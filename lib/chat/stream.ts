import type { Dispatch, SetStateAction } from 'react';
import type { CanvasData } from '@/components/Canvas/LearningCanvas';
import { isValidStudentName } from './storage';
import { STUDENT_PROFILE_KEY } from './types';
import type { MascotMood, StudentProfile } from './types';

export interface StreamHandlers {
  setMascotMessage: (value: string) => void;
  setMascotMood: (value: MascotMood) => void;
  setStudentProfile: Dispatch<SetStateAction<StudentProfile>>;
  setCanvasData: (value: CanvasData) => void;
  setCanvasOpen: (value: boolean) => void;
}

export interface StreamResult {
  assistantText: string;
  pendingCanvasData: CanvasData | null;
}

type SseData = Record<string, string | undefined>;

function parseEvent(raw: string): { eventType: string; dataStr: string } {
  let eventType = 'token';
  let dataStr = '';
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) {
      eventType = line.slice(6).trim();
    } else if (line.startsWith('data:')) {
      dataStr += line.slice(5).trim();
    }
  }
  return { eventType, dataStr };
}

function persistProfile(h: StreamHandlers, patch: (prev: StudentProfile) => StudentProfile) {
  h.setStudentProfile((prev) => {
    const updated = patch(prev);
    if (updated === prev) return prev;
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  });
}

function handleEvent(eventType: string, data: SseData, state: StreamResult, h: StreamHandlers) {
  if (eventType === 'token') {
    state.assistantText += data.chunk || '';
    h.setMascotMessage(
      state.assistantText.slice(0, 60) + (state.assistantText.length > 60 ? '...' : '')
    );
  } else if (eventType === 'memory') {
    if (data.name && isValidStudentName(data.name)) {
      persistProfile(h, (prev) => ({ ...prev, name: data.name, grade: data.grade || prev.grade }));
    }
  } else if (eventType === 'canvas') {
    state.pendingCanvasData = data as unknown as CanvasData;
    h.setCanvasData(state.pendingCanvasData);
    h.setCanvasOpen(true);
  } else if (eventType === 'thinking') {
    h.setMascotMessage(data.status || 'sedang memproses...');
  } else if (eventType === 'done') {
    h.setMascotMood('happy');
    h.setMascotMessage('Semoga penjelasan Kak Ambis membantu belajarmu.');
    if (data.student_name && isValidStudentName(data.student_name)) {
      persistProfile(h, (prev) =>
        prev.name === data.student_name ? prev : { ...prev, name: data.student_name }
      );
    }
  } else if (eventType === 'error') {
    state.assistantText = `Maaf, terjadi kendala: ${data.message || 'tidak diketahui'}`;
    h.setMascotMood('idle');
    h.setMascotMessage('Ada kendala sebentar, coba lagi ya.');
  }
}

function processChunk(raw: string, state: StreamResult, h: StreamHandlers) {
  const { eventType, dataStr } = parseEvent(raw);
  if (!dataStr) return;
  try {
    handleEvent(eventType, JSON.parse(dataStr), state, h);
  } catch (parseErr) {
    console.warn('Gagal parse SSE data:', parseErr);
  }
}

export async function readChatStream(response: Response, h: StreamHandlers): Promise<StreamResult> {
  const state: StreamResult = { assistantText: '', pendingCanvasData: null };
  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  if (reader) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() || '';
      for (const raw of parts) processChunk(raw, state, h);
    }
  }
  if (!state.assistantText) {
    state.assistantText = 'Halo! Kak Ambis siap membantu belajarmu.';
  }
  return state;
}
