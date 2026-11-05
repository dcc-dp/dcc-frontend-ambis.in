import { Badge, Card, ProgressBar } from '@/components/ui';
import type { BadgeTone } from '@/components/ui';
import { categoryIcon } from './StatCard';

export interface ConceptRowProps {
  name: string;
  progress: number;
  previousProgress: number;
  category: string;
}

interface ChangeIndicator {
  text: string;
  tone: BadgeTone;
  icon: string;
}

function getChangeIndicator(current: number, previous: number): ChangeIndicator {
  const change = current - previous;
  if (change > 0) return { text: `+${change}%`, tone: 'correct', icon: '↑' };
  if (change < 0) return { text: `${change}%`, tone: 'wrong', icon: '↓' };
  return { text: '0%', tone: 'neutral', icon: '→' };
}

export function ConceptRow({ name, progress, previousProgress, category }: ConceptRowProps) {
  const change = getChangeIndicator(progress, previousProgress);

  return (
    <Card as="article" padding="md" className="flex items-start gap-4">
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-paper-deep text-accent md:h-14 md:w-14"
      >
        {categoryIcon(category)}
      </span>
      <div className="min-w-0 flex-1">
        <ProgressBar ratio={progress / 100} label={name} kind="progressbar" />
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-base text-ink-soft">
          <Badge tone={change.tone}>
            {change.icon} {change.text}
          </Badge>
          <span>Sebelumnya: {previousProgress}%</span>
          <span aria-hidden="true">•</span>
          <span className="capitalize">{category}</span>
        </div>
      </div>
    </Card>
  );
}
