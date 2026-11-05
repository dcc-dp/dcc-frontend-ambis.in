import { ProgressBar } from '@/components/ui';

function masteryCaption(percent: number) {
  if (percent < 40) return 'Baru mulai';
  if (percent < 80) return 'Makin paham';
  return 'Hampir menguasai';
}

export default function MasteryMeter({ mastery }: { mastery: number }) {
  const ratio = Math.max(0, Math.min(1, mastery));
  const caption = masteryCaption(Math.round(ratio * 100));
  return <ProgressBar kind="meter" ratio={ratio} label="Seberapa paham kamu" valueText={caption} />;
}
