'use client';

import { Badge, Button, Card, ProgressBar } from '@/components/ui';
import { difficultyLabel, goalLabel } from '@/lib/learning-path/format';
import type { LearningPathData, RoadmapStep } from '@/lib/learning-path/types';
import { RoadmapBanners } from './RoadmapBanners';
import { RoadmapTimeline } from './RoadmapTimeline';

interface RoadmapViewProps {
  data: LearningPathData;
  currentStep: RoadmapStep | undefined;
  progressPercent: number;
  isFetchingExercises: boolean;
  onStartDiagnostic: () => void;
  onEnterStep: (step: RoadmapStep) => void;
  onTakeQuiz: (step: RoadmapStep) => void;
}

export function RoadmapView({
  data,
  currentStep,
  progressPercent,
  isFetchingExercises,
  onStartDiagnostic,
  onEnterStep,
  onTakeQuiz,
}: RoadmapViewProps) {
  const goal = goalLabel(data.goal);
  return (
    <div className="flex-1 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <Badge tone="accent" className="mb-2 inline-block">Mode 1: Jalur Belajar Terpandu</Badge>
          <h2 className="mb-1 text-3xl font-extrabold text-ink">
            Roadmap Belajar: {data.subtopic.toUpperCase()}
          </h2>
          <p className="mx-auto max-w-lg text-lg text-ink-soft">
            {goal ? `Target: ${goal} • ` : ''}Level: {difficultyLabel(data.difficulty)}
          </p>
        </div>

        <RoadmapBanners data={data} isFetchingExercises={isFetchingExercises} onStartDiagnostic={onStartDiagnostic} />
        <RoadmapTimeline roadmap={data.roadmap} onEnterStep={onEnterStep} onTakeQuiz={onTakeQuiz} />

        <Card className="mx-auto mt-8 max-w-lg">
          <ProgressBar
            ratio={progressPercent / 100}
            label="Total Kemajuan Milestone"
            valueText={`${progressPercent} persen selesai`}
          />
        </Card>

        {currentStep && (
          <div className="mt-6 text-center">
            <Button size="lg" onClick={() => onEnterStep(currentStep)}>
              Masuk ke Tahap: {currentStep.title}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
