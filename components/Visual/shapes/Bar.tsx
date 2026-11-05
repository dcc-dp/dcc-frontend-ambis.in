import { Hatch, INK, HATCH_STYLE, STROKE_PROPS, jitter, pt, round2 } from './shared';

export function SimpleBar({ n, d, size }: { n: number; d: number; size: number }) {
  const width = size - 8;
  const height = size * 0.3;
  const top = (size - height) / 2;
  return (
    <>
      <rect x={4} y={top} width={width} height={height} rx={4} className={`fill-illus-empty ${INK}`} {...STROKE_PROPS} />
      {n > 0 && <rect x={4} y={top} width={round2((width * n) / d)} height={height} rx={4} className={`fill-illus-chocolate ${INK}`} {...STROKE_PROPS} />}
    </>
  );
}

export function Bar({ n, d, size, rounded, clipId }: { n: number; d: number; size: number; rounded: boolean; clipId: string }) {
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

  const fill = rounded ? 'fill-illus-chocolate' : 'fill-illus-ribbon';
  const paths = Array.from({ length: d }, (_, i) => cellPath(i));

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          {paths.map((path, i) => (i < n ? <path key={i} d={path} /> : null))}
        </clipPath>
      </defs>
      {paths.map((path, i) => (
        <path key={i} d={path} className={`${i < n ? fill : 'fill-illus-empty'} ${INK}`} {...STROKE_PROPS} />
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
              style={HATCH_STYLE}
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}
    </>
  );
}
