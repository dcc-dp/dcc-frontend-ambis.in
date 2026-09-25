'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ChatContainer from '@/components/Chat/ChatContainer';
import { InitialQuestionsModal } from '@/components/Modal/InitialQuestionsModal';
import { LoginPromptModal } from '@/components/Modal/LoginPromptModal';
import Mascot from '@/components/Mascot/Mascot';
import { MODEL_STORAGE_KEY } from '@/components/Chat/ModelSelector';
import LearningCanvas from '@/components/Canvas/LearningCanvas';
import type { CanvasData } from '@/components/Canvas/LearningCanvas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  canvasData?: CanvasData;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  type: 'ask' | 'learning-path';
}

interface StudentProfile {
  studentId: string;
  name?: string;
  grade?: string;
  goal?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  facts?: string[];
}

const CHAT_HISTORY_KEY = 'ambisin_chat_history';
const STUDENT_PROFILE_KEY = 'ambisin_student_profile';
const DEFAULT_STUDENT_ID = '00000000-0000-0000-0000-000000000901';

const DISALLOWED_NAMES = [
  'siapa', 'siapakah', 'apa', 'apakah', 'mana', 'dimana', 'kenapa',
  'tau', 'tahu', 'ingat', 'lupa', 'kamu', 'anda', 'kakak', 'kak',
  'siswa demo', 'anonim', 'admin', 'user', 'null', 'undefined'
];

function isValidStudentName(name?: string | null): boolean {
  if (!name) return false;
  const cleaned = name.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  if (DISALLOWED_NAMES.includes(cleaned)) return false;
  for (const bad of ['siapa', 'siapakah', 'apakah', 'tau', 'tahu', 'ingat', 'lupa']) {
    if (cleaned.split(/\s+/).includes(bad)) return false;
  }
  return cleaned.length >= 2;
}

