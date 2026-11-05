import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const TONE = {
  info: 'bg-accent-soft text-ink',
  success: 'bg-correct-soft text-correct',
  warn: 'bg-attention-soft text-attention',
  error: 'bg-wrong-soft text-wrong',
} as const satisfies Record<string, string>;

const DEFAULT_LABEL = {
  info: 'Catatan:',
  success: 'Sudah benar:',
  warn: 'Perhatikan:',
  error: 'Belum tepat:',
} as const satisfies Record<string, string>;

const LIVE_ROLE = {
  assertive: 'alert',
  polite: 'status',
} as const satisfies Record<string, string>;

export type CalloutTone = keyof typeof TONE;

export type CalloutProps = {
  tone: CalloutTone;
  title?: string;
  live?: 'polite' | 'assertive' | false;
  className?: string;
  children: ReactNode;
};

export function Callout({ tone, title, live = false, className, children }: CalloutProps) {
  return (
    <div
      role={live ? LIVE_ROLE[live] : undefined}
      className={cn('rounded-md p-4 text-lg', TONE[tone], className)}
    >
      <span className="font-bold">{title ?? DEFAULT_LABEL[tone]}</span> {children}
    </div>
  );
}
