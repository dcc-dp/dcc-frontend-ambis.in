'use client';

import { useState } from 'react';
import VisualCanvas from '@/components/Visual/VisualCanvas';
import RichText from '@/components/Visual/RichText';
import { FIXTURE_QUESTION, visualSpecFixtures } from '@/lib/fixtures/visualSpecFixtures';
import type { InterventionKind } from '@/lib/visualSpec';

const TABS: { kind: InterventionKind; label: string }[] = [
  { kind: 'guiding_question', label: 'Pertanyaan pemandu' },
  { kind: 'hint', label: 'Petunjuk' },
  { kind: 'explanation', label: 'Penjelasan' },
  { kind: 'worked_example', label: 'Contoh langkah' },
];

export default function CanvasPreviewPage() {
  const [kind, setKind] = useState<InterventionKind>('worked_example');

  return (
    <div className="min-h-screen bg-paper text-ink">
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        <header className="space-y-2">
          <p className="text-sm text-ink-soft">Pratinjau tanpa server</p>
          <h1 className="text-[30px] font-bold leading-tight text-ink">Kanvas AMBIS.IN</h1>
          <p className="max-w-[60ch] text-lg leading-[1.65] text-ink">
            <RichText text={FIXTURE_QUESTION} />
          </p>
        </header>

        <nav className="flex flex-wrap gap-x-6 gap-y-1" aria-label="Jenis intervensi">
          {TABS.map((tab) => (
            <button
              key={tab.kind}
              type="button"
              onClick={() => setKind(tab.kind)}
              aria-pressed={kind === tab.kind}
              className={`focus-pop min-h-11 border-b-[3px] px-1 text-lg font-semibold transition-colors duration-150 ${
                kind === tab.kind ? 'border-accent text-ink' : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <VisualCanvas key={kind} spec={visualSpecFixtures[kind]} />
      </main>
    </div>
  );
}
