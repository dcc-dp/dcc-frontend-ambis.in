import React, { useId } from 'react';
import type { AnalogyTemplate } from '@/lib/visualSpec';

interface FractionShapeProps {
  template: AnalogyTemplate;
  numerator: number;
  denominator: number;
  size?: number;
}

interface Point {
  x: number;
  y: number;
}

const INK = '#2A2722';
const EMPTY = '#FFFDF8';
const STROKE_WIDTH = 2.25;
const MAX_DRAWN = 12;
const CHEESE = '#EFC36B';
const CHOCOLATE = '#9A6A47';
const RIBBON = '#C9604F';
const WATER = '#8DB6D9';
const PEPPERONI = '#B5473A';

const STROKE_PROPS = {
  stroke: INK,
  strokeWidth: STROKE_WIDTH,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function jitter(index: number) {
  return round2(Math.sin(index * 12.9) * 0.8);
}

function pt(x: number, y: number, index: number): Point {
  return { x: round2(x + jitter(index * 2 + 1)), y: round2(y + jitter(index * 2 + 2)) };
}

function poly(points: Point[]) {
  return `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`;
}

function clamp(numerator: number, denominator: number) {
  const d = Math.max(1, Math.round(denominator) || 1);
  const full = numerator > d;
  return { n: full ? d : Math.max(0, Math.min(numerator, d)), d, full };
}

function SimpleBar({ n, d, size }: { n: number; d: number; size: number }) {
  const width = size - 8;
  const height = size * 0.3;
  const top = (size - height) / 2;
  return (
    <>
      <rect x={4} y={top} width={width} height={height} rx={4} fill={EMPTY} {...STROKE_PROPS} />
      {n > 0 && <rect x={4} y={top} width={round2((width * n) / d)} height={height} rx={4} fill={CHOCOLATE} {...STROKE_PROPS} />}
    </>
  );
}

function Hatch({ clipId, size }: { clipId: string; size: number }) {
  return (
    <g clipPath={`url(#${clipId})`} stroke={INK} strokeWidth={1} opacity={0.5} fill="none">
      {[0.25, 0.5, 0.75].map((offset) => (
        <line key={offset} x1={offset * size - size / 2} y1={size} x2={offset * size + size / 2} y2={0} />
      ))}
    </g>
  );
}

function Pizza({ n, d, size, clipId }: { n: number; d: number; size: number; clipId: string }) {
  const r = size / 2 - 4;
  const c = size / 2;
  const points = Array.from({ length: d }, (_, i) => {
    const a = (i / d) * 2 * Math.PI - Math.PI / 2;
    return pt(c + r * Math.cos(a), c + r * Math.sin(a), i);
  });
  const slices =
    d === 1
      ? [`M ${c - r} ${c} A ${r} ${r} 0 1 0 ${c + r} ${c} A ${r} ${r} 0 1 0 ${c - r} ${c} Z`]
      : points.map((p, i) => {
          const q = points[(i + 1) % d];
          return `M ${c} ${c} L ${p.x} ${p.y} A ${r} ${r} 0 0 1 ${q.x} ${q.y} Z`;
        });

  const dots: { x: number; y: number; radius: number }[] = [];
  if (d === 1) {
    if (n) {
      [[-0.3, -0.2], [0.28, 0.08], [-0.04, 0.36]].forEach(([dx, dy]) => {
        dots.push({ x: round2(c + r * dx), y: round2(c + r * dy), radius: 4.5 });
      });
    }
  } else {
    const shown = Math.min(n, 3);
    for (let i = 0; i < shown; i += 1) {
      const a = ((i + 0.5) / d) * 2 * Math.PI - Math.PI / 2;
      const radius = Math.min(4.5, ((2 * Math.PI * 0.6 * r) / d) * 0.3);
      if (radius < 1.5) continue;
      const radii = shown < 2 ? [0.62, 0.34] : [0.62];
      radii.forEach((k) => {
        dots.push({ x: round2(c + k * r * Math.cos(a)), y: round2(c + k * r * Math.sin(a)), radius: round2(radius) });
      });
    }
  }

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          {slices.map((path, i) => (i < n || (d === 1 && n) ? <path key={i} d={path} /> : null))}
        </clipPath>
      </defs>
      {slices.map((path, i) => (
        <path key={i} d={path} fill={i < n ? CHEESE : EMPTY} {...STROKE_PROPS} />
      ))}
      {n > 0 && <Hatch clipId={clipId} size={size} />}
      <circle cx={c} cy={c} r={r - 5} fill="none" stroke={INK} strokeWidth={1} opacity={0.45} />
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.radius} fill={PEPPERONI} stroke={INK} strokeWidth={1.25} />
      ))}
    </>
  );
}

