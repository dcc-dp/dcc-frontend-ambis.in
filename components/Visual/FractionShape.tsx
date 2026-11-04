import React from 'react';
import type { AnalogyTemplate } from '@/lib/visualSpec';

interface FractionShapeProps {
  template: AnalogyTemplate;
  numerator: number;
  denominator: number;
  size?: number;
}

const FILL = '#f59e0b';
const EMPTY = '#fef3c7';
const STROKE = '#b45309';

function clamp(numerator: number, denominator: number) {
  const d = Math.max(1, Math.min(denominator, 24));
  return { n: Math.max(0, Math.min(numerator, d)), d };
}

function Pizza({ n, d, size }: { n: number; d: number; size: number }) {
  const r = size / 2 - 4;
  const c = size / 2;
  if (d === 1) {
    return <circle cx={c} cy={c} r={r} fill={n ? FILL : EMPTY} stroke={STROKE} strokeWidth={2} />;
  }
  return (
    <>
      {Array.from({ length: d }, (_, i) => {
        const a1 = (i / d) * 2 * Math.PI - Math.PI / 2;
        const a2 = ((i + 1) / d) * 2 * Math.PI - Math.PI / 2;
        const path = `M ${c} ${c} L ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} A ${r} ${r} 0 ${
          2 * Math.PI / d > Math.PI ? 1 : 0
        } 1 ${c + r * Math.cos(a2)} ${c + r * Math.sin(a2)} Z`;
        return <path key={i} d={path} fill={i < n ? FILL : EMPTY} stroke={STROKE} strokeWidth={2} />;
      })}
    </>
  );
}

function Bar({ n, d, size, rounded }: { n: number; d: number; size: number; rounded: boolean }) {
  const width = size - 8;
  const height = rounded ? size * 0.42 : size * 0.3;
  const top = (size - height) / 2;
  const cell = width / d;
  return (
    <>
      {Array.from({ length: d }, (_, i) => (
        <rect
          key={i}
          x={4 + i * cell}
          y={top}
          width={cell}
          height={height}
          rx={rounded ? 4 : 0}
          fill={i < n ? (rounded ? '#92400e' : '#ec4899') : rounded ? '#fde68a' : '#fce7f3'}
          stroke={rounded ? '#78350f' : '#9d174d'}
          strokeWidth={2}
        />
      ))}
    </>
  );
}

function Bottle({ n, d, size }: { n: number; d: number; size: number }) {
  const bodyWidth = size * 0.5;
  const bodyHeight = size * 0.72;
  const left = (size - bodyWidth) / 2;
  const top = size * 0.2;
  const water = (n / d) * bodyHeight;
  return (
    <>
      <rect x={size / 2 - 7} y={size * 0.06} width={14} height={size * 0.16} fill="#bae6fd" stroke="#0369a1" strokeWidth={2} />
      <rect x={left} y={top} width={bodyWidth} height={bodyHeight} rx={8} fill="#e0f2fe" stroke="#0369a1" strokeWidth={2} />
      <rect x={left + 1} y={top + bodyHeight - water} width={bodyWidth - 2} height={water} rx={6} fill="#38bdf8" />
      {Array.from({ length: d - 1 }, (_, i) => (
        <line
          key={i}
          x1={left}
          x2={left + bodyWidth * 0.3}
          y1={top + ((i + 1) / d) * bodyHeight}
          y2={top + ((i + 1) / d) * bodyHeight}
          stroke="#0369a1"
          strokeWidth={1.5}
        />
      ))}
    </>
  );
}

export default function FractionShape({ template, numerator, denominator, size = 112 }: FractionShapeProps) {
  const { n, d } = clamp(numerator, denominator);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${n} per ${d}`}>
      {template === 'pizza' && <Pizza n={n} d={d} size={size} />}
      {template === 'coklat' && <Bar n={n} d={d} size={size} rounded />}
      {template === 'pita' && <Bar n={n} d={d} size={size} rounded={false} />}
      {template === 'botol_air' && <Bottle n={n} d={d} size={size} />}
    </svg>
  );
}
