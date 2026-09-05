'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useHermesAgent } from '../hooks/useHermesAgent';
import {
  SparklesIcon,
  BrainIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SendIcon,
  SquareIcon,
  RotateCcwIcon,
  LightbulbIcon,
  BookOpenIcon,
  HelpCircleIcon,
  CheckCircleIcon,
  SmileIcon,
} from './Icons';

interface ScaffoldOption {
  level: number;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  activeColor: string;
}

const SCAFFOLD_OPTIONS: ScaffoldOption[] = [
  {
    level: 1,
    emoji: '💡',
    title: 'Clue Aja',
    subtitle: 'Kasih petunjuk kecil, aku mau coba mikir sendiri',
    color: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
    activeColor: 'bg-emerald-500 text-zinc-950 font-semibold shadow-lg shadow-emerald-500/20 border-emerald-400',
  },
  {
    level: 2,
    emoji: '🤔',
    title: 'Bimbing Langkah',
    subtitle: 'Tuntun aku lewat pertanyaan bertahap',
    color: 'border-blue-500/30 text-blue-300 bg-blue-500/10',
    activeColor: 'bg-blue-500 text-zinc-950 font-semibold shadow-lg shadow-blue-500/20 border-blue-400',
  },
  {
    level: 3,
    emoji: '📖',
    title: 'Jelasin Konsep',
    subtitle: 'Terangkan materi & rumus dasarnya dulu',
    color: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
    activeColor: 'bg-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-500/20 border-amber-400',
  },
  {
    level: 4,
    emoji: '📝',
    title: 'Contoh Mirip',
    subtitle: 'Beri contoh soal serupa biar aku paham polanya',
    color: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
    activeColor: 'bg-purple-500 text-zinc-950 font-semibold shadow-lg shadow-purple-500/20 border-purple-400',
  },
  {
    level: 5,
    emoji: '🎯',
    title: 'Bahas Tuntas',
    subtitle: 'Jelaskan cara lengkap langkah demi langkah',
    color: 'border-rose-500/30 text-rose-300 bg-rose-500/10',
    activeColor: 'bg-rose-500 text-zinc-950 font-semibold shadow-lg shadow-rose-500/20 border-rose-400',
  },
];

const SUGGESTED_QUESTIONS = [
  {
    topic: '🔢 Aljabar',
    text: 'Bagaimana cara menyelesaikan persamaan linear 3x + 6 = 18?',
  },
  {
    topic: '🍕 Pecahan',
    text: 'Aku bingung menjumlahkan 1/2 + 1/3, kenapa jawabannya bukan 2/5?',
  },
  {
    topic: '💻 Informatika',
    text: 'Jelaskan konsep perulangan (loop) sederhana untuk siswa kelas 7.',
  },
];

