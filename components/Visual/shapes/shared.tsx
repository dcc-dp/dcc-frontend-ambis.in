export interface Point {
  x: number;
  y: number;
}

export const INK = 'stroke-illus-ink';
export const HATCH_STYLE = { stroke: 'var(--theme-illus-hatch)' };
const STROKE_WIDTH = 2.25;

export const STROKE_PROPS = {
  strokeWidth: STROKE_WIDTH,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

export function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function jitter(index: number) {
  return round2(Math.sin(index * 12.9) * 0.8);
}

export function pt(x: number, y: number, index: number): Point {
  return { x: round2(x + jitter(index * 2 + 1)), y: round2(y + jitter(index * 2 + 2)) };
}

export function poly(points: Point[]) {
  return `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`;
}

export function Hatch({ clipId, size }: { clipId: string; size: number }) {
  return (
    <g clipPath={`url(#${clipId})`} style={HATCH_STYLE} strokeWidth={1} fill="none">
      {[0.25, 0.5, 0.75].map((offset) => (
        <line key={offset} x1={offset * size - size / 2} y1={size} x2={offset * size + size / 2} y2={0} />
      ))}
    </g>
  );
}