function loadChatHistory(filterType?: 'ask' | 'learning-path'): ChatHistory[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed: ChatHistory[] = JSON.parse(stored);
      const chats = parsed.map((chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((m: any) => ({
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

function saveChatHistory(history: ChatHistory[]) {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
}

export default function HomePage() {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  const [hasAnsweredQuestions, setHasAnsweredQuestions] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [devBypassLimit, setDevBypassLimit] = useState<boolean>(true);
  const [mascotMessage, setMascotMessage] = useState('Halo! Kak Ambis siap membantu belajarmu');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'waving' | 'idle'>('waving');
  const [selectedModelId, setSelectedModelId] = useState<string>('gemini/gemini-3.5-flash-lite');
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    studentId: DEFAULT_STUDENT_ID,
  });
  const [canvasOpen, setCanvasOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  const hasLoaded = useRef(false);
  const isSaving = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const history = loadChatHistory('ask');
    setChatHistory(history);

    // 1. Load saved model selection
    const savedModel = localStorage.getItem(MODEL_STORAGE_KEY);
    if (savedModel && !savedModel.includes('llama-3.3') && !savedModel.includes('compound')) {
      setSelectedModelId(savedModel);
    } else {
      setSelectedModelId('gemini/gemini-3.5-flash-lite');
    }

    // 2. Load persistent student profile from localStorage
    let activeProfile: StudentProfile = { studentId: DEFAULT_STUDENT_ID };
    try {
      const storedProfile = localStorage.getItem(STUDENT_PROFILE_KEY);
      if (storedProfile) {
        activeProfile = { ...activeProfile, ...JSON.parse(storedProfile) };
      }
    } catch (e) {
      console.warn('Error reading student profile:', e);
    }
    // Bersihkan nama jika sebelumnya sempat tersimpan nama keliru seperti "Siapa"
    if (activeProfile.name && !isValidStudentName(activeProfile.name)) {
      activeProfile.name = undefined;
      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(activeProfile));
    }
    setStudentProfile(activeProfile);

    // 3. Sync student memory with PostgreSQL DB
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    fetch(`${baseUrl}/api/v1/chat/memory?student_id=${activeProfile.studentId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((dbData) => {
        if (dbData && dbData.name && isValidStudentName(dbData.name)) {
          setStudentProfile((prev) => {
            const merged = {
              ...prev,
              name: prev.name || dbData.name,
              grade: prev.grade || dbData.grade,
              facts: dbData.facts || prev.facts,
            };
            localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      })
      .catch(() => {});

    const stored = localStorage.getItem('hasCompletedInitialQuestions');
    if (stored === 'true') {
      setHasAnsweredQuestions(true);
      setShowInitialModal(false);
    } else {
      setShowInitialModal(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current || isSaving.current) return;
    saveChatHistory(chatHistory);
  }, [chatHistory]);

  useEffect(() => {
    const isEnvDisabled = process.env.NEXT_PUBLIC_DISABLE_CHAT_LIMIT === 'true';
    const stored = localStorage.getItem('dev_bypass_chat_limit');
    if (stored !== null) {
      setDevBypassLimit(stored === 'true');
    } else {
      setDevBypassLimit(isEnvDisabled || process.env.NODE_ENV === 'development');
    }
  }, []);

  useEffect(() => {
    if (!devBypassLimit && chatCount >= 3) {
      setShowLoginModal(true);
    }
  }, [chatCount, devBypassLimit]);

  const handleContinueLater = () => {
    setShowLoginModal(false);
    if (!devBypassLimit) {
      setIsBlocked(true);
    }
  };

  const handleDevBypass = () => {
    setDevBypassLimit(true);
    setIsBlocked(false);
    setShowLoginModal(false);
    localStorage.setItem('dev_bypass_chat_limit', 'true');
  };

  const handleInitialQuestionsSubmit = async (answers: {
    name?: string;
    goal: string;
    topic: string;
    subtopic: string;
    difficulty: string;
  }) => {
    localStorage.setItem('hasCompletedInitialQuestions', 'true');
    localStorage.setItem('initialAnswers', JSON.stringify(answers));
    setHasAnsweredQuestions(true);
    setShowInitialModal(false);

    const updatedProfile: StudentProfile = {
      ...studentProfile,
      name: answers.name?.trim() || studentProfile.name,
      goal: answers.goal,
      topic: answers.topic,
      subtopic: answers.subtopic,
      difficulty: answers.difficulty,
    };
    setStudentProfile(updatedProfile);
    localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(updatedProfile));

    // Sinkronisasi memori ke database PostgreSQL
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      await fetch(`${baseUrl}/api/v1/chat/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: updatedProfile.studentId,
          name: updatedProfile.name,
          goal: updatedProfile.goal,
          topic: updatedProfile.topic,
        }),
      });
    } catch (err) {
      console.warn('Sync memory to backend skipped:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (isBlocked && !devBypassLimit) {
      setShowLoginModal(true);
      return;
    }

    const currentMessage = message.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');
    setIsLoading(true);
    setChatCount((prev) => prev + 1);

    // Deteksi perkenalan nama langsung di sisi klien HANYA jika bukan kalimat tanya/uji memori
    let activeName = studentProfile.name;
    const isQuestionOrTesting = /[?]|(?:siapa|tau|tahu|ingat|lupa|tebak|apakah|bukan)/i.test(currentMessage);
    if (!isQuestionOrTesting) {
      const introMatch = currentMessage.match(
        /(?:(?:nama\s+(?:saya|aku|ku)|namaku)\s*(?:adalah\s*)?|panggil\s+(?:aku|saja)\s+)([A-Za-z][A-Za-z0-9_\s]{1,25})/i
      );
      if (introMatch && introMatch[1]) {
        const detected = introMatch[1].trim();
        if (isValidStudentName(detected)) {
          activeName = detected;
          const updated = { ...studentProfile, name: detected };
          setStudentProfile(updated);
          localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(updated));
        }
      }
    }

    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) {
      setCurrentChatId(chatId);
      const title = currentMessage.slice(0, 40) + (currentMessage.length > 40 ? '...' : '');
      const newHistory: ChatHistory = {
        id: chatId,
        title,
        messages: [userMessage],
        createdAt: new Date(),
        type: 'ask',
      };
      isSaving.current = true;
      setChatHistory((prev) => {
        const updated = [newHistory, ...prev];
        saveChatHistory(updated);
        setTimeout(() => { isSaving.current = false; }, 0);
        return updated;
      });
    } else {
      setChatHistory((prev) => {
        const updated = prev.map((chat) =>
          chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
        );
        saveChatHistory(updated);
        return updated;
      });
    }

    try {
      setMascotMood('thinking');
      setMascotMessage('Kak Ambis sedang memikirkan jawaban untukmu...');
      setIsLoading(true);

      // Ambil ringkasan sesi-sesi percakapan terdahulu (cross-session memory)
      const previousSessions = chatHistory
        .filter((c) => c.id !== (currentChatId || '') && c.messages && c.messages.length > 0)
        .slice(0, 8)
        .map((c) => {
          const firstUserMsg = c.messages.find((m) => m.role === 'user')?.content.slice(0, 100) || '';
          return `Sesi "${c.title}": Pernah menanyakan "${firstUserMsg}"`;
        });

      // Konteks siswa lengkap dengan identitas persisten
      const studentContext = {
        student_id: studentProfile.studentId || DEFAULT_STUDENT_ID,
        name: activeName,
        grade: studentProfile.grade,
        goal: studentProfile.goal,
        topic: studentProfile.topic,
        subtopic: studentProfile.subtopic,
        difficulty: studentProfile.difficulty,
        facts: studentProfile.facts,
        previous_sessions: previousSessions.length > 0 ? previousSessions : undefined,
      };

      // Sertakan 1 sesi chat penuh (hingga 50 pesan terakhir dalam sesi ini)
      const sessionMessages = updatedMessages.slice(-50).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const controller = new AbortController();
      const timeoutMs = 60_000;
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      let response: Response;
      try {
        response = await fetch(`${baseUrl}/api/v1/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({
            prompt: currentMessage,
            messages: sessionMessages,
            student_context: studentContext,
            model_id: selectedModelId,
            stream: true,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      let assistantText = '';
      let pendingCanvasData: CanvasData | null = null;
      if (response.ok) {
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
            for (const raw of parts) {
              const lines = raw.split('\n');
              let eventType = 'token';
              let dataStr = '';
              for (const line of lines) {
                if (line.startsWith('event:')) {
                  eventType = line.slice(6).trim();
                } else if (line.startsWith('data:')) {
                  dataStr += line.slice(5).trim();
                }
              }
              if (!dataStr) continue;
              try {
                const data = JSON.parse(dataStr);
                if (eventType === 'token') {
                  assistantText += data.chunk || '';
                  setMascotMessage(
                    assistantText.slice(0, 60) +
                      (assistantText.length > 60 ? '...' : '')
                  );
                } else if (eventType === 'memory') {
                  // Perbarui memori siswa secara real-time dari respon backend
                  if (data.name && isValidStudentName(data.name)) {
                    setStudentProfile((prev) => {
                      const updated = {
                        ...prev,
                        name: data.name,
                        grade: data.grade || prev.grade,
                      };
                      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(updated));
                      return updated;
                    });
                  }
                } else if (eventType === 'canvas') {
                  // Open Learning Canvas with structured payload
                  try {
                    pendingCanvasData = data as CanvasData;
                    setCanvasData(pendingCanvasData);
                    setCanvasOpen(true);
                  } catch {}
                } else if (eventType === 'thinking') {
                  setMascotMessage(data.status || 'sedang memproses...');
                } else if (eventType === 'done') {
                  setMascotMood('happy');
                  setMascotMessage('Semoga penjelasan Kak Ambis membantu belajarmu.');
                  if (data.student_name && isValidStudentName(data.student_name)) {
                    setStudentProfile((prev) => {
                      if (prev.name === data.student_name) return prev;
                      const updated = { ...prev, name: data.student_name };
                      localStorage.setItem(STUDENT_PROFILE_KEY, JSON.stringify(updated));
                      return updated;
                    });
                  }
                } else if (eventType === 'error') {
                  assistantText =
                    `Maaf, terjadi kendala: ${data.message || 'tidak diketahui'}`;
                  setMascotMood('idle');
                  setMascotMessage('Ada kendala sebentar, coba lagi ya.');
                }
              } catch (parseErr) {
                console.warn('Gagal parse SSE data:', parseErr);
              }
            }
          }
        }
        if (!assistantText) {
          assistantText = 'Halo! Kak Ambis siap membantu belajarmu.';
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        assistantText =
          errData.detail ||
          'Maaf, terjadi kendala saat menghubungi Kak Ambis. Silakan coba lagi ya!';
        setMascotMood('idle');
        setMascotMessage('Ada kendala sebentar, coba lagi ya.');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantText,
        createdAt: new Date(),
        canvasData: pendingCanvasData || undefined,
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setIsLoading(false);

      const finalChatId = currentChatId || chatId;
      setChatHistory((prev) => {
        const updated = prev.map((chat) =>
          chat.id === finalChatId ? { ...chat, messages: finalMessages } : chat
        );
        saveChatHistory(updated);
        return updated;
      });
    } catch (err) {
      console.error('Error calling AI:', err);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Maaf, Kak Ambis sedang offline atau tidak bisa dihubungi saat ini. Pastikan backend aktif ya!',
        createdAt: new Date(),
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setIsLoading(false);
      setMascotMood('idle');
      setMascotMessage('Yuk coba kirim lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setChatCount(0);
    setShowLoginModal(false);
    setMessage('');
    setCurrentChatId(null);
    setIsBlocked(false);
    // StudentProfile (termasuk nama) sengaja dipertahankan agar Kak Ambis tetap mengenalnya di sesi baru!
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setChatCount(chat.messages.filter((m) => m.role === 'user').length);
      setCurrentChatId(chat.id);
    }
  };

  const handleLearningPathClick = () => {
    if (hasAnsweredQuestions) {
      window.location.href = '/dashboard/learning';
    } else {
      setShowInitialModal(true);
    }
  };

  return (
    <MainLayout
      onNewChat={handleNewChat}
      onSelectChat={handleSelectChat}
      onLearningPathClick={handleLearningPathClick}
      chats={chatHistory.map((c) => ({
        id: c.id,
        title: c.title,
        preview: c.messages[c.messages.length - 1]?.content?.slice(0, 60),
        updatedAt: c.createdAt,
      }))}
    >
      <div className="flex h-full w-full overflow-hidden relative">
        {/* Left Column: Chat Area (resizes smoothly in lockstep as canvas slides in/out) */}
        <div className="flex-1 flex flex-col h-full min-w-0">
          {/* Header info - only show when no messages */}
          {messages.length === 0 && (
            <div className="text-center py-4 md:py-6 px-4 flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                {studentProfile.name ? `Halo, ${studentProfile.name}!` : 'Halo! Apa yang ingin kamu lakukan hari ini?'}
              </h1>
              <p className="text-gray-500 text-xs md:text-sm">
                {studentProfile.name
                  ? 'Kak Ambis siap melanjutkan sesi belajarmu hari ini.'
                  : 'Pilih fitur atau langsung ketik pesan di bawah'}
              </p>
            </div>
          )}

          {/* Feature Selector - only when no messages */}
          {messages.length === 0 && (
            <div className="px-4 pb-4 flex-shrink-0">
              {/* Feature Cards */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4">
                <button
                  onClick={() => {
                    const textarea = document.querySelector('textarea');
                    if (textarea) textarea.focus();
                  }}
                  className="flex-1 max-w-sm mx-auto sm:mx-0 w-full sm:w-auto bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-120 p-4 sm:p-5 border border-gray-200 hover:border-blue-300 group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Tanya Apapun</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-3">
                    Tanya materi, rumus, konsep, atau kode pemrograman
                  </p>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline">
                    Mulai Bertanya &rarr;
                  </span>
                </button>

                <button
                  onClick={handleLearningPathClick}
                  className="flex-1 max-w-sm mx-auto sm:mx-0 w-full sm:w-auto bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-120 p-4 sm:p-5 border border-purple-200 hover:border-purple-300 group text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Learning Path</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-3">
                    Program belajar terstruktur Matematika & Informatika
                  </p>
                  <span className="text-xs font-semibold text-purple-600 group-hover:underline">
                    Buka Jalur Belajar &rarr;
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Dev Mode Switch Bar */}
          <div className="flex items-center justify-between px-4 py-1.5 border-y border-gray-200/70 bg-gray-50/90 text-xs text-gray-500 flex-shrink-0">
            <div className="flex items-center gap-2 text-gray-600 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Chat Belajar Interaktif</span>
              {studentProfile.name && (
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium">
                  Profil: {studentProfile.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* If canvas has data and is closed, offer quick reopen button */}
              {canvasData && !canvasOpen && (
                <button
                  type="button"
                  onClick={() => setCanvasOpen(true)}
                  className="px-2 py-0.5 rounded-full font-semibold transition text-[10px] sm:text-[11px] flex items-center gap-1 cursor-pointer bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                  title="Buka kembali Learning Canvas"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  <span>Buka Canvas</span>
                </button>
              )}

              <span className="text-[11px] font-medium text-gray-500">Mode Dev:</span>
              <button
                type="button"
                onClick={() => {
                  const nextVal = !devBypassLimit;
                  setDevBypassLimit(nextVal);
                  if (nextVal) setIsBlocked(false);
                  localStorage.setItem('dev_bypass_chat_limit', String(nextVal));
                }}
                className={`px-2 py-0.5 rounded-full font-semibold transition text-[10px] sm:text-[11px] flex items-center gap-1.5 cursor-pointer ${
                  devBypassLimit
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                }`}
                title="Klik untuk aktifkan / matikan batas 3 chat gratis"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${devBypassLimit ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {devBypassLimit ? 'Batas Chat: OFF (Unlimited)' : 'Batas Chat: ON (Maks 3)'}
              </button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex-1 min-h-0 flex flex-col">
            <ChatContainer
              messages={messages}
              message={message}
              isLoading={isLoading}
              mode="ask"
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
              selectedModelId={selectedModelId}
              onModelChange={setSelectedModelId}
              onOpenCanvas={(data) => { setCanvasData(data); setCanvasOpen(true); }}
            />
          </div>
        </div>

        {/* Right Column: Learning Canvas Layout Panel (Slides in from the right edge smoothly) */}
        <aside
          aria-label="Learning Canvas Panel"
          className={`shrink-0 h-full bg-white flex flex-col z-10 overflow-hidden canvas-panel ${
            canvasOpen && canvasData ? 'canvas-panel-open border-l border-gray-200 shadow-xl md:shadow-none' : 'border-l-0'
          }`}
        >
          {canvasData && (
            <LearningCanvas
              data={canvasData}
              isOpen={canvasOpen}
              onClose={() => setCanvasOpen(false)}
            />
          )}
        </aside>
      </div>

      <InitialQuestionsModal
        isOpen={showInitialModal}
        onClose={() => setShowInitialModal(false)}
        onSkip={() => setShowInitialModal(false)}
        onSubmit={handleInitialQuestionsSubmit}
      />

      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={handleContinueLater}
        onDevBypass={handleDevBypass}
      />

      {!canvasOpen && (
        <Mascot 
          message={mascotMessage} 
          mood={mascotMood}
          showChat={true}
        />
      )}
    </MainLayout>
  );
}
