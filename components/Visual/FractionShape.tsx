import { useId } from 'react';
import type { AnalogyTemplate } from '@/lib/visualSpec';
import { Bar, SimpleBar } from './shapes/Bar';
import { Bottle } from './shapes/Bottle';
import { Pizza } from './shapes/Pizza';

interface FractionShapeProps {
  template: AnalogyTemplate;
  numerator: number;
  denominator: number;
  size?: number;
}

const MAX_DRAWN = 12;

function clamp(numerator: number, denominator: number) {
  const d = Math.max(1, Math.round(denominator) || 1);
  const full = numerator > d;
  return { n: full ? d : Math.max(0, Math.min(numerator, d)), d, full };
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
