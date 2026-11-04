'use client';

import { useEffect, useRef, useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import AnswerBox, { type PracticeOption } from '@/components/Visual/AnswerBox';
import FreeAsk from '@/components/Visual/FreeAsk';
import RichText from '@/components/Visual/RichText';
import VisualCanvas from '@/components/Visual/VisualCanvas';
import { API_BASE_URL, useCanvasSession } from '@/app/hooks/useCanvasSession';
import { DEMO_EXERCISE, useOfflineCanvasDemo } from '@/app/hooks/useOfflineCanvasDemo';

interface PracticeExercise {
  id: string;
  concept_id: string;
  difficulty: number;
  kind: string;
  question: string;
  options: PracticeOption[] | null;
}

interface PracticeConcept {
  id: string;
  code: string;
  name: string;
  exercises: PracticeExercise[];
}

type Tab = 'practice' | 'ask';

const KIND_LABEL: Record<string, string> = {
  mcq: 'Pilihan ganda',
  short_answer: 'Isian singkat',
  steps: 'Langkah',
};

const DEMO_CATALOG: PracticeConcept[] = [
  { id: 'demo', code: 'DEMO', name: 'Penjumlahan Pecahan (demo)', exercises: [DEMO_EXERCISE] },
];

function CheckGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function BouncingDots() {
  return (
    <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="animate-dot-pulse h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animationDelay: `${dot * 200}ms` }}
        />
      ))}
    </span>
  );
}

function masteryCaption(percent: number) {
  if (percent < 40) return 'Baru mulai';
  if (percent < 80) return 'Makin paham';
  return 'Hampir menguasai';
}

function MasteryMeter({ mastery }: { mastery: number }) {
  const percent = Math.round(Math.max(0, Math.min(1, mastery)) * 100);
  return (
    <div
      className="space-y-2"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={`${percent} persen, ${masteryCaption(percent)}`}
      aria-label={`Seberapa paham kamu ${percent} persen`}
    >
      <div className="flex items-center justify-between text-base font-semibold text-ink">
        <span>Seberapa paham kamu</span>
        <span className="tabular-nums">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-sm font-semibold text-ink-soft">{masteryCaption(percent)}</p>
    </div>
  );
}

