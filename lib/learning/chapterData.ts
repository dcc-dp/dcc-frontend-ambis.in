export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export const chapterData: Record<string, Record<string, Chapter[]>> = {
  matematika: {
    'aljabar-dasar': [
      {
        id: 'pengenalan-variabel',
        title: 'Pengenalan Variabel',
        content: `Variabel adalah lambang atau simbol yang digunakan untuk mewakili nilai yang belum diketahui dalam matematika.\n\nDalam aljabar, kita sering menggunakan huruf seperti x, y, atau z untuk merepresentasikan nilai yang tidak diketahui.\n\n**Contoh:**\n- x + 5 = 10  (x adalah variabel)\n- 2y = 8      (y adalah variabel)\n\n**Mengapa Menggunakan Variabel?**\n\n1. Untuk merepresentasikan nilai yang belum diketahui\n2. Untuk membuat rumus yang umum\n3. Untuk menyelesaikan persamaan\n\n**Fakta Menarik:**\nHuruf "x" sering digunakan sebagai variabel karena kebiasaan matematikawan Arab pada abad ke-9 yang menulis "shay" (artinya "sesuatu") dalam tulisan Arab. Ketika materi matematika ini diterjemahkan ke bahasa Eropa, "shay" diganti dengan huruf "x".`,
        order: 1,
      },
      {
        id: 'konstanta-dan-koefisien',
        title: 'Konstanta dan Koefisien',
        content: `Selain variabel, dalam aljabar kita juga mengenal konstanta dan koefisien.\n\n**Konstanta**\nKonstanta adalah nilai yang tetap dan tidak berubah. Contohnya: angka 5, 10, 3.14, dll.\n\n**Koefisien**\nKoefisien adalah angka yang mengalikan variabel. Contohnya:\n- 2x -> 2 adalah koefisien dari x\n- -3y -> -3 adalah koefisien dari y\n- x -> koefisiennya adalah 1 (karena 1x = x)\n\n**Contoh Ekspresi Aljabar:**\n- 2x + 5 -> 2 adalah koefisien x, 5 adalah konstanta\n- 3x - 2y + 7 -> 3 dan -2 adalah koefisien, 7 adalah konstanta\n\n**Latihan:**\nTentukan koefisien dan konstanta dari: 4a - 3b + 8\n\n**Jawaban:**\n- Koefisien a: 4\n- Koefisien b: -3\n- Konstanta: 8`,
        order: 2,
      },
      {
        id: 'operasi-pada-variabel',
        title: 'Operasi pada Variabel',
        content: `Kita dapat melakukan operasi matematika pada variabel, sama seperti pada angka.\n\n**Penjumlahan dan Pengurangan**\nKita hanya bisa menjumlahkan atau mengurangkan variabel yang sama (variabel sejenis).\n\nContoh:\n- 2x + 3x = 5x (benar)\n- x + y = x + y (tidak bisa disederhanakan)\n- 3x - 2x = x\n\n**Perkalian**\n- 2x × 3 = 6x\n- x × x = x²\n- 2x × 3y = 6xy\n\n**Pembagian**\n- 6x ÷ 2 = 3x\n- x² ÷ x = x\n\n**Eksponen (Pangkat)**\n- x² = x × x\n- x³ = x × x × x\n- 2x² = 2 × x × x\n\n**Prioritas Operasi**\nSama seperti operasi hitung biasa:\n1. Kerjakan di dalam tanda kurung\n2. Eksponen\n3. Perkalian/Pembagian\n4. Penjumlahan/Pengurangan`,
        order: 3,
      },
    ],
    'persamaan-linear': [
      {
        id: 'pengenalan-persamaan',
        title: 'Pengenalan Persamaan Linear',
        content: `Persamaan linear adalah kalimat matematika yang menyatakan kesamaan dua ekspresi dan memiliki derajat satu (pangkat tertinggi adalah 1).\n\n**Bentuk Umum Persamaan Linear Satu Variabel:**\nax + b = c\n\ndimana:\n- x adalah variabel\n- a, b, c adalah konstanta\n- a ≠ 0\n\n**Contoh Persamaan Linear:**\n- x + 3 = 7\n- 2x - 5 = 11\n- 3x + 2 = 2x + 8\n\n**Cara Membaca Persamaan:**\n"x + 3 = 7" dibaca: "x ditambah 3 sama dengan 7"\n\n**Istilah dalam Persamaan:**\n- ruas kiri: x + 3\n- ruas kanan: 7\n- tanda sama dengan: =\n\n**Prinsip Dasar:**\nApa yang dilakukan pada satu ruas, harus dilakukan juga pada ruas lainnya agar persamaan tetap benar (seimbang).`,
        order: 1,
      },
      {
        id: 'menyelesaikan-plsv',
        title: 'Menyelesaikan PLSV',
        content: `PLSV = Persamaan Linear Satu Variabel\n\nUntuk menyelesaikan PLSV, kita perlu mencari nilai variabel yang membuat persamaan menjadi benar.\n\n**Langkah-langkah Menyelesaikan PLSV:**\n\n1. **Pisahkan variabel dan konstanta**\n   Pindahkan semua suku yang mengandung variabel ke ruas kiri, dan konstanta ke ruas kanan.\n\n2. **Sederhanakan**\n   Lakukan operasi hitung untuk mendapatkan nilai variabel.\n\n**Contoh 1:**\nx + 5 = 12\n\nx = 12 - 5\nx = 7\n\n**Contoh 2:**\n2x - 3 = 7\n\n2x = 7 + 3\n2x = 10\nx = 5\n\n**Contoh 3:**\n3x + 2 = 2x + 8\n\n3x - 2x = 8 - 2\nx = 6\n\n**Contoh 4:**\n2(x + 3) = 16\n\n2x + 6 = 16\n2x = 16 - 6\n2x = 10\nx = 5\n\n**Tips:**\n- Selalu periksa jawaban dengan mensubstitusikan nilai x ke persamaan awal\n- Jika hasilnya benar, maka solusi sudah tepat!`,
        order: 2,
      },
    ],
  },
  informatika: {
    'dasar-pemrograman': [
      {
        id: 'pengenalan-variabel-prog',
        title: 'Pengenalan Variabel dalam Pemrograman',
        content: `Variabel dalam pemrograman adalah wadah untuk menyimpan data.\n\n**Apa itu Variabel?**\nVariabel adalah nama yang diberikan untuk menyimpan suatu nilai. Nilai ini dapat diubah selama program berjalan.\n\n**Contoh dalam JavaScript:**\n\`\`\`javascript\nlet nama = "Budi";\nlet umur = 20;\nlet tinggi = 175.5;\n\`\`\`\n\n**Jenis-jenis Variabel:**\n- **String**: teks, contoh: "Hello World"\n- **Number**: angka, contoh: 42, 3.14\n- **Boolean**: true/false\n- **Array**: kumpulan data, contoh: [1, 2, 3]\n- **Object**: data terstruktur, contoh: {nama: "Budi"}\n\n**Aturan Penamaan Variabel:**\n1. Harus diawali dengan huruf, underscore (_), atau tanda dolar ($\n2. Boleh mengandung huruf, angka, underscore, atau dollar\n3. Case sensitive (nama berbeda dengan Nama)\n4. Tidak boleh menggunakan kata kunci bahasa pemrograman\n\n**Konvensi Penamaan:**\n- camelCase: firstName, age, isStudent\n- snake_case: first_name, age, is_student\n- UPPER_CASE: MAX_VALUE, PI (untuk konstanta)`,
        order: 1,
      },
      {
        id: 'tipe-data',
        title: 'Tipe Data Dasar',
        content: `Tipe data menentukan jenis nilai yang dapat disimpan dalam variabel.\n\n**1. Number (Angka)**\n\`\`\`javascript\nlet umur = 25;           // integer\nlet phi = 3.14;          // floating point\nlet negatif = -10;       // negative number\n\`\`\`\n\n**2. String (Teks)**\n\`\`\`javascript\nlet nama = "Budi";\nlet pesan = 'Hello World';\n\`\`\`\n\n**3. Boolean (Logika)**\n\`\`\`javascript\nlet isActive = true;\nlet isMarried = false;\n\`\`\`\n\n**4. Undefined dan Null**\n\`\`\`javascript\nlet x;          // undefined - belum diberi nilai\nlet y = null;   // null - secara sengaja tidak ada nilai\n\`\`\`\n\n**5. Array (Kumpulan Data)**\n\`\`\`javascript\nlet angka = [1, 2, 3, 4, 5];\nlet warna = ["merah", "biru", "hijau"];\n\`\`\`\n\n**6. Object (Data Terstruktur)**\n\`\`\`javascript\nlet orang = {\n  nama: "Budi",\n  umur: 25,\n  pekerjaan: "Programmer"\n};\n\`\`\``,
        order: 2,
      },
    ],
  },
};

export const moduleNames: Record<string, Record<string, string>> = {
  matematika: {
    'aljabar-dasar': 'Aljabar Dasar',
    'persamaan-linear': 'Persamaan Linear',
    'sistem-persamaan': 'Sistem Persamaan',
    'fungsi-dan-grafik': 'Fungsi & Grafik',
  },
  informatika: {
    'dasar-pemrograman': 'Dasar Pemrograman',
    'alur-kendali': 'Alur Kendali',
    'fungsi-dan-prosedur': 'Fungsi & Prosedur',
    'struktur-data': 'Struktur Data',
    'pemrograman-oo': 'OOP Dasar',
  },
};
