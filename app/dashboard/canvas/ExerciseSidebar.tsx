import ExercisePicker from '@/components/Practice/ExercisePicker';
import type { PracticeConcept, PracticeExercise } from '@/components/Practice/types';

interface ExerciseSidebarProps {
  shownCatalog: PracticeConcept[] | null;
  catalogError: string | null;
  offline: boolean;
  selected: PracticeExercise | null;
  selectedLabel: string;
  onChoose: (exercise: PracticeExercise) => void;
  onUseDemo?: () => void;
}

export default function ExerciseSidebar({
  shownCatalog,
  catalogError,
  offline,
  selected,
  selectedLabel,
  onChoose,
  onUseDemo,
}: ExerciseSidebarProps) {
  const selectedId = selected?.id ?? null;
  return (
    <aside className="min-w-0 space-y-4" aria-label="Pilih soal">
      <h1 className="text-xl font-bold text-ink">Latihan</h1>
      {catalogError && !offline && (
        <p className="rounded-md bg-wrong-soft p-3 text-base text-wrong">
          <strong className="font-bold">Soal belum bisa dimuat.</strong> Coba lagi sebentar lagi
          {onUseDemo ? (
            <>
              , atau pakai{' '}
              <button type="button" className="focus-pop min-h-11 font-semibold underline" onClick={onUseDemo}>
                mode demo
              </button>
            </>
          ) : null}
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
              <ExercisePicker concepts={shownCatalog} selectedId={selectedId} onChoose={onChoose} />
            </div>
          </details>
          <div className="hidden space-y-4 lg:block">
            <ExercisePicker concepts={shownCatalog} selectedId={selectedId} onChoose={onChoose} />
          </div>
        </>
      )}
    </aside>
  );
}
