'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button, Card, ProgressBar } from '@/components/ui';
import { ModuleList } from '@/components/learning/ModuleList';
import { moduleData, sampleSubjectNames } from '@/lib/learning/subjectData';
import type { ModuleItem } from '@/lib/learning/subjectData';

export default function LearningSubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string || 'matematika';

  const modules: ModuleItem[] = moduleData[subject] || moduleData.matematika;
  const subjectTitle = sampleSubjectNames[subject] || 'Matematika';

  const totalChapters = modules.reduce((sum, m) => sum + m.chapterCount, 0);
  const completedChapters = modules.reduce((sum, m) => sum + m.completedChapters, 0);
  const totalProgress = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  const handleModuleClick = (moduleId: string) => {
    const firstChapters: Record<string, Record<string, string>> = {
      matematika: {
        'aljabar-dasar': 'pengenalan-variabel',
        'persamaan-linear': 'pengenalan-persamaan',
      },
      informatika: {
        'dasar-pemrograman': 'pengenalan-variabel-prog',
      },
    };
    const firstChapter = firstChapters[subject]?.[moduleId] || 'chapter-1';
    router.push(`/dashboard/learning/${subject}/${moduleId}/${firstChapter}`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-8">
      <div className="space-y-2">
        <Button variant="ghost" onClick={() => router.back()}>
          <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Learning Path
        </Button>

        <h1 className="text-3xl font-bold text-ink">{subjectTitle}</h1>
        <p className="text-base text-ink-soft">Pilih module untuk memulai belajar</p>
      </div>

      <Card padding="lg" className="space-y-4">
        <h2 className="text-xl font-semibold text-ink">Progress Keseluruhan</h2>
        <ProgressBar
          ratio={totalProgress / 100}
          label={`${completedChapters} dari ${totalChapters} chapter selesai`}
        />
      </Card>

      <ModuleList
        modules={modules}
        onSelectModule={handleModuleClick}
        subjectTitle={subjectTitle}
      />
    </div>
  );
}
