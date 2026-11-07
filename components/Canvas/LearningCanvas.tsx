'use client';

import { useState, useEffect } from 'react';
import { Button, Tabs, type TabItem } from '@/components/ui';
import StepFlowCanvas from './StepFlowCanvas';
import CanvasHeader from './learning/CanvasHeader';
import ConceptTab from './learning/ConceptTab';
import SummaryTab from './learning/SummaryTab';
import CanvasTriggerButton from './learning/CanvasTriggerButton';
import type { CanvasData, CanvasStep, CanvasTab } from './learning/types';

export type { CanvasData, CanvasStep };
export { CanvasTriggerButton };

interface LearningCanvasProps {
  data: CanvasData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRequest?: () => void;
}

function hasSteps(data: CanvasData | null): boolean {
  return Boolean(data?.steps && data.steps.length > 0);
}

function buildTabs(data: CanvasData): TabItem<CanvasTab>[] {
  return [
    ...(hasSteps(data) ? [{ value: 'flow' as const, label: `Alur Langkah (${data.steps.length})` }] : []),
    { value: 'concept', label: 'Konsep & Rumus' },
    { value: 'summary', label: 'Hasil Akhir' },
  ];
}

export default function LearningCanvas({ data, onClose }: LearningCanvasProps) {
  const [prevData, setPrevData] = useState(data);
  const [tab, setTab] = useState<CanvasTab>(hasSteps(data) ? 'flow' : 'concept');
  const [activeStep, setActiveStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  if (prevData !== data) {
    setPrevData(data);
    if (data) {
      setTab(hasSteps(data) ? 'flow' : 'concept');
      setActiveStep(0);
      setMounted(false);
    }
  }

  useEffect(() => {
    if (!data) return;
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [data]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!data) return null;

  const fade = mounted ? 'animate-fade-in' : 'opacity-0';

  return (
    <div role="region" aria-label="Learning Canvas" className="flex h-full w-full flex-col overflow-hidden bg-card">
      <CanvasHeader data={data} onClose={onClose} />

      <div className="shrink-0 border-b border-line px-5">
        <Tabs label="Learning Canvas" idBase="canvas" value={tab} onChange={setTab} items={buildTabs(data)} />
      </div>

      <div
        role="tabpanel"
        id={`canvas-panel-${tab}`}
        aria-labelledby={`canvas-tab-${tab}`}
        className="flex-1 space-y-4 overflow-y-auto px-5 py-4"
      >
        {tab === 'flow' && hasSteps(data) && (
          <div className={fade}>
            <StepFlowCanvas
              steps={data.steps}
              activeStep={activeStep}
              onStepChange={setActiveStep}
              subject={data.subject}
              accent={data.subject}
              title={data.title}
            />
          </div>
        )}
        {tab === 'concept' && <ConceptTab data={data} className={fade} onShowFlow={() => setTab('flow')} />}
        {tab === 'summary' && <SummaryTab data={data} className={fade} />}
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-line bg-paper-deep px-5 py-3">
        <span className="text-sm font-medium text-ink-soft">Kak Ambis &bull; Learning Canvas</span>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Tutup Canvas
        </Button>
      </div>
    </div>
  );
}
