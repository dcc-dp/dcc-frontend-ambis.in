'use client';

import RichText from '../RichText';
import type { StepFlowBlock } from '@/lib/visualSpec';

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
