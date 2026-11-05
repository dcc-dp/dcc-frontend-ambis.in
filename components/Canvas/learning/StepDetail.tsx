import MathContent from '@/components/Chat/MathContent';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { SubjectTone } from './subject-tone';
import type { CanvasStep } from './types';

interface StepDetailProps {
  step: CanvasStep;
  activeStep: number;
  total: number;
  tone: SubjectTone;
  onPrev: () => void;
  onNext: () => void;
}

const ARROW_LEFT = 'M15 19l-7-7 7-7';
const ARROW_RIGHT = 'M9 5l7 7-7 7';

function Arrow({ d }: { d: string }) {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

export default function StepDetail({ step, activeStep, total, tone, onPrev, onNext }: StepDetailProps) {
  return (
    <div className="flex overflow-hidden rounded-xl border-theme border-line bg-card shadow-sm">
      <span aria-hidden="true" className={cn('w-1 shrink-0', tone.solid)} />
      <div className="min-w-0 flex-1 space-y-3 p-4">
        <div className="flex items-center justify-between gap-2 border-b border-line pb-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                tone.solid,
              )}
            >
              {step.number}
            </span>
            <h3 className="truncate text-base font-bold text-ink">{step.title}</h3>
          </div>
          <span className="shrink-0 text-sm font-semibold text-ink-soft">Detail Penjelasan</span>
        </div>

        <div className="py-1 text-sm leading-relaxed text-ink">
          <MathContent content={step.body} isUser={false} />
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-line pt-2">
          <Button variant="secondary" size="sm" disabled={activeStep === 0} onClick={onPrev}>
            <Arrow d={ARROW_LEFT} />
            <span>Sebelumnya</span>
          </Button>
          <span className="text-sm font-semibold text-ink-soft">
            Langkah {activeStep + 1} / {total}
          </span>
          <Button size="sm" disabled={activeStep === total - 1} onClick={onNext}>
            <span>Langkah Berikutnya</span>
            <Arrow d={ARROW_RIGHT} />
          </Button>
        </div>
      </div>
    </div>
  );
}
