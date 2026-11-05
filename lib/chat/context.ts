import { DEFAULT_STUDENT_ID } from './types';
import { isValidStudentName } from './storage';
import type { ChatHistory, Message, StudentProfile } from './types';

export function detectIntroName(currentMessage: string): string | null {
  const isQuestionOrTesting = /[?]|(?:siapa|tau|tahu|ingat|lupa|tebak|apakah|bukan)/i.test(currentMessage);
  if (isQuestionOrTesting) return null;
  const introMatch = currentMessage.match(
    /(?:(?:nama\s+(?:saya|aku|ku)|namaku)\s*(?:adalah\s*)?|panggil\s+(?:aku|saja)\s+)([A-Za-z][A-Za-z0-9_\s]{1,25})/i
  );
  if (!introMatch || !introMatch[1]) return null;
  const detected = introMatch[1].trim();
  return isValidStudentName(detected) ? detected : null;
}

export function buildPreviousSessions(chatHistory: ChatHistory[], currentChatId: string | null): string[] {
  return chatHistory
    .filter((c) => c.id !== (currentChatId || '') && c.messages && c.messages.length > 0)
    .slice(0, 8)
    .map((c) => {
      const firstUserMsg = c.messages.find((m) => m.role === 'user')?.content.slice(0, 100) || '';
      return `Sesi "${c.title}": Pernah menanyakan "${firstUserMsg}"`;
    });
}

export function buildStudentContext(
  profile: StudentProfile,
  activeName: string | undefined,
  previousSessions: string[]
) {
  return {
    student_id: profile.studentId || DEFAULT_STUDENT_ID,
    name: activeName,
    grade: profile.grade,
    goal: profile.goal,
    topic: profile.topic,
    subtopic: profile.subtopic,
    difficulty: profile.difficulty,
    facts: profile.facts,
    previous_sessions: previousSessions.length > 0 ? previousSessions : undefined,
  };
}

export function buildSessionMessages(updatedMessages: Message[]) {
  return updatedMessages.slice(-50).map((m) => ({
    role: m.role,
    content: m.content,
  }));
}
