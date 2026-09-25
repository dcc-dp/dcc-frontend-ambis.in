'use client';

import React, { useState, useEffect, useRef } from 'react';
import MathContent from '@/components/Chat/MathContent';
import StepFlowCanvas from './StepFlowCanvas';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CanvasStep {
  number: number;
  title: string;
  body: string;
  formula: string;
  short_desc?: string;
}

export interface CanvasData {
  title: string;
  subject: 'Matematika' | 'Informatika' | 'Umum';
  analogy: string;
  concept: string;
  core_formula?: string;
  steps: CanvasStep[];
  summary: string;
  final_answer?: string;
  raw_content: string;
}

interface LearningCanvasProps {
  data: CanvasData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRequest?: () => void;
}

// ── Subject badge colours ─────────────────────────────────────────────────────

function subjectBadge(subject: string) {
  if (subject === 'Matematika') return 'bg-blue-100 text-blue-700 border-blue-200';
  if (subject === 'Informatika') return 'bg-violet-100 text-violet-700 border-violet-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function subjectAccent(subject: string) {
  if (subject === 'Matematika') return '#3b82f6';
  if (subject === 'Informatika') return '#8b5cf6';
  return '#6b7280';
}

// ── Main canvas panel ─────────────────────────────────────────────────────────

export default function LearningCanvas({
  data,
  isOpen,
  onClose,
}: LearningCanvasProps) {
  const hasSteps = Boolean(data?.steps && data.steps.length > 0);
  const [tab, setTab] = useState<'flow' | 'concept' | 'summary'>('flow');
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Reset internal state when canvas data changes
  useEffect(() => {
    if (data) {
      setTab(data.steps && data.steps.length > 0 ? 'flow' : 'concept');
      setActiveStep(0);
      setMounted(false);
      const t = setTimeout(() => setMounted(true), 60);
      return () => clearTimeout(t);
    }
  }, [data]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!data) return null;

  const accent = subjectAccent(data.subject);

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label="Learning Canvas"
      className="h-full w-full bg-white flex flex-col overflow-hidden"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0 bg-white"
        style={{ background: `linear-gradient(135deg, ${accent}12 0%, #ffffff 100%)` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Subject icon */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs"
            style={{ background: accent }}
          >
            {data.subject === 'Informatika' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
              Learning Canvas
            </p>
            <h2 className="text-sm font-bold text-gray-900 truncate leading-tight">
              {data.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${subjectBadge(data.subject)}`}
          >
            {data.subject}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup canvas"
            title="Tutup canvas"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex border-b border-gray-100 shrink-0 px-5 bg-white">
        {[
          ...(hasSteps ? [{ id: 'flow', label: `Alur Langkah (${data.steps.length})` }] : []),
          { id: 'concept', label: 'Konsep & Rumus' },
          { id: 'summary', label: 'Hasil Akhir' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id as typeof tab)}
            className={`relative px-3 py-2.5 text-xs font-semibold transition-colors mr-1 cursor-pointer ${
              tab === t.id
                ? 'text-gray-900 font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: accent }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 1. FLOW TAB (Interactive Step Flow Nodes) */}
        {tab === 'flow' && hasSteps && (
          <div className={mounted ? 'animate-fade-in' : 'opacity-0'}>
            <StepFlowCanvas
              steps={data.steps}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              subject={data.subject}
              accent={accent}
              title={data.title}
            />
          </div>
        )}

        {/* 2. CONCEPT TAB (Clean, non-ambiguous theory & core formula) */}
        {tab === 'concept' && (
          <div className={`space-y-4 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Core formula prominent card */}
            {data.core_formula && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-2">
                  Rumus / Aturan Kunci
                </p>
                <div className="bg-white rounded-xl p-3 border border-blue-100 text-center font-semibold text-gray-900 overflow-x-auto shadow-2xs">
                  <MathContent
                    content={data.core_formula.startsWith('$') ? data.core_formula : `$$ ${data.core_formula} $$`}
                    isUser={false}
                  />
                </div>
              </div>
            )}

            {/* Analogy / Intuisi */}
            {data.analogy && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1.5">
                  Bayangkan Dulu (Intuisi Masalah)
                </p>
                <div className="text-xs text-amber-950 leading-relaxed">
                  <MathContent content={data.analogy} isUser={false} />
                </div>
              </div>
            )}

            {/* Core Concept explanation */}
            {data.concept ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Penjelasan Konsep
                </p>
                <div className="text-xs text-gray-700 leading-relaxed">
                  <MathContent content={data.concept} isUser={false} />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Uraian Materi
                </p>
                <div className="text-xs text-gray-700 leading-relaxed">
                  <MathContent content={data.raw_content} isUser={false} />
                </div>
              </div>
            )}

            {/* CTA to flow view */}
            {hasSteps && (
              <button
                type="button"
                onClick={() => setTab('flow')}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-95 active:scale-98 shadow-xs cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)` }}
              >
                Lihat Diagram Alur Langkah Pengerjaan &rarr;
              </button>
            )}
          </div>
        )}

        {/* 3. SUMMARY TAB (Direct answer, key conclusions) */}
        {tab === 'summary' && (
          <div className={`space-y-4 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            {/* Bold final answer banner if found */}
            {data.final_answer && (
              <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50/80 p-4 shadow-2xs text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
                  Hasil Akhir
                </p>
                <p className="text-sm font-extrabold text-emerald-950 font-mono">
                  {data.final_answer}
                </p>
              </div>
            )}

            {/* Clean summary */}
            {data.summary ? (
              <div
                className="rounded-2xl p-4 border bg-white shadow-2xs"
                style={{ borderColor: `${accent}40` }}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: accent }}
                >
                  Kesimpulan Pembelajaran
                </p>
                <div className="text-xs text-gray-700 leading-relaxed">
                  <MathContent content={data.summary} isUser={false} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">Belum ada ringkasan.</p>
            )}

            {/* Full raw content accordion */}
            <details className="group">
              <summary className="cursor-pointer text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1.5 py-1 select-none">
                <svg
                  className="w-3 h-3 transition-transform group-open:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Lihat uraian teks lengkap
              </summary>
              <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-xs">
                <MathContent content={data.raw_content} isUser={false} />
              </div>
            </details>
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/50">
        <span className="text-[11px] text-gray-400 font-medium">
          Kak Ambis &bull; Learning Canvas
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200"
        >
          Tutup Canvas
        </button>
      </div>
    </div>
  );
}

// ── Trigger button (used inside message bubbles) ──────────────────────────────

export function CanvasTriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                 bg-indigo-50 border border-indigo-200 text-indigo-700
                 text-[11px] font-semibold hover:bg-indigo-100 active:scale-95
                 transition-all duration-150 shadow-xs cursor-pointer"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
      Buka Learning Canvas
    </button>
  );
}
