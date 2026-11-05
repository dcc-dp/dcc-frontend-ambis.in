import MathContent from '@/components/Chat/MathContent';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { CanvasData } from './types';

interface ConceptTabProps {
  data: CanvasData;
  className: string;
  onShowFlow: () => void;
}

const LABEL = 'mb-2 text-sm font-bold uppercase tracking-wider';

export default function ConceptTab({ data, className, onShowFlow }: ConceptTabProps) {
  const hasSteps = data.steps && data.steps.length > 0;
  const conceptTitle = data.concept ? 'Penjelasan Konsep' : 'Uraian Materi';
  const conceptBody = data.concept ? data.concept : data.raw_content;

  return (
    <div className={cn('space-y-4', className)}>
      {data.core_formula && (
        <div className="rounded-xl border-theme border-accent bg-accent-soft p-4">
          <p className={cn(LABEL, 'text-accent-ink')}>Rumus / Aturan Kunci</p>
          <div className="overflow-x-auto rounded-lg border-theme border-line bg-card p-3 text-center font-semibold text-ink">
            <MathContent
              content={data.core_formula.startsWith('$') ? data.core_formula : `$$ ${data.core_formula} $$`}
              isUser={false}
            />
          </div>
        </div>
      )}

      {data.analogy && (
        <div className="rounded-xl border-theme border-attention bg-attention-soft p-4">
          <p className={cn(LABEL, 'text-attention')}>Bayangkan Dulu (Intuisi Masalah)</p>
          <div className="text-sm leading-relaxed text-ink">
            <MathContent content={data.analogy} isUser={false} />
          </div>
        </div>
      )}

      <Card>
        <p className={cn(LABEL, 'text-ink-soft')}>{conceptTitle}</p>
        <div className="text-sm leading-relaxed text-ink">
          <MathContent content={conceptBody} isUser={false} />
        </div>
      </Card>

      {hasSteps && (
        <Button onClick={onShowFlow} fullWidth>
          Lihat Diagram Alur Langkah Pengerjaan &rarr;
        </Button>
      )}
    </div>
  );
}
