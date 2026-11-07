'use client';

import RichText from '../RichText';
import type { FractionBarBlock } from '@/lib/visualSpec';

const HATCH_IMAGE = 'repeating-linear-gradient(135deg, var(--theme-illus-hatch) 0 2px, transparent 2px 7px)';

export function FractionBarView({ block }: { block: FractionBarBlock }) {
  return (
    <div className="space-y-3">
      {block.rows.map((row, index) => {
        const align = block.align_denominator;
        const cells = align ?? row.denominator;
        const shaded = align ? Math.round((row.numerator * align) / row.denominator) : row.numerator;
        return (
          <div key={`${row.label}-${index}`} className="flex items-center gap-3">
            <div className="min-w-14 shrink-0 text-xl font-semibold tabular-nums text-ink">
              <RichText text={row.label || `${row.numerator}/${row.denominator}`} />
            </div>
            <div className="flex h-10 flex-1 overflow-hidden rounded-sm border-theme border-edge bg-card">
              {Array.from({ length: cells }, (_, i) => {
                const isShaded = i < shaded;
                return (
                  <div
                    key={i}
                    className={`flex-1 border-r-[1.5px] border-edge last:border-r-0 ${isShaded ? 'animate-cell-in bg-accent-fill' : 'bg-card'}`}
                    style={isShaded ? { animationDelay: `${Math.min(i, 7) * 60}ms`, backgroundImage: HATCH_IMAGE } : undefined}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      {block.align_denominator && (
        <p className="text-[17px] text-ink-soft">
          Semua batang dibagi menjadi {block.align_denominator} bagian sama besar.
        </p>
      )}
    </div>
  );
}
