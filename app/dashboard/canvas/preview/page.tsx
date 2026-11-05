'use client';

import { useState } from 'react';
import { Tabs } from '@/components/ui';
import VisualCanvas from '@/components/Visual/VisualCanvas';
import RichText from '@/components/Visual/RichText';
import { FIXTURE_QUESTION, visualSpecFixtures } from '@/lib/fixtures/visualSpecFixtures';
import type { InterventionKind } from '@/lib/visualSpec';

const SHOW_DEV_LABEL = process.env.NEXT_PUBLIC_DEMO_TOGGLE === '1';

const TABS:{ value: InterventionKind; label: string }[] = [
  { value: 'guiding_question', label: 'Pertanyaan pemandu' },
  { value: 'hint', label: 'Petunjuk' },
  { value: 'explanation', label: 'Penjelasan' },
  { value: 'worked_example', label: 'Contoh langkah' },
];

export default function CanvasPreviewPage() {
  const [kind, setKind] = useState<InterventionKind>('worked_example');

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        {SHOW_DEV_LABEL && <p className="text-sm text-ink-soft">Pratinjau tanpa server</p>}
        <h1 className="text-3xl font-bold leading-tight text-ink">
          {SHOW_DEV_LABEL ? 'Kanvas AMBIS.IN' : 'Contoh tampilan soal'}
        </h1>
        <p className="max-w-[60ch] text-lg leading-relaxed text-ink">
          <RichText text={FIXTURE_QUESTION} />
        </p>
      </header>

      <Tabs label="Jenis intervensi" value={kind} onChange={setKind} items={TABS} idBase="preview" />

      <VisualCanvas key={kind} spec={visualSpecFixtures[kind]} />
    </div>
  );
}
