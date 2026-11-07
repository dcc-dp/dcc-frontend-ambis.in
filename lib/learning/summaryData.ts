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
    totalProgress: 60,
    completedModules: 1,
    totalModules: 4,
    studyTime: 5,
    averageQuizScore: 82,
    modules: [
      {
        id: 'aljabar-dasar',
        title: 'Aljabar Dasar',
        completedChapters: 3,
        totalChapters: 3,
        progress: 100,
        averageScore: 90,
        isCompleted: true,
      },
      {
        id: 'persamaan-linear',
        title: 'Persamaan Linear',
        completedChapters: 2,
        totalChapters: 3,
        progress: 67,
        averageScore: 80,
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
        completedChapters: 1,
        totalChapters: 3,
        progress: 25,
        averageScore: 75,
        isCompleted: false,
      },
    ],
  },
  informatika: {
    pathTitle: 'Informatika',
    totalProgress: 30,
    completedModules: 1,
    totalModules: 5,
    studyTime: 3,
    averageQuizScore: 85,
    modules: [
      {
        id: 'dasar-pemrograman',
        title: 'Dasar Pemrograman',
        completedChapters: 4,
        totalChapters: 4,
        progress: 100,
        averageScore: 92,
        isCompleted: true,
      },
      {
        id: 'alur-kendali',
        title: 'Alur Kendali',
        completedChapters: 2,
        totalChapters: 3,
        progress: 67,
        averageScore: 80,
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
