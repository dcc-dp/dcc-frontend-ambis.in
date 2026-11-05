import type { BadgeTone } from '@/components/ui';

export interface SubjectTone {
  solid: string;
  text: string;
  border: string;
  badge: BadgeTone;
  stroke: string;
  fill: string;
}

const ACCENT_TONE: SubjectTone = {
  solid: 'bg-accent text-on-accent',
  text: 'text-accent-ink',
  border: 'border-accent',
  badge: 'accent',
  stroke: 'stroke-accent',
  fill: 'fill-accent',
};

const MARK_TONE: SubjectTone = {
  solid: 'bg-mark text-ink',
  text: 'text-ink',
  border: 'border-mark',
  badge: 'mark',
  stroke: 'stroke-mark',
  fill: 'fill-mark',
};

const NEUTRAL_TONE: SubjectTone = {
  solid: 'bg-ink-soft text-paper',
  text: 'text-ink-soft',
  border: 'border-edge',
  badge: 'neutral',
  stroke: 'stroke-ink-soft',
  fill: 'fill-ink-soft',
};

export function subjectTone(subject: string): SubjectTone {
  if (subject === 'Matematika') return ACCENT_TONE;
  if (subject === 'Informatika') return MARK_TONE;
  return NEUTRAL_TONE;
}
