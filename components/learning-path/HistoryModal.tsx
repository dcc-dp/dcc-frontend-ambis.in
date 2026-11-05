'use client';

import { Button, Modal } from '@/components/ui';
import { formatRelativeTime } from '@/lib/learning-path/format';
import type { ChatHistory } from '@/lib/learning-path/types';

interface HistoryModalProps {
  open: boolean;
  chats: ChatHistory[];
  onClose: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
}

export function HistoryModal({ open, chats, onClose, onNewChat, onSelectChat }: HistoryModalProps) {
  const handleSelect = (chatId: string) => {
    onSelectChat(chatId);
    onClose();
  };

  const handleNew = () => {
    onNewChat();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Riwayat belajar"
      footer={<Button onClick={handleNew}>Percakapan baru</Button>}
    >
      {chats.length === 0 ? (
        <p className="text-ink-soft">
          Belum ada riwayat. Yuk mulai bertanya ke Kak Ambis, nanti percakapanmu tersimpan di sini.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                onClick={() => handleSelect(chat.id)}
                className="flex min-h-11 w-full flex-col items-start gap-1 rounded-lg border-theme border-line bg-card px-4 py-3 text-left transition-colors hover:bg-paper-deep focus-pop"
              >
                <span className="w-full truncate text-lg font-semibold text-ink">{chat.title}</span>
                <span className="w-full truncate text-base text-ink-soft">
                  {chat.messages[chat.messages.length - 1]?.content?.slice(0, 60)}
                </span>
                <span className="text-base text-ink-soft">{formatRelativeTime(chat.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