function Bar({ n, d, size, rounded, clipId }: { n: number; d: number; size: number; rounded: boolean; clipId: string }) {
  const width = size - 8;
  const height = rounded ? size * 0.42 : size * 0.3;
  const top = (size - height) / 2;
  const cell = width / d;
  const notch = rounded ? 0 : Math.min(8, height * 0.35);
  const rr = rounded ? Math.min(4, cell / 2) : 0;
  const upper = Array.from({ length: d + 1 }, (_, i) => pt(4 + i * cell, top, i));
  const lower = Array.from({ length: d + 1 }, (_, i) => pt(4 + i * cell, top + height, i + 100));

  const cellPath = (i: number) => {
    const tl = upper[i];
    const tr = upper[i + 1];
    const br = lower[i + 1];
    const bl = lower[i];
    const roundLeft = rounded && i === 0;
    const roundRight = rounded && i === d - 1;
    let path = roundLeft
      ? `M ${tl.x} ${round2(tl.y + rr)} Q ${tl.x} ${tl.y} ${round2(tl.x + rr)} ${tl.y}`
      : `M ${tl.x} ${tl.y}`;
    if (roundRight) {
      path += ` L ${round2(tr.x - rr)} ${tr.y} Q ${tr.x} ${tr.y} ${tr.x} ${round2(tr.y + rr)} L ${br.x} ${round2(br.y - rr)} Q ${br.x} ${br.y} ${round2(br.x - rr)} ${br.y}`;
    } else if (notch && i === d - 1) {
      path += ` L ${tr.x} ${tr.y} L ${round2(tr.x - notch)} ${round2((tr.y + br.y) / 2)} L ${br.x} ${br.y}`;
    } else {
      path += ` L ${tr.x} ${tr.y} L ${br.x} ${br.y}`;
    }
    path += roundLeft
      ? ` L ${round2(bl.x + rr)} ${bl.y} Q ${bl.x} ${bl.y} ${bl.x} ${round2(bl.y - rr)} Z`
      : ` L ${bl.x} ${bl.y} Z`;
    return path;
  };

  const fill = rounded ? CHOCOLATE : RIBBON;
  const paths = Array.from({ length: d }, (_, i) => cellPath(i));

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          {paths.map((path, i) => (i < n ? <path key={i} d={path} /> : null))}
        </clipPath>
      </defs>
      {paths.map((path, i) => (
        <path key={i} d={path} fill={i < n ? fill : EMPTY} {...STROKE_PROPS} />
      ))}
      {n > 0 && <Hatch clipId={clipId} size={size} />}
      {rounded &&
        cell >= 8 &&
        Array.from({ length: d }, (_, i) => {
          const y = round2(top + height / 2 + jitter(i + 200));
          return (
            <line
              key={i}
              x1={round2(upper[i].x + 3)}
              x2={round2(upper[i + 1].x - 3)}
              y1={y}
              y2={y}
              stroke={INK}
              strokeWidth={1}
              strokeLinecap="round"
              opacity={0.5}
            />
          );
        })}
    </>
  );
}

