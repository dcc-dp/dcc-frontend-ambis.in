import { cn } from '@/lib/cn';
import { SvgIcon } from './SvgIcon';

interface SidebarChat {
  id: string;
  title: string;
  preview?: string;
  updatedAt: Date;
}

interface SidebarChatListProps {
  chats: SidebarChat[];
  isOpen: boolean;
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
}

const CHAT_ICON_PATH =
  'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z';

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Baru saja';
  if (minutes < 60) return `${minutes}m lalu`;
  if (hours < 24) return `${hours}h lalu`;
  return `${days}d lalu`;
}

export function SidebarChatList({ chats, isOpen, activeChatId, onSelectChat }: SidebarChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="p-2">
        {isOpen && (
          <p className="text-sm text-ink-soft px-3 py-2 font-medium uppercase tracking-wide">
            Riwayat Chat
          </p>
        )}
        <div className="space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => onSelectChat(chat.id)}
              aria-label={chat.title}
              aria-current={chat.id === activeChatId ? 'true' : undefined}
              className={cn(
                'w-full text-left px-3 min-h-11 rounded-lg text-base transition-colors focus-pop',
                chat.id === activeChatId
                  ? 'bg-accent-soft text-accent-ink'
                  : 'text-ink hover:bg-paper-deep'
              )}
            >
              <div className="flex items-center gap-2">
                <SvgIcon className="w-4 h-4 flex-shrink-0 text-ink-soft" d={CHAT_ICON_PATH} />
                {isOpen && (
                  <div className="flex-1 min-w-0 py-1">
                    <p className="truncate font-medium text-base">{chat.title}</p>
                    <p className="truncate text-sm text-ink-soft">{formatTime(chat.updatedAt)}</p>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
