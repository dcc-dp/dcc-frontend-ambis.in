import { Hatch, INK, HATCH_STYLE, STROKE_PROPS, pt, round2 } from './shared';

export function Pizza({ n, d, size, clipId }: { n: number; d: number; size: number; clipId: string }) {
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
        <path key={i} d={path} className={`${i < n ? 'fill-illus-pizza' : 'fill-illus-empty'} ${INK}`} {...STROKE_PROPS} />
      ))}
      {n > 0 && <Hatch clipId={clipId} size={size} />}
      <circle cx={c} cy={c} r={r - 5} fill="none" style={HATCH_STYLE} strokeWidth={1} />
      {dots.map((dot, i) => (
        <circle key={i} cx={dot.x} cy={dot.y} r={dot.radius} className={`fill-illus-pepperoni ${INK}`} strokeWidth={1.25} />
      ))}
    </>
  );
}
