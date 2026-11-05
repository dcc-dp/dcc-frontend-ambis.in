'use client';

import ChatContainer from '@/components/Chat/ChatContainer';
import { Badge, Button } from '@/components/ui';
import type { LearningPathData, Message, RoadmapStep } from '@/lib/learning-path/types';

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
  return (
    <div className="flex h-[75dvh] min-h-96 flex-col">
      {data && currentStep && (
        <div className="border-b-theme border-line bg-card px-4 py-3">
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge tone="accent">Tahap {data.roadmap.findIndex((s) => s.id === currentStep.id) + 1}</Badge>
              <h2 className="text-lg font-bold text-ink">
                {currentStep.title} — {data.subtopic}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {currentStep.hasQuiz && (
                <Button size="sm" onClick={() => onTakeQuiz(currentStep)}>
                  Kerjakan Soal
                </Button>
              )}
              <Button size="sm" variant="secondary" onClick={onShowRoadmap}>
                Lihat Roadmap
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-0 flex-1">
        <ChatContainer
          messages={messages}
          message={message}
          isLoading={isLoading}
          mode="learning-path"
          quickPrompts={quickPrompts}
          onQuickPromptClick={(prompt) => onSendMessage(prompt)}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
        />
      </div>
    </div>
  );
}
