'use client';

import React, { useId } from 'react';
import RichText from './RichText';
import FractionShape from './FractionShape';
import {
  fractionParts,
  fractionValue,
  type AnalogySceneBlock,
  type FractionBarBlock,
  type NoteBlock,
  type NumberLineBlock,
  type StepFlowBlock,
} from '@/lib/visualSpec';

const NOTE_STYLES: Record<NoteBlock['tone'], string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  warn: 'border-amber-200 bg-amber-50 text-amber-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
};

export function NoteView({ block }: { block: NoteBlock }) {
  return (
    <div className={`rounded-2xl border px-4 py-3 text-base leading-relaxed ${NOTE_STYLES[block.tone]}`}>
      <RichText text={block.text} />
    </div>
  );
}

export function FractionBarView({ block }: { block: FractionBarBlock }) {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      {block.rows.map((row, index) => {
        const align = block.align_denominator;
        const cells = align ?? row.denominator;
        const shaded = align ? Math.round((row.numerator * align) / row.denominator) : row.numerator;
        return (
          <div key={`${row.label}-${index}`} className="flex items-center gap-3">
            <div className="w-14 shrink-0 text-center text-base text-gray-800">
              <RichText text={row.label || `${row.numerator}/${row.denominator}`} />
            </div>
            <div className="flex h-9 flex-1 overflow-hidden rounded-lg border-2 border-indigo-500">
              {Array.from({ length: cells }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 border-r border-indigo-300 last:border-r-0 transition-colors ${
                    i < shaded ? 'bg-indigo-500' : 'bg-indigo-50'
                  }`}
                />
              ))}
            </div>
          </div>
        );
      })}
      {block.align_denominator && (
        <p className="text-center text-xs text-gray-500">
          Semua batang dipotong menjadi {block.align_denominator} bagian sama besar
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
  const padX = 32;
  const lineY = 84;
  const x = (value: number) => padX + ((value - lo) / (hi - lo)) * (width - 2 * padX);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3">
      <svg viewBox={`0 0 ${width} 130`} className="w-full" role="img" aria-label="Garis bilangan">
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5" />
          </marker>
        </defs>

        <line x1={padX} x2={width - padX} y1={lineY} y2={lineY} stroke="#475569" strokeWidth={3} strokeLinecap="round" />
        {Array.from({ length: block.ticks + 1 }, (_, i) => {
          const tx = x(lo + (i / block.ticks) * (hi - lo));
          const major = i === 0 || i === block.ticks;
          return (
            <line key={i} x1={tx} x2={tx} y1={lineY - (major ? 11 : 6)} y2={lineY + (major ? 11 : 6)} stroke="#475569" strokeWidth={major ? 3 : 1.5} />
          );
        })}
        <text x={padX} y={lineY + 30} textAnchor="middle" fontSize="15" fill="#334155">{block.start}</text>
        <text x={width - padX} y={lineY + 30} textAnchor="middle" fontSize="15" fill="#334155">{block.end}</text>

        {block.arrows.map((arrow, index) => {
          const from = fractionValue(arrow.from) ?? lo;
          const to = from + (fractionValue(arrow.by) ?? 0);
          const x1 = x(from);
          const x2 = x(to);
          const mid = (x1 + x2) / 2;
          return (
            <g key={`arrow-${index}`}>
              <path
                d={`M ${x1} ${lineY - 6} Q ${mid} ${lineY - 62} ${x2} ${lineY - 8}`}
                fill="none"
                stroke="#4f46e5"
                strokeWidth={3}
                strokeDasharray={arrow.hidden_end ? '6 5' : undefined}
                markerEnd={`url(#${markerId})`}
              />
              <text x={mid} y={lineY - 52} textAnchor="middle" fontSize="15" fontWeight={600} fill="#4338ca">{arrow.label}</text>
              {arrow.hidden_end && (
                <g>
                  <circle cx={x2} cy={lineY - 22} r={13} fill="#eef2ff" stroke="#4f46e5" strokeWidth={2} />
                  <text x={x2} y={lineY - 16} textAnchor="middle" fontSize="16" fontWeight={700} fill="#4338ca">?</text>
                </g>
              )}
            </g>
          );
        })}

        {block.points.map((point, index) => {
          const value = fractionValue(point.at);
          if (value === null) return null;
          return (
            <g key={`point-${index}`}>
              <circle cx={x(value)} cy={lineY} r={7} fill="#f59e0b" stroke="#b45309" strokeWidth={2} />
              <text x={x(value)} y={lineY + 52} textAnchor="middle" fontSize="15" fontWeight={600} fill="#92400e">{point.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function AnalogySceneView({ block }: { block: AnalogySceneBlock }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex flex-wrap items-end justify-center gap-6 pb-3">
        {block.items.map((item, index) => {
          const parts = fractionParts(item.fraction);
          if (!parts) return null;
          return (
            <figure key={`${item.fraction}-${index}`} className="flex flex-col items-center gap-1">
              <FractionShape template={block.template} numerator={parts.n} denominator={parts.d} />
              <figcaption className="text-base text-amber-900">
                <RichText text={item.fraction} />
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="text-center text-base leading-relaxed text-amber-950">
        <RichText text={block.story} />
      </p>
    </div>
  );
}

function MathChips({ math }: { math: string }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {math
        .split(';')
        .map((segment) => segment.trim())
        .filter(Boolean)
        .map((segment, index) => (
          <span
            key={`${segment}-${index}`}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-base text-slate-800"
          >
            <RichText text={segment} />
          </span>
        ))}
    </div>
  );
}

export function StepFlowView({ block }: { block: StepFlowBlock }) {
  return (
    <ol className="rounded-2xl border border-gray-200 bg-white p-4">
      {block.steps.map((step, index) => (
        <li key={`${step.n}-${index}`}>
          <div
            className={`rounded-xl border px-3.5 py-3 ${
              step.locked ? 'border-2 border-dashed border-indigo-300 bg-indigo-50/60' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                  step.locked ? 'bg-indigo-400' : 'bg-indigo-600'
                }`}
              >
                {step.locked ? '?' : step.n}
              </span>
              <h4 className="text-base font-bold text-gray-900">{step.title}</h4>
              {step.locked && (
                <span className="ml-auto rounded-full border border-indigo-300 bg-white px-2 py-0.5 text-xs font-semibold text-indigo-700">
                  Giliranmu!
                </span>
              )}
            </div>
            {step.detail && (
              <p className="mt-1.5 pl-9 text-sm leading-relaxed text-gray-600">
                <RichText text={step.detail} />
              </p>
            )}
            {step.math && (
              <div className="pl-9">
                <MathChips math={step.math} />
              </div>
            )}
          </div>
          {index < block.steps.length - 1 && (
            <div className="flex justify-center py-0.5 text-indigo-300" aria-hidden="true">
              <svg width="20" height="22" viewBox="0 0 20 22">
                <line x1="10" y1="0" x2="10" y2="14" stroke="currentColor" strokeWidth="2.5" />
                <polygon points="5,12 15,12 10,20" fill="currentColor" />
              </svg>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
