'use client';

import { useState } from 'react';

interface InitialQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
  onSubmit: (answers: {
    name?: string;
    goal: string;
    topic: string;
    subtopic: string;
    difficulty: string;
  }) => void;
}

interface Answers {
  name: string;
  goal: string;
  topic: string;
  subtopic: string;
  difficulty: string;
}

const topics = [
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

const difficulties = [
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

export function InitialQuestionsModal({
  isOpen,
  onClose,
  onSkip,
  onSubmit,
}: InitialQuestionsModalProps) {
  const [answers, setAnswers] = useState<Answers>({
    name: '',
    goal: '',
    topic: '',
    subtopic: '',
    difficulty: '',
  });
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSubmit(answers);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    onSkip?.();
  };

  const goals = [
    { id: 'pr', label: 'Ngerjain PR', tag: 'PR', desc: 'Ada tugas sekolah yang harus diselesaikan' },
    { id: 'konsep', label: 'Paham Konsep', tag: 'Konsep', desc: 'Mau memahami materi secara bertahap dan jelas' },
  ];

  const selectedTopic = topics.find((t) => t.id === answers.topic);

  const canProceed =
    (step === 0 && answers.goal !== '') ||
    (step === 1 && answers.topic !== '') ||
    (step === 2 && answers.subtopic !== '') ||
    (step === 3 && answers.difficulty !== '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header - Sticky */}
        <div className="p-6 border-b border-gray-100 bg-blue-600 rounded-t-2xl relative sticky top-0 z-10">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-base">
              A
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Mari Kita Mulai!
              </h2>
              <p className="text-blue-100 text-sm">
                Langkah {step + 1} dari 4
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 0: Nama & Tujuan Belajar */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Nama Panggilanmu (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Budi"
                  value={answers.name}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Kak Ambis akan mengingat namamu di setiap sesi belajar.</p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Apa tujuan utama belajarmu?
                </h3>
                <div className="space-y-2.5">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => setAnswers((prev) => ({ ...prev, goal: goal.id }))}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 transition-all duration-120 text-left ${
                        answers.goal === goal.id
                          ? 'border-blue-500 bg-blue-50/70'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                        {goal.tag}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{goal.label}</p>
                        <p className="text-xs text-gray-500">{goal.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Pilih Topik */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Pilih topik materi yang ingin dipelajari:
              </h3>
              <div className="space-y-2.5">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, topic: topic.id, subtopic: '' }))}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 transition-all duration-120 text-left ${
                      answers.topic === topic.id
                        ? 'border-blue-500 bg-blue-50/70'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {topic.badge}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{topic.label}</p>
                      <p className="text-xs text-gray-500">{topic.subtopics.length} sub-topik tersedia</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Pilih Sub-topik */}
          {step === 2 && selectedTopic && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Pilih sub-topik spesifik di {selectedTopic.label}:
              </h3>
              <div className="space-y-2.5">
                {selectedTopic.subtopics.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, subtopic: sub.id }))}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 transition-all duration-120 text-left ${
                      answers.subtopic === sub.id
                        ? 'border-blue-500 bg-blue-50/70'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                      {sub.label.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{sub.label}</p>
                      <p className="text-xs text-gray-500">{sub.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Level Kesulitan */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Pilih tingkat kesulitan belajarmu:
              </h3>
              <div className="space-y-2.5">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setAnswers((prev) => ({ ...prev, difficulty: diff.id }))}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 transition-all duration-120 text-left ${
                      answers.difficulty === diff.id
                        ? 'border-blue-500 bg-blue-50/70'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-7 rounded-md bg-gray-100 text-gray-700 font-semibold text-xs flex items-center justify-center flex-shrink-0">
                      {diff.tag}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{diff.label}</p>
                      <p className="text-xs text-gray-500">{diff.desc}</p>
                      {answers.difficulty === diff.id && (
                        <p className="text-[11px] mt-1 text-blue-600 font-medium">{diff.detail}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div className="p-6 border-t-2 border-gray-100 flex justify-between items-center sticky bottom-0 bg-white">
          <button
            onClick={step === 0 ? handleSkip : handleBack}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition"
          >
            {step === 0 ? 'Lewati' : 'Kembali'}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold transition-all duration-120"
          >
            {step === 3 ? 'Mulai Belajar!' : 'Lanjut'}
          </button>
        </div>
      </div>
    </div>
  );
}
