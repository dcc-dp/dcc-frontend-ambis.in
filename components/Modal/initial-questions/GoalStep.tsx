import { Field, Input } from '@/components/ui';
import { ChoiceTile } from './ChoiceTile';
import { GOALS, type Answers } from './data';

interface StepProps {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
}

export function GoalStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-4">
      <Field label="Nama Panggilanmu (Opsional)" hint="Kak Ambis akan mengingat namamu di setiap sesi belajar.">
        <Input
          type="text"
          placeholder="Misal: Budi"
          value={answers.name}
          onChange={(e) => update({ name: e.target.value })}
        />
      </Field>
      <h3 className="text-base font-semibold text-ink">Apa tujuan utama belajarmu?</h3>
      <div className="space-y-2">
        {GOALS.map((goal) => (
          <ChoiceTile
            key={goal.id}
            badge={goal.tag}
            title={goal.label}
            desc={goal.desc}
            selected={answers.goal === goal.id}
            onSelect={() => update({ goal: goal.id })}
          />
        ))}
      </div>
    </div>
  );
}
