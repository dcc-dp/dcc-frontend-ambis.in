import MathContent from '@/components/Chat/MathContent';
import { Input } from '@/components/ui';
import type { AgentFeedback, ExerciseItem } from './types';

interface QuizOptionsProps {
  question: ExerciseItem;
  selectedOption: string | null;
  textAnswer: string;
  feedback: AgentFeedback | null;
  onSelect: (key: string) => void;
  onTextChange: (value: string) => void;
}

const TILE_BASE =
  'flex w-full min-h-14 items-center gap-3 rounded-lg border-theme p-4 text-left text-lg focus-pop';

function CheckGlyph() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function tileClass(isSubmitted: boolean, isSelected: boolean, isCorrect: boolean, isWrong: boolean): string {
  if (isSubmitted) {
    if (isCorrect) return 'border-correct bg-correct-soft text-ink cursor-default';
    if (isWrong) return 'border-wrong bg-wrong-soft text-ink cursor-default';
    return 'border-line bg-paper-deep text-ink-soft cursor-not-allowed';
  }
  if (isSelected) return 'border-accent bg-accent-soft text-ink';
  return 'border-edge bg-card text-ink hover:bg-paper-deep';
}

export function QuizOptions({
  question,
  selectedOption,
  textAnswer,
  feedback,
  onSelect,
  onTextChange,
}: QuizOptionsProps) {
  if (!question.options || question.options.length === 0) {
    return (
      <div className="space-y-2">
        <label htmlFor="quiz-text-answer" className="block text-base font-semibold text-ink">
          Ketik jawabanmu di bawah ini:
        </label>
        <Input
          id="quiz-text-answer"
          type="text"
          value={textAnswer}
          onChange={(e) => onTextChange(e.target.value)}
          disabled={Boolean(feedback)}
          placeholder="Contoh: 17/20"
          className="min-h-12 text-lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {question.options.map((opt) => {
        const isSelected = selectedOption === opt.key;
        const isSubmitted = Boolean(feedback);
        const isThisCorrect = Boolean(feedback?.is_correct && isSelected);
        const isThisWrong = Boolean(feedback && !feedback.is_correct && isSelected);

        return (
          <button
            key={opt.key}
            type="button"
            disabled={isSubmitted}
            onClick={() => onSelect(opt.key)}
            aria-pressed={isSelected}
            className={`${TILE_BASE} ${tileClass(isSubmitted, isSelected, isThisCorrect, isThisWrong)}`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-base font-bold ${
                isSelected ? 'bg-accent text-on-accent' : 'bg-paper-deep text-ink'
              }`}
            >
              {opt.key}
            </span>
            <div className="flex-1 font-medium">
              <MathContent content={opt.label} />
            </div>
            {!isSubmitted && isSelected && <span className="text-accent"><CheckGlyph /></span>}
            {isSubmitted && isThisCorrect && (
              <span className="flex items-center gap-1 text-base font-bold text-correct">
                <CheckGlyph />
                Benar
              </span>
            )}
            {isSubmitted && isThisWrong && (
              <span className="text-base font-bold text-wrong">Cek Bimbingan</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
