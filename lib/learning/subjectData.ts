export interface ModuleItem {
  id: string;
  title: string;
  chapterCount: number;
  completedChapters: number;
  description: string;
  progress?: number;
}

export const moduleData: Record<string, ModuleItem[]> = {
  matematika: [
    {
      id: 'aljabar-dasar',
      title: 'Aljabar Dasar',
      chapterCount: 3,
      completedChapters: 3,
      description: 'Pelajari konsep dasar aljabar termasuk variabel, koefisien, dan konstanta',
      progress: 100,
    },
    {
      id: 'persamaan-linear',
      title: 'Persamaan Linear',
      chapterCount: 3,
      completedChapters: 2,
      description: 'Menyelesaikan persamaan linear satu variabel dan dua variabel',
      progress: 67,
    },
    {
      id: 'sistem-persamaan',
      title: 'Sistem Persamaan',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Sistem persamaan dengan 2 atau lebih variabel',
      progress: 0,
    },
    {
      id: 'fungsi-dan-grafik',
      title: 'Fungsi & Grafik',
      chapterCount: 3,
      completedChapters: 1,
      description: 'Memahami fungsi dan cara menggambarnya pada koordinat Cartesius',
      progress: 25,
    },
  ],
  informatika: [
    {
      id: 'dasar-pemrograman',
      title: 'Dasar Pemrograman',
      chapterCount: 4,
      completedChapters: 4,
      description: 'Konsep dasar pemrograman: variabel, tipe data, dan operator',
      progress: 100,
    },
    {
      id: 'alur-kendali',
      title: 'Alur Kendali',
      chapterCount: 3,
      completedChapters: 2,
      description: 'Percabangan dan perulangan dalam pemrograman',
      progress: 67,
    },
    {
      id: 'fungsi-dan-prosedur',
      title: 'Fungsi & Prosedur',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Membuat dan menggunakan fungsi dalam pemrograman',
      progress: 0,
    },
    {
      id: 'struktur-data',
      title: 'Struktur Data',
      chapterCount: 4,
      completedChapters: 0,
      description: 'Array, list, dan struktur data dasar lainnya',
      progress: 0,
    },
    {
      id: 'pemrograman-oo',
      title: 'OOP Dasar',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Pendahuluan pemrograman berorientasi objek',
      progress: 0,
    },
  ],
};

export const sampleSubjectNames: Record<string, string> = {
  matematika: 'Matematika',
  informatika: 'Informatika',
};
