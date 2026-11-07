import MathContent from '@/components/Chat/MathContent';
import VisualCanvas from '@/components/Visual/VisualCanvas';
import { Badge, Button, Callout } from '@/components/ui';
import { friendlyFeedbackLabel } from '@/lib/learning/feedbackLabels';
import { normalizeVisualSpec } from '@/lib/visualSpec';
import type { AgentFeedback } from './types';

interface QuizFeedbackProps {
  feedback: AgentFeedback;
  isLastQuestion: boolean;
  onRetry: () => void;
  onNext: () => void;
}

const DEFAULT_HINT = 'Periksa kembali konsep penyamaan penyebut ya!';

function InterventionBody({ feedback }: { feedback: AgentFeedback }) {
  const visual = normalizeVisualSpec(feedback.intervention?.visual);
  if (visual) return <VisualCanvas spec={visual} />;
  return (
    <div className="text-base text-ink">
      <MathContent content={feedback.intervention?.text || DEFAULT_HINT} />
    </div>
  );
}

export function QuizFeedback({ feedback, isLastQuestion, onRetry, onNext }: QuizFeedbackProps) {
  if (feedback.is_correct) {
    return (
      <Callout tone="success" title="Luar Biasa, Jawabanmu Benar!" live="polite">
        Kamu makin paham konsep ini. Terus semangat!
        <div className="mt-3 flex justify-end">
          <Button onClick={onNext}>{isLastQuestion ? 'Selesai' : 'Soal Berikutnya'}</Button>
        </div>
      </Callout>
    );
  }

  const intervention = feedback.intervention;
  const label = friendlyFeedbackLabel(feedback.misconception_code, intervention?.rule_code, intervention?.kind);

  return (
    <Callout tone="warn" title="Bimbingan Belajar Kak Ambis:" live="polite">
      <div className="mt-2 space-y-3">
        <Badge tone="attention" className="inline-block">
          {label}
        </Badge>

        <InterventionBody feedback={feedback} />

        <div className="flex justify-end">
          <Button variant="secondary" onClick={onRetry}>
            Paham, Coba Jawab Ulang
          </Button>
        </div>
      </div>
    </Callout>
  );
}
