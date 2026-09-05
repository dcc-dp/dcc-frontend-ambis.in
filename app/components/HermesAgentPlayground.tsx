'use client';

import React, { useState } from 'react';
import { useHermesAgent } from '../hooks/useHermesAgent';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Cpu,
  Wrench,
  Square,
  RotateCcw,
  Send,
  BookOpen,
  HelpCircle,
  Layers,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

const SCAFFOLD_LEVELS = [
  { level: 1, name: 'Level 1: Hint', desc: 'Petunjuk arah logika dasar', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { level: 2, name: 'Level 2: Guiding Question', desc: 'Pertanyaan pemandu reflektif', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { level: 3, name: 'Level 3: Concept Explanation', desc: 'Penjelasan ulang konsep kunci', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { level: 4, name: 'Level 4: Worked Example', desc: 'Contoh analogi langkah demi langkah', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { level: 5, name: 'Level 5: Full Solution', desc: 'Solusi lengkap & pembahasan', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
];

const PRESET_PROMPTS = [
  { label: 'Matematika - Aljabar', text: 'Bagaimana cara menyelesaikan persamaan linear 3x + 6 = 18?' },
  { label: 'Matematika - Pecahan', text: 'Aku bingung menjumlahkan 1/2 + 1/3, kenapa bukan 2/5?' },
  { label: 'Informatika - Logika', text: 'Jelaskan konsep perulangan (loop) sederhana untuk pemula kelas 7.' },
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
  const [activeMode, setActiveMode] = useState<'ask' | 'learning_path' | 'productivity_task'>('ask');
  const [selectedLevel, setSelectedLevel] = useState<number>(2);
  const [showThinking, setShowThinking] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isStreaming) return;
    sendPrompt(inputPrompt, activeMode, { scaffold_level: selectedLevel });
  };

  const handleSelectPreset = (text: string) => {
    setInputPrompt(text);
  };

  const currentScaffoldInfo = SCAFFOLD_LEVELS.find((s) => s.level === scaffoldLevel) || SCAFFOLD_LEVELS[0];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 shadow-sm">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              Hermes Agent Studio
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-medium font-mono">
                SSE Live Stub
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Personal Productivity & 5-Level Adaptive Scaffolding Playground (Ambis.in)
            </p>
          </div>
        </div>

        {/* Active Scaffolding Level Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${currentScaffoldInfo.color}`}>
            <Layers className="w-3.5 h-3.5" />
            <span>Aktif: {currentScaffoldInfo.name}</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Mode & Scaffolding Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mode Selector */}
        <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/80 rounded-xl p-3 space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            Mode Pembelajaran:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveMode('ask')}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeMode === 'ask'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              Ask Mode
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('learning_path')}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeMode === 'learning_path'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              Learning Path
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('productivity_task')}
              className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeMode === 'productivity_task'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Sprint Task
            </button>
          </div>
        </div>

        {/* Scaffold Ladder Level Selector */}
        <div className="bg-zinc-900/60 backdrop-blur border border-zinc-800/80 rounded-xl p-3 space-y-2">
          <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Tingkat Bantuan (Scaffolding Ladder):
            </span>
            <span className="text-[11px] text-zinc-500">1 (Ringan) - 5 (Penuh)</span>
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {SCAFFOLD_LEVELS.map((s) => (
              <button
                key={s.level}
                type="button"
                onClick={() => setSelectedLevel(s.level)}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedLevel === s.level
                    ? 'bg-zinc-100 text-zinc-900 font-semibold shadow'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                }`}
                title={s.desc}
              >
                Lv {s.level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Prompts Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">Contoh Prompt:</span>
        {PRESET_PROMPTS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectPreset(preset.text)}
            className="text-xs py-1 px-2.5 rounded-full bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-300 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Tanyakan soal atau topik pembelajaran (contoh: 'Bagaimana cara mencari nilai x pada 2x + 4 = 10?')..."
            rows={3}
            disabled={isStreaming}
            className="w-full bg-zinc-900/90 border border-zinc-700/70 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-none shadow-inner"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={abortStream}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 rounded-lg text-xs font-medium transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputPrompt.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium shadow transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-rose-400 hover:underline text-xs ml-2"
          >
            Reset
          </button>
        </div>
      )}

      {/* Agent Thinking & Reasoning Process (Accordion) */}
      {(thoughts.length > 0 || isThinking || toolCalls.length > 0) && (
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowThinking(!showThinking)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-medium text-zinc-300 hover:bg-zinc-800/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Cpu className={`w-4 h-4 ${isThinking ? 'text-indigo-400 animate-spin' : 'text-zinc-400'}`} />
              <span>
                {isThinking ? 'Agent sedang memproses reasoning...' : 'Log Proses Berpikir Agent (Reasoning Steps)'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                {thoughts.length} tahap
              </span>
            </div>
            {showThinking ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {showThinking && (
            <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-zinc-800/60 bg-zinc-950/40 font-mono text-xs">
              {thoughts.map((thought, idx) => (
                <div key={idx} className="flex items-start gap-2 text-zinc-400">
                  <span className="text-indigo-400 text-[10px] mt-0.5">▶</span>
                  <span>{thought}</span>
                </div>
              ))}

              {/* Tool Calls Visualizer */}
              {toolCalls.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/50 space-y-2">
                  <div className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5 font-sans">
                    <Wrench className="w-3 h-3 text-amber-400" />
                    Function Calling Execution:
                  </div>
                  {toolCalls.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-300 font-semibold">{tool.tool_name}()</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            tool.status === 'success'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {tool.status || 'Executing...'}
                        </span>
                      </div>
                      {tool.output && (
                        <pre className="text-[10px] text-zinc-400 overflow-x-auto bg-black/40 p-1.5 rounded">
                          {JSON.stringify(tool.output, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Streaming Agent Response Box */}
      {(content || isStreaming) && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800/60 pb-2">
            <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Respon Hermes Agent:
            </span>
            <div className="flex items-center gap-2">
              {isStreaming && (
                <span className="flex items-center gap-1.5 text-indigo-400 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  Streaming...
                </span>
              )}
              <button
                type="button"
                onClick={reset}
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                title="Bersihkan respon"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-zinc-100 text-sm leading-relaxed whitespace-pre-wrap font-sans">
            {content}
            {isStreaming && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />}
          </div>
        </div>
      )}
    </div>
  );
}
