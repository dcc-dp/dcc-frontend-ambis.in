'use client';

import React, { useEffect, useRef, useState } from 'react';
import VisualCanvas from './VisualCanvas';
import { API_BASE_URL } from '@/app/hooks/useCanvasSession';
import { visualSpecFixtures } from '@/lib/fixtures/visualSpecFixtures';
import { normalizeVisualSpec, type VisualSpec } from '@/lib/visualSpec';

const SUGGESTIONS = [
  'Kenapa 1/2 + 1/3 bukan 2/5?',
  'Apa itu KPK dan buat apa?',
  'Bagaimana cara menjumlahkan 3/5 dan 1/4?',
];

interface FreeAskProps {
  offline?: boolean;
}

export default function FreeAsk({ offline = false }: FreeAskProps) {
  const [question, setQuestion] = useState('');
  const [visual, setVisual] = useState<VisualSpec | null>(null);
  const [degraded, setDegraded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setDegraded(false);
    setVisual(null);

    try {
      if (offline) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setVisual(visualSpecFixtures.explanation);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/v1/ask/visual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = (await response.json()) as { visual: unknown; degraded?: boolean };
      const spec = normalizeVisualSpec(body.visual);
      if (!spec) throw new Error('Bentuk jawaban dari server tidak dikenali');
      setVisual(spec);
      setDegraded(body.degraded === true);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError('Pertanyaanmu belum terkirim. Coba lagi, ya.');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-lg font-semibold text-ink">Mau belajar apa hari ini?</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void ask(question);
              }
            }}
            maxLength={500}
            rows={2}
            disabled={loading}
            placeholder="Tulis pertanyaanmu, misalnya: kenapa 1/2 + 1/3 bukan 2/5?"
            className="focus-pop w-full resize-none rounded-lg border-[1.5px] border-edge bg-card px-3.5 py-2.5 text-lg text-ink placeholder:text-ink-soft transition-colors duration-150 focus:border-accent focus:ring-[0.5px] focus:ring-accent disabled:bg-paper-deep disabled:opacity-60"
          />
        </label>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => {
                setQuestion(suggestion);
                void ask(suggestion);
              }}
              className="focus-pop min-h-11 px-1 py-1 text-left text-base text-accent-ink underline underline-offset-4 transition-colors duration-150 hover:bg-paper-deep disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={loading || !question.trim()}
          onClick={() => void ask(question)}
          className="focus-pop min-h-12 w-full rounded-lg border border-transparent bg-accent px-4 text-lg font-semibold text-white transition duration-150 hover:bg-accent-ink active:scale-[.98] disabled:cursor-not-allowed disabled:border-line disabled:bg-paper-deep disabled:text-ink-soft disabled:active:scale-100"
        >
          {loading ? 'Sedang menggambar' : 'Jelaskan dengan gambar'}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-wrong-soft p-5 text-xl font-semibold text-wrong">
          {error}
        </p>
      )}

      {degraded && visual && (
        <p className="rounded-md bg-attention-soft p-4 text-base text-attention">
          <strong className="font-bold">Perhatikan:</strong> Gambar penjelasannya belum bisa dibuat kali ini. Coba tanyakan lagi.
        </p>
      )}

      {visual && <VisualCanvas spec={visual} />}
    </div>
  );
}
