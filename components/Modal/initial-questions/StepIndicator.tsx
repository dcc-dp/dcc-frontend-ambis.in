interface StepIndicatorProps {
  step: number;
  total: number;
}

export function StepIndicator({ step, total }: StepIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-label="Langkah"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step + 1}
      aria-valuetext={`Langkah ${step + 1} dari ${total}`}
      className="mb-4 flex gap-2"
    >
      {Array.from({ length: total }, (_, s) => (
        <span
          key={s}
          className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-accent' : 'bg-line'}`}
        />
      ))}
    </div>
  );
}
