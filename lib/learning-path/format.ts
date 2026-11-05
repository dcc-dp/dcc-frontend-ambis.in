export function formatRelativeTime(date: Date): string {
  const diff = new Date().getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export function difficultyLabel(difficulty: string): string {
  if (difficulty === 'beginner') return 'Pemula';
  if (difficulty === 'intermediate') return 'Menengah';
  return 'Lanjutan';
}

const GOAL_LABELS: Record<string, string> = {
  pr: 'Mengerjakan PR',
  konsep: 'Memahami Konsep',
};

export function goalLabel(goal: string | undefined): string | null {
  if (!goal) return null;
  return GOAL_LABELS[goal] ?? null;
}
