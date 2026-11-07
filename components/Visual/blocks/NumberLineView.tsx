'use client';

import { useId } from 'react';
import { fractionValue, type NumberLineBlock } from '@/lib/visualSpec';

const GRID_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent 0 23px, var(--theme-illus-grid) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, var(--theme-illus-grid) 23px 24px)',
};

export function NumberLineView({ block }: { block: NumberLineBlock }) {
  const markerId = useId();
  const lo = fractionValue(block.start) ?? 0;
  const hi = fractionValue(block.end) ?? 1;
  const width = 600;
  const padX = 40;
  const lineY = 110;
  const span = hi - lo || 1;
  const x = (value: number) => padX + ((Math.max(lo, Math.min(hi, value)) - lo) / span) * (width - 2 * padX);

  const pointItems = block.points
    .map((point, index) => ({ point, index, value: fractionValue(point.at) }))
    .filter((item): item is { point: typeof item.point; index: number; value: number } => item.value !== null)
    .sort((a, b) => a.value - b.value);
  const labelGap = 74;
  const labelRows = pointItems.length > 1 && (pointItems.length - 1) * labelGap > width - 2 * padX ? 2 : 1;
  const labelX: number[] = new Array(pointItems.length);
  for (let row = 0; row < labelRows; row += 1) {
    const slots = pointItems.map((_, order) => order).filter((order) => order % labelRows === row);
    const xs = slots.map((order) => x(pointItems[order].value));
    for (let i = 1; i < xs.length; i += 1) xs[i] = Math.max(xs[i], xs[i - 1] + labelGap);
    if (xs.length && xs[xs.length - 1] > width - padX) {
      xs[xs.length - 1] = width - padX;
      for (let i = xs.length - 2; i >= 0; i -= 1) xs[i] = Math.min(xs[i], xs[i + 1] - labelGap);
    }
    slots.forEach((order, i) => {
      labelX[order] = Math.max(padX, xs[i]);
    });
  }
  const svgHeight = 200 + (labelRows - 1) * 44;

  return (
    <div className="bg-illus-empty p-2" style={GRID_STYLE}>
      <svg viewBox={`0 0 ${width} ${svgHeight}`} className="w-full" role="img" aria-label={`Garis bilangan dari ${block.start} sampai ${block.end}`}>
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-illus-accent" />
          </marker>
        </defs>

        <line x1={padX} x2={width - padX} y1={lineY} y2={lineY} className="stroke-illus-ink" strokeWidth={2.5} strokeLinecap="round" />
        {Array.from({ length: block.ticks + 1 }, (_, i) => {
          const tx = x(lo + (i / block.ticks) * (hi - lo));
          const major = i === 0 || i === block.ticks;
          return (
            <line key={i} x1={tx} x2={tx} y1={lineY - (major ? 11 : 6)} y2={lineY + (major ? 11 : 6)} className="stroke-illus-ink" strokeWidth={major ? 2.5 : 2} strokeLinecap="round" />
          );
        })}
        <text x={padX} y={lineY + 42} textAnchor="middle" fontSize="34" fontWeight={600} className="fill-illus-ink">{block.start}</text>
        <text x={width - padX} y={lineY + 42} textAnchor="middle" fontSize="34" fontWeight={600} className="fill-illus-ink">{block.end}</text>

        {block.arrows.map((arrow, index) => {
          const from = fractionValue(arrow.from) ?? lo;
          const to = from + (fractionValue(arrow.by) ?? 0);
          const x1 = x(from);
          const x2 = x(to);
          const mid = (x1 + x2) / 2;
          return (
            <g key={`arrow-${index}`}>
              <path
                d={`M ${x1} ${lineY - 6} Q ${mid} ${lineY - 78} ${x2} ${lineY - 8}`}
                fill="none"
                className="stroke-illus-accent"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={arrow.hidden_end ? '6 5' : undefined}
                markerEnd={`url(#${markerId})`}
              />
              <text x={mid} y={lineY - 62} textAnchor="middle" fontSize="34" fontWeight={600} className="fill-illus-accent-ink">{arrow.label}</text>
              {arrow.hidden_end && (
                <g>
                  <circle cx={x2} cy={lineY - 30} r={20} className="fill-illus-mark stroke-illus-ink" strokeWidth={2} />
                  <text x={x2} y={lineY - 20} textAnchor="middle" fontSize="30" fontWeight={600} className="fill-illus-ink">?</text>
                </g>
              )}
            </g>
          );
        })}

        {pointItems.map((item, order) => (
          <g key={`point-${item.index}`}>
            <circle cx={x(item.value)} cy={lineY} r={8} className="fill-illus-accent stroke-illus-ink" strokeWidth={2} />
            <text x={labelX[order]} y={lineY + 80 + (order % labelRows) * 44} textAnchor="middle" fontSize="34" fontWeight={600} className="fill-illus-ink">{item.point.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
