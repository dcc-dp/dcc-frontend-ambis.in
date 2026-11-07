'use client';

import RichText from '../RichText';
import FractionShape from '../FractionShape';
import { fractionParts, type AnalogySceneBlock } from '@/lib/visualSpec';

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
