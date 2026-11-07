import type { CanvasData } from '@/components/Canvas/LearningCanvas';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  canvasData?: CanvasData;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  type: 'ask' | 'learning-path';
}

export interface StudentProfile {
  studentId: string;
  name?: string;
  grade?: string;
  goal?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  facts?: string[];
}

export type MascotMood = 'happy' | 'thinking' | 'waving' | 'idle';

export interface InitialAnswers {
  name?: string;
  goal: string;
  topic: string;
  subtopic: string;
  difficulty: string;
}

export const CHAT_HISTORY_KEY = 'ambisin_chat_history';
export const STUDENT_PROFILE_KEY = 'ambisin_student_profile';
export const DEFAULT_STUDENT_ID = '00000000-0000-0000-0000-000000000901';
export const DEFAULT_MODEL_ID = 'gemini/gemini-3.5-flash-lite';
