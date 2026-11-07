'use client';

import { useEffect, useRef } from 'react';
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const placeholder = mode === 'learning-path'
    ? 'Tanya tentang materi yang kamu pelajari... (Shift+Enter untuk baris baru)'
    : 'Ketik atau paste teks panjang... (Shift+Enter untuk baris baru)';

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
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
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 border-t border-line bg-card p-4">
        <div className="max-w-3xl mx-auto">
          {quickPrompts && quickPrompts.length > 0 && (
            <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-sm font-bold text-ink-soft shrink-0">Saran Cepat:</span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onQuickPromptClick?.(qp)}
                  className="min-h-11 shrink-0 whitespace-nowrap rounded-full border-theme border-edge bg-card px-4 text-base font-semibold text-accent-ink transition-colors hover:bg-accent-soft focus-pop"
                >
                  {qp}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end mb-2">
            <span className="text-sm text-ink-soft hidden sm:block">
              Shift+Enter untuk baris baru
            </span>
          </div>
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
        </div>
      </div>
    </div>
  );
}
