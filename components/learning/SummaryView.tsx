'use client';

import { Badge, Button, Callout, Card, ProgressBar } from '@/components/ui';

interface SummaryViewProps {
  pathTitle: string;
  totalProgress: number;
  completedModules: number;
  totalModules: number;
  studyTime?: number;
  averageQuizScore?: number;
  modules: Array<{
    id: string;
    title: string;
    completedChapters: number;
    totalChapters: number;
    progress: number;
    averageScore?: number;
    isCompleted: boolean;
  }>;
  onViewModule?: (moduleId: string) => void;
}

export function SummaryView({
  pathTitle,
  totalProgress,
  completedModules,
  totalModules,
  studyTime,
  averageQuizScore,
  modules,
  onViewModule,
}: SummaryViewProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">
          PEMBELAJARAN {pathTitle.toUpperCase()}
        </h1>
        <p className="text-base text-ink-soft">Ringkasan kemajuan belajarmu</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-base text-ink-soft">Kemajuan Keseluruhan</p>
          <p className="text-2xl font-bold tabular-nums">{totalProgress}%</p>
        </Card>
        <Card>
          <p className="text-base text-ink-soft">Modul Selesai</p>
          <p className="text-2xl font-bold tabular-nums">{completedModules}/{totalModules}</p>
          <p className="text-sm text-ink-soft">semua modul</p>
        </Card>
        {studyTime !== undefined && (
          <Card>
            <p className="text-base text-ink-soft">Waktu Belajar</p>
            <p className="text-2xl font-bold tabular-nums">{studyTime} jam</p>
          </Card>
        )}
        {averageQuizScore !== undefined && (
          <Card>
            <p className="text-base text-ink-soft">Rata-rata Kuis</p>
            <p className="text-2xl font-bold tabular-nums">{averageQuizScore}%</p>
          </Card>
        )}
      </div>

      <Card as="section" padding="lg" className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Kemajuan Modul</h2>
        <div className="space-y-4">
          {modules.map((module) => (
            <Card key={module.id} as="article" tone="sunken" className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{module.title}</h3>
                  <p className="text-base text-ink-soft">
                    {module.completedChapters}/{module.totalChapters} bab
                  </p>
                </div>
                {module.isCompleted && (
                  <Badge tone="correct" className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap">
                    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Selesai
                  </Badge>
                )}
              </div>

              <ProgressBar
                ratio={module.progress / 100}
                label={`Kemajuan: ${module.completedChapters} dari ${module.totalChapters} bab`}
              />

              {module.averageScore !== undefined && (
                <p className="text-base text-ink-soft">Rata-rata kuis: {module.averageScore}%</p>
              )}
              {onViewModule && (
                <div className="flex justify-end">
                  <Button variant="secondary" size="sm" onClick={() => onViewModule(module.id)}>
                    Lihat Detail
                    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {completedModules === totalModules && totalModules > 0 && (
        <Callout tone="success" title={`Selamat! Kamu Telah Menyelesaikan ${pathTitle}!`}>
          Kamu telah menyelesaikan semua modul dan bab.
        </Callout>
      )}
    </div>
  );
}
