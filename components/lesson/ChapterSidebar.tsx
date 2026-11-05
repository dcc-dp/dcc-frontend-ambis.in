import type { Chapter } from '@/lib/learning/chapterData';

interface ChapterSidebarProps {
  chapters: Chapter[];
  currentChapterId: string;
  completedChapters: Set<string>;
  moduleTitle: string;
  onBack: () => void;
  onSelect: (id: string) => void;
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function ChapterSidebar({
  chapters,
  currentChapterId,
  completedChapters,
  moduleTitle,
  onBack,
  onSelect,
}: ChapterSidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r-theme border-line bg-card md:flex">
      <div className="border-b-theme border-line p-4">
        <button
          type="button"
          onClick={onBack}
          className="focus-pop flex min-h-11 items-center gap-1 rounded-md text-base text-ink-soft hover:text-ink"
        >
          ← Kembali ke {moduleTitle}
        </button>
      </div>
      <nav aria-label="Daftar Chapter" className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 text-sm font-semibold text-ink-soft">Daftar Chapter</p>
        <div className="space-y-1">
          {chapters.map((chapter, idx) => {
            const isActive = chapter.id === currentChapterId;
            const isDone = completedChapters.has(chapter.id);
            const badgeClass = isDone
              ? 'bg-correct-soft text-correct'
              : isActive
                ? 'bg-accent-soft text-accent-ink'
                : 'bg-paper-deep text-ink-soft';
            return (
              <button
                key={chapter.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect(chapter.id)}
                className={`focus-pop flex min-h-11 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-base ${
                  isActive
                    ? 'bg-accent-soft font-semibold text-accent-ink'
                    : 'text-ink-soft hover:bg-paper-deep'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm ${badgeClass}`}
                >
                  {isDone ? <CheckIcon /> : idx + 1}
                </span>
                <span className="truncate">{chapter.title}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
