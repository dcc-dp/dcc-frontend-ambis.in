import { cn } from '@/lib/cn';

const ROLE = {
  meter: 'meter',
  progressbar: 'progressbar',
} as const satisfies Record<string, string>;

export type ProgressBarKind = keyof typeof ROLE;

export type ProgressBarProps = {
  ratio: number;
  label: string;
  valueText?: string;
  kind?: ProgressBarKind;
};

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function ProgressBar({ ratio, label, valueText, kind = 'progressbar' }: ProgressBarProps) {
  const percent = Math.round(clampRatio(ratio) * 100);
  const text = valueText ?? `${percent} persen`;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 text-lg">
        <span className="font-semibold text-ink">{label}</span>
        <span aria-hidden="true" className="font-semibold text-ink tabular-nums">
          {percent}%
        </span>
      </div>
      <div
        role={ROLE[kind]}
        aria-label={label}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={text}
        className="h-2.5 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className={cn(
            'h-full rounded-full bg-accent transition-[width] duration-500 motion-reduce:transition-none',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
