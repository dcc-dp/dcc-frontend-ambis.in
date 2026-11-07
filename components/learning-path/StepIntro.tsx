import { Card } from '@/components/ui';
import type { RoadmapStep } from '@/lib/learning-path/types';

interface StepIntroProps {
  step: RoadmapStep;
  stepNumber: number;
  subtopic: string;
}

export function StepIntro({ step, stepNumber, subtopic }: StepIntroProps) {
  return (
    <Card as="section" aria-labelledby="judul-tahap" tone="sunken" padding="md" className="space-y-2">
      <p className="text-sm font-semibold text-ink-soft">
        Tahap {stepNumber} · {subtopic}
      </p>
      <h2 id="judul-tahap" className="text-xl font-bold text-ink">
        {step.title}
      </h2>
      <p className="text-lg text-ink">Di tahap ini kamu akan belajar: {step.description.replace(/\.$/, '')}.</p>
      <p className="text-base text-ink-soft">
        Kak Ambis menjelaskan lewat tanya jawab. Pilih salah satu saran di bawah, atau tulis pertanyaanmu sendiri.
      </p>
    </Card>
  );
}
