import { Callout, Card } from '@/components/ui';
import type { QuizQuestion } from '@/lib/learning/quizData';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  selectedAnswer: number | undefined;
  isSubmitted: boolean;
  onSelect: (questionId: string, optionIndex: number) => void;
}

function Glyph({ kind }: { kind: 'check' | 'cross' }) {
  const d = kind === 'check' ? 'M5 13l4 4L19 7' : 'M6 6l12 12M18 6L6 18';
  return (
    <svg aria-hidden="true" className="ml-auto h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={d} />
    </svg>
  );
}

function optionClass(isSelected: boolean, isCorrectOption: boolean, isSubmitted: boolean): string {
  if (!isSubmitted) {
    return isSelected
      ? 'border-accent bg-accent-soft'
      : 'border-edge bg-card enabled:hover:bg-paper-deep';
  }
  if (isCorrectOption) return 'border-correct bg-correct-soft';
  if (isSelected) return 'border-wrong bg-wrong-soft';
  return 'border-line bg-paper-deep text-ink-soft';
}

function letterClass(isSelected: boolean, isCorrectOption: boolean, isSubmitted: boolean): string {
  if (!isSubmitted) {
    return isSelected ? 'border-accent bg-accent text-on-accent' : 'border-edge text-ink';
  }
  if (isCorrectOption) return 'border-correct bg-correct text-paper';
  if (isSelected) return 'border-wrong bg-wrong text-paper';
  return 'border-line text-ink-soft';
}

export function QuizQuestionCard({
  question,
  index,
  selectedAnswer,
  isSubmitted,
  onSelect,
}: QuizQuestionCardProps) {
  const isCorrect = selectedAnswer === question.correct;

  return (
    <Card padding="lg">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-base font-bold text-accent-ink">
          {index + 1}
        </span>
        <h2 className="text-xl font-semibold text-ink">{question.question}</h2>
      </div>

      <div role="group" aria-label={`Pilihan jawaban soal ${index + 1}`} className="space-y-3 sm:ml-11">
        {question.options.map((option, oIdx) => {
          const isSelected = selectedAnswer === oIdx;
          const isCorrectOption = question.correct === oIdx;

          return (
            <button
              key={oIdx}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(question.id, oIdx)}
              disabled={isSubmitted}
              className={`focus-pop flex min-h-14 w-full items-center gap-3 rounded-lg border-theme px-4 py-3 text-left text-lg text-ink disabled:cursor-default ${optionClass(isSelected, isCorrectOption, isSubmitted)}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-theme text-base font-bold ${letterClass(isSelected, isCorrectOption, isSubmitted)}`}
              >
                {String.fromCharCode(65 + oIdx)}
              </span>
              <span>{option}</span>
              {!isSubmitted && isSelected && <Glyph kind="check" />}
              {isSubmitted && isCorrectOption && <Glyph kind="check" />}
              {isSubmitted && isSelected && !isCorrectOption && <Glyph kind="cross" />}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div className="mt-4 sm:ml-11">
          {isCorrect ? (
            <Callout tone="success" title="Sudah benar:">
              Jawaban benar!
            </Callout>
          ) : (
            <Callout tone="error" title="Belum tepat:">
              Jawaban salah. Jawaban yang benar adalah: <strong>{question.options[question.correct]}</strong>
            </Callout>
          )}
        </div>
      )}
    </Card>
  );
}
