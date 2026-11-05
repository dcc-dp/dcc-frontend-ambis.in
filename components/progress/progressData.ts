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
    if (stored) {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as ConceptProgress[];
    }
  } catch {
    return getDefaultProgress();
  }
  return getDefaultProgress();
}

export function saveProgress(progress: ConceptProgress[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    return;
  }
}

export function getDefaultProgress(): ConceptProgress[] {
  return [
    { id: 'pecahan', name: 'Pecahan', progress: 35, previousProgress: 20, icon: '🍰', category: 'matematika' },
    { id: 'bilangan-bulat', name: 'Bilangan Bulat', progress: 62, previousProgress: 50, icon: '🔢', category: 'matematika' },
    { id: 'aljabar-dasar', name: 'Aljabar Dasar', progress: 42, previousProgress: 35, icon: '🧮', category: 'matematika' },
    { id: 'perbandingan', name: 'Perbandingan', progress: 28, previousProgress: 20, icon: '⚖️', category: 'matematika' },
    { id: 'berpikir-komputasional', name: 'Berpikir Komputasional', progress: 55, previousProgress: 40, icon: '🧠', category: 'informatika' },
    { id: 'algoritma', name: 'Algoritma', progress: 48, previousProgress: 38, icon: '🧩', category: 'informatika' },
    { id: 'data-dan-gambar', name: 'Data dan Gambar', progress: 31, previousProgress: 24, icon: '🖼️', category: 'informatika' },
  ];
}
