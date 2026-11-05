'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface ChatHistory {
  id: string;
  title: string;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
  type: 'ask' | 'learning-path';
}

interface MainLayoutProps {
  children: React.ReactNode;
  userName?: string;
  onLogout?: () => void;
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  onLearningPathClick?: () => void;
  showSidebar?: boolean;
  chats?: Array<{
    id: string;
    title: string;
    preview?: string;
    updatedAt: Date;
  }>;
  activeChatId?: string;
  closeSidebarOnMount?: boolean;
}

const CHAT_HISTORY_KEY = 'ambisin_chat_history';

function loadChatHistoryFromStorage(filterType?: 'ask' | 'learning-path'): Array<{
  id: string;
  title: string;
  preview?: string;
  updatedAt: Date;
}> {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed: ChatHistory[] = JSON.parse(stored);
      const chats = parsed.map((chat) => ({
        id: chat.id,
        title: chat.title,
        preview: chat.messages[chat.messages.length - 1]?.content?.slice(0, 60),
        updatedAt: new Date(chat.createdAt),
        type: chat.type,
      }));
      if (filterType) {
        return chats.filter((c) => c.type === filterType);
      }
      return chats;
    }
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
  return [];
}

export default function MainLayout({ children, userName, onLogout, onNewChat, onSelectChat, onLearningPathClick, showSidebar = true, chats: propChats, activeChatId, closeSidebarOnMount = false }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [localChats, setLocalChats] = useState<Array<{
    id: string;
    title: string;
    preview?: string;
    updatedAt: Date;
  }>>([]);

  // Determine which type of chats to show based on current page
  const isLearningPathPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard/learning');
  const chats = propChats || localChats;

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        if (closeSidebarOnMount) {
          setSidebarOpen(false);
        } else {
          setSidebarOpen(true);
        }
      } else {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [closeSidebarOnMount]);

  // Load chat history from localStorage if no prop provided
  useEffect(() => {
    if (!propChats) {
      const loaded = loadChatHistoryFromStorage(isLearningPathPage ? 'learning-path' : 'ask');
      queueMicrotask(() => setLocalChats(loaded));
    }
  }, [propChats, isLearningPathPage]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSelectChat = (chatId: string) => {
    if (onSelectChat) {
      onSelectChat(chatId);
    }
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    } else {
      // Navigate to home page for new chat if no handler provided
      window.location.href = '/chat';
    }
  };

  return (
    <div className="flex h-screen bg-paper text-ink relative">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-scrim z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {showSidebar && (
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={handleSidebarToggle}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onLearningPathClick={onLearningPathClick}
          chats={chats}
          activeChatId={activeChatId}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {showSidebar && (
          <Header
            userName={userName}
            onLogout={onLogout}
            onSidebarToggle={handleSidebarToggle}
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
          />
        )}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
