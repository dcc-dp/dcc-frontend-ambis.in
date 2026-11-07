'use client';

import { useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { SummaryView } from '@/components/learning/SummaryView';
import { useModuleProgress } from '@/hooks/useModuleProgress';
import { summaryData } from '@/lib/learning/summaryData';
import type { SummaryData } from '@/lib/learning/summaryData';

export default function LearningSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.pathId as string || 'matematika';

  const data: SummaryData = summaryData[pathId] || summaryData.matematika;
  const baseModules = useMemo(
    () =>
      data.modules.map((module) => ({
        id: module.id,
        title: module.title,
        chapterCount: module.totalChapters,
        completedChapters: 0,
        description: '',
      })),
    [data],
  );
  const live = useModuleProgress(pathId, baseModules);
  const modules = live.map((module) => ({
    id: module.id,
    title: module.title,
    completedChapters: module.completedChapters,
    totalChapters: module.chapterCount,
    progress: module.progress ?? 0,
    isCompleted: module.chapterCount > 0 && module.completedChapters === module.chapterCount,
  }));
  const totalChapters = modules.reduce((sum, module) => sum + module.totalChapters, 0);
  const doneChapters = modules.reduce((sum, module) => sum + module.completedChapters, 0);
  const totalProgress = totalChapters > 0 ? Math.round((doneChapters / totalChapters) * 100) : 0;
  const completedModules = modules.filter((module) => module.isCompleted).length;

  const handleViewModule = (moduleId: string) => {
    router.push(`/dashboard/learning/${pathId}/${moduleId}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <SummaryView
        pathTitle={data.pathTitle}
        totalProgress={totalProgress}
        completedModules={completedModules}
        totalModules={modules.length}
        modules={modules}
        onViewModule={handleViewModule}
      />
      <Button onClick={() => router.push('/dashboard/learning')}>Kembali ke Jalur Belajar</Button>
    </div>
  );
}
