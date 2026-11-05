import { ChoiceTile } from './ChoiceTile';
import { TOPICS, type Answers } from './data';

interface StepProps {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
}

export function TopicStep({ answers, update }: StepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-ink">Pilih topik materi yang ingin dipelajari:</h3>
      <div className="space-y-2">
        {TOPICS.map((topic) => (
          <ChoiceTile
            key={topic.id}
            badge={topic.badge}
            title={topic.label}
            desc={`${topic.subtopics.length} sub-topik tersedia`}
            selected={answers.topic === topic.id}
            onSelect={() => update({ topic: topic.id, subtopic: '' })}
          />
        ))}
      </div>
    </div>
  );
}
