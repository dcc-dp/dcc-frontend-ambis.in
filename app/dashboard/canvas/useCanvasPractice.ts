import { useEffect, useState } from 'react';
import type { PracticeConcept, PracticeExercise } from '@/components/Practice/types';
import { API_BASE_URL } from '@/app/hooks/useCanvasSession';

export function useCanvasPractice() {
  const [catalog, setCatalog] = useState<PracticeConcept[] | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selected, setSelected] = useState<PracticeExercise | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/v1/curriculum/practice`)
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
  }, []);

  return { catalog, catalogError, selected, setSelected };
}
