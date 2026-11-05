import type { ButtonHTMLAttributes, MouseEvent, Ref } from 'react';
import { cn } from '@/lib/cn';

const VARIANT = {
  primary: 'bg-accent text-on-accent border-theme border-accent enabled:hover:bg-accent-ink',
  secondary: 'bg-card border-theme border-edge text-ink enabled:hover:bg-paper-deep',
  ghost: 'border-theme border-transparent text-accent enabled:hover:bg-accent-soft',
  danger: 'bg-wrong-soft text-wrong border-theme border-wrong enabled:hover:bg-paper-deep enabled:hover:border-wrong',
} as const satisfies Record<string, string>;

const SIZE = {
  sm: 'min-h-11 px-3 text-base',
  md: 'min-h-12 px-4 text-lg',
  lg: 'min-h-14 px-5 text-xl',
} as const satisfies Record<string, string>;

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-pop disabled:bg-paper-deep disabled:text-ink-soft disabled:border-line disabled:cursor-not-allowed';

export type ButtonVariant = keyof typeof VARIANT;
export type ButtonSize = keyof typeof SIZE;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  type = 'button',
  className,
  children,
  onClick,
  ref,
  ...rest
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={handleClick}
      className={cn(BASE, VARIANT[variant], SIZE[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 rounded-full border-theme border-current border-t-transparent animate-spin motion-reduce:animate-none"
        />
      )}
      {children}
    </button>
  );
}
