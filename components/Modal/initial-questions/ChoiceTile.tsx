import type { ReactNode } from 'react';

interface ChoiceTileProps {
  badge: string;
  title: string;
  desc: string;
  selected: boolean;
  onSelect: () => void;
  extra?: ReactNode;
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 text-accent"
    >
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

export function ChoiceTile({ badge, title, desc, selected, onSelect, extra }: ChoiceTileProps) {
  const tone = selected
    ? 'border-accent bg-accent-soft'
    : 'border-edge bg-card hover:bg-paper-deep';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex min-h-14 w-full items-center gap-3 rounded-lg border-theme p-3 text-left transition-colors focus-pop ${tone}`}
    >
      <span className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg bg-paper-deep px-2 text-sm font-bold text-ink">
        {badge}
      </span>
      <span className="flex-1">
        <span className="block text-base font-semibold text-ink">{title}</span>
        <span className="block text-sm text-ink-soft">{desc}</span>
        {extra}
      </span>
      {selected && <CheckIcon />}
    </button>
  );
}
