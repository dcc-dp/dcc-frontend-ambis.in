import { ChoiceTile } from './ChoiceTile';
import { DIFFICULTIES, type Answers } from './data';

interface StepProps {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
}

export function DifficultyStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-ink">Pilih tingkat kesulitan belajarmu:</h3>
      <div className="space-y-2">
        {DIFFICULTIES.map((diff) => {
          const selected = answers.difficulty === diff.id;
          return (
            <ChoiceTile
              key={diff.id}
              badge={diff.tag}
              title={diff.label}
              desc={diff.desc}
              selected={selected}
              onSelect={() => update({ difficulty: diff.id })}
              extra={
                selected ? (
                  <span className="mt-1 block text-sm font-medium text-accent-ink">{diff.detail}</span>
                ) : null
              }
            />
          );
        })}
      </div>
    </div>
  );
}
