import { Badge } from '@/components/ui';

export function StartNode({ title }: { title: string }) {
  return (
    <div className="flex w-full max-w-sm items-center justify-between gap-2 rounded-xl border-theme border-correct bg-correct-soft px-3.5 py-2 text-sm text-ink">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-correct text-sm font-bold text-card">
          S
        </span>
        <span className="truncate font-bold">Titik Awal: {title}</span>
      </div>
      <Badge tone="correct">Mulai</Badge>
    </div>
  );
}

export function FinalNode({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full max-w-sm items-center justify-between gap-2 rounded-xl border-theme border-accent bg-accent-soft px-3.5 py-2.5 text-left text-sm text-ink transition-colors hover:bg-paper-deep focus-pop"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent">
          ✓
        </span>
        <span className="font-bold">Target Tercapai & Kesimpulan</span>
      </div>
      <Badge tone="accent">Selesai</Badge>
    </button>
  );
}
