export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

export const quizData: Record<string, QuizQuestion[]> = {
  'pengenalan-variabel': [
    {
      id: 'q1',
      question: 'Apa itu variabel dalam aljabar?',
      options: [
        'Simbol yang mewakili nilai belum diketahui',
        'Angka dalam persamaan',
        'Operasi matematika',
        'Hasil dari perhitungan',
      ],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Dalam persamaan x + 5 = 10, x adalah?',
      options: ['Konstanta', 'Variabel', 'Koefisien', 'Hasil akhir'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Manakah yang merupakan contoh variabel?',
      options: ['7', 'y', '+', '15'],
      correct: 1,
    },
  ],
  'konstanta-dan-koefisien': [
    {
      id: 'q1',
      question: 'Dalam ekspresi 3x + 7, berapakah koefisien dari x?',
      options: ['3', '7', 'x', '1'],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Manakah yang merupakan konstanta dalam 5y - 3?',
      options: ['5', 'y', '-3', 'Tidak ada'],
      correct: 2,
    },
    {
      id: 'q3',
      question: 'Berapakah koefisien dari x dalam x + 4?',
      options: ['0', '1', '4', 'Tidak ada'],
      correct: 1,
    },
  ],
  'operasi-pada-variabel': [
    {
      id: 'q1',
      question: 'Hasil dari 3x + 2x adalah?',
      options: ['5x', '6x', '5x²', 'x'],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Hasil dari 6x ÷ 2 adalah?',
      options: ['3x', '3', '4x', '12x'],
      correct: 0,
    },
    {
      id: 'q3',
      question: 'Manakah operasi yang benar?',
      options: ['x + y = xy', '2x + 3x = 5x', 'x + x = x²', '3x - x = 3'],
      correct: 1,
    },
  ],
  'pengenalan-persamaan': [
    {
      id: 'q1',
      question: 'Apa yang dimaksud dengan persamaan linear?',
      options: [
        'Persamaan dengan derajat 2',
        'Persamaan yang menyatakan kesamaan dua ekspresi dengan derajat 1',
        'Persamaan tanpa variabel',
        'Persamaan dengan banyak variabel',
      ],
      correct: 1,
    },
    {
      id: 'q2',
      question: 'Manakah yang merupakan persamaan linear?',
      options: ['x² + 3 = 7', '2x + 5 = 11', 'x³ = 8', '√x = 3'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Dalam persamaan x + 3 = 7, apa ruas kirinya?',
      options: ['7', 'x + 3', 'x', '3'],
      correct: 1,
    },
  ],
  'menyelesaikan-plsv': [
    {
      id: 'q1',
      question: 'Penyelesaian dari x + 5 = 12 adalah?',
      options: ['x = 5', 'x = 7', 'x = 17', 'x = 2'],
      correct: 1,
    },
    {
      id: 'q2',
      question: 'Jika 2x - 3 = 7, maka x = ?',
      options: ['x = 2', 'x = 5', 'x = 4', 'x = 3'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Langkah pertama menyelesaikan PLSV adalah?',
      options: [
        'Menghitung hasil',
        'Pisahkan variabel dan konstanta',
        'Mengalikan kedua ruas',
        'Membagi kedua ruas',
      ],
      correct: 1,
    },
  ],
  'pengenalan-variabel-prog': [
    {
      id: 'q1',
      question: 'Apa itu variabel dalam pemrograman?',
      options: [
        'Wadah untuk menyimpan data',
        'Tipe data',
        'Fungsi',
        'Operator',
      ],
      correct: 0,
    },
    {
      id: 'q2',
      question: 'Manakah penamaan variabel yang benar?',
      options: ['2nama', 'nama lengkap', 'namaLengkap', 'nama-lengkap'],
      correct: 2,
    },
    {
      id: 'q3',
      question: 'Apa tipe data dari "Hello World"?',
      options: ['Number', 'Boolean', 'String', 'Array'],
      correct: 2,
    },
  ],
  'tipe-data': [
    {
      id: 'q1',
      question: 'Tipe data untuk nilai true/false adalah?',
      options: ['Number', 'String', 'Boolean', 'Array'],
      correct: 2,
    },
    {
      id: 'q2',
      question: 'Manakah yang merupakan tipe data Number?',
      options: ['"Hello"', '42', 'true', '[1,2,3]'],
      correct: 1,
    },
    {
      id: 'q3',
      question: 'Apa yang terjadi jika variabel dideklarasikan tanpa diberi nilai?',
      options: ['Error', 'Null', 'Undefined', '0'],
      correct: 2,
    },
  ],
};

export const chapterNames: Record<string, string> = {
  'pengenalan-variabel': 'Pengenalan Variabel',
  'konstanta-dan-koefisien': 'Konstanta dan Koefisien',
  'operasi-pada-variabel': 'Operasi pada Variabel',
  'pengenalan-persamaan': 'Pengenalan Persamaan Linear',
  'menyelesaikan-plsv': 'Menyelesaikan PLSV',
  'pengenalan-variabel-prog': 'Pengenalan Variabel dalam Pemrograman',
  'tipe-data': 'Tipe Data Dasar',
};
