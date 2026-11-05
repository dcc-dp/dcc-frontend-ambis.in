'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { readSSE } from '@/lib/sse';
import { normalizeVisualSpec, type InterventionKind, type VisualSpec } from '@/lib/visualSpec';

export type CanvasPhase = 'idle' | 'working' | 'done' | 'error';

export interface CanvasResult {
  session_id: string;
  problem_id: string;
  attempt_id: string;
  attempt_number: number;
  is_correct: boolean;
  error_type: string | null;
  misconception_code: string | null;
  intervention: { kind: InterventionKind; rule_code: string; reason: string } | null;
  mastery: number;
  confidence: number;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const WATCHDOG_MS = 45000;
const TIMEOUT_MESSAGE = 'Kak Ambis butuh waktu lebih lama. Coba lagi ya.';

export function useCanvasSession(exerciseId: string | null) {
  const [phase, setPhase] = useState<CanvasPhase>('idle');
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [visual, setVisual] = useState<VisualSpec | null>(null);
  const [result, setResult] = useState<CanvasResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const idsRef = useRef<{ session_id?: string; problem_id?: string }>({});

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearWatchdog = useCallback(() => {
    if (timerRef.current === null) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const abort = useCallback(() => {
    clearWatchdog();
    abortRef.current?.abort();
    abortRef.current = null;
  }, [clearWatchdog]);

  const reset = useCallback(() => {
    abort();
    idsRef.current = {};
    setPhase('idle');
    setThoughts([]);
    setVisual(null);
    setResult(null);
    setError(null);
  }, [abort]);

  useEffect(() => abort, [abort]);

  const submit = useCallback(
    async (answer: string) => {
      if (!exerciseId || !answer.trim()) return;
      abort();

      const controller = new AbortController();
      abortRef.current = controller;
      setPhase('working');
      setThoughts([]);
      setVisual(null);
      setResult(null);
      setError(null);

      let streamedVisual: VisualSpec | null = null;
      let finished = false;
      let timedOut = false;
      timerRef.current = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, WATCHDOG_MS);

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/agent/hermes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
          body: JSON.stringify({
            student_answer: answer.trim(),
            exercise_id: exerciseId,
            mode: 'ask',
            stream: true,
            ...idsRef.current,
          }),
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        for await (const { event, data } of readSSE(response)) {
          const payload = (data ?? {}) as Record<string, unknown>;
          if (event === 'thinking' && typeof payload.thought === 'string') {
            const thought = payload.thought;
            setThoughts((prev) => [...prev, thought]);
          } else if (event === 'visual') {
            streamedVisual = normalizeVisualSpec(payload);
            setVisual(streamedVisual);
          } else if (event === 'done') {
            const done = payload as unknown as CanvasResult & {
              intervention: (CanvasResult['intervention'] & { visual?: unknown }) | null;
            };
            idsRef.current = { session_id: done.session_id, problem_id: done.problem_id };
            if (!streamedVisual && done.intervention?.visual) {
              setVisual(normalizeVisualSpec(done.intervention.visual));
            }
            setResult(done);
            setPhase('done');
            finished = true;
          } else if (event === 'error') {
            setError(typeof payload.message === 'string' ? payload.message : 'Terjadi kesalahan');
            setPhase('error');
            finished = true;
          }
        }
        if (!finished) {
          setError('Koneksi terputus sebelum selesai');
          setPhase('error');
        }
      } catch (err: unknown) {
        if (timedOut) {
          setError(TIMEOUT_MESSAGE);
          setPhase('error');
          return;
        }
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Gagal menghubungi server');
        setPhase('error');
      } finally {
        if (abortRef.current === controller) {
          clearWatchdog();
          abortRef.current = null;
        }
      }
    },
    [abort, clearWatchdog, exerciseId]
  );

  return { phase, thoughts, visual, result, error, submit, reset };
}
