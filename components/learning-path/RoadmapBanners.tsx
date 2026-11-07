'use client';

import { Button, Callout, Card } from '@/components/ui';
import type { LearningPathData } from '@/lib/learning-path/types';

interface RoadmapBannersProps {
  data: LearningPathData;
  isFetchingExercises: boolean;
  notice?: string | null;
  onStartDiagnostic: () => void;
}

export function RoadmapBanners({ data, isFetchingExercises, notice, onStartDiagnostic }: RoadmapBannersProps) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      {notice && (
        <Callout tone="warn" live="polite">
          {notice}
        </Callout>
      )}

      {data.roadmapReasoning && (
        <Callout tone="info" title="Kata Kak Ambis:">
          {data.roadmapReasoning}
        </Callout>
      )}

      {data.aiMessage && (
        <Callout tone="warn" title="Catatan:">
          {data.aiMessage}
        </Callout>
      )}

      {!data.diagnosticCompleted && (
        <Card tone="sunken" className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold text-ink">Tes Diagnostik Belum Dikerjakan</h3>
            <p className="mt-1 text-base text-ink-soft">
              Yuk kerjakan 2 soal cepat agar Kak Ambis bisa memetakan miskonsepsi dan menyusun peta belajar yang pas buat kamu!
            </p>
          </div>
          <Button onClick={onStartDiagnostic} disabled={isFetchingExercises} className="shrink-0">
            {isFetchingExercises ? 'Memuat Soal...' : 'Mulai Tes Diagnostik'}
          </Button>
        </Card>
      )}

      {data.diagnosticCompleted && (
        <Callout tone="success" title="Hasil tes awalmu:">
          <span className="flex flex-wrap items-center justify-between gap-3">
            <span>
              Pemahaman awalmu <span className="font-bold">{data.diagnosticScore || 0}%</span>. Peta belajarmu
              sudah disesuaikan untukmu!
            </span>
            <Button variant="ghost" size="sm" onClick={onStartDiagnostic}>
              Ulangi Tes
            </Button>
          </span>
        </Callout>
      )}
    </div>
  );
}
