'use client';

import { Badge, Button, Card } from '@/components/ui';
import type { RoadmapStep } from '@/lib/learning-path/types';

interface RoadmapTimelineProps {
  roadmap: RoadmapStep[];
  onEnterStep: (step: RoadmapStep) => void;
  onTakeQuiz: (step: RoadmapStep) => void;
}

function stepCardClass(step: RoadmapStep): string {
  if (step.completed) return 'border-correct bg-correct-soft';
  if (step.current) return 'border-accent bg-card';
  return 'border-line bg-card text-ink-soft';
}

function connectorClass(step: RoadmapStep): string {
  if (step.completed) return 'bg-correct';
  if (step.current) return 'bg-accent';
  return 'bg-line';
}

function badgeClass(step: RoadmapStep): string {
  if (step.completed) return 'bg-correct text-card';
  if (step.current) return 'bg-accent text-on-accent';
  return 'bg-paper-deep text-ink-soft';
}

export function RoadmapTimeline({ roadmap, onEnterStep, onTakeQuiz }: RoadmapTimelineProps) {
  return (
    <ol className="mx-auto flex max-w-lg flex-col">
      {roadmap.map((step, index) => (
        <li key={step.id}>
          <Card className={`flex flex-col justify-between gap-3 sm:flex-row sm:items-center ${stepCardClass(step)}`}>
            <div className="flex items-center gap-3">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${badgeClass(step)}`}
              >
                <span className="sr-only">{step.completed ? 'Selesai, tahap ' : 'Tahap '}</span>
                {step.completed ? '✓' : index + 1}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-lg font-bold ${step.current ? 'text-accent-ink' : ''}`}>{step.title}</h3>
                  {step.recommendedBadge && <Badge tone="attention">{step.recommendedBadge}</Badge>}
                </div>
                <p className="mt-0.5 line-clamp-2 text-base text-ink-soft">{step.description}</p>
              </div>
            </div>
            {step.hasQuiz ? (
              <Button
                size="sm"
                variant={step.current ? 'primary' : 'secondary'}
                onClick={() => onTakeQuiz(step)}
                className="shrink-0 self-end sm:self-center"
              >
                {step.completed ? 'Latihan Ulang' : 'Kerja Latihan'}
              </Button>
            ) : (
              <Button
                size="sm"
                variant={step.current ? 'primary' : 'secondary'}
                onClick={() => onEnterStep(step)}
                className="shrink-0 self-end sm:self-center"
              >
                Pelajari Materi
              </Button>
            )}
          </Card>
          {index < roadmap.length - 1 && (
            <div aria-hidden="true" className="flex justify-center">
              <div className={`h-6 w-1 ${connectorClass(step)}`} />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
