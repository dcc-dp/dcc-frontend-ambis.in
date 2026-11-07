import { exerciseMeta, type PracticeConcept, type PracticeExercise } from './types';

interface ExercisePickerProps {
  concepts: PracticeConcept[];
  selectedId: string | null;
  onChoose: (exercise: PracticeExercise) => void;
}

const ITEM_BASE =
  'focus-pop border-theme flex min-h-11 w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-base whitespace-nowrap text-ink transition-colors lg:whitespace-normal';

export default function ExercisePicker({ concepts, selectedId, onChoose }: ExercisePickerProps) {
  return (
    <>
      {concepts.map((concept) => (
        <div key={concept.id} className="space-y-2">
          <h2 className="text-sm font-semibold text-ink-soft">{concept.name}</h2>
          <ul className="flex snap-x snap-mandatory gap-2 overflow-x-auto p-1.5 lg:flex-col lg:overflow-visible">
            {concept.exercises.map((exercise, index) => {
              const isSelected = selectedId === exercise.id;
              return (
                <li key={exercise.id} className="shrink-0 snap-start lg:shrink">
                  <button
                    type="button"
                    onClick={() => onChoose(exercise)}
                    aria-current={isSelected}
                    className={`${ITEM_BASE} ${
                      isSelected
                        ? 'border-accent bg-accent-soft font-semibold'
                        : 'border-edge bg-card hover:bg-paper-deep'
                    }`}
                  >
                    <span className="font-semibold">Soal {index + 1}</span>
                    <span className="text-sm text-ink-soft">{exerciseMeta(exercise)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
