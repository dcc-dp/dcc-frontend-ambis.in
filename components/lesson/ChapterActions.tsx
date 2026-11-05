import { Badge, Button } from '@/components/ui';
import type { Chapter } from '@/lib/learning/chapterData';

interface ChapterActionsProps {
  isCompleted: boolean;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  onComplete: () => void;
  onStartQuiz: () => void;
  onSelectChapter: (id: string) => void;
}

function Arrow({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

export function ChapterActions({
  isCompleted,
  prevChapter,
  nextChapter,
  onComplete,
  onStartQuiz,
  onSelectChapter,
}: ChapterActionsProps) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <Button variant="secondary" onClick={onComplete} disabled={isCompleted}>
          <Arrow d="M5 13l4 4L19 7" />
          Selesai Membaca
        </Button>
        {isCompleted && <Badge tone="correct">Sudah selesai</Badge>}
        <Button variant="primary" onClick={onStartQuiz}>
          Kerjakan Kuis
        </Button>
      </div>

      <div className="flex flex-col gap-3 border-t-theme border-line pt-4 sm:flex-row sm:justify-between">
        {prevChapter ? (
          <Button variant="secondary" size="sm" onClick={() => onSelectChapter(prevChapter.id)}>
            <Arrow d="M15 19l-7-7 7-7" />
            Sebelumnya: {prevChapter.title}
          </Button>
        ) : null}
        {nextChapter && (
          <Button variant="secondary" size="sm" className="sm:ml-auto" onClick={() => onSelectChapter(nextChapter.id)}>
            Selanjutnya: {nextChapter.title}
            <Arrow d="M9 5l7 7-7 7" />
          </Button>
        )}
      </div>
    </>
  );
}
