import type { RefObject } from 'react';
import { Callout } from '@/components/ui';
import VisualCanvas from '@/components/Visual/VisualCanvas';
import type { CanvasPhase, CanvasResult } from '@/app/hooks/useCanvasSession';
import type { VisualSpec } from '@/lib/visualSpec';
import MasteryMeter from './MasteryMeter';

interface FeedbackPanelProps {
  phase: CanvasPhase;
  thoughts: string[];
  visual: VisualSpec | null;
  result: CanvasResult | null;
  feedbackRef: RefObject<HTMLDivElement | null>;
}

function CheckGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function BouncingDots() {
  return (
    <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="animate-dot-pulse h-1.5 w-1.5 rounded-full bg-accent"
          style={{ animationDelay: `${dot * 200}ms` }}
        />
      ))}
    </span>
  );
}

function Thinking({ thoughts }: { thoughts: string[] }) {
  return (
    <div className="space-y-2 rounded-md bg-paper-deep p-4 text-ink">
      {thoughts.map((thought, index) => {
        const isLast = index === thoughts.length - 1;
        return (
          <p key={`${thought}-${index}`} className={`flex items-center gap-2 text-base ${isLast ? 'font-semibold' : 'text-ink-soft'}`}>
            {isLast ? <BouncingDots /> : <CheckGlyph />}
            <span>{thought}</span>
          </p>
        );
      })}
      {thoughts.length === 0 && (
        <p className="flex items-center gap-2 text-base font-semibold">
          <BouncingDots />
          <span>Menghubungi server</span>
        </p>
      )}
    </div>
  );
}

function Outcome({ result }: { result: CanvasResult }) {
  if (result.is_correct) {
    return (
      <Callout tone="success" title="Jawabanmu benar.">
        <div className="mt-3">
          <MasteryMeter mastery={result.mastery} />
        </div>
      </Callout>
    );
  }
  return (
    <Callout tone="warn" title="Belum tepat. Coba lagi, ya.">
      <p className="text-base">Percobaan ke-{result.attempt_number}. Gambar di bawah bisa membantu.</p>
      {result.mastery > 0 && (
        <div className="mt-3">
          <MasteryMeter mastery={result.mastery} />
        </div>
      )}
    </Callout>
  );
}

export default function FeedbackPanel({ phase, thoughts, visual, result, feedbackRef }: FeedbackPanelProps) {
  const showVisual = phase === 'done' && result && !result.is_correct && visual;
  return (
    <>
      <div ref={feedbackRef} tabIndex={-1} role="status" aria-live="polite" className="space-y-6 outline-none">
        {phase === 'working' && <Thinking thoughts={thoughts} />}
        {phase === 'error' && (
          <Callout tone="error" live="assertive" title="Belum terkirim.">
            Jawabanmu belum terkirim, sinyalnya sepertinya putus. Coba lagi, ya.
          </Callout>
        )}
        {phase === 'done' && result && <Outcome result={result} />}
      </div>
      {showVisual && <VisualCanvas key={result.attempt_id} spec={visual} />}
    </>
  );
}
