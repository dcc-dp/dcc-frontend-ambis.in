import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  emphasis?: boolean;
}

function Glyph({ children, size = 28 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export const STAT_ICONS = {
  total: (
    <Glyph>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </Glyph>
  ),
  improvement: (
    <Glyph>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </Glyph>
  ),
  matematika: (
    <Glyph>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Glyph>
  ),
  informatika: (
    <Glyph>
      <path d="M8 8l-4 4 4 4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M13.5 5l-3 14" />
    </Glyph>
  ),
} as const;

export function categoryIcon(category: string): ReactNode {
  return category === 'informatika' ? STAT_ICONS.informatika : STAT_ICONS.matematika;
}

export function StatCard({ icon, label, value, emphasis = false }: StatCardProps) {
  return (
    <Card padding="md" className="flex flex-col gap-2">
      <span aria-hidden="true" className="text-accent">
        {icon}
      </span>
      <p className="text-base text-ink-soft">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${emphasis ? 'text-correct' : 'text-ink'}`}>
        {value}
      </p>
    </Card>
  );
}
