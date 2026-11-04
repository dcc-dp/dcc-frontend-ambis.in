'use client';

import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  onLearningPathClick?: () => void;
  chats?: Array<{
    id: string;
    title: string;
    preview?: string;
    updatedAt: Date;
  }>;
  activeChatId?: string;
}

export default function Sidebar({ isOpen = true, onToggle, onNewChat, onSelectChat, onLearningPathClick, chats = [], activeChatId }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes}m lalu`;
    if (hours < 24) return `${hours}h lalu`;
    return `${days}d lalu`;
  };

  const handleChatClick = (chatId: string) => {
    if (onSelectChat) {
      onSelectChat(chatId);
    }
  };

  const handleNewChatClick = () => {
    if (onNewChat) {
      onNewChat();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
        />
      )}

      <aside
        className={`bg-gray-50 border-r border-gray-200 flex flex-col h-screen transition-all duration-300 z-50 ${
          isOpen ? 'w-[280px]' : 'w-16'
        } ${isMobile && isOpen ? 'fixed inset-y-0 left-0' : ''} ${isMobile && !isOpen ? 'w-0 overflow-hidden border-r-0' : ''}`}
      >
        {/* Logo + Close Button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                A
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 whitespace-nowrap tracking-tight">
                  Ambis.In
                </h1>
                <p className="text-[10px] text-gray-500 whitespace-nowrap">AI Learning Platform</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                A
              </div>
            </div>
          )}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-200 rounded-md transition flex-shrink-0"
            >
              {/* <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg> */}
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <div className="p-3 flex-shrink-0">
          <button
            onClick={handleNewChatClick}
            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition ${
              isOpen
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700 justify-center p-3'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isOpen && <span>Percakapan Baru</span>}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-3 flex-shrink-0">
          <div className="h-px bg-gray-200" />
        </div>

        {/* Chat History */}
        {chats.length > 0 && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-2">
              {isOpen && (
                <p className="text-xs text-gray-400 px-3 py-2 font-medium uppercase tracking-wide">
                  Riwayat Chat
                </p>
              )}
              <div className="space-y-1">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                      chat.id === activeChatId
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-3 h-3 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {isOpen && (
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium text-xs">{chat.title}</p>
                          <p className="truncate text-[10px] text-gray-400">
                            {formatTime(chat.updatedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-h-0" />

        {/* Divider */}
        <div className="mx-3 flex-shrink-0">
          <div className="h-px bg-gray-200" />
        </div>

        {/* Learning Path Section */}
        <div className="p-3 flex-shrink-0 border-t border-gray-200 bg-gray-50">
          {isOpen && (
            <p className="text-xs text-gray-400 px-1 py-1 font-medium uppercase tracking-wide">
              Belajar
            </p>
          )}
          <button
            onClick={onLearningPathClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium text-sm group"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {isOpen && <span>Learning Path</span>}
          </button>
          <a
            href="/dashboard/canvas"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium text-sm group"
          >
            <svg className="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm4 15h8m-4-4v4" />
            </svg>
            {isOpen && <span>Kanvas Latihan</span>}
          </a>
        </div>
      </aside>
    </>
  );
}
