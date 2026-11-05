'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { TabPanel, Tabs } from '@/components/ui';
import FreeAsk from '@/components/Visual/FreeAsk';
import PracticeScreen from '@/components/Practice/PracticeScreen';
import { DEMO_CATALOG, type CanvasTab, type PracticeExercise } from '@/components/Practice/types';
import { useCanvasSession } from '@/app/hooks/useCanvasSession';
import { DEMO_EXERCISE, useOfflineCanvasDemo } from '@/app/hooks/useOfflineCanvasDemo';
import ExerciseSidebar from './ExerciseSidebar';
import { useCanvasPractice } from './useCanvasPractice';

const SHOW_DEMO_TOGGLE = process.env.NEXT_PUBLIC_DEMO_TOGGLE === '1';

const TAB_ITEMS: { value: CanvasTab; label: string }[] = [
  { value: 'practice', label: 'Latihan soal' },
  { value: 'ask', label: 'Tanya bebas' },
];


function CanvasScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab: CanvasTab = searchParams.get('tab') === 'ask' ? 'ask' : 'practice';
  const [offline, setOffline] = useState(false);
  const { catalog, catalogError, selected, setSelected } = useCanvasPractice();

  const online = useCanvasSession(offline ? null : selected?.id ?? null);
  const demo = useOfflineCanvasDemo();
  const { phase, thoughts, visual, result, submit, reset } = offline ? demo : online;
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (phase !== 'done' && phase !== 'error') return;
    const node = feedbackRef.current;
    if (!node) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }, [phase]);

  const shownCatalog = offline ? DEMO_CATALOG : catalog;

  const changeTab = (value: CanvasTab) => {
    router.replace(value === 'ask' ? `${pathname}?tab=ask` : pathname, { scroll: false });
  };

  const selectedLabel = (() => {
    for (const concept of shownCatalog ?? []) {
      const index = concept.exercises.findIndex((exercise) => exercise.id === selected?.id);
      if (index >= 0) return `Soal ${index + 1}`;
    }
    return '';
  })();

  const choose = (exercise: PracticeExercise) => {
    reset();
    setSelected(exercise);
  };

  const setMode = (next: boolean) => {
    online.reset();
    demo.reset();
    setOffline(next);
    setSelected(next ? DEMO_EXERCISE : catalog?.[0]?.exercises[0] ?? null);
  };

  const demoToggle = (
    <label className="flex min-h-11 cursor-pointer items-center gap-2 px-2 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={offline}
        onChange={(event) => setMode(event.target.checked)}
        className="focus-pop h-5 w-5 accent-accent"
      />
      Mode demo (tanpa server)
    </label>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <Tabs
        label="Mode belajar"
        value={tab}
        onChange={changeTab}
        items={TAB_ITEMS}
        idBase="canvas"
        trailing={SHOW_DEMO_TOGGLE ? demoToggle : undefined}
      >
        <TabPanel value="ask">
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-ink">Tanya bebas</h1>
            <FreeAsk offline={offline} />
          </div>
        </TabPanel>

        <TabPanel value="practice">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <ExerciseSidebar
              shownCatalog={shownCatalog}
              catalogError={catalogError}
              offline={offline}
              selected={selected}
              selectedLabel={selectedLabel}
              onChoose={choose}
              onUseDemo={SHOW_DEMO_TOGGLE ? () => setMode(true) : undefined}
            />
            <section className="min-w-0 space-y-6">
              {!selected && !catalogError && catalog && <p className="text-ink-soft">Belum ada soal latihan.</p>}
              {selected && (
                <PracticeScreen
                  exercise={selected}
                  onSubmit={submit}
                  phase={phase}
                  thoughts={thoughts}
                  visual={visual}
                  result={result}
                  feedbackRef={feedbackRef}
                />
              )}
            </section>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default function CanvasPage() {
  return (
    <Suspense fallback={null}>
      <CanvasScreen />
    </Suspense>
  );
}
