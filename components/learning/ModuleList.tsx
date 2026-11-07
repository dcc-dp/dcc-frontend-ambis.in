'use client';

import { useRouter } from 'next/navigation';
import { Badge, Button, Card, ProgressBar } from '@/components/ui';
import type { ModuleItem } from '@/lib/learning/subjectData';

interface ModuleListProps {
  modules: ModuleItem[];
  onSelectModule: (moduleId: string) => void;
  subjectTitle?: string;
}

export function ModuleList({ modules, onSelectModule, subjectTitle = '' }: ModuleListProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {modules.map((module, index) => {
        const progress = module.progress ?? (module.chapterCount > 0 ? Math.round((module.completedChapters / module.chapterCount) * 100) : 0);
        const isComplete = module.completedChapters === module.chapterCount;

        return (
          <Card
            key={module.id}
            className="cursor-pointer"
            onClick={() => onSelectModule(module.id)}
          >
            <div className="flex items-start gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                  isComplete ? 'bg-correct-soft text-correct' : 'bg-accent text-on-accent'
                }`}
              >
                {isComplete ? (
                  <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <h4 className="text-xl font-semibold text-ink">{module.title}</h4>
                    <p className="text-base text-ink-soft">{module.description}</p>
                  </div>
                  <div className="shrink-0">
                    <Badge tone={isComplete ? 'correct' : progress > 0 ? 'accent' : 'neutral'}>
                      {module.completedChapters}/{module.chapterCount}
                    </Badge>
                  </div>
                </div>

                <ProgressBar
                  ratio={progress / 100}
                  label={`Progress: ${module.completedChapters} dari ${module.chapterCount} chapter`}
                />

                <div className="flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/learning/${subjectTitle.toLowerCase()}/${module.id}`);
                    }}
                  >
                    Lihat Detail
                    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
