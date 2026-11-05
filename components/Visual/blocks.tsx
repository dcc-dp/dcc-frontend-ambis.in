'use client';

import React, { useId } from 'react';
import RichText from './RichText';
import FractionShape from './FractionShape';
import { Callout, type CalloutTone } from '@/components/ui';
import {
  fractionParts,
  fractionValue,
  type AnalogySceneBlock,
  type FractionBarBlock,
  type NoteBlock,
  type NumberLineBlock,
  type StepFlowBlock,
} from '@/lib/visualSpec';

const GRID_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent 0 23px, var(--theme-illus-grid) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, var(--theme-illus-grid) 23px 24px)',
};

const HATCH_IMAGE = 'repeating-linear-gradient(135deg, var(--theme-illus-hatch) 0 2px, transparent 2px 7px)';

const NOTE_TONE = { info: 'info', warn: 'warn', success: 'success' } as const satisfies Record<NoteBlock['tone'], CalloutTone>;

export function NoteView({ block }: { block: NoteBlock }) {
  return (
    <Callout tone={NOTE_TONE[block.tone]} className="max-w-[60ch] text-[18px] leading-[1.65]">
      <RichText text={block.text} />
    </Callout>
  );
}

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

export function AnalogySceneView({ block }: { block: AnalogySceneBlock }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-6">
        {block.items.map((item, index) => {
          const parts = fractionParts(item.fraction);
          if (!parts) return null;
          return (
            <figure key={`${item.fraction}-${index}`} className="flex flex-col items-center gap-2">
              <FractionShape template={block.template} numerator={parts.n} denominator={parts.d} />
              <figcaption className="text-xl font-semibold tabular-nums text-ink">
                <RichText text={item.fraction} />
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="max-w-[60ch] text-left text-[18px] leading-[1.65] text-ink">
        <RichText text={block.story} />
      </p>
    </div>
  );
}

function MathLines({ math }: { math: string }) {
  return (
    <div className="mt-2 space-y-1">
      {math
        .split(';')
        .map((segment) => segment.trim())
        .filter(Boolean)
        .map((segment, index) => (
          <div key={`${segment}-${index}`} className="overflow-x-auto break-words text-[20px] font-medium leading-snug tabular-nums text-ink sm:text-[22px]">
            <RichText text={segment} />
          </div>
        ))}
    </div>
  );
}

function PencilMini() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20l1-5L16 4l4 4L9 19z" />
    </svg>
  );
}

export function StepFlowView({ block }: { block: StepFlowBlock }) {
  return (
    <ol className="divide-y divide-line">
      {block.steps.map((step, index) => (
        <li
          key={`${step.n}-${index}`}
          className={`grid grid-cols-[2rem_1fr] gap-x-3 py-4 first:pt-0 last:pb-0 ${
            step.locked ? '-mx-4 rounded-md bg-mark-soft px-4 first:pt-4 last:pb-4' : ''
          }`}
        >
          <span className="text-[19px] font-bold leading-snug text-accent">{step.locked ? '?' : step.n}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="flex-1 text-[19px] font-semibold leading-snug text-ink">
                <span className="sr-only">Langkah {step.n}: </span>
                {step.title}
              </h3>
              {step.locked && (
                <span className="inline-flex shrink-0 items-center gap-1.5 text-base font-semibold text-accent-ink">
                  Giliranmu
                  <PencilMini />
                </span>
              )}
            </div>
            {step.detail && (
              <p className={`mt-1 max-w-[60ch] text-[18px] leading-[1.65] ${step.locked ? 'text-ink' : 'text-ink-soft'}`}>
                <RichText text={step.detail} />
              </p>
            )}
            {step.math && <MathLines math={step.math} />}
            {step.locked && (
              <>
                <div className="mt-3 h-8 border-b-2 border-dashed border-edge" aria-hidden="true" />
                <p className="mt-1 text-base text-ink-soft">Tulis di bukumu</p>
              </>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
