'use client';

import React, { useEffect, useRef, useState } from 'react';
import VisualCanvas from './VisualCanvas';
import { API_BASE_URL } from '@/app/hooks/useCanvasSession';
import { visualSpecFixtures } from '@/lib/fixtures/visualSpecFixtures';
import { normalizeVisualSpec, type VisualSpec } from '@/lib/visualSpec';

const SUGGESTIONS = [
  'Kenapa 1/2 + 1/3 bukan 2/5?',
  'Apa itu KPK dan buat apa?',
  'Bagaimana cara menjumlahkan 3/5 dan 1/4?',
];

interface FreeAskProps {
  offline?: boolean;
}

export default function FreeAsk({ offline = false }: FreeAskProps) {
  const [question, setQuestion] = useState('');
  const [visual, setVisual] = useState<VisualSpec | null>(null);
  const [degraded, setDegraded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    setDegraded(false);
    setVisual(null);

    try {
      if (offline) {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setVisual(visualSpecFixtures.explanation);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/v1/ask/visual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = (await response.json()) as { visual: unknown; degraded?: boolean };
      const spec = normalizeVisualSpec(body.visual);
      if (!spec) throw new Error('Bentuk jawaban dari server tidak dikenali');
      setVisual(spec);
      setDegraded(body.degraded === true);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Gagal menghubungi server');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-gray-700">Mau belajar apa hari ini?</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void ask(question);
              }
            }}
            maxLength={500}
            rows={2}
            disabled={loading}
            placeholder="Tulis pertanyaanmu, misalnya: kenapa 1/2 + 1/3 bukan 2/5?"
            className="w-full resize-none rounded-xl border-2 border-gray-200 px-3.5 py-2.5 text-base text-gray-900 outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => {
                setQuestion(suggestion);
                void ask(suggestion);
              }}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700 transition hover:border-indigo-300 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={loading || !question.trim()}
          onClick={() => void ask(question)}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Menggambar penjelasan...' : 'Tampilkan di kanvas'}
        </button>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}. Coba lagi ya.
        </p>
      )}

      {degraded && visual && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Penjelasan visualnya belum berhasil dibuat kali ini.
        </p>
      )}

      {visual && <VisualCanvas spec={visual} />}
    </div>
  );
}
