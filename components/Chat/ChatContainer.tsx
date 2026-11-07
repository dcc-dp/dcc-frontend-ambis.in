'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import MessageList from '@/components/Chat/MessageList';
import { Button } from '@/components/ui';
import type { CanvasData } from '@/components/Canvas/LearningCanvas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  canvasData?: CanvasData;
}

interface ChatContainerProps {
  messages: Message[];
  message: string;
  isLoading: boolean;
  mode: 'ask' | 'learning-path';
  quickPrompts?: string[];
  onQuickPromptClick?: (prompt: string) => void;
  onMessageChange: (msg: string) => void;
  onSendMessage: (overrideMsg?: string) => void;
  selectedModelId?: string;
  onModelChange?: (modelId: string) => void;
  onOpenCanvas?: (data: CanvasData) => void;
  intro?: ReactNode;
}

export default function ChatContainer({
  messages,
  message,
  isLoading,
  mode,
  quickPrompts,
  onQuickPromptClick,
  onMessageChange,
  onSendMessage,
  onOpenCanvas,
  intro,
}: ChatContainerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  useEffect(() => {
    if (messages.length > 1) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const placeholder = mode === 'learning-path'
    ? 'Tanya Kak Ambis tentang materi ini...'
    : 'Ketik pertanyaanmu di sini...';

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-3">
        <div className="mx-auto w-full max-w-4xl space-y-4 px-4">
        {intro}
        <MessageList messages={messages} mode={mode} onOpenCanvas={onOpenCanvas} />
        {isLoading && (
          <div className="flex justify-start" role="status" aria-label="Kak Ambis sedang mengetik">
            <div className="rounded-xl border-theme border-line bg-card px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent animate-dot-pulse" style={{ animationDelay: '0ms' }} />
                <span className="h-2.5 w-2.5 rounded-full bg-accent animate-dot-pulse" style={{ animationDelay: '150ms' }} />
                <span className="h-2.5 w-2.5 rounded-full bg-accent animate-dot-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {quickPrompts && quickPrompts.length > 0 && (
          <div className="pb-2">
            <p className="mb-2 text-sm font-bold text-ink-soft">Saran cepat</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onQuickPromptClick?.(qp)}
                  className="min-h-11 rounded-full border-theme border-edge bg-card px-4 py-2 text-left text-base font-semibold text-accent-ink transition-colors hover:bg-accent-soft focus-pop"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-line bg-card py-4">
        <div className="mx-auto w-full max-w-4xl px-4">
          <div className="flex gap-3 items-center">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder={placeholder}
              aria-label="Pesan untuk Kak Ambis"
              className="flex-1 px-4 py-3 border-theme border-edge rounded-lg resize-none bg-card text-ink text-lg placeholder:text-ink-soft min-h-12 max-h-[200px] overflow-y-auto no-scrollbar focus-pop"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            />
            <Button
              onClick={() => onSendMessage()}
              disabled={!message.trim() || isLoading}
              className="self-stretch"
            >
              {isLoading ? '...' : 'Kirim'}
            </Button>
          </div>
          <p className="mt-1.5 hidden text-right text-sm text-ink-soft md:block">
            Enter untuk kirim · Shift+Enter untuk baris baru
          </p>
        </div>
      </div>
    </div>
  );
}