export default function CanvasPage() {
  const [tab, setTab] = useState<Tab>('practice');
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

  const working = phase === 'working';

  return (
    <MainLayout>
      <div className="min-h-full bg-paper text-ink">
        <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex gap-6" aria-label="Mode belajar">
              {(
                [
                  ['practice', 'Latihan soal'],
                  ['ask', 'Tanya bebas'],
                ] as [Tab, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={tab === key}
                  onClick={() => setTab(key)}
                  className={`focus-pop inline-flex min-h-11 items-center border-b-[3px] px-1 text-lg font-semibold transition-colors duration-150 ${
                    tab === key ? 'border-accent text-ink' : 'border-transparent text-ink-soft hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>

            <label className="flex min-h-11 cursor-pointer items-center gap-2 px-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={offline}
                onChange={(event) => setMode(event.target.checked)}
                className="focus-pop h-5 w-5 accent-accent"
              />
              Mode demo (tanpa server)
            </label>
          </header>

          {tab === 'ask' && <FreeAsk offline={offline} />}

          {tab === 'practice' && (
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              <aside className="min-w-0 space-y-4" aria-label="Pilih soal">
                <h1 className="text-xl font-bold text-ink">Latihan</h1>
                {catalogError && !offline && (
                  <p className="rounded-md bg-wrong-soft p-3 text-base text-wrong">
                    <strong className="font-bold">Soal belum bisa dimuat.</strong> Coba lagi sebentar lagi, atau pakai{' '}
                    <button type="button" className="focus-pop font-semibold underline" onClick={() => setMode(true)}>
                      mode demo
                    </button>
                    .
                  </p>
                )}
                {!shownCatalog && !catalogError && <p className="text-base text-ink-soft">Memuat soal</p>}
                {shownCatalog?.map((concept) => (
                  <div key={concept.id} className="space-y-2">
                    <h2 className="text-sm font-semibold text-ink-soft">{concept.name}</h2>
                    <div className="relative">
                      <ul className="-m-1 flex snap-x snap-mandatory gap-1 overflow-x-auto p-1 pb-2 lg:flex-col lg:overflow-visible">
                        {concept.exercises.map((exercise, index) => (
                          <li key={exercise.id} className="shrink-0 snap-start lg:shrink">
                            <button
                              type="button"
                              onClick={() => choose(exercise)}
                              aria-current={selected?.id === exercise.id}
                              className={`focus-pop flex min-h-11 w-full items-center gap-2.5 rounded-md border-b-[3px] px-3 py-1.5 text-left text-base whitespace-nowrap text-ink transition-colors duration-150 lg:whitespace-normal lg:border-b-0 ${
                                selected?.id === exercise.id
                                  ? 'border-accent bg-accent-soft lg:font-bold'
                                  : 'border-transparent hover:bg-paper-deep'
                              }`}
                            >
                              <span className="font-semibold lg:font-[inherit]">Soal {index + 1}</span>
                              <span className="hidden text-sm text-ink-soft lg:inline">
                                {KIND_LABEL[exercise.kind] ?? exercise.kind} · tingkat {exercise.difficulty}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-paper to-transparent lg:hidden"
                      />
                    </div>
                  </div>
                ))}
              </aside>

              <section className="min-w-0 space-y-6">
                {!selected && !catalogError && catalog && (
                  <p className="text-ink-soft">Belum ada soal latihan.</p>
                )}

                {selected && (
                  <>
                    <article>
                      <p className="text-sm font-semibold text-ink-soft">
                        {KIND_LABEL[selected.kind] ?? selected.kind} · tingkat {selected.difficulty}
                      </p>
                      <div className="border-b border-line py-6">
                        <p className="max-w-[60ch] text-[22px] font-semibold leading-[1.4] text-ink sm:text-[26px]">
                          <RichText text={selected.question} />
                        </p>
                      </div>
                    </article>

                    <AnswerBox
                      key={selected.id}
                      kind={selected.kind}
                      options={selected.options}
                      disabled={working}
                      onSubmit={submit}
                    />

                    <div
                      ref={feedbackRef}
                      tabIndex={-1}
                      role="status"
                      aria-live="polite"
                      className="space-y-6 outline-none"
                    >
                      {working && (
                        <div className="space-y-2 rounded-md bg-paper-deep p-4 text-ink">
                          {thoughts.map((thought, index) => (
                            <p
                              key={`${thought}-${index}`}
                              className={`flex items-center gap-2 text-base ${index === thoughts.length - 1 ? 'font-semibold' : 'text-ink-soft'}`}
                            >
                              {index === thoughts.length - 1 ? <BouncingDots /> : <CheckGlyph />}
                              <span>{thought}</span>
                            </p>
                          ))}
                          {thoughts.length === 0 && (
                            <p className="flex items-center gap-2 text-base font-semibold">
                              <BouncingDots />
                              <span>Menghubungi server</span>
                            </p>
                          )}
                        </div>
                      )}

                      {phase === 'error' && (
                        <p role="alert" className="rounded-md bg-wrong-soft p-5 text-xl font-semibold text-wrong">
                          Jawabanmu belum terkirim, sinyalnya sepertinya putus. Coba lagi, ya.
                        </p>
                      )}

                      {phase === 'done' && result && (
                        result.is_correct ? (
                          <div className="space-y-4 rounded-md bg-correct-soft p-5 text-correct">
                            <p className="text-xl">
                              <strong className="font-bold">Benar.</strong> Jawabanmu sudah tepat.
                            </p>
                            <MasteryMeter mastery={result.mastery} />
                          </div>
                        ) : (
                          <div className="space-y-4 rounded-md bg-attention-soft p-5 text-attention">
                            <div>
                              <p className="text-xl">
                                <strong className="font-bold">Belum tepat.</strong> Coba lagi, ya.
                              </p>
                              <p className="text-base">
                                Percobaan ke-{result.attempt_number}. Gambar di bawah bisa membantu.
                              </p>
                            </div>
                            <MasteryMeter mastery={result.mastery} />
                          </div>
                        )
                      )}
                    </div>

                    {phase === 'done' && result && !result.is_correct && visual && (
                      <VisualCanvas key={result.attempt_id} spec={visual} />
                    )}
                  </>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
