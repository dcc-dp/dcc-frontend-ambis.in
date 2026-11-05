import MathContent from '@/components/Chat/MathContent';
import { cn } from '@/lib/cn';
import { subjectTone } from './subject-tone';
import type { CanvasData } from './types';

interface SummaryTabProps {
  data: CanvasData;
  className: string;
}

const LABEL = 'mb-2 text-sm font-bold uppercase tracking-wider';

export default function SummaryTab({ data, className }: SummaryTabProps) {
  const tone = subjectTone(data.subject);

  return (
    <div className={cn('space-y-4', className)}>
      {data.final_answer && (
        <div className="rounded-xl border-2 border-correct bg-correct-soft p-4 text-center">
          <p className={cn(LABEL, 'mb-1 text-correct')}>Hasil Akhir</p>
          <p className="font-mono text-base font-extrabold text-ink">{data.final_answer}</p>
        </div>
      )}

      {data.summary ? (
        <div className={cn('rounded-xl border-theme bg-card p-4', tone.border)}>
          <p className={cn(LABEL, tone.text)}>Kesimpulan Pembelajaran</p>
          <div className="text-sm leading-relaxed text-ink">
            <MathContent content={data.summary} isUser={false} />
          </div>
        </div>
      ) : (
        <p className="text-sm italic text-ink-soft">Belum ada ringkasan.</p>
      )}

      <details className="group">
        <summary className="flex min-h-11 cursor-pointer select-none items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink focus-pop">
          <svg
            className="h-3 w-3 transition-transform group-open:rotate-90"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Lihat uraian teks lengkap
        </summary>
        <div className="mt-3 rounded-lg border-theme border-line bg-paper-deep p-4 text-sm">
          <MathContent content={data.raw_content} isUser={false} />
        </div>
      </details>
    </div>
  );
}
