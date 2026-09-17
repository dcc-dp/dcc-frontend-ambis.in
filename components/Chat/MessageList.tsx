import React from 'react';
import MathContent from '@/components/Chat/MathContent';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface MessageListProps {
  messages: Message[];
  mode?: 'ask' | 'learning-path';
}

export function MessageList({ messages, mode = 'ask' }: MessageListProps) {
  const placeholderText = mode === 'learning-path' 
    ? 'Belum ada percakapan. Tanya tentang materi yang sedang kamu pelajari!'
    : 'Belum ada percakapan';

  const placeholderSub = mode === 'learning-path'
    ? 'Tanya tentang materi yang kamu kurang paham'
    : 'Ketik pesan untuk memulai';

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg
            className="w-12 h-12 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-sm">{placeholderText}</p>
          <p className="text-xs mt-1">{placeholderSub}</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-2xl px-5 py-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                  : 'bg-white border border-gray-200/90 text-gray-900 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 mb-2 pb-1 border-b border-gray-100">
                {message.role === 'assistant' ? (
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs">
                      🦉
                    </span>
                    <span className="text-xs font-semibold text-blue-700">
                      Kak Ambis
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-[10px] font-medium text-blue-600 border border-blue-200/50">
                      Tutor AI
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-blue-100">
                    Kamu
                  </span>
                )}
              </div>

              <MathContent
                content={message.content}
                isUser={message.role === 'user'}
              />

              <p
                className={`text-[11px] mt-2.5 text-right ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {new Date(message.createdAt).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MessageList;
