'use client';

import React, { useState, useEffect, useRef } from 'react';
import MathContent from '@/components/Chat/MathContent';
import type { CanvasStep } from './LearningCanvas';

interface StepFlowCanvasProps {
  steps: CanvasStep[];
  activeStep: number;
  onStepChange: (index: number) => void;
  subject: string;
  accent: string;
  title: string;
}

// ── SVG Flow Connector with animated dashed flow ─────────────────────────────
function FlowConnector({
  isActive,
  isCompleted,
  accent,
}: {
  isActive: boolean;
  isCompleted: boolean;
  accent: string;
}) {
  const strokeColor = isActive ? accent : isCompleted ? '#10b981' : '#cbd5e1';

  return (
    <div className="flex flex-col items-center justify-center h-8 w-full my-0.5 select-none" aria-hidden="true">
      <svg className="w-5 h-8 overflow-visible" viewBox="0 0 20 32">
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="24"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeDasharray={isActive ? '4 4' : 'none'}
          className={isActive ? 'animate-flow-dash' : ''}
        />
        <polygon
          points="6,22 14,22 10,30"
          fill={strokeColor}
        />
      </svg>
    </div>
  );
}

export default function StepFlowCanvas({
  steps,
  activeStep,
  onStepChange,
  subject,
  accent,
  title,
}: StepFlowCanvasProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Auto-play stepper: moves forward every 3.5 seconds
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      onStepChange((activeStep + 1) % steps.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPlaying, activeStep, steps.length, onStepChange]);

  const currentStep = steps[activeStep] || steps[0];

  return (
    <div className="space-y-4">
      {/* ── Top Control Bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-gray-50/80 border border-gray-200/80 rounded-2xl px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-700">
            Langkah {activeStep + 1} dari {steps.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Play / Pause Auto Stepper */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
            }`}
            title={isPlaying ? 'Jeda animasi' : 'Putar alur otomatis'}
          >
            {isPlaying ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                <span>Jeda</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Putar Alur</span>
              </>
            )}
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              onStepChange(0);
            }}
            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition cursor-pointer"
            title="Kembali ke langkah pertama"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Flow Graph Nodes Container ──────────────────────────────────── */}
      <div className="bg-gradient-to-b from-slate-50/70 to-white border border-gray-200/70 rounded-2xl p-4 shadow-2xs">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3 text-center">
          Peta Alur Berpikir (Klik Node untuk Mempelajari)
        </p>

        {/* 1. START NODE */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-sm rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2 flex items-center justify-between text-xs text-emerald-900 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                S
              </span>
              <span className="font-bold truncate">Titik Awal: {title}</span>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
              Mulai
            </span>
          </div>

          <FlowConnector
            isActive={activeStep === 0}
            isCompleted={activeStep > 0}
            accent={accent}
          />
        </div>

        {/* 2. STEP NODES */}
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;

          return (
            <div key={step.number} className="flex flex-col items-center">
              {/* Step Node Card */}
              <div
                onClick={() => {
                  setIsPlaying(false);
                  onStepChange(idx);
                }}
                className={`w-full max-w-sm rounded-2xl p-3.5 transition-all duration-300 cursor-pointer select-none text-left relative ${
                  isActive
                    ? 'bg-white border-2 shadow-md scale-[1.02] z-10'
                    : isCompleted
                    ? 'bg-emerald-50/40 border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/70'
                    : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-2xs opacity-80'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: accent,
                        boxShadow: `0 8px 20px -6px ${accent}30`,
                      }
                    : {}
                }
              >
                {/* Node Header Row */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Circle badge */}
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                        isActive ? 'scale-110 shadow-xs text-white' : ''
                      }`}
                      style={{
                        background: isActive
                          ? accent
                          : isCompleted
                          ? '#10b981'
                          : '#e2e8f0',
                        color: isCompleted || isActive ? '#ffffff' : '#64748b',
                      }}
                    >
                      {isCompleted ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </span>

                    <h4
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-gray-900 font-extrabold' : 'text-gray-700'
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                      isActive
                        ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {isActive ? 'Aktif' : isCompleted ? 'Selesai' : `Langkah ${step.number}`}
                  </span>
                </div>

                {/* Short preview line */}
                {step.short_desc && (
                  <p className="text-[11px] text-gray-500 line-clamp-1 pl-8">
                    {step.short_desc}
                  </p>
                )}

                {/* Formula Chip if present */}
                {step.formula && (
                  <div className="mt-2 pl-8">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50/80 border border-blue-100 text-[10px] font-mono text-blue-800 truncate max-w-full">
                      Rumus: {step.formula}
                    </span>
                  </div>
                )}
              </div>

              {/* Connector to next node */}
              <FlowConnector
                isActive={activeStep === idx}
                isCompleted={idx < activeStep}
                accent={accent}
              />
            </div>
          );
        })}

        {/* 3. FINAL NODE (TARGET) */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => onStepChange(steps.length - 1)}
            className="w-full max-w-sm rounded-xl border border-blue-200 bg-blue-50/80 px-3.5 py-2.5 flex items-center justify-between text-xs text-blue-900 shadow-2xs cursor-pointer hover:bg-blue-100/80 transition"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                ✓
              </span>
              <span className="font-bold">Target Tercapai & Kesimpulan</span>
            </div>
            <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-300">
              Selesai
            </span>
          </div>
        </div>
      </div>

      {/* ── Active Step Focused Detail Card ─────────────────────────────── */}
      {currentStep && (
        <div
          ref={activeNodeRef}
          className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm space-y-3"
          style={{ borderLeftColor: accent, borderLeftWidth: 4 }}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-xs"
                style={{ background: accent }}
              >
                {currentStep.number}
              </span>
              <h3 className="text-sm font-bold text-gray-900">
                {currentStep.title}
              </h3>
            </div>
            <span className="text-[10px] font-semibold text-gray-400">
              Detail Penjelasan
            </span>
          </div>

          {/* Explanation Body */}
          <div className="text-xs text-gray-700 leading-relaxed py-1">
            <MathContent content={currentStep.body} isUser={false} />
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => {
                setIsPlaying(false);
                onStepChange(activeStep - 1);
              }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Sebelumnya</span>
            </button>

            <span className="text-[11px] font-semibold text-gray-400">
              Langkah {activeStep + 1} / {steps.length}
            </span>

            <button
              type="button"
              disabled={activeStep === steps.length - 1}
              onClick={() => {
                setIsPlaying(false);
                onStepChange(activeStep + 1);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition flex items-center gap-1 cursor-pointer hover:opacity-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
              style={{ background: accent }}
            >
              <span>Langkah Berikutnya</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
