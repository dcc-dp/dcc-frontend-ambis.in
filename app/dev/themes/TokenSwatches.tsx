'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface SwatchToken {
  name: string;
  swatch: string;
}

const TOKENS: SwatchToken[] = [
  { name: 'paper', swatch: 'bg-paper' },
  { name: 'card', swatch: 'bg-card' },
  { name: 'paper-deep', swatch: 'bg-paper-deep' },
  { name: 'ink', swatch: 'bg-ink' },
  { name: 'ink-soft', swatch: 'bg-ink-soft' },
  { name: 'line', swatch: 'bg-line' },
  { name: 'edge', swatch: 'bg-edge' },
  { name: 'accent', swatch: 'bg-accent' },
  { name: 'accent-ink', swatch: 'bg-accent-ink' },
  { name: 'accent-soft', swatch: 'bg-accent-soft' },
  { name: 'accent-fill', swatch: 'bg-accent-fill' },
  { name: 'on-accent', swatch: 'bg-on-accent' },
  { name: 'correct', swatch: 'bg-correct' },
  { name: 'correct-soft', swatch: 'bg-correct-soft' },
  { name: 'attention', swatch: 'bg-attention' },
  { name: 'attention-soft', swatch: 'bg-attention-soft' },
  { name: 'mark', swatch: 'bg-mark' },
  { name: 'mark-soft', swatch: 'bg-mark-soft' },
  { name: 'wrong', swatch: 'bg-wrong' },
  { name: 'wrong-soft', swatch: 'bg-wrong-soft' },
];

export function TokenSwatches() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const resolved: Record<string, string> = {};
    container.querySelectorAll<HTMLElement>('[data-token]').forEach((element) => {
      const name = element.dataset.token ?? '';
      resolved[name] = getComputedStyle(element).getPropertyValue(`--theme-${name}`).trim();
    });
    setValues(resolved);
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-2 gap-3">
      {TOKENS.map((token) => (
        <div
          key={token.name}
          className="flex flex-col gap-2 rounded-lg border-theme border-line bg-card p-3"
        >
          <div
            data-token={token.name}
            className={cn('h-12 rounded-md border-theme border-edge', token.swatch)}
          />
          <span className="text-base font-semibold text-ink">{token.name}</span>
          <span className="text-sm break-all text-ink-soft">
            {values[token.name] || 'memuat...'}
          </span>
        </div>
      ))}
    </div>
  );
}
