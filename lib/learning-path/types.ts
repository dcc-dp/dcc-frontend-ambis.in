export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  type: 'ask' | 'learning-path';
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'practice' | 'checkpoint';
  completed: boolean;
  current: boolean;
  hasQuiz: boolean;
  recommendedBadge?: string;
}

export interface LearningPathData {
  goal: string;
  topic: string;
  subtopic: string;
  difficulty: string;
  conceptId: string;
  diagnosticCompleted: boolean;
  diagnosticScore?: number;
  misconceptions?: string[];
  roadmap: RoadmapStep[];
  roadmapReasoning?: string;
  aiMessage?: string;
}

export type MascotMood = 'happy' | 'thinking' | 'waving' | 'idle';

export interface RoadmapResult {
  steps: RoadmapStep[];
  reasoning: string | undefined;
  isFallback: boolean | undefined;
  message: string | undefined;
}

export interface InitialAnswers {
  goal: string;
  topic: string;
  subtopic: string;
  difficulty: string;
}
