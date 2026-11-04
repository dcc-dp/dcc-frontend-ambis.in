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
  guiding_question: 'Mulai berpikir',
  hint: 'Petunjuk',
  explanation: 'Penjelasan',
  worked_example: 'Contoh langkah demi langkah',
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
    <section className="space-y-4" aria-label={spec.title || 'Kanvas penjelasan'}>
      <header className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
          {KIND_LABEL[spec.intervention_kind]}
        </span>
        {spec.title && <h2 className="text-lg font-bold text-gray-900">{spec.title}</h2>}
      </header>

      {spec.blocks.map((block, index) => {
        const content = renderBlock(block);
        if (!content) return null;
        return (
          <div
            key={`${block.type}-${index}`}
            className="animate-fade-in space-y-1.5"
            style={{ animationDelay: `${index * 180}ms`, animationFillMode: 'both' }}
          >
            {content}
            {block.caption && (
              <p className="px-1 text-sm text-gray-500">
                <RichText text={block.caption} />
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
