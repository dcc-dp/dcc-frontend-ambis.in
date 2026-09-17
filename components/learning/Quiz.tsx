'use client';

import React, { useState } from 'react';
import MathContent from '@/components/Chat/MathContent';

export interface ExerciseItem {
  id: string;
  concept_id?: string;
  question: string;
  options?: Array<{ key: string; label: string; misconception_id?: string | null }> | null;
  correct_answer?: string;
  difficulty?: number;
  kind?: string;
  solution_steps?: string[] | null;
}

interface QuizProps {
  questions: ExerciseItem[];
  conceptTitle?: string;
  isDiagnostic?: boolean;
  onComplete?: (finalMastery: number, misconceptions: string[]) => void;
  onClose?: () => void;
}

interface AgentFeedback {
  is_correct: boolean;
  error_type: string | null;
  misconception_code: string | null;
  intervention: {
    kind: string;
    rule_code: string;
    reason: string;
    text: string;
  } | null;
  mastery: number;
}

export function Quiz({
  questions,
  conceptTitle = 'Latihan Interaktif',
  isDiagnostic = false,
  onComplete,
  onClose,
}: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AgentFeedback | null>(null);
  const [attemptsPerQuestion, setAttemptsPerQuestion] = useState<Record<number, number>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Record<number, boolean>>({});
  const [latestMastery, setLatestMastery] = useState<number>(0.3);
  const [detectedMisconceptions, setDetectedMisconceptions] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
        <p className="text-gray-500">Tidak ada soal yang tersedia saat ini.</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            Kembali
          </button>
        )}
      </div>
    );
  }

  const handleCheckAnswer = async () => {
    const answer = currentQuestion.options && currentQuestion.options.length > 0
      ? selectedOption
      : textAnswer.trim();

    if (!answer) return;

    setIsLoading(true);
    const attemptNum = (attemptsPerQuestion[currentIndex] || 0) + 1;
    setAttemptsPerQuestion((prev) => ({ ...prev, [currentIndex]: attemptNum }));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/v1/agent/hermes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: '00000000-0000-0000-0000-000000000901',
          exercise_id: currentQuestion.id,
          student_answer: answer,
          mode: isDiagnostic ? 'diagnostic' : 'learning_path',
          stream: false,
        }),
      });

      if (response.ok) {
        const data: AgentFeedback = await response.json();
        setFeedback(data);
        if (data.mastery !== undefined) {
          setLatestMastery(data.mastery);
        }
        if (data.misconception_code) {
          setDetectedMisconceptions((prev) =>
            prev.includes(data.misconception_code!) ? prev : [...prev, data.misconception_code!]
          );
        }
        if (data.is_correct) {
          setCompletedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
        }
      } else {
        // Fallback simple comparison if agent service unavailable
        const isCorrect = currentQuestion.correct_answer === answer;
        setFeedback({
          is_correct: isCorrect,
          error_type: isCorrect ? null : 'conceptual',
          misconception_code: null,
          intervention: isCorrect ? null : {
            kind: 'hint',
            rule_code: 'HINT_FALLBACK',
            reason: 'Periksa kembali langkah pengerjaanmu.',
            text: 'Periksa kembali perhitunganmu ya. Samakan dulu penyebutnya sebelum dijumlahkan!',
          },
          mastery: isCorrect ? 0.75 : 0.25,
        });
        if (isCorrect) {
          setCompletedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
        }
      }
    } catch {
      // Offline / Network fallback
      const isCorrect = currentQuestion.correct_answer === answer;
      setFeedback({
        is_correct: isCorrect,
        error_type: isCorrect ? null : 'calculation',
        misconception_code: null,
        intervention: isCorrect ? null : {
          kind: 'hint',
          rule_code: 'OFFLINE_HINT',
          reason: 'Coba hitung ulang dengan teliti.',
          text: 'Jangan menyerah! Coba periksa kembali langkah menyamakan penyebut ya.',
        },
        mastery: isCorrect ? 0.7 : 0.3,
      });
      if (isCorrect) {
        setCompletedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
      if (onComplete) {
        onComplete(Math.round(latestMastery * 100), detectedMisconceptions);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTextAnswer('');
      setFeedback(null);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setTextAnswer('');
    setFeedback(null);
  };

  const getMisconceptionExplanation = (code: string): string => {
    switch (code) {
      case 'ADDS_NUM_DENOM_DIRECTLY':
        return 'Cenderung menjumlahkan pembilang dan penyebut secara langsung (contoh: 1/2 + 1/3 = 2/5). Kita perlu memperkuat fondasi penyamaan penyebut dengan KPK.';
      case 'WRONG_LCM':
        return 'Keliru dalam mencari Kelipatan Persekutuan Terkecil (KPK) untuk menyamakan penyebut.';
      case 'FAILS_TO_SIMPLIFY':
        return 'Perhitungan sudah tepat namun belum menyederhanakan pecahan ke bentuk paling sederhana.';
      case 'CROSS_MULTIPLY_AS_ADD':
        return 'Tertukar antara operasi perkalian silang dan penjumlahan pecahan.';
      default:
        return 'Perlu penguatan langkah-langkah dasar operasi pecahan.';
    }
  };

  if (isFinished) {
    const masteryPercent = Math.min(Math.round(latestMastery * 100), 100);
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-100 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-4">
          {isDiagnostic ? '🔍' : '🎓'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isDiagnostic ? 'Hasil Pemetaan Diagnostik Selesai' : 'Hebat! Sesi Belajar Selesai'}
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          {isDiagnostic
            ? `Kak Ambis telah memetakan kemampuan awalmu pada konsep ${conceptTitle}.`
            : `Kamu telah menyelesaikan latihan pada konsep ${conceptTitle}.`}
        </p>

        {/* Mastery Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-5 text-left">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-700 mb-2">
            <span>{isDiagnostic ? 'Baseline Penguasaan Konsep' : 'Tingkat Pemahaman (Mastery State)'}</span>
            <span className="text-sm font-bold text-blue-900">{masteryPercent}%</span>
          </div>
          <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
          <p className="text-xs text-blue-600 mt-2">
            {isDiagnostic
              ? masteryPercent >= 60
                ? '🌟 Pemahaman awalmu cukup bagus! Beberapa konsep pengayaan telah ditambahkan ke roadmap.'
                : '💡 Kak Ambis telah menyesuaikan urutan roadmap agar materi fondasi dasar diajarkan bertahap.'
              : masteryPercent >= 70
              ? '🌟 Pemahaman konsepmu sangat baik! Kamu siap lanjut ke tahap berikutnya.'
              : '💪 Sudah bagus! Terus asah pemahamanmu dengan latihan terbimbing ya.'}
          </p>
        </div>

        {/* Diagnostic Insights / Misconceptions */}
        {isDiagnostic && (
          <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-left">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>🎯</span>
              <span>Fokus Bimbingan Kak Ambis:</span>
            </h4>
            {detectedMisconceptions.length > 0 ? (
              <ul className="space-y-2 text-xs text-amber-950">
                {detectedMisconceptions.map((code) => (
                  <li key={code} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-amber-200">
                    <span className="text-amber-600 font-bold shrink-0">•</span>
                    <span>{getMisconceptionExplanation(code)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-amber-900">
                Tidak terdeteksi miskonsepsi mendasar. Kamu siap langsung memahami materi inti dan menyelesaikan latihan soal!
              </p>
            )}
            <p className="text-[11px] text-amber-700 mt-2 font-medium">
              ✨ Roadmap belajarmu telah disesuaikan berdasarkan analisis di atas.
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md transition flex items-center gap-2"
            >
              <span>{isDiagnostic ? 'Buka Roadmap Belajar yang Disesuaikan' : 'Lanjut ke Roadmap'}</span>
              <span>🚀</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const isAnswerSelected = currentQuestion.options && currentQuestion.options.length > 0
    ? Boolean(selectedOption)
    : Boolean(textAnswer.trim());

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-2xl mx-auto transition-all">
      {/* Mode Diagnostic Alert */}
      {isDiagnostic && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-white flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span>🔍</span>
            <span>Tes Diagnostik Awal — Pemetaan Kemampuan Belajar</span>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">Tidak Mengurangi Nilai</span>
        </div>
      )}

      {/* Quiz Header */}
      <div className="px-6 py-4 bg-gray-50/90 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            {currentIndex + 1}
          </span>
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            {isDiagnostic ? 'Pertanyaan Diagnostik' : 'Soal'} {currentIndex + 1} dari {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Mastery:</span>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {Math.round(latestMastery * 100)}%
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Question Prompt */}
        <div className="text-base sm:text-lg font-semibold text-gray-900 leading-relaxed">
          <MathContent content={currentQuestion.question} />
        </div>

        {/* Options (Multiple Choice or Short Answer) */}
        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOption === opt.key;
              const isSubmitted = Boolean(feedback);
              const isThisCorrect = feedback?.is_correct && isSelected;
              const isThisWrong = feedback && !feedback.is_correct && isSelected;

              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(opt.key)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 cursor-pointer ${
                    isSubmitted
                      ? isThisCorrect
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs'
                        : isThisWrong
                        ? 'border-rose-400 bg-rose-50 text-rose-950'
                        : 'border-gray-200 bg-gray-50/50 opacity-60'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <div className="flex-1 font-medium text-sm sm:text-base text-gray-900">
                    <MathContent content={opt.label} />
                  </div>
                  {isSubmitted && isThisCorrect && (
                    <span className="text-emerald-600 font-bold text-sm">✅ Benar</span>
                  )}
                  {isSubmitted && isThisWrong && (
                    <span className="text-rose-600 font-bold text-sm">❌ Cek Bimbingan</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600">
              Ketik jawabanmu di bawah ini:
            </label>
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={Boolean(feedback)}
              placeholder="Contoh: 17/20"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
            />
          </div>
        )}

        {/* Scaffolding & Agent Guidance Card (When Wrong) */}
        {feedback && !feedback.is_correct && (
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-amber-50/80 p-5 shadow-xs space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-sm">
                  🦉
                </span>
                <span className="text-xs font-bold text-amber-900">
                  Bimbingan Belajar Kak Ambis
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                {feedback.intervention?.kind === 'hint'
                  ? '💡 Petunjuk (Level 1)'
                  : feedback.intervention?.kind === 'guiding_question'
                  ? '❓ Pertanyaan Pemantik (Level 2)'
                  : '📖 Penjelasan Konsep (Level 3)'}
              </span>
            </div>

            {feedback.misconception_code && (
              <div className="text-xs text-amber-950 bg-amber-100/60 px-3 py-1.5 rounded-lg font-medium">
                🎯 Terdeteksi Pola Pemikiran: <span className="font-bold">{feedback.misconception_code}</span>
              </div>
            )}

            <div className="text-sm text-gray-800 leading-relaxed font-normal">
              <MathContent
                content={
                  feedback.intervention?.text ||
                  'Periksa kembali konsep penyamaan penyebut ya!'
                }
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleRetry}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
              >
                <span>🔄</span>
                <span>Paham, Coba Jawab Ulang</span>
              </button>
            </div>
          </div>
        )}

        {/* Success Card (When Correct) */}
        {feedback && feedback.is_correct && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 text-emerald-950 flex items-center justify-between shadow-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <h4 className="font-bold text-sm text-emerald-900">Luar Biasa, Jawabanmu Benar!</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Tingkat penguasaan konsepmu meningkat menjadi{' '}
                  <span className="font-bold">{Math.round(feedback.mastery * 100)}%</span>.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 shadow-xs"
            >
              <span>{isLastQuestion ? 'Selesai 🏁' : 'Soal Berikutnya ➡️'}</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {!feedback && (
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleCheckAnswer}
              disabled={!isAnswerSelected || isLoading}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Kak Ambis sedang mengevaluasi...</span>
                </>
              ) : (
                <span>Periksa Jawaban 🚀</span>
              )}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
              >
                Batal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
