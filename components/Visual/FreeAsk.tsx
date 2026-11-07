'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button, Callout, Field, Textarea } from '@/components/ui';
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
      setError('Pertanyaanmu belum terkirim. Coba lagi, ya.');
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Field label="Mau belajar apa hari ini?">
          <Textarea
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
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <Button
              key={suggestion}
              variant="secondary"
              size="sm"
              disabled={loading}
              onClick={() => {
                setQuestion(suggestion);
                void ask(suggestion);
              }}
              className="text-left"
            >
              {suggestion}
            </Button>
          ))}
        </div>
        <Button fullWidth disabled={loading || !question.trim()} onClick={() => void ask(question)}>
          {loading ? 'Sedang menggambar' : 'Jelaskan dengan gambar'}
        </Button>
      </div>

      {error && (
        <Callout tone="error" live="assertive">
          {error}
        </Callout>
      )}

      {degraded && visual && (
        <Callout tone="warn">Gambar penjelasannya belum bisa dibuat kali ini. Coba tanyakan lagi.</Callout>
      )}

      {visual && <VisualCanvas spec={visual} />}
    </div>
  );
}
