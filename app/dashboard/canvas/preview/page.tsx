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
    <main className="mx-auto max-w-2xl space-y-5 px-4 py-8">
      <header className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Pratinjau tanpa server</p>
        <h1 className="text-2xl font-bold text-gray-900">Kanvas AMBIS.IN</h1>
        <p className="text-base text-gray-700">
          <RichText text={FIXTURE_QUESTION} />
        </p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label="Jenis intervensi">
        {TABS.map((tab) => (
          <button
            key={tab.kind}
            type="button"
            onClick={() => setKind(tab.kind)}
            aria-pressed={kind === tab.kind}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              kind === tab.kind
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <VisualCanvas key={kind} spec={visualSpecFixtures[kind]} />
    </main>
  );
}
