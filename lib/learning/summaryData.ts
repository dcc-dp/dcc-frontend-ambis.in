export interface ModuleSummary {
  id: string;
  title: string;
  completedChapters: number;
  totalChapters: number;
  progress: number;
  averageScore?: number;
  isCompleted: boolean;
}

export interface SummaryData {
  pathTitle: string;
  totalProgress: number;
  completedModules: number;
  totalModules: number;
  studyTime: number;
  averageQuizScore: number;
  modules: ModuleSummary[];
}

export const summaryData: Record<string, SummaryData> = {
  matematika: {
    pathTitle: 'Matematika',
    totalProgress: 0,
    completedModules: 0,
    totalModules: 4,
    studyTime: 0,
    averageQuizScore: 0,
    modules: [
      {
        id: 'aljabar-dasar',
        title: 'Aljabar Dasar',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'persamaan-linear',
        title: 'Persamaan Linear',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'sistem-persamaan',
        title: 'Sistem Persamaan',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'fungsi-dan-grafik',
        title: 'Fungsi & Grafik',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
    ],
  },
  informatika: {
    pathTitle: 'Informatika',
    totalProgress: 30,
    completedModules: 0,
    totalModules: 5,
    studyTime: 0,
    averageQuizScore: 0,
    modules: [
      {
        id: 'dasar-pemrograman',
        title: 'Dasar Pemrograman',
        completedChapters: 0,
        totalChapters: 4,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'alur-kendali',
        title: 'Alur Kendali',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'fungsi-dan-prosedur',
        title: 'Fungsi & Prosedur',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'struktur-data',
        title: 'Struktur Data',
        completedChapters: 0,
        totalChapters: 4,
        progress: 0,
        isCompleted: false,
      },
      {
        id: 'pemrograman-oo',
        title: 'OOP Dasar',
        completedChapters: 0,
        totalChapters: 3,
        progress: 0,
        isCompleted: false,
      },
    ],
  },
};
