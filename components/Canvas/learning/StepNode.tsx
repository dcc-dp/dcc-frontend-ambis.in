import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { SubjectTone } from './subject-tone';
import type { CanvasStep } from './types';

interface StepNodeProps {
  step: CanvasStep;
  isActive: boolean;
  isCompleted: boolean;
  tone: SubjectTone;
  onSelect: () => void;
}

function CheckMark() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function nodeClass(isActive: boolean, isCompleted: boolean, tone: SubjectTone) {
  if (isActive) return cn('z-10 scale-[1.02] border-2 bg-card shadow-md', tone.border);
  if (isCompleted) return 'border-theme border-correct bg-correct-soft hover:bg-paper-deep';
  return 'border-theme border-line bg-card hover:border-edge';
}

function circleClass(isActive: boolean, isCompleted: boolean, tone: SubjectTone) {
  if (isActive) return cn('scale-110', tone.solid);
  if (isCompleted) return 'bg-correct text-card';
  return 'bg-paper-deep text-ink-soft';
}

export default function StepNode({ step, isActive, isCompleted, tone, onSelect }: StepNodeProps) {
  const badgeTone = isActive ? tone.badge : isCompleted ? 'correct' : 'neutral';
  const badgeLabel = isActive ? 'Aktif' : isCompleted ? 'Selesai' : `Langkah ${step.number}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? 'step' : undefined}
      className={cn(
        'relative min-h-11 w-full max-w-sm select-none rounded-xl p-3.5 text-left transition-all duration-300 focus-pop',
        nodeClass(isActive, isCompleted, tone),
      )}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform',
              circleClass(isActive, isCompleted, tone),
            )}
          >
            {isCompleted ? <CheckMark /> : step.number}
          </span>
          <h4 className={cn('truncate text-sm text-ink', isActive ? 'font-extrabold' : 'font-bold')}>
            {step.title}
          </h4>
        </div>
        <Badge tone={badgeTone} className={cn('shrink-0 rounded-full', isActive && 'animate-pulse motion-reduce:animate-none')}>
          {badgeLabel}
        </Badge>
      </div>

      {step.short_desc && <p className="line-clamp-1 pl-9 text-sm text-ink-soft">{step.short_desc}</p>}

      {step.formula && (
        <div className="mt-2 pl-9">
          <Badge tone="accent" className="inline-block max-w-full truncate font-mono">
            Rumus: {step.formula}
          </Badge>
        </div>
      )}
    </button>
  );
}
