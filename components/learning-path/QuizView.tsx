'use client';

import Quiz from '@/components/learning/Quiz';
import type { ExerciseItem } from '@/components/learning/Quiz';
import { Button } from '@/components/ui';

interface QuizViewProps {
  questions: ExerciseItem[];
  conceptTitle: string;
  isDiagnostic: boolean;
  onComplete: (finalMastery: number, misconceptions: string[]) => void;
  onClose: () => void;
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 19l-7-7 7-7" />
    </svg>
  );
}

export function QuizView({ questions, conceptTitle, isDiagnostic, onComplete, onClose }: QuizViewProps) {
  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" size="sm" onClick={onClose} className="mb-4">
          <BackIcon />
          Kembali ke jalur belajar
        </Button>
        <Quiz
          questions={questions}
          conceptTitle={conceptTitle}
          isDiagnostic={isDiagnostic}
          onComplete={onComplete}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
