'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/Layout/AppShell';
import { TabPanel, Tabs } from '@/components/ui';
import FreeAsk from '@/components/Visual/FreeAsk';
import ExercisePicker from '@/components/Practice/ExercisePicker';
import PracticeScreen from '@/components/Practice/PracticeScreen';
import {
  DEMO_CATALOG,
  type CanvasTab,
  type PracticeConcept,
  type PracticeExercise,
} from '@/components/Practice/types';
import { API_BASE_URL, useCanvasSession } from '@/app/hooks/useCanvasSession';
import { DEMO_EXERCISE, useOfflineCanvasDemo } from '@/app/hooks/useOfflineCanvasDemo';

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
  const [catalog, setCatalog] = useState<PracticeConcept[] | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PracticeExercise | null>(null);

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

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/v1/curriculum/practice`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<PracticeConcept[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setCatalog(data);
        setSelected(data[0]?.exercises[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setCatalogError('Soal belum bisa dimuat');
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <Tabs
          label="Mode belajar"
          value={tab}
          onChange={changeTab}
          items={TAB_ITEMS}
          idBase="canvas"
          trailing={
            <label className="flex min-h-11 cursor-pointer items-center gap-2 px-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={offline}
                onChange={(event) => setMode(event.target.checked)}
                className="focus-pop h-5 w-5 accent-accent"
              />
              Mode demo (tanpa server)
            </label>
          }
        >
        <TabPanel value="ask">
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-ink">Tanya bebas</h1>
            <FreeAsk offline={offline} />
          </div>
        </TabPanel>

        <TabPanel value="practice">
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="min-w-0 space-y-4" aria-label="Pilih soal">
              <h1 className="text-xl font-bold text-ink">Latihan</h1>
              {catalogError && !offline && (
                <p className="rounded-md bg-wrong-soft p-3 text-base text-wrong">
                  <strong className="font-bold">Soal belum bisa dimuat.</strong> Coba lagi sebentar lagi, atau pakai{' '}
                  <button type="button" className="focus-pop min-h-11 font-semibold underline" onClick={() => setMode(true)}>
                    mode demo
                  </button>
                  .
                </p>
              )}
              {!shownCatalog && !catalogError && <p className="text-base text-ink-soft">Memuat soal</p>}
              {shownCatalog && (
                <>
                  <details className="rounded-md border-theme border-edge bg-card lg:hidden">
                    <summary className="focus-pop flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-md px-3 text-base font-semibold text-ink">
                      <span>Pilih soal</span>
                      <span className="text-sm font-normal text-ink-soft">{selectedLabel}</span>
                    </summary>
                    <div className="space-y-2 px-2 pb-2">
                      <ExercisePicker concepts={shownCatalog} selectedId={selected?.id ?? null} onChoose={choose} />
                    </div>
                  </details>
                  <div className="hidden space-y-4 lg:block">
                    <ExercisePicker concepts={shownCatalog} selectedId={selected?.id ?? null} onChoose={choose} />
                  </div>
                </>
              )}
            </aside>

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
    </AppShell>
  );
}

export default function CanvasPage() {
  return (
    <Suspense fallback={null}>
      <CanvasScreen />
    </Suspense>
  );
}
