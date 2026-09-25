'use client';

import React, { useState, useEffect, useRef } from 'react';
import MathContent from '@/components/Chat/MathContent';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CanvasStep {
  number: number;
  title: string;
  body: string;
  formula: string;
}

export interface CanvasData {
  title: string;
  subject: 'Matematika' | 'Informatika' | 'Umum';
  analogy: string;
  concept: string;
  steps: CanvasStep[];
  summary: string;
  raw_content: string;
}

interface LearningCanvasProps {
  data: CanvasData | null;
  isOpen: boolean;
  onClose: () => void;
  /** Called when user clicks "Lihat di Canvas" from a message button */
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

// ── Animated progress-step indicator ─────────────────────────────────────────

function StepDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          aria-label={`Langkah ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === active
              ? 'w-5 h-2 bg-blue-500'
              : i < active
              ? 'w-2 h-2 bg-blue-300'
              : 'w-2 h-2 bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

// ── Single step card ──────────────────────────────────────────────────────────

function StepCard({
  step,
  isActive,
  subject,
}: {
  step: CanvasStep;
  isActive: boolean;
  subject: string;
}) {
  const accent = subjectAccent(subject);

  return (
    <div
      className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
        isActive
          ? 'border-blue-200 shadow-md shadow-blue-100/60 scale-100 opacity-100'
          : 'border-gray-100 scale-95 opacity-40 pointer-events-none'
      }`}
      style={isActive ? { borderLeftColor: accent, borderLeftWidth: 3 } : {}}
    >
      {/* Step header */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: isActive ? `${accent}0d` : '#f9fafb' }}
      >
        <span
          className="flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold shrink-0"
          style={{ background: isActive ? accent : '#d1d5db' }}
        >
          {step.number}
        </span>
        <span className="font-semibold text-sm text-gray-800">{step.title}</span>
      </div>

      {/* Step body */}
      {isActive && (
        <div className="px-4 pb-4 pt-2 animate-fade-in">
          <MathContent content={step.body} isUser={false} />
        </div>
      )}
    </div>
  );
}

// ── Main canvas panel ─────────────────────────────────────────────────────────

export default function LearningCanvas({
  data,
  isOpen,
  onClose,
}: LearningCanvasProps) {
  const [tab, setTab] = useState<'overview' | 'steps' | 'summary'>('overview');
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // reset internal state when canvas data changes
  useEffect(() => {
    if (data) {
      setTab('overview');
      setActiveStep(0);
      setMounted(false);
      // micro-delay to trigger entrance animation
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

  const hasSteps = data.steps && data.steps.length > 0;
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
        className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0"
        style={{ background: `linear-gradient(135deg, ${accent}15 0%, #ffffff 100%)` }}
      >
          <div className="flex items-center gap-3 min-w-0">
            {/* Subject icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
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

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${subjectBadge(data.subject)}`}
            >
              {data.subject}
            </span>
            <button
              onClick={onClose}
              aria-label="Tutup canvas"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────────────────── */}
        <div className="flex border-b border-gray-100 shrink-0 px-5">
          {[
            { id: 'overview', label: 'Konsep' },
            ...(hasSteps ? [{ id: 'steps', label: `Langkah (${data.steps.length})` }] : []),
            { id: 'summary', label: 'Ringkasan' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`relative px-3 py-2.5 text-xs font-semibold transition-colors mr-1 ${
                tab === t.id
                  ? 'text-gray-900'
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

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div className={`space-y-4 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
              {/* Analogy card */}
              {data.analogy && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1.5">
                    Bayangkan Dulu
                  </p>
                  <MathContent content={data.analogy} isUser={false} />
                </div>
              )}

              {/* Concept / full explanation */}
              {data.concept ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Penjelasan Inti
                  </p>
                  <MathContent content={data.concept} isUser={false} />
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    Penjelasan Lengkap
                  </p>
                  <MathContent content={data.raw_content} isUser={false} />
                </div>
              )}

              {/* CTA to steps */}
              {hasSteps && (
                <button
                  onClick={() => setTab('steps')}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm"
                  style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)` }}
                >
                  Lihat Langkah-Langkah Penjelasan
                </button>
              )}
            </div>
          )}

          {/* STEPS TAB */}
          {tab === 'steps' && hasSteps && (
            <div className={`space-y-3 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
              {/* Navigation */}
              <div className="flex items-center justify-between py-1">
                <StepDots total={data.steps.length} active={activeStep} />
                <div className="flex items-center gap-2">
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((p) => p - 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Langkah sebelumnya"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-500 font-medium w-14 text-center">
                    {activeStep + 1} / {data.steps.length}
                  </span>
                  <button
                    disabled={activeStep === data.steps.length - 1}
                    onClick={() => setActiveStep((p) => p + 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    aria-label="Langkah berikutnya"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Step cards — show all, highlight active */}
              {data.steps.map((step, idx) => (
                <div key={step.number} onClick={() => setActiveStep(idx)}>
                  <StepCard step={step} isActive={idx === activeStep} subject={data.subject} />
                </div>
              ))}

              {/* Last step CTA */}
              {activeStep === data.steps.length - 1 && (
                <button
                  onClick={() => setTab('summary')}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm animate-fade-in"
                  style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)` }}
                >
                  Lihat Ringkasan Akhir
                </button>
              )}
            </div>
          )}

          {/* SUMMARY TAB */}
          {tab === 'summary' && (
            <div className={`space-y-4 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
              {data.summary ? (
                <div
                  className="rounded-2xl p-5 border"
                  style={{ background: `${accent}0a`, borderColor: `${accent}30` }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: accent }}
                  >
                    Kesimpulan Utama
                  </p>
                  <MathContent content={data.summary} isUser={false} />
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Belum ada ringkasan.</p>
              )}

              {/* Full raw content fallback */}
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
                  Lihat jawaban lengkap
                </summary>
                <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <MathContent content={data.raw_content} isUser={false} />
                </div>
              </details>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-gray-100 px-5 py-3 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            Kak Ambis &mdash; Learning Canvas
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            Tutup
          </button>
        </div>
      </div>
  );
}

// ── Trigger button (used inside message bubbles) ──────────────────────────────

export function CanvasTriggerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                 bg-indigo-50 border border-indigo-200 text-indigo-700
                 text-[11px] font-semibold hover:bg-indigo-100 active:scale-95
                 transition-all duration-150 shadow-xs"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
      Buka Learning Canvas
    </button>
  );
}
