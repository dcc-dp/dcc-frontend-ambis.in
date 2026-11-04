'use client';

import React from 'react';
import RichText from './RichText';
import {
  AnalogySceneView,
  FractionBarView,
  NoteView,
  NumberLineView,
  StepFlowView,
} from './blocks';
import type { VisualBlock, VisualSpec } from '@/lib/visualSpec';

const KIND_LABEL: Record<VisualSpec['intervention_kind'], string> = {
  guiding_question: 'Coba pikirkan dulu',
  hint: 'Petunjuk',
  explanation: 'Penjelasan',
  worked_example: 'Contoh langkah',
};

function renderBlock(block: VisualBlock): React.ReactNode {
  switch (block.type) {
    case 'note':
      return <NoteView block={block} />;
    case 'fraction_bar':
      return <FractionBarView block={block} />;
    case 'number_line':
      return <NumberLineView block={block} />;
    case 'analogy_scene':
      return <AnalogySceneView block={block} />;
    case 'step_flow':
      return <StepFlowView block={block} />;
    case 'answer_input':
      return null;
  }
}

export default function VisualCanvas({ spec }: { spec: VisualSpec }) {
  return (
    <section
      className="space-y-8 rounded-lg border border-line bg-card p-5 sm:p-6"
      aria-label={spec.title || 'Kanvas penjelasan'}
    >
      <header className="space-y-1">
        <p className="text-sm font-semibold text-ink-soft">{KIND_LABEL[spec.intervention_kind]}</p>
        {spec.title && (
          <h2 className="pb-2 text-2xl font-bold tracking-[-0.01em] text-ink">
            <span className="relative inline-block">
              {spec.title}
              <svg
                className="absolute -bottom-2 left-0 h-2 w-full text-accent"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M2 4 Q 7 0 12 4 T 22 4 T 32 4 T 42 4 T 52 4 T 62 4 T 72 4 T 82 4 T 92 4 T 98 4" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
          </h2>
        )}
      </header>

      {spec.blocks.map((block, index) => {
        const content = renderBlock(block);
        if (!content) return null;
        return (
          <div
            key={`${block.type}-${index}`}
            className="animate-block-in space-y-2"
            style={{ animationDelay: `${Math.min(index, 3) * 120}ms` }}
          >
            {content}
            {block.caption && (
              <p className="text-[17px] leading-normal text-ink-soft">
                <RichText text={block.caption} />
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
