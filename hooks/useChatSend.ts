'use client';

import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { CanvasData } from '@/components/Canvas/LearningCanvas';
import {
  buildPreviousSessions,
  buildSessionMessages,
  buildStudentContext,
  detectIntroName,
} from '@/lib/chat/context';
import { saveChatHistory } from '@/lib/chat/storage';
import { requestStream } from '@/lib/chat/request';
import { readChatStream } from '@/lib/chat/stream';
import { STUDENT_PROFILE_KEY } from '@/lib/chat/types';
import type { ChatHistory, MascotMood, Message, StudentProfile } from '@/lib/chat/types';

export interface ChatSendDeps {
  message: string;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setMessage: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setChatCount: Dispatch<SetStateAction<number>>;
  studentProfile: StudentProfile;
  setStudentProfile: Dispatch<SetStateAction<StudentProfile>>;
  currentChatId: string | null;
  setCurrentChatId: Dispatch<SetStateAction<string | null>>;
  chatHistory: ChatHistory[];
  setChatHistory: Dispatch<SetStateAction<ChatHistory[]>>;
  isSaving: RefObject<boolean>;
  isBlocked: boolean;
  devBypassLimit: boolean;
  setShowLoginModal: Dispatch<SetStateAction<boolean>>;
  setMascotMessage: Dispatch<SetStateAction<string>>;
  setMascotMood: Dispatch<SetStateAction<MascotMood>>;
  selectedModelId: string;
  setCanvasData: Dispatch<SetStateAction<CanvasData | null>>;
  setCanvasOpen: Dispatch<SetStateAction<boolean>>;
}

function recordUserMessage(
  d: ChatSendDeps,
  chatId: string,
  userMessage: Message,
  updatedMessages: Message[],
  currentMessage: string
) {
  if (!d.currentChatId) {
    d.setCurrentChatId(chatId);
    const title = currentMessage.slice(0, 40) + (currentMessage.length > 40 ? '...' : '');
    const newHistory: ChatHistory = {
      id: chatId,
      title,
      messages: [userMessage],
      createdAt: new Date(),
      type: 'ask',
    };
    d.isSaving.current = true;
    d.setChatHistory((prev) => {
      const updated = [newHistory, ...prev];
      saveChatHistory(updated);
      setTimeout(() => { d.isSaving.current = false; }, 0);
      return updated;
    });
    return;
  }
  d.setChatHistory((prev) => {
    const updated = prev.map((chat) =>
      chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
    );
    saveChatHistory(updated);
    return updated;
  });
}

async function resolveAssistant(d: ChatSendDeps, response: Response) {
  if (response.ok) {
    return readChatStream(response, d);
  }
  const errData = await response.json().catch(() => ({}));
  d.setMascotMood('idle');
  d.setMascotMessage('Ada kendala sebentar, coba lagi ya.');
  return {
    assistantText:
      errData.detail ||
      'Maaf, terjadi kendala saat menghubungi Kak Ambis. Silakan coba lagi ya!',
    pendingCanvasData: null as CanvasData | null,
  };
}

async function runChatTurn(
  d: ChatSendDeps,
  chatId: string,
  currentMessage: string,
  updatedMessages: Message[],
  activeName: string | undefined
) {
  d.setMascotMood('thinking');
  d.setMascotMessage('Kak Ambis sedang memikirkan jawaban untukmu...');
  d.setIsLoading(true);

  const previousSessions = buildPreviousSessions(d.chatHistory, d.currentChatId);
  const response = await requestStream({
    prompt: currentMessage,
    messages: buildSessionMessages(updatedMessages),
    student_context: buildStudentContext(d.studentProfile, activeName, previousSessions),
    model_id: d.selectedModelId,
    stream: true,
  });

  const { assistantText, pendingCanvasData } = await resolveAssistant(d, response);
  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: assistantText,
    createdAt: new Date(),
    canvasData: pendingCanvasData || undefined,
  };
  const finalMessages = [...updatedMessages, assistantMessage];
  d.setMessages(finalMessages);
  d.setIsLoading(false);

  const finalChatId = d.currentChatId || chatId;
  d.setChatHistory((prev) => {
    const updated = prev.map((chat) =>
      chat.id === finalChatId ? { ...chat, messages: finalMessages } : chat
    );
    saveChatHistory(updated);
    return updated;
  });
}

function reportOffline(d: ChatSendDeps, updatedMessages: Message[]) {
  const assistantMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content:
      'Maaf, Kak Ambis sedang offline atau tidak bisa dihubungi saat ini. Pastikan backend aktif ya!',
    createdAt: new Date(),
  };
  d.setMessages([...updatedMessages, assistantMessage]);
  d.setIsLoading(false);
  d.setMascotMood('idle');
  d.setMascotMessage('Yuk coba kirim lagi nanti.');
}

export function useChatSend(d: ChatSendDeps) {
  return async function handleSendMessage() {
    if (!d.message.trim()) return;

    if (d.isBlocked && !d.devBypassLimit) {
      d.setShowLoginModal(true);
      return;
    }

    const currentMessage = d.message.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      createdAt: new Date(),
    };

    const updatedMessages = [...d.messages, userMessage];
    d.setMessages(updatedMessages);
    d.setMessage('');
    d.setIsLoading(true);
    d.setChatCount((prev) => prev + 1);

    let activeName = d.studentProfile.name;
    const detected = detectIntroName(currentMessage);
    if (detected) {
      activeName = detected;
      const updated = { ...d.studentProfile, name: detected };
      d.setStudentProfile(updated);
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(updated));
    }

    const chatId = d.currentChatId || Date.now().toString();
    recordUserMessage(d, chatId, userMessage, updatedMessages, currentMessage);

    try {
      await runChatTurn(d, chatId, currentMessage, updatedMessages, activeName);
    } catch (err) {
      console.error('Error calling AI:', err);
      reportOffline(d, updatedMessages);
    } finally {
      d.setIsLoading(false);
    }
  };
}
