import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';

const VARIANT = {
  ghost: 'border-theme border-line text-accent enabled:hover:bg-accent-soft',
  secondary: 'bg-card border-theme border-edge text-ink enabled:hover:bg-paper-deep',
} as const satisfies Record<string, string>;

const SIZE = {
  44: 'h-11 w-11',
  48: 'h-12 w-12',
} as const satisfies Record<number, string>;

const BASE =
  'inline-flex shrink-0 items-center justify-center rounded-lg transition-colors focus-pop disabled:bg-paper-deep disabled:text-ink-soft disabled:border-line disabled:cursor-not-allowed';

export type IconButtonVariant = keyof typeof VARIANT;
export type IconButtonSize = keyof typeof SIZE;

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  ref?: Ref<HTMLButtonElement>;
};

export function IconButton({
  label,
  icon,
  variant = 'ghost',
  size = 44,
  type = 'button',
  className,
  ref,
  ...rest
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
      {...rest}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    </button>
  );
}
