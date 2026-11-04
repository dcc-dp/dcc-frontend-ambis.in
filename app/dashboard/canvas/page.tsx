'use client';

import { useEffect, useState } from 'react';
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

function MasteryMeter({ mastery }: { mastery: number }) {
  const percent = Math.round(Math.max(0, Math.min(1, mastery)) * 100);
  return (
    <div className="space-y-1" aria-label={`Penguasaan konsep ${percent} persen`}>
      <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
        <span>Penguasaan konsep</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
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
  const { phase, thoughts, visual, result, error, submit, reset } = offline ? demo : online;

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
      .catch((err: unknown) => {
        if (!cancelled) setCatalogError(err instanceof Error ? err.message : 'Gagal memuat soal');
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
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex gap-2" aria-label="Mode belajar">
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
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                  tab === key
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={offline}
              onChange={(event) => setMode(event.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
            Mode demo (tanpa server)
          </label>
        </header>

        {tab === 'ask' && <FreeAsk offline={offline} />}

        {tab === 'practice' && (
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="space-y-4" aria-label="Pilih soal">
              <h1 className="text-lg font-bold text-gray-900">Latihan</h1>
              {catalogError && !offline && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  Soal belum bisa dimuat ({catalogError}). Pastikan server menyala, atau aktifkan{' '}
                  <button type="button" className="font-semibold underline" onClick={() => setMode(true)}>
                    mode demo
                  </button>
                  .
                </p>
              )}
              {!shownCatalog && !catalogError && <p className="text-sm text-gray-500">Memuat soal...</p>}
              {shownCatalog?.map((concept) => (
                <div key={concept.id} className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">{concept.name}</h2>
                  <ul className="space-y-1.5">
                    {concept.exercises.map((exercise, index) => (
                      <li key={exercise.id}>
                        <button
                          type="button"
                          onClick={() => choose(exercise)}
                          aria-current={selected?.id === exercise.id}
                          className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                            selected?.id === exercise.id
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300'
                          }`}
                        >
                          <span className="font-semibold">Soal {index + 1}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            {KIND_LABEL[exercise.kind] ?? exercise.kind} · tingkat {exercise.difficulty}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </aside>

            <section className="space-y-5" aria-live="polite">
              {!selected && !catalogError && catalog && (
                <p className="text-gray-600">Belum ada soal latihan.</p>
              )}

              {selected && (
                <>
                  <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">Soal</p>
                    <p className="text-lg leading-relaxed text-gray-900">
                      <RichText text={selected.question} />
                    </p>
                  </article>

                  <AnswerBox
                    key={selected.id}
                    kind={selected.kind}
                    options={selected.options}
                    disabled={working}
                    onSubmit={submit}
                  />

                  {working && (
                    <div className="space-y-1 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                      {thoughts.map((thought, index) => (
                        <p
                          key={`${thought}-${index}`}
                          className={`text-sm ${index === thoughts.length - 1 ? 'animate-pulse font-semibold text-indigo-800' : 'text-indigo-500'}`}
                        >
                          {thought}
                        </p>
                      ))}
                      {thoughts.length === 0 && (
                        <p className="animate-pulse text-sm text-indigo-800">Menghubungi server...</p>
                      )}
                    </div>
                  )}

                  {phase === 'error' && (
                    <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      {error ?? 'Terjadi kesalahan'}. Coba kirim lagi ya.
                    </p>
                  )}

                  {phase === 'done' && result && (
                    <div className="space-y-5">
                      {result.is_correct ? (
                        <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                          <p className="text-xl font-bold text-emerald-900">Jawabanmu benar! Hebat!</p>
                          <MasteryMeter mastery={result.mastery} />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                            <p className="text-lg font-bold text-amber-900">
                              Belum tepat. Percobaan ke-{result.attempt_number}. Yuk lihat gambarnya!
                            </p>
                            <MasteryMeter mastery={result.mastery} />
                          </div>
                          {visual && <VisualCanvas key={result.attempt_id} spec={visual} />}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
