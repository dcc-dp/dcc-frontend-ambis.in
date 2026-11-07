import { safeGet, safeSet } from '@/lib/safeStorage';
import { CHAT_HISTORY_KEY } from './types';

export const MODEL_STORAGE_KEY = 'ambisin_selected_model';
import type { ChatHistory, Message } from './types';

type StoredMessage = Omit<Message, 'createdAt'> & { createdAt: string | Date };
type StoredChat = Omit<ChatHistory, 'createdAt' | 'messages'> & {
  createdAt: string | Date;
  messages: StoredMessage[];
};

const DISALLOWED_NAMES = [
  'siapa', 'siapakah', 'apa', 'apakah', 'mana', 'dimana', 'kenapa',
  'tau', 'tahu', 'ingat', 'lupa', 'kamu', 'anda', 'kakak', 'kak',
  'siswa demo', 'anonim', 'admin', 'user', 'null', 'undefined'
];

export function isValidStudentName(name?: string | null): boolean {
  if (!name) return false;
  const cleaned = name.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  if (DISALLOWED_NAMES.includes(cleaned)) return false;
  for (const bad of ['siapa', 'siapakah', 'apakah', 'tau', 'tahu', 'ingat', 'lupa']) {
    if (cleaned.split(/\s+/).includes(bad)) return false;
  }
  return cleaned.length >= 2;
}

export function loadChatHistory(filterType?: 'ask' | 'learning-path'): ChatHistory[] {
  try {
    const stored = safeGet(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed: StoredChat[] = JSON.parse(stored);
      const chats: ChatHistory[] = parsed.map((chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        })),
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

export function saveChatHistory(history: ChatHistory[]) {
  try {
    safeSet(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}