function Bottle({ n, d, size, id }: { n: number; d: number; size: number; id: string }) {
  const bodyWidth = size * 0.5;
  const bodyHeight = size * 0.72;
  const left = (size - bodyWidth) / 2;
  const right = left + bodyWidth;
  const top = size * 0.2;
  const bottom = top + bodyHeight;
  const radius = 8;
  const bodyClip = `${id}-body`;
  const fillClip = `${id}-fill`;

  const tl = pt(left, top, 0);
  const tr = pt(right, top, 1);
  const br = pt(right, bottom, 2);
  const bl = pt(left, bottom, 3);
  const body =
    `M ${tl.x + radius} ${tl.y} L ${tr.x - radius} ${tr.y} Q ${tr.x} ${tr.y} ${tr.x} ${tr.y + radius} ` +
    `L ${br.x} ${br.y - radius} Q ${br.x} ${br.y} ${br.x - radius} ${br.y} ` +
    `L ${bl.x + radius} ${bl.y} Q ${bl.x} ${bl.y} ${bl.x} ${bl.y - radius} ` +
    `L ${tl.x} ${tl.y + radius} Q ${tl.x} ${tl.y} ${tl.x + radius} ${tl.y} Z`;

  const neckTop = size * 0.06;
  const neckBottom = size * 0.22;
  const neck = poly([
    pt(size / 2 - 7, neckTop, 4),
    pt(size / 2 + 7, neckTop, 5),
    pt(size / 2 + 7, neckBottom, 6),
    pt(size / 2 - 7, neckBottom, 7),
  ]);

  const waterY = round2(bottom - (n / d) * bodyHeight);
  const water =
    `M ${left} ${waterY} Q ${round2(left + bodyWidth * 0.25)} ${round2(waterY - 3)} ${round2(left + bodyWidth * 0.5)} ${waterY} ` +
    `T ${right} ${waterY} L ${right} ${bottom + 2} L ${left} ${bottom + 2} Z`;

  return (
    <>
      <defs>
        <clipPath id={bodyClip}>
          <path d={body} />
        </clipPath>
        <clipPath id={fillClip}>
          <path d={water} />
        </clipPath>
      </defs>
      <path d={neck} fill={EMPTY} {...STROKE_PROPS} />
      <path d={body} fill={EMPTY} stroke="none" />
      {n > 0 && (
        <g clipPath={`url(#${bodyClip})`}>
          <path d={water} fill={WATER} {...STROKE_PROPS} />
          <Hatch clipId={fillClip} size={size} />
        </g>
      )}
      <path d={body} fill="none" {...STROKE_PROPS} />
      {Array.from({ length: d - 1 }, (_, i) => {
        const y = round2(top + ((i + 1) / d) * bodyHeight + jitter(i + 300));
        return (
          <line
            key={i}
            x1={round2(right - bodyWidth * 0.3)}
            x2={right}
            y1={y}
            y2={y}
            stroke={INK}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}

export default function FractionShape({ template, numerator, denominator, size = 112 }: FractionShapeProps) {
  const { n, d, full } = clamp(numerator, denominator);
  const id = useId().replace(/[^\w-]/g, '');
  const clipId = `${id}-fill`;
  const simple = d > MAX_DRAWN;
  const label = full ? `penuh, ${numerator} dari ${d} bagian` : `${n} dari ${d} bagian`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
      {simple && <SimpleBar n={n} d={d} size={size} />}
      {!simple && template === 'pizza' && <Pizza n={n} d={d} size={size} clipId={clipId} />}
      {!simple && template === 'coklat' && <Bar n={n} d={d} size={size} rounded clipId={clipId} />}
      {!simple && template === 'pita' && <Bar n={n} d={d} size={size} rounded={false} clipId={clipId} />}
      {!simple && template === 'botol_air' && <Bottle n={n} d={d} size={size} id={id} />}
    </svg>
  );
}
