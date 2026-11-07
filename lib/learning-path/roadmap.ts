import type { RoadmapStep } from './types';

export function generateInitialRoadmap(subtopic: string): RoadmapStep[] {
  if (subtopic === 'pecahan') {
    return [
      {
        id: 'step-1',
        title: 'Pecahan Senilai',
        description: 'Fondasi memahami representasi pecahan senilai sebelum operasi hitung.',
        type: 'lesson',
        completed: false,
        current: true,
        hasQuiz: false,
      },
      {
        id: 'step-2',
        title: 'KPK Penyebut',
        description: 'Menentukan Kelipatan Persekutuan Terkecil untuk menyamakan penyebut berbeda.',
        type: 'lesson',
        completed: false,
        current: false,
        hasQuiz: false,
      },
      {
        id: 'step-3',
        title: 'Penjumlahan Pecahan Berpenyebut Beda',
        description: 'Materi inti: menyamakan penyebut pecahan lalu menjumlahkan pembilang.',
        type: 'lesson',
        completed: false,
        current: false,
        hasQuiz: false,
      },
      {
        id: 'step-4',
        title: 'Latihan Terbimbing (Scaffolding)',
        description: 'Latihan soal berjenjang didampingi panduan adaptif dari Kak Ambis.',
        type: 'practice',
        completed: false,
        current: false,
        hasQuiz: true,
      },
      {
        id: 'step-5',
        title: 'Evaluasi & Uji Pemahaman',
        description: 'Uji pemahaman akhir dan kenaikan level penguasaan konsep.',
        type: 'checkpoint',
        completed: false,
        current: false,
        hasQuiz: true,
      },
    ];
  }

  return [
    { id: 'step-1', title: 'Pengenalan Konsep', description: 'Dasar dan definisi topik', type: 'lesson', completed: false, current: true, hasQuiz: false },
    { id: 'step-2', title: 'Teori Fundamental', description: 'Prinsip dan rumus utama', type: 'lesson', completed: false, current: false, hasQuiz: false },
    { id: 'step-3', title: 'Latihan Terbimbing', description: 'Latihan soal pemula & menengah', type: 'practice', completed: false, current: false, hasQuiz: true },
    { id: 'step-4', title: 'Aplikasi Nyata', description: 'Penerapan soal cerita kontekstual', type: 'lesson', completed: false, current: false, hasQuiz: false },
    { id: 'step-5', title: 'Evaluasi Akhir', description: 'Review & evaluasi pemahaman', type: 'checkpoint', completed: false, current: false, hasQuiz: true },
  ];
}
