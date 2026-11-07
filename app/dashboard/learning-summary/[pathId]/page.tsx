'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { SummaryView } from '@/components/learning/SummaryView';
import { summaryData } from '@/lib/learning/summaryData';
import type { SummaryData } from '@/lib/learning/summaryData';

export default function LearningSummaryPage() {
  const params = useParams();
  const router = useRouter();
  const pathId = params.pathId as string || 'matematika';

  const data: SummaryData = summaryData[pathId] || summaryData.matematika;

  const handleViewModule = (moduleId: string) => {
    router.push(`/dashboard/learning/${pathId}/${moduleId}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-4 md:p-8">
      <SummaryView
        pathTitle={data.pathTitle}
        totalProgress={data.totalProgress}
        completedModules={data.completedModules}
        totalModules={data.totalModules}
        studyTime={data.studyTime}
        averageQuizScore={data.averageQuizScore}
        modules={data.modules}
        onViewModule={handleViewModule}
      />
      <Button onClick={() => router.push('/dashboard/learning')}>Kembali ke Learning Path</Button>
    </div>
  );
}
