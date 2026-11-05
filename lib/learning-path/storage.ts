import type { ChatHistory, LearningPathData, Message } from './types';

export const CHAT_HISTORY_KEY = 'ambisin_chat_history';
export const LEARNING_PATH_DATA_KEY = 'ambisin_learning_path_data';
export const STUDENT_PROGRESS_KEY = 'ambisin_student_progress';
export const DEFAULT_PECAHAN_CONCEPT_ID = '00000000-0000-0000-0000-000000000203';

interface StoredMessage extends Omit<Message, 'createdAt'> {
  createdAt: string;
}

interface StoredChat extends Omit<ChatHistory, 'createdAt' | 'messages'> {
  createdAt: string;
  messages: StoredMessage[];
}

interface StoredProgress {
  id: string;
  name: string;
  progress: number;
  previousProgress: number;
  icon: string;
  category: string;
}

export function loadChatHistory(filterType?: 'ask' | 'learning-path'): ChatHistory[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed: StoredChat[] = JSON.parse(stored);
      const chats = parsed.map((chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((m: StoredMessage) => ({ ...m, createdAt: new Date(m.createdAt) })),
      }));
      return filterType ? chats.filter((c) => c.type === filterType) : chats;
    }
  } catch { return []; }
  return [];
}

export function saveChatHistory(history: ChatHistory[]) {
  try { localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history)); } catch { return; }
}

export function loadLearningPathData(): LearningPathData | null {
  try {
    const stored = localStorage.getItem(LEARNING_PATH_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function saveLearningPathData(data: LearningPathData) {
  localStorage.setItem(LEARNING_PATH_DATA_KEY, JSON.stringify(data));
}

export function updateStudentProgressStorage(conceptId: string, conceptName: string, newScore: number) {
  try {
    const stored = localStorage.getItem(STUDENT_PROGRESS_KEY);
    const list: StoredProgress[] = stored ? JSON.parse(stored) : [];
    const index = list.findIndex((c) => c.id === conceptId);
    if (index >= 0) {
      list[index].previousProgress = list[index].progress;
      list[index].progress = newScore;
    } else {
      list.push({
        id: conceptId,
        name: conceptName,
        progress: newScore,
        previousProgress: Math.max(0, newScore - 15),
        icon: '🍰',
        category: 'matematika',
      });
    }
    localStorage.setItem(STUDENT_PROGRESS_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('ambisin_progress_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to sync student progress:', err);
  }
}
