import { ChoiceTile } from './ChoiceTile';
import { TOPICS, type Answers } from './data';

interface StepProps {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
}

export function SubtopicStep({ answers, update }: StepProps) {
  const selectedTopic = TOPICS.find((t) => t.id === answers.topic);
  if (!selectedTopic) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-ink">
        Pilih sub-topik spesifik di {selectedTopic.label}:
      </h3>
      <div className="space-y-2">
        {selectedTopic.subtopics.map((sub) => (
          <ChoiceTile
            key={sub.id}
            badge={sub.label.charAt(0)}
            title={sub.label}
            desc={sub.desc}
            selected={answers.subtopic === sub.id}
            onSelect={() => update({ subtopic: sub.id })}
          />
        ))}
      </div>
    </div>
  );
}
