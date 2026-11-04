import type { VisualSpec } from '@/lib/visualSpec';

export const FIXTURE_QUESTION =
  'Ibu punya 3/5 kg gula dan menambah 1/4 kg lagi. Berapa total gula Ibu sekarang? (tulis dalam bentuk pecahan paling sederhana)';

export const visualSpecFixtures: Record<VisualSpec['intervention_kind'], VisualSpec> = {
  guiding_question: {
    spec_version: '0.1',
    intervention_kind: 'guiding_question',
    title: 'Mulai dari mana?',
    blocks: [
      { type: 'note', tone: 'info', text: 'Menurutmu, apa yang harus disamakan dulu sebelum 3/5 dan 1/4 dijumlahkan?' },
      {
        type: 'fraction_bar',
        rows: [
          { label: '3/5', numerator: 3, denominator: 5 },
          { label: '1/4', numerator: 1, denominator: 4 },
        ],
        caption: 'Perhatikan: potongan kedua batang ini tidak sama besar.',
      },
    ],
  },
  hint: {
    spec_version: '0.1',
    intervention_kind: 'hint',
    title: 'Cek penyebutnya',
    blocks: [
      { type: 'note', tone: 'warn', text: 'Hampir! Coba lihat lagi penyebutnya: 5 dan 4 punya ukuran potongan yang berbeda.' },
      {
        type: 'number_line',
        start: '0',
        end: '1',
        ticks: 20,
        points: [
          { at: '12/20', label: '3/5' },
          { at: '5/20', label: '1/4' },
        ],
        arrows: [],
        caption: 'Di garis bilangan, 3/5 dan 1/4 sama-sama bisa dibagi menjadi 20 bagian.',
      },
    ],
  },
  explanation: {
    spec_version: '0.1',
    intervention_kind: 'explanation',
    title: 'Kenapa penyebut harus sama?',
    blocks: [
      {
        type: 'analogy_scene',
        template: 'pizza',
        story: 'Seperempat pizza dan sepertiga pizza punya ukuran potongan berbeda. Potongan beda ukuran tidak bisa langsung digabung.',
        items: [{ fraction: '1/4' }, { fraction: '1/3' }],
      },
      {
        type: 'step_flow',
        steps: [
          { n: 1, title: 'Cara yang keliru', detail: 'Atas ditambah atas, bawah ditambah bawah. Hasilnya 2/5, padahal 1/2 saja sudah lebih besar dari 2/5.', math: '1 + 1 = 2 ; 2 + 3 = 5' },
          { n: 2, title: 'Samakan ukuran potongan dulu', detail: 'KPK 2 dan 3 adalah 6', math: '1/2 = 3/6 ; 1/3 = 2/6' },
          { n: 3, title: 'Baru gabungkan potongannya', detail: 'Penyebut tetap 6', math: '3/6 + 2/6 = 5/6' },
        ],
      },
      { type: 'note', tone: 'success', text: 'Sekarang coba soalmu lagi dengan cara yang sama ya!' },
    ],
  },
  worked_example: {
    spec_version: '0.1',
    intervention_kind: 'worked_example',
    title: 'Menyamakan penyebut dulu',
    blocks: [
      {
        type: 'analogy_scene',
        template: 'coklat',
        story: 'Dua batang coklat beda ukuran potongan. Potong dulu sama besar, baru dihitung bersama.',
        items: [{ fraction: '3/5' }, { fraction: '1/4' }],
      },
      {
        type: 'step_flow',
        steps: [
          { n: 1, title: 'Cari penyebut yang sama', detail: 'KPK dari 5 dan 4 adalah 20', math: '5 x 4 = 20' },
          { n: 2, title: 'Ubah kedua pecahan', detail: 'Kalikan pembilang dan penyebut dengan angka yang sama', math: '3/5 = 12/20 ; 1/4 = 5/20' },
          { n: 3, title: 'Jumlahkan pembilangnya', detail: 'Penyebut tetap 20. Hitung sendiri hasilnya ya!', math: '12/20 + 5/20 = ?/20', locked: true },
        ],
      },
      {
        type: 'number_line',
        start: '0',
        end: '1',
        ticks: 20,
        points: [{ at: '12/20', label: '12/20' }],
        arrows: [{ from: '12/20', by: '5/20', label: '+ 5/20', hidden_end: true }],
      },
    ],
  },
};
