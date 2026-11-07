'use client';

import React, { useState, useEffect } from 'react';
import { SidebarChatList } from '@/components/chat-page/SidebarChatList';
import { SvgIcon } from '@/components/chat-page/SvgIcon';
import { Button, IconButton } from '@/components/ui';
import { cn } from '@/lib/cn';

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

const NAV_ITEM_CLASS =
  'w-full flex items-center gap-3 px-3 min-h-11 text-ink hover:bg-paper-deep rounded-lg transition-colors font-medium text-base focus-pop';

function LogoMark() {
  return (
    <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-on-accent font-bold text-base">
      A
    </div>
  );
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
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-scrim z-40" onClick={onToggle} />
      )}

      <aside
        className={cn(
          'bg-card text-ink border-r-theme border-line flex flex-col h-screen transition-all duration-300 z-50',
          isOpen ? 'w-[280px]' : 'w-16',
          isMobile && isOpen && 'fixed inset-y-0 left-0',
          isMobile && !isOpen && 'w-0 overflow-hidden border-r-0'
        )}
      >
        <div className="p-4 border-b-theme border-line flex items-center justify-between flex-shrink-0">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <h1 className="text-lg font-bold text-ink whitespace-nowrap tracking-tight">
                  Ambis.In
                </h1>
                <p className="text-sm text-ink-soft whitespace-nowrap">AI Learning Platform</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <LogoMark />
            </div>
          )}
          {onToggle && isOpen && (
            <IconButton
              label="Tutup sidebar"
              onClick={onToggle}
              icon={<SvgIcon className="w-5 h-5" d="M6 18L18 6M6 6l12 12" />}
            />
          )}
        </div>

        <div className="p-3 flex-shrink-0">
          <Button
            size="sm"
            fullWidth
            onClick={handleNewChatClick}
            title={isOpen ? undefined : 'Percakapan Baru'}
            aria-label="Percakapan Baru"
          >
            <SvgIcon className="w-4 h-4 flex-shrink-0" d="M12 4v16m8-8H4" />
            {isOpen && <span>Percakapan Baru</span>}
          </Button>
        </div>

        <div className="mx-3 flex-shrink-0">
          <div className="h-px bg-line" />
        </div>

        {chats.length > 0 && (
          <SidebarChatList
            chats={chats}
            isOpen={isOpen}
            activeChatId={activeChatId}
            onSelectChat={handleChatClick}
          />
        )}

        <div className="flex-1 min-h-0" />

        <div className="mx-3 flex-shrink-0">
          <div className="h-px bg-line" />
        </div>

        <div className="p-3 flex-shrink-0 border-t-theme border-line bg-card">
          {isOpen && (
            <p className="text-sm text-ink-soft px-1 py-1 font-medium uppercase tracking-wide">
              Belajar
            </p>
          )}
          <button
            type="button"
            onClick={onLearningPathClick}
            aria-label="Jalur Belajar"
            className={cn(NAV_ITEM_CLASS, 'group')}
          >
            <SvgIcon
              className="w-5 h-5 flex-shrink-0 text-ink-soft group-hover:text-accent transition-colors"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
            {isOpen && <span>Jalur Belajar</span>}
          </button>
          <a
            href="/dashboard/canvas"
            aria-label="Kanvas Latihan"
            className={cn(NAV_ITEM_CLASS, 'group')}
          >
            <SvgIcon
              className="w-5 h-5 flex-shrink-0 text-ink-soft group-hover:text-accent transition-colors"
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm4 15h8m-4-4v4"
            />
            {isOpen && <span>Kanvas Latihan</span>}
          </a>
        </div>
      </aside>
    </>
  );
}
