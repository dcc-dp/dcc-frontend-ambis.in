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
      completedChapters: 0,
      description: 'Pelajari konsep dasar aljabar termasuk variabel, koefisien, dan konstanta',
    },
    {
      id: 'persamaan-linear',
      title: 'Persamaan Linear',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Menyelesaikan persamaan linear satu variabel dan dua variabel',
    },
    {
      id: 'sistem-persamaan',
      title: 'Sistem Persamaan',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Sistem persamaan dengan 2 atau lebih variabel',
    },
    {
      id: 'fungsi-dan-grafik',
      title: 'Fungsi & Grafik',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Memahami fungsi dan cara menggambarnya pada koordinat Cartesius',
    },
  ],
  informatika: [
    {
      id: 'dasar-pemrograman',
      title: 'Dasar Pemrograman',
      chapterCount: 4,
      completedChapters: 0,
      description: 'Konsep dasar pemrograman: variabel, tipe data, dan operator',
    },
    {
      id: 'alur-kendali',
      title: 'Alur Kendali',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Percabangan dan perulangan dalam pemrograman',
    },
    {
      id: 'fungsi-dan-prosedur',
      title: 'Fungsi & Prosedur',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Membuat dan menggunakan fungsi dalam pemrograman',
    },
    {
      id: 'struktur-data',
      title: 'Struktur Data',
      chapterCount: 4,
      completedChapters: 0,
      description: 'Array, list, dan struktur data dasar lainnya',
    },
    {
      id: 'pemrograman-oo',
      title: 'OOP Dasar',
      chapterCount: 3,
      completedChapters: 0,
      description: 'Pendahuluan pemrograman berorientasi objek',
    },
  ],
};

export const sampleSubjectNames: Record<string, string> = {
  matematika: 'Matematika',
  informatika: 'Informatika',
};
