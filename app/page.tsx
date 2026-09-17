'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ChatContainer from '@/components/Chat/ChatContainer';
import { InitialQuestionsModal } from '@/components/Modal/InitialQuestionsModal';
import { LoginPromptModal } from '@/components/Modal/LoginPromptModal';
import Mascot from '@/components/Mascot/Mascot';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  type: 'ask' | 'learning-path';
}

const CHAT_HISTORY_KEY = 'ambisin_chat_history';

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
  const [mascotMessage, setMascotMessage] = useState('Halo! Saya asisten belajar Anda 🎓');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'waving' | 'idle'>('waving');
  const hasLoaded = useRef(false);
  const isSaving = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const history = loadChatHistory('ask');
    setChatHistory(history);

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

  const handleInitialQuestionsSubmit = (answers: { goal: string; topic: string; subtopic: string; difficulty: string }) => {
    localStorage.setItem('hasCompletedInitialQuestions', 'true');
    localStorage.setItem('initialAnswers', JSON.stringify(answers));
    setHasAnsweredQuestions(true);
    setShowInitialModal(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (isBlocked && !devBypassLimit) {
      setShowLoginModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      createdAt: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentMessage = message;
    setMessage('');
    setIsLoading(true);
    setChatCount((prev) => prev + 1);

    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) {
      setCurrentChatId(chatId);
      const title = message.slice(0, 40) + (message.length > 40 ? '...' : '');
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/v1/ask/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentMessage,
          mode: 'general',
        }),
      });

      let assistantText = '';
      if (response.ok) {
        const data = await response.json();
        assistantText = data.answer || 'Halo! Kak Ambis siap membantu belajarmu.';
        setMascotMood('happy');
        setMascotMessage('Semoga penjelasan Kak Ambis membantu ya! 🌟');
      } else {
        assistantText = 'Maaf, terjadi kendala saat menghubungi Kak Ambis. Silakan coba lagi ya!';
        setMascotMood('idle');
        setMascotMessage('Ada kendala sebentar, coba lagi ya.');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantText,
        createdAt: new Date(),
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
        content: 'Maaf, Kak Ambis sedang offline atau tidak bisa dihubungi saat ini. Pastikan backend aktif ya!',
        createdAt: new Date(),
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setIsLoading(false);
      setMascotMood('idle');
      setMascotMessage('Yuk coba kirim lagi nanti.');
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setChatCount(0);
    setShowLoginModal(false);
    setMessage('');
    setCurrentChatId(null);
    setIsBlocked(false);
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
      <div className="flex flex-col h-full">
        {/* Header info - only show when no messages */}
        {messages.length === 0 && (
          <div className="text-center py-4 md:py-6 px-4 flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Halo! Apa yang ingin kamu lakukan hari ini?
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">
              Pilih fitur atau langsung ketik pesan di bawah
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
                className="flex-1 max-w-sm mx-auto sm:mx-0 w-full sm:w-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-120 p-4 sm:p-6 border border-gray-200 hover:border-blue-300 group"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                  💬
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Tanya Apapun</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
                  Bertanya tentang topik apapun yang kamu inginkan
                </p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs sm:text-sm font-medium group-hover:bg-blue-700 transition-colors">
                  ?
                </div>
              </button>

              <button
                onClick={handleLearningPathClick}
                className="flex-1 max-w-sm mx-auto sm:mx-0 w-full sm:w-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-120 p-4 sm:p-6 border border-purple-300 hover:border-purple-400 group"
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                  📚
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Learning Path</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4">
                  Program belajar terstruktur Matematika & Informatika
                </p>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs sm:text-sm font-medium group-hover:bg-purple-700 transition-colors">
                  📖
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Dev Mode Switch Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-y border-gray-200/70 bg-gray-50/90 text-xs text-gray-500 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-gray-600 font-medium text-[11px]">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Chat Belajar Interaktif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-500">⚡ Mode Dev:</span>
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

        {/* Chat Container - Shared Component */}
        <ChatContainer
          messages={messages}
          message={message}
          isLoading={isLoading}
          mode="ask"
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
        />
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

      <Mascot 
        message={mascotMessage} 
        mood={mascotMood}
        showChat={true}
      />
    </MainLayout>
  );
}
