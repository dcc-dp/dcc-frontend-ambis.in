'use client';

import {
  createContext,
  useContext,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/cn';

interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

const CONTROL =
  'w-full border-theme bg-card text-ink placeholder:text-ink-soft rounded-lg px-3.5 py-2 focus-pop focus:border-accent disabled:bg-paper-deep disabled:text-ink-soft disabled:border-line disabled:cursor-not-allowed';

function borderColor(invalid: boolean | undefined): string {
  return invalid ? 'border-wrong' : 'border-edge';
}

export type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <FieldContext.Provider value={{ id: inputId, describedBy, invalid: Boolean(error) }}>
      <div className="flex w-full flex-col gap-2">
        <label
          htmlFor={inputId}
          className="self-start rounded-sm bg-mark px-1 text-sm font-semibold text-ink"
        >
          {label}
        </label>
        {children}
        {hint && (
          <p id={hintId} className="text-base text-ink-soft">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-base font-semibold text-wrong">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  ref?: Ref<HTMLInputElement>;
};

function mergeDescribedBy(fieldValue?: string, callerValue?: string): string | undefined {
  return [fieldValue, callerValue].filter(Boolean).join(' ') || undefined;
}

export function Input({
  id,
  className,
  ref,
  'aria-describedby': callerDescribedBy,
  ...rest
}: InputProps) {
  const field = useContext(FieldContext);
  return (
    <input
      ref={ref}
      id={id ?? field?.id}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={mergeDescribedBy(field?.describedBy, callerDescribedBy)}
      className={cn(
        CONTROL,
        'min-h-12 text-xl',
        borderColor(field?.invalid),
        className,
      )}
      {...rest}
    />
  );
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  ref?: Ref<HTMLTextAreaElement>;
};

export function Textarea({
  id,
  className,
  ref,
  'aria-describedby': callerDescribedBy,
  ...rest
}: TextareaProps) {
  const field = useContext(FieldContext);
  return (
    <textarea
      ref={ref}
      id={id ?? field?.id}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={mergeDescribedBy(field?.describedBy, callerDescribedBy)}
      className={cn(
        CONTROL,
        'min-h-24 text-lg resize-none',
        borderColor(field?.invalid),
        className,
      )}
      {...rest}
    />
  );
}