export default function HermesAgentPlayground() {
  const {
    isThinking,
    thoughts,
    content,
    toolCalls,
    scaffoldLevel,
    isStreaming,
    error,
    sendPrompt,
    abortStream,
    reset,
  } = useHermesAgent();

  const [inputPrompt, setInputPrompt] = useState('');
  const [activeMode, setActiveMode] = useState<'ask' | 'learning_path'>('ask');
  const [selectedLevel, setSelectedLevel] = useState<number>(2);
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [showThinkingDetail, setShowThinkingDetail] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current && (content || isThinking)) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [content, isThinking]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isStreaming) return;

    setSubmittedQuestion(query);
    sendPrompt(query, activeMode, {
      scaffold_level: selectedLevel,
      current_topic: 'Bimbingan Siswa Kelas VII',
    });
    if (!textToSend) {
      setInputPrompt('');
    }
  };

  const activeLevelConfig =
    SCAFFOLD_OPTIONS.find((s) => s.level === scaffoldLevel) || SCAFFOLD_OPTIONS[1];

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-140px)] max-w-2xl mx-auto pb-28 sm:pb-32 px-3 sm:px-4">
      {/* 1. Header Profile: Kak Ambis Tutor */}
      <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 mb-4 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20">
              🤖
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-900 rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-zinc-100 text-base sm:text-lg">Kak Ambis</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-medium">
                Tutor AI Kelas VII
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Prinsip: &ldquo;Bantu kamu paham, bukan cuma kasih contekan&rdquo; ✨
            </p>
          </div>
        </div>

        {/* Mode Selector Mobile Pill */}
        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode('ask')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeMode === 'ask'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircleIcon className="w-3.5 h-3.5" />
            <span>Tanya PR</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('learning_path')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeMode === 'learning_path'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpenIcon className="w-3.5 h-3.5" />
            <span>Rute Belajar</span>
          </button>
        </div>
      </div>

      {/* 2. Scaffolding Level Selector (Bahasa Siswa SMP) */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-zinc-300 flex items-center gap-1.5">
            <LightbulbIcon className="w-4 h-4 text-amber-400" />
            Pilih bentuk bantuan yang kamu mau:
          </span>
          <span className="text-[11px] text-zinc-500">Bisa diubah kapan saja</span>
        </div>

        {/* Scrollable Horizontal Pill for Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
          {SCAFFOLD_OPTIONS.map((item) => {
            const isSelected = selectedLevel === item.level;
            return (
              <button
                key={item.level}
                type="button"
                onClick={() => setSelectedLevel(item.level)}
                className={`py-2 px-3 rounded-xl border text-xs whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected ? item.activeColor : `${item.color} hover:bg-zinc-800/60`
                }`}
              >
                <span className="text-sm">{item.emoji}</span>
                <div className="text-left">
                  <div className="font-semibold">{item.title}</div>
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-zinc-400 italic">
          💡 Sedang aktif: <strong className="text-zinc-200">{activeLevelConfig.title}</strong> — {activeLevelConfig.subtitle}
        </p>
      </div>

      {/* 3. Main Chat & Interaction Feed */}
      <div className="flex-1 space-y-4">
        {/* Welcome Card if no question yet */}
        {!submittedQuestion && (
          <div className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border border-zinc-800 rounded-2xl p-5 text-center space-y-4 shadow-sm my-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
              <SmileIcon className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-100">
                Halo! Mau belajar apa kita hari ini?
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                Tulis soal Matematika atau Informatika yang bikin kamu pusing. Kak Ambis akan bimbing langkah demi langkah!
              </p>
            </div>

            {/* Quick suggested chips */}
            <div className="pt-2 text-left space-y-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Coba klik contoh soal ini:
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(q.text)}
                    className="w-full text-left p-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750/80 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-indigo-400">{q.topic}</span>
                      <span className="text-zinc-400 group-hover:text-zinc-200 line-clamp-1">
                        {q.text}
                      </span>
                    </div>
                    <span className="text-zinc-500 group-hover:text-indigo-400 text-xs shrink-0 ml-2">
                      Coba ➔
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Student Bubble (Question) */}
        {submittedQuestion && (
          <div className="flex justify-end gap-2.5 items-end">
            <div className="max-w-[85%] sm:max-w-[75%] bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-md leading-relaxed">
              <p className="font-medium">{submittedQuestion}</p>
              <span className="block text-[10px] text-indigo-200/80 text-right mt-1">
                {activeMode === 'ask' ? 'Mode Tanya PR' : 'Mode Rute Belajar'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-300 font-bold shrink-0">
              Kamu
            </div>
          </div>
        )}

        {/* Kak Ambis Tutor Response Bubble */}
        {(isThinking || content || toolCalls.length > 0) && (
          <div className="flex justify-start gap-2.5 items-start">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow mt-1">
              🤖
            </div>

            <div className="max-w-[90%] sm:max-w-[85%] space-y-3">
              {/* Friendly Thinking Accordion */}
              {(isThinking || thoughts.length > 0) && (
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowThinkingDetail(!showThinkingDetail)}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-zinc-300 hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <BrainIcon
                        className={`w-4 h-4 ${
                          isThinking ? 'text-indigo-400 animate-spin' : 'text-zinc-400'
                        }`}
                      />
                      <span>
                        {isThinking
                          ? 'Kak Ambis lagi menyusun cara bimbingan...'
                          : `Cara Kak Ambis berpikir (${thoughts.length} langkah)`}
                      </span>
                    </div>
                    {showThinkingDetail ? (
                      <ChevronUpIcon className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-zinc-400" />
                    )}
                  </button>

                  {showThinkingDetail && (
                    <div className="px-3.5 pb-3 pt-1 border-t border-zinc-800/60 bg-zinc-950/40 space-y-2 text-xs">
                      {thoughts.map((thought, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-zinc-400">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{thought}</span>
                        </div>
                      ))}

                      {/* Friendly Tool Summary */}
                      {toolCalls.length > 0 && (
                        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] flex items-center gap-2 mt-2">
                          <SparklesIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>Miskonsepsi dianalisis & level bantuan disesuaikan otomatis!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Tutor Message Card */}
              <div className="bg-zinc-900/95 border border-zinc-800/90 rounded-2xl rounded-tl-sm p-4 sm:p-5 text-zinc-100 text-sm leading-relaxed shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2 text-xs text-zinc-400">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <span>Kak Ambis</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                      {activeLevelConfig.title}
                    </span>
                  </span>
                  {isStreaming && (
                    <span className="flex items-center gap-1.5 text-indigo-400 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      Mengetik...
                    </span>
                  )}
                </div>

                <div className="text-zinc-100 text-[14px] sm:text-[15px] leading-relaxed whitespace-pre-wrap">
                  {content}
                  {isStreaming && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
                  )}
                </div>

                {/* Micro Follow-up Chips for Students */}
                {!isStreaming && content && (
                  <div className="pt-3 border-t border-zinc-800/60 space-y-2">
                    <p className="text-[11px] font-medium text-zinc-400">Gimana, sudah jelas?</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSend('Aku sudah paham! Sekarang kasih soal latihan yang mirip.')}
                        className="text-xs py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium transition-all"
                      >
                        👍 Paham! Coba latihan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLevel((prev) => Math.min(prev + 1, 5));
                          handleSend('Masih agak bingung, boleh dijelaskan lebih rinci lagi langkahnya?');
                        }}
                        className="text-xs py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium transition-all"
                      >
                        🤔 Masih bingung, bimbing lagi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Card */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between shadow-sm">
            <span>{error}</span>
            <button
              type="button"
              onClick={reset}
              className="text-rose-400 hover:underline font-semibold ml-2"
            >
              Coba Lagi
            </button>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* 4. Sticky Bottom Mobile Input Dock */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-800/80 z-20">
        <div className="max-w-2xl mx-auto space-y-2">
          {/* Quick topic shortcuts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-zinc-500 whitespace-nowrap">Pilihan Cepat:</span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputPrompt(q.text)}
                className="py-0.5 px-2.5 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 whitespace-nowrap transition-colors"
              >
                {q.topic}
              </button>
            ))}
          </div>

          {/* Form Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Tulis pertanyaan PR Matematika atau Informatika..."
                disabled={isStreaming}
                className="w-full bg-zinc-900 border border-zinc-700/80 focus:border-indigo-500 rounded-2xl pl-4 pr-10 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
              {inputPrompt && !isStreaming && (
                <button
                  type="button"
                  onClick={() => setInputPrompt('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Action Buttons */}
            {isStreaming ? (
              <button
                type="button"
                onClick={abortStream}
                className="h-11 px-4 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
              >
                <SquareIcon className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputPrompt.trim()}
                className="h-11 px-4 sm:px-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 shrink-0"
              >
                <span>Kirim</span>
                <SendIcon className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Reset Button */}
            {(content || submittedQuestion) && !isStreaming && (
              <button
                type="button"
                onClick={() => {
                  reset();
                  setSubmittedQuestion(null);
                }}
                className="h-11 w-11 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-colors shrink-0"
                title="Mulai Sesi Baru"
              >
                <RotateCcwIcon className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
