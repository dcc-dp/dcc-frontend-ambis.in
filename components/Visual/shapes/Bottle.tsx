import { Hatch, INK, STROKE_PROPS, jitter, poly, pt, round2 } from './shared';

export function Bottle({ n, d, size, id }: { n: number; d: number; size: number; id: string }) {
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
      <path d={neck} className={`fill-illus-empty ${INK}`} {...STROKE_PROPS} />
      <path d={body} className="fill-illus-empty" stroke="none" />
      {n > 0 && (
        <g clipPath={`url(#${bodyClip})`}>
          <path d={water} className={`fill-illus-water ${INK}`} {...STROKE_PROPS} />
          <Hatch clipId={fillClip} size={size} />
        </g>
      )}
      <path d={body} fill="none" className={INK} {...STROKE_PROPS} />
      {Array.from({ length: d - 1 }, (_, i) => {
        const y = round2(top + ((i + 1) / d) * bodyHeight + jitter(i + 300));
        return (
          <line
            key={i}
            x1={round2(right - bodyWidth * 0.3)}
            x2={right}
            y1={y}
            y2={y}
            className={INK}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
}
