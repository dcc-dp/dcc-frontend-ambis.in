'use client';

import { useState, useEffect } from 'react';
import FlowConnector from './learning/FlowConnector';
import FlowControls from './learning/FlowControls';
import StepNode from './learning/StepNode';
import StepDetail from './learning/StepDetail';
import { StartNode, FinalNode } from './learning/EndNodes';
import { subjectTone } from './learning/subject-tone';
import type { CanvasStep } from './learning/types';

interface StepFlowCanvasProps {
  steps: CanvasStep[];
  activeStep: number;
  onStepChange: (index: number) => void;
  subject: string;
  accent: string;
  title: string;
}

export default function StepFlowCanvas({
  steps,
  activeStep,
  onStepChange,
  subject,
  title,
}: StepFlowCanvasProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const tone = subjectTone(subject);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      onStepChange((activeStep + 1) % steps.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPlaying, activeStep, steps.length, onStepChange]);

  const currentStep = steps[activeStep] || steps[0];

  const goTo = (index: number) => {
    setIsPlaying(false);
    onStepChange(index);
  };

  return (
    <div className="space-y-4">
      <FlowControls
        activeStep={activeStep}
        total={steps.length}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={() => goTo(0)}
      />

      <div className="rounded-xl border-theme border-line bg-paper-deep p-4">
        <p className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-ink-soft">
          Peta Alur Berpikir (Klik Node untuk Mempelajari)
        </p>

        <div className="flex flex-col items-center">
          <StartNode title={title} />
          <FlowConnector isActive={activeStep === 0} isCompleted={activeStep > 0} tone={tone} />
        </div>

        {steps.map((step, idx) => (
          <div key={`step-node-${idx}-${step.number}`} className="flex flex-col items-center">
            <StepNode
              step={step}
              isActive={idx === activeStep}
              isCompleted={idx < activeStep}
              tone={tone}
              onSelect={() => goTo(idx)}
            />
            <FlowConnector isActive={activeStep === idx} isCompleted={idx < activeStep} tone={tone} />
          </div>
        ))}

        <div className="flex flex-col items-center">
          <FinalNode onClick={() => onStepChange(steps.length - 1)} />
        </div>
      </div>

      {currentStep && (
        <StepDetail
          step={currentStep}
          activeStep={activeStep}
          total={steps.length}
          tone={tone}
          onPrev={() => goTo(activeStep - 1)}
          onNext={() => goTo(activeStep + 1)}
        />
      )}
    </div>
  );
}
