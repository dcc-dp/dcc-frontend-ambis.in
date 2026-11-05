import { useCallback, useEffect, useState } from 'react';
import type { PracticeConcept, PracticeExercise } from '@/components/Practice/types';
import { API_BASE_URL } from '@/app/hooks/useCanvasSession';

const CATALOG_TIMEOUT_MS = 15000;

export function useCanvasPractice() {
  const [catalog, setCatalog] = useState<PracticeConcept[] | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PracticeExercise | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/v1/curriculum/practice`, {
      signal: AbortSignal.timeout(CATALOG_TIMEOUT_MS),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<PracticeConcept[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setCatalog(data);
        setSelected(data[0]?.exercises[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setCatalogError('Soal belum bisa dimuat');
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setCatalogError(null);
    setAttempt((value) => value + 1);
  }, []);

  return { catalog, catalogError, selected, setSelected, retry };
}
