export interface Answers {
  name: string;
  goal: string;
  topic: string;
  subtopic: string;
  difficulty: string;
}

export const TOPICS = [
  {
    id: 'matematika',
    label: 'Matematika',
    badge: 'MTK',
    subtopics: [
      { id: 'pecahan', label: 'Pecahan', desc: 'Pecahan senilai, KPK penyebut, & penjumlahan pecahan' },
      { id: 'aljabar', label: 'Aljabar', desc: 'Persamaan, pertidaksamaan, dan fungsi' },
      { id: 'geometri', label: 'Geometri', desc: 'Bangun ruang, luas, dan volume' },
      { id: 'statistika', label: 'Statistika', desc: 'Mean, median, modus, dan probabilitas' },
      { id: 'kalkulus', label: 'Kalkulus Dasar', desc: 'Limit, turunan, dan integral' },
      { id: 'trigonometri', label: 'Trigonometri', desc: 'Sin, cos, tan dan aplikasinya' },
    ],
  },
  {
    id: 'informatika',
    label: 'Informatika',
    badge: 'INF',
    subtopics: [
      { id: 'pemrograman-dasar', label: 'Pemrograman Dasar', desc: 'Variabel, tipe data, dan operator' },
      { id: 'algoritma', label: 'Algoritma', desc: 'Flowchart, pseudocode, dan logika' },
      { id: 'web-dasar', label: 'Web Development', desc: 'HTML, CSS, dan JavaScript' },
      { id: 'struktur-data', label: 'Struktur Data', desc: 'Array, linked list, dan stack' },
      { id: 'database', label: 'Database', desc: 'SQL dan relational database' },
    ],
  },
];

export const DIFFICULTIES = [
  {
    id: 'beginner',
    label: 'Pemula',
    tag: 'Dasar',
    desc: 'Belajar dari nol, cocok untuk yang baru kenal topik ini',
    detail: 'Penjelasan step-by-step, banyak contoh, dan latihan dasar',
  },
  {
    id: 'intermediate',
    label: 'Menengah',
    tag: 'Sedang',
    desc: 'Sudah paham dasar, ingin memperdalam pemahaman',
    detail: 'Latihan lebih kompleks, studi kasus, dan proyek kecil',
  },
  {
    id: 'advanced',
    label: 'Lanjutan',
    tag: 'Mahir',
    desc: 'Sudah menguasai topik, ingin tantangan lebih',
    detail: 'Soal olimpiade, proyek kompleks, dan analisis mendalam',
  },
];

export const GOALS = [
  { id: 'pr', label: 'Ngerjain PR', tag: 'PR', desc: 'Ada tugas sekolah yang harus diselesaikan' },
  { id: 'konsep', label: 'Paham Konsep', tag: 'Konsep', desc: 'Mau memahami materi secara bertahap dan jelas' },
];
