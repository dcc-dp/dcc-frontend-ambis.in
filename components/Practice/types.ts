import type { PracticeOption } from '@/components/Visual/AnswerBox';
import { DEMO_EXERCISE } from '@/app/hooks/useOfflineCanvasDemo';

export interface PracticeExercise {
  id: string;
  concept_id: string;
  difficulty: number;
  kind: string;
  question: string;
  options: PracticeOption[] | null;
}

export interface PracticeConcept {
  id: string;
  code: string;
  name: string;
  exercises: PracticeExercise[];
}

export type CanvasTab = 'practice' | 'ask';

export const KIND_LABEL: Record<string, string> = {
  mcq: 'Pilihan ganda',
  short_answer: 'Isian singkat',
  steps: 'Langkah',
};

export const DEMO_CATALOG: PracticeConcept[] = [
  { id: 'demo', code: 'DEMO', name: 'Penjumlahan Pecahan (demo)', exercises: [DEMO_EXERCISE] },
];

export function exerciseMeta(exercise: PracticeExercise): string {
  return `${KIND_LABEL[exercise.kind] ?? exercise.kind} · tingkat ${exercise.difficulty}`;
}
