export interface ConceptProgress {
  id: string;
  name: string;
  progress: number;
  previousProgress: number;
  icon: string;
  category: 'matematika' | 'informatika';
}

export const STORAGE_KEY = 'ambisin_student_progress';

export function loadProgress(): ConceptProgress[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return getDefaultProgress();
}

export function saveProgress(progress: ConceptProgress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getDefaultProgress(): ConceptProgress[] {
  return [
    { id: 'pecahan', name: 'Pecahan', progress: 35, previousProgress: 20, icon: '🍰', category: 'matematika' },
    { id: 'aljabar', name: 'Aljabar', progress: 42, previousProgress: 35, icon: '🔢', category: 'matematika' },
    { id: 'geometri', name: 'Geometri', progress: 67, previousProgress: 55, icon: '📐', category: 'matematika' },
    { id: 'statistika', name: 'Statistika', progress: 23, previousProgress: 15, icon: '📊', category: 'matematika' },
    { id: 'kalkulus', name: 'Kalkulus Dasar', progress: 15, previousProgress: 10, icon: '📈', category: 'matematika' },
    { id: 'pemrograman', name: 'Pemrograman Dasar', progress: 78, previousProgress: 60, icon: '💻', category: 'informatika' },
    { id: 'algoritma', name: 'Algoritma', progress: 55, previousProgress: 40, icon: '🧩', category: 'informatika' },
    { id: 'web', name: 'Web Development', progress: 31, previousProgress: 20, icon: '🌐', category: 'informatika' },
    { id: 'database', name: 'Database', progress: 45, previousProgress: 30, icon: '🗄️', category: 'informatika' },
  ];
}
