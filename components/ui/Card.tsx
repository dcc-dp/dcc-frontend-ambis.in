import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const TONE = {
  card: 'bg-card border-line shadow-sm',
  sunken: 'bg-paper-deep border-line',
  outline: 'bg-transparent border-edge',
} as const satisfies Record<string, string>;

const PADDING = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const satisfies Record<string, string>;

export type CardTone = keyof typeof TONE;
export type CardPadding = keyof typeof PADDING;

export type CardProps = HTMLAttributes<HTMLElement> & {
  as?: 'div' | 'section' | 'article';
  tone?: CardTone;
  padding?: CardPadding;
};

export function Card({
  as: Tag = 'div',
  tone = 'card',
  padding = 'md',
  className,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={cn('rounded-xl border-theme text-ink', TONE[tone], PADDING[padding], className)}
      {...rest}
    />
  );
}
