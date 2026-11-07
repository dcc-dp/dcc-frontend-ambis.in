import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const TONE = {
  neutral: 'bg-paper-deep text-ink',
  accent: 'bg-accent-soft text-accent-ink',
  correct: 'bg-correct-soft text-correct',
  attention: 'bg-attention-soft text-attention',
  wrong: 'bg-wrong-soft text-wrong',
  mark: 'bg-mark text-ink',
} as const satisfies Record<string, string>;

export type BadgeTone = keyof typeof TONE;

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn('rounded-sm px-2 py-0.5 text-sm font-semibold', TONE[tone], className)}
      {...rest}
    />
  );
}
