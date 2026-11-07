import React from 'react';
import MathContent from '@/components/Chat/MathContent';
import { CanvasTriggerButton } from '@/components/Canvas/LearningCanvas';
import type { CanvasData } from '@/components/Canvas/LearningCanvas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  canvasData?: CanvasData;
}

interface MessageListProps {
  messages: Message[];
  mode?: 'ask' | 'learning-path';
  onOpenCanvas?: (data: CanvasData) => void;
}

export function MessageList({ messages, mode = 'ask', onOpenCanvas }: MessageListProps) {
  const placeholderText = 'Belum ada percakapan';

  const placeholderSub = mode === 'learning-path'
    ? 'Tanya tentang materi yang sedang kamu pelajari, terutama yang kamu kurang paham'
    : 'Ketik pesan untuk memulai';

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-ink-soft">
          <svg
            className="w-12 h-12 mb-4 text-ink-soft"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg font-semibold text-ink">{placeholderText}</p>
          <p className="text-base mt-1">{placeholderSub}</p>
        </div>
      ) : (
        messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-5 py-4 rounded-xl text-lg leading-relaxed ${
                  isUser
                    ? 'bg-accent text-on-accent'
                    : 'bg-card border-theme border-line text-ink'
                }`}
              >
                <div className="flex items-center gap-2 mb-2 pb-1">
                  {isUser ? (
                    <span className="text-sm font-semibold">Kamu</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-sm font-bold text-on-accent"
                      >
                        A
                      </span>
                      <span className="text-base font-semibold text-accent-ink">Kak Ambis</span>
                      <span className="rounded-full border-theme border-line bg-accent-soft px-2 text-sm font-medium text-accent-ink">
                        Tutor AI
                      </span>
                    </div>
                  )}
                </div>

                <MathContent content={message.content} isUser={isUser} />

                {message.role === 'assistant' && message.canvasData && onOpenCanvas && (
                  <CanvasTriggerButton onClick={() => onOpenCanvas(message.canvasData!)} />
                )}

                <p className={`text-sm mt-2.5 text-right ${isUser ? 'text-on-accent' : 'text-ink-soft'}`}>
                  {new Date(message.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MessageList;
