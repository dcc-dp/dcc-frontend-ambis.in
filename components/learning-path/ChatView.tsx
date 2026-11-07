'use client';

import ChatContainer from '@/components/Chat/ChatContainer';
import { Badge, Button } from '@/components/ui';
import type { LearningPathData, Message, RoadmapStep } from '@/lib/learning-path/types';
import { StepIntro } from './StepIntro';

interface ChatViewProps {
  data: LearningPathData | null;
  currentStep: RoadmapStep | undefined;
  messages: Message[];
  message: string;
  isLoading: boolean;
  quickPrompts: string[];
  onMessageChange: (msg: string) => void;
  onSendMessage: (overrideMsg?: string) => void;
  onTakeQuiz: (step: RoadmapStep) => void;
  onShowRoadmap: () => void;
}

export function ChatView({
  data,
  currentStep,
  messages,
  message,
  isLoading,
  quickPrompts,
  onMessageChange,
  onSendMessage,
  onTakeQuiz,
  onShowRoadmap,
}: ChatViewProps) {
  const stepNumber = data && currentStep ? data.roadmap.findIndex((s) => s.id === currentStep.id) + 1 : 0;

  return (
    <div className="flex h-[calc(100dvh-15rem)] min-h-96 flex-col md:h-[calc(100dvh-9rem)]">
      {data && currentStep && (
        <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center gap-2 px-4 py-2">
          <Button size="sm" variant="secondary" onClick={onShowRoadmap}>
            Lihat Peta Belajar
          </Button>
          <Badge tone="accent">
            Tahap {stepNumber} dari {data.roadmap.length}
          </Badge>
          {currentStep.hasQuiz && (
            <Button size="sm" className="ml-auto" onClick={() => onTakeQuiz(currentStep)}>
              Kerjakan Soal
            </Button>
          )}
        </div>
      )}
      <div className="min-h-0 flex-1">
        <ChatContainer
          messages={messages}
          message={message}
          isLoading={isLoading}
          mode="learning-path"
          quickPrompts={quickPrompts}
          intro={data && currentStep ? <StepIntro step={currentStep} stepNumber={stepNumber} subtopic={data.subtopic} /> : undefined}
          onQuickPromptClick={(prompt) => onSendMessage(prompt)}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
}
