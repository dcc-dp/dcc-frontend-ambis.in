'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CanvasPhase, CanvasResult } from './useCanvasSession';
import { visualSpecFixtures } from '@/lib/fixtures/visualSpecFixtures';
import type { InterventionKind, VisualSpec } from '@/lib/visualSpec';

export const DEMO_EXERCISE = {
  id: 'demo-0404',
  concept_id: 'demo',
  difficulty: 3,
  kind: 'short_answer',
  question:
    'Ibu punya 3/5 kg gula dan menambah 1/4 kg lagi. Berapa total gula Ibu sekarang? (tulis dalam bentuk pecahan paling sederhana)',
  options: null,
};

const CORRECT = '17/20';
const MISCONCEPTION_ANSWER = '4/9';
const SIMULATED_DELAY_MS = 700;

function pickKind(answer: string, mistakes: number): InterventionKind {
  if (answer === MISCONCEPTION_ANSWER) return 'explanation';
  if (mistakes <= 2) return 'hint';
  return 'worked_example';
}

export function useOfflineCanvasDemo() {
  const [phase, setPhase] = useState<CanvasPhase>('idle');
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [visual, setVisual] = useState<VisualSpec | null>(null);
  const [result, setResult] = useState<CanvasResult | null>(null);
  const [error] = useState<string | null>(null);

  const mistakesRef = useRef(0);
  const attemptsRef = useRef(0);
  const masteryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    mistakesRef.current = 0;
    attemptsRef.current = 0;
    masteryRef.current = 0;
    setPhase('idle');
    setThoughts([]);
    setVisual(null);
    setResult(null);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  const submit = useCallback(
    async (rawAnswer: string) => {
      const answer = rawAnswer.replace(/\s+/g, '');
      if (!answer) return;

      clearTimer();
      setPhase('working');
      setThoughts(['Menilai jawaban siswa...']);
      setVisual(null);
      setResult(null);

      timerRef.current = setTimeout(() => {
        const isCorrect = answer === CORRECT;
        attemptsRef.current += 1;
        if (!isCorrect) mistakesRef.current += 1;
        masteryRef.current = 0.7 * masteryRef.current + 0.3 * (isCorrect ? 1 : 0);

        const kind = isCorrect ? null : pickKind(answer, mistakesRef.current);
        setVisual(kind ? visualSpecFixtures[kind] : null);
        setResult({
          session_id: 'demo',
          problem_id: 'demo',
          attempt_id: `demo-${attemptsRef.current}`,
          attempt_number: attemptsRef.current,
          is_correct: isCorrect,
          error_type: isCorrect ? null : 'conceptual',
          misconception_code: answer === MISCONCEPTION_ANSWER ? 'ADDS_NUM_DENOM_DIRECTLY' : null,
          intervention: kind ? { kind, rule_code: 'DEMO', reason: 'Mode demo tanpa server' } : null,
          mastery: masteryRef.current,
          confidence: 0.5,
        });
        setPhase('done');
      }, SIMULATED_DELAY_MS);
    },
    [clearTimer]
  );

  return { phase, thoughts, visual, result, error, submit, reset };
}
