'use client';

import { useEffect, useRef, useState } from 'react';
import type { CanvasData } from '@/components/Canvas/LearningCanvas';
import { saveChatHistory } from '@/lib/chat/storage';
import type { ChatHistory, MascotMood, Message } from '@/lib/chat/types';
import { useChatBootstrap } from './useChatBootstrap';
import { useChatLimit } from './useChatLimit';
import { useChatSend } from './useChatSend';

export function useChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState('Halo! Kak Ambis siap membantu belajarmu');
  const [mascotMood, setMascotMood] = useState<MascotMood>('waving');
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const isSaving = useRef(false);

  const profile = useChatBootstrap({ setChatHistory });
  const limit = useChatLimit();

  useEffect(() => {
    if (!profile.hasLoaded.current || isSaving.current) return;
    saveChatHistory(chatHistory);
  }, [chatHistory, profile.hasLoaded]);

  const handleSendMessage = useChatSend({
    message,
    messages,
    setMessages,
    setMessage,
    setIsLoading,
    setChatCount: limit.setChatCount,
    studentProfile: profile.studentProfile,
    setStudentProfile: profile.setStudentProfile,
    currentChatId,
    setCurrentChatId,
    chatHistory,
    setChatHistory,
    isSaving,
    isBlocked: limit.isBlocked,
    devBypassLimit: limit.devBypassLimit,
    setShowLoginModal: limit.setShowLoginModal,
    setMascotMessage,
    setMascotMood,
    selectedModelId: profile.selectedModelId,
    setCanvasData,
    setCanvasOpen,
  });

  const handleNewChat = () => {
    setMessages([]);
    limit.setChatCount(0);
    limit.setShowLoginModal(false);
    setMessage('');
    setCurrentChatId(null);
    limit.setIsBlocked(false);
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      limit.setChatCount(chat.messages.filter((m) => m.role === 'user').length);
      setCurrentChatId(chat.id);
    }
  };

  const openCanvas = (data: CanvasData) => {
    setCanvasData(data);
    setCanvasOpen(true);
  };

  const sidebarChats = chatHistory.map((c) => ({
    id: c.id,
    title: c.title,
    preview: c.messages[c.messages.length - 1]?.content?.slice(0, 60),
    updatedAt: c.createdAt,
  }));

  return {
    messages,
    message,
    setMessage,
    isLoading,
    mascotMessage,
    mascotMood,
    canvasOpen,
    setCanvasOpen,
    canvasData,
    openCanvas,
    sidebarChats,
    profile,
    limit,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
  };
}
