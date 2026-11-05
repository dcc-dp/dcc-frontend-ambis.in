'use client';

import { useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { saveChatHistory } from '@/lib/learning-path/storage';
import type { ChatHistory, LearningPathData, MascotMood, Message, RoadmapStep } from '@/lib/learning-path/types';

interface ChatOptions {
  learningPathData: LearningPathData | null;
  setMascotMessage: Dispatch<SetStateAction<string>>;
  setMascotMood: Dispatch<SetStateAction<MascotMood>>;
}

export function useLearningPathChat({ learningPathData, setMascotMessage, setMascotMood }: ChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [hasLoadedIntroForStep, setHasLoadedIntroForStep] = useState<string | null>(null);
  const isSaving = useRef(false);

  const loadProactiveLessonIntro = async (step: RoadmapStep, subtopicName: string) => {
    if (hasLoadedIntroForStep === step.id) return;
    setHasLoadedIntroForStep(step.id);

    setIsLoading(true);
    setMascotMood('thinking');
    setMascotMessage(`Kak Ambis sedang menyiapkan pengantar belajar untuk ${step.title}...`);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const res = await fetch(`${baseUrl}/api/v1/learning-paths/lesson-intro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step_title: step.title,
          step_description: step.description,
          topic: 'Matematika',
          subtopic: subtopicName,
          student_name: 'Siswa',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const introMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `${data.greeting}\n\n${data.content}`,
          createdAt: new Date(),
        };
        setMessages((prev) => (prev.length === 0 ? [introMessage] : prev));
        if (data.quick_prompts && data.quick_prompts.length > 0) {
          setQuickPrompts(data.quick_prompts);
        }
        setMascotMood('happy');
        setMascotMessage('Pengantar materi sudah siap! Klik saran pertanyaan di bawah atau tanyakan apa saja ke Kak Ambis ya!');
        return;
      }
    } catch (err) {
      console.error('Failed to fetch proactive lesson intro:', err);
    } finally {
      setIsLoading(false);
    }

    const fallbackMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Halo! Selamat datang di tahap **${step.title}**!\n\nDi tahap ini kita akan membahas: ${step.description}.\n\n*Maaf ya, Kak Ambis sedang sedikit kesulitan terhubung ke server AI saat menyiapkan pembuka otomatis. Tapi tenang, kamu bisa klik saran pertanyaan cepat di bawah atau langsung tanya ke Kak Ambis!*`,
      createdAt: new Date(),
    };
    setMessages((prev) => (prev.length === 0 ? [fallbackMsg] : prev));
    setQuickPrompts([
      'Beri contoh soal sederhana',
      'Jelaskan konsep ini lebih santai',
      'Aku sudah paham, mau latihan',
    ]);
  };

  const handleSendMessage = async (overrideMsg?: string) => {
    const textToSend = (overrideMsg || message).trim();
    if (!textToSend) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: textToSend, createdAt: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);

    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) {
      setCurrentChatId(chatId);
      const title = textToSend.slice(0, 40) + (textToSend.length > 40 ? '...' : '');
      const newHistory: ChatHistory = { id: chatId, title, messages: [userMessage], createdAt: new Date(), type: 'learning-path' };
      isSaving.current = true;
      setChatHistory((prev) => { const updated = [newHistory, ...prev]; saveChatHistory(updated); setTimeout(() => { isSaving.current = false; }, 0); return updated; });
    } else {
      setChatHistory((prev) => { const updated = prev.map((chat) => chat.id === chatId ? { ...chat, messages: updatedMessages } : chat); saveChatHistory(updated); return updated; });
    }

    try {
      setMascotMood('thinking');
      setMascotMessage('Kak Ambis sedang menyiapkan penjelasan untukmu...');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const currentStep = learningPathData?.roadmap.find((s) => s.current);
      const stepContext = currentStep ? `[Konteks Pembelajaran: ${currentStep.title} — ${currentStep.description}] ` : '';

      const response = await fetch(`${baseUrl}/api/v1/ask/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `${stepContext}${textToSend}`,
          mode: 'learning_path',
        }),
      });

      let assistantText = '';
      if (response.ok) {
        const data = await response.json();
        assistantText = data.answer || data.response || 'Jawaban berhasil diterima dari Kak Ambis.';
      } else {
        assistantText = `Halo! Kak Ambis mendengar pertanyaanmu: "${textToSend}". Maaf ya, server AI sedang sedikit sibuk. Coba tanyakan sekali lagi ya!`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantText,
        createdAt: new Date(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      const finalChatId = currentChatId || chatId;
      setChatHistory((prev) => {
        const updated = prev.map((chat) => (chat.id === finalChatId ? { ...chat, messages: finalMessages } : chat));
        saveChatHistory(updated);
        return updated;
      });
      setMascotMood('happy');
      setMascotMessage('Semoga penjelasannya jelas ya! Kalau ada bagian yang belum paham, tanyakan saja lagi!');
    } catch {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Halo! Kak Ambis mendengar pertanyaanmu. Maaf ya, koneksi ke server AI sedang terganggu. Periksa koneksi lokalmu ya!`,
        createdAt: new Date(),
      };
      setMessages([...updatedMessages, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage('');
    setCurrentChatId(null);
    setQuickPrompts([]);
    setHasLoadedIntroForStep(null);
  };
  const handleSelectChat = (chatId: string) => { const chat = chatHistory.find((c) => c.id === chatId); if (chat) { setMessages(chat.messages); setCurrentChatId(chat.id); } };

  return {
    messages,
    message,
    setMessage,
    isLoading,
    chatHistory,
    setChatHistory,
    quickPrompts,
    isSaving,
    loadProactiveLessonIntro,
    handleSendMessage,
    handleNewChat,
    handleSelectChat,
  };
}
