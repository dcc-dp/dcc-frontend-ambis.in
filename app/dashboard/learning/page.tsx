'use client';

import { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import ChatContainer from '@/components/Chat/ChatContainer';
import { InitialQuestionsModal } from '@/components/Modal/InitialQuestionsModal';
import Mascot from '@/components/Mascot/Mascot';
import Quiz, { ExerciseItem } from '@/components/learning/Quiz';

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

const CHAT_HISTORY_KEY = 'ambisin_chat_history';
const LEARNING_PATH_DATA_KEY = 'ambisin_learning_path_data';
const STUDENT_PROGRESS_KEY = 'ambisin_student_progress';
const DEFAULT_PECAHAN_CONCEPT_ID = '00000000-0000-0000-0000-000000000203';

function loadChatHistory(filterType?: 'ask' | 'learning-path'): ChatHistory[] {
  try {
    const stored = localStorage.getItem(CHAT_HISTORY_KEY);
    if (stored) {
      const parsed: ChatHistory[] = JSON.parse(stored);
      const chats = parsed.map((chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) })),
      }));
      return filterType ? chats.filter((c) => c.type === filterType) : chats;
    }
  } catch { /* ignore */ }
  return [];
}

function saveChatHistory(history: ChatHistory[]) {
  try { localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history)); } catch { /* ignore */ }
}

function loadLearningPathData(): LearningPathData | null {
  try {
    const stored = localStorage.getItem(LEARNING_PATH_DATA_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function saveLearningPathData(data: LearningPathData) {
  localStorage.setItem(LEARNING_PATH_DATA_KEY, JSON.stringify(data));
}

function updateStudentProgressStorage(conceptId: string, conceptName: string, newScore: number) {
  try {
    const stored = localStorage.getItem(STUDENT_PROGRESS_KEY);
    let list: any[] = stored ? JSON.parse(stored) : [];
    const index = list.findIndex((c: any) => c.id === conceptId);
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

function generateInitialRoadmap(subtopic: string): RoadmapStep[] {
  if (subtopic === 'pecahan') {
    return [
      {
        id: 'step-1',
        title: 'Pecahan Senilai',
        description: 'Fondasi memahami representasi pecahan senilai sebelum operasi hitung.',
        type: 'lesson',
        completed: false,
        current: true,
        hasQuiz: false,
      },
      {
        id: 'step-2',
        title: 'KPK Penyebut',
        description: 'Menentukan Kelipatan Persekutuan Terkecil untuk menyamakan penyebut berbeda.',
        type: 'lesson',
        completed: false,
        current: false,
        hasQuiz: false,
      },
      {
        id: 'step-3',
        title: 'Penjumlahan Pecahan Berpenyebut Beda',
        description: 'Materi inti: menyamakan penyebut pecahan lalu menjumlahkan pembilang.',
        type: 'lesson',
        completed: false,
        current: false,
        hasQuiz: false,
      },
      {
        id: 'step-4',
        title: 'Latihan Terbimbing (Scaffolding)',
        description: 'Latihan soal berjenjang didampingi panduan adaptif dari Kak Ambis.',
        type: 'practice',
        completed: false,
        current: false,
        hasQuiz: true,
      },
      {
        id: 'step-5',
        title: 'Evaluasi & Uji Pemahaman',
        description: 'Uji pemahaman akhir dan kenaikan level penguasaan konsep.',
        type: 'checkpoint',
        completed: false,
        current: false,
        hasQuiz: true,
      },
    ];
  }

  return [
    { id: 'step-1', title: 'Pengenalan Konsep', description: 'Dasar dan definisi topik', type: 'lesson', completed: false, current: true, hasQuiz: false },
    { id: 'step-2', title: 'Teori Fundamental', description: 'Prinsip dan rumus utama', type: 'lesson', completed: false, current: false, hasQuiz: false },
    { id: 'step-3', title: 'Latihan Terbimbing', description: 'Latihan soal pemula & menengah', type: 'practice', completed: false, current: false, hasQuiz: true },
    { id: 'step-4', title: 'Aplikasi Nyata', description: 'Penerapan soal cerita kontekstual', type: 'lesson', completed: false, current: false, hasQuiz: false },
    { id: 'step-5', title: 'Evaluasi Akhir', description: 'Review & evaluasi pemahaman', type: 'checkpoint', completed: false, current: false, hasQuiz: true },
  ];
}

export default function LearningPathsPage() {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [learningPathData, setLearningPathData] = useState<LearningPathData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState('Selamat datang di Learning Path! 🎓');
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'waving' | 'idle'>('waving');
  const [showRoadmap, setShowRoadmap] = useState(true);

  // Quick Prompt Chips & Proactive Intro
  const [quickPrompts, setQuickPrompts] = useState<string[]>([]);
  const [hasLoadedIntroForStep, setHasLoadedIntroForStep] = useState<string | null>(null);

  // Diagnostic & Practice Quiz State
  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentQuizStep, setCurrentQuizStep] = useState<RoadmapStep | null>(null);
  const [diagnosticExercises, setDiagnosticExercises] = useState<ExerciseItem[]>([]);
  const [practiceExercises, setPracticeExercises] = useState<ExerciseItem[]>([]);
  const [isFetchingExercises, setIsFetchingExercises] = useState(false);

  const hasLoaded = useRef(false);
  const isSaving = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const history = loadChatHistory('learning-path');
    setChatHistory(history);
    const pathData = loadLearningPathData();
    if (pathData) {
      setLearningPathData(pathData);
      setMascotMessage(`Kamu sedang belajar ${pathData.subtopic}. Kak Ambis siap menemanimu dari konsep awal sampai mahir! 💡`);
    } else {
      setShowInitialModal(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current || isSaving.current) return;
    saveChatHistory(chatHistory);
  }, [chatHistory]);

  const fetchCurriculumExercises = async (conceptId: string, isDiagnostic: boolean): Promise<ExerciseItem[]> => {
    try {
      setIsFetchingExercises(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const response = await fetch(
        `${baseUrl}/api/v1/curriculum/concepts/${conceptId}/exercises?is_diagnostic=${isDiagnostic}`
      );
      if (response.ok) {
        const data: ExerciseItem[] = await response.json();
        return data;
      }
    } catch (err) {
      console.error('Error fetching curriculum exercises:', err);
    } finally {
      setIsFetchingExercises(false);
    }
    return [];
  };

  const requestDynamicRoadmap = async (
    topic: string,
    subtopic: string,
    goal: string,
    difficulty: string,
    diagnosticScore?: number,
    misconceptions?: string[]
  ) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const res = await fetch(`${baseUrl}/api/v1/learning-paths/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          subtopic,
          goal,
          difficulty,
          diagnostic_score: diagnosticScore,
          misconceptions,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const steps: RoadmapStep[] = data.steps.map((s: any, idx: number) => ({
          id: s.id || `step-${idx + 1}`,
          title: s.title,
          description: s.description,
          type: s.type || 'lesson',
          completed: false,
          current: idx === 0,
          hasQuiz: Boolean(s.has_quiz),
          recommendedBadge: s.recommended_badge || undefined,
        }));
        return {
          steps,
          reasoning: data.reasoning,
          isFallback: data.is_fallback,
          message: data.message,
        };
      }
    } catch (err) {
      console.error('Failed to call generate-roadmap:', err);
    }

    // Default fallback
    return {
      steps: generateInitialRoadmap(subtopic),
      reasoning: 'Roadmap terstruktur disusun berdasarkan kurikulum acuan.',
      isFallback: true,
      message: 'Maaf ya, Kak Ambis sedang mengalami sedikit kendala koneksi ke server AI saat menyusun roadmap otomatis. Untuk sementara, Kak Ambis siapkan rekomendasi kurikulum standar ini ya!',
    };
  };

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

    // Friendly fallback if offline / error
    const fallbackMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Halo! Selamat datang di tahap **${step.title}**! 👋\n\nDi tahap ini kita akan membahas: ${step.description}.\n\n*Maaf ya, Kak Ambis sedang sedikit kesulitan terhubung ke server AI saat menyiapkan pembuka otomatis. Tapi tenang, kamu bisa klik saran pertanyaan cepat di bawah atau langsung tanya ke Kak Ambis!* 💡`,
      createdAt: new Date(),
    };
    setMessages((prev) => (prev.length === 0 ? [fallbackMsg] : prev));
    setQuickPrompts([
      'Beri contoh soal sederhana',
      'Jelaskan konsep ini lebih santai',
      'Aku sudah paham, mau latihan',
    ]);
  };

  const handleInitialQuestionsSubmit = async (answers: {
    goal: string;
    topic: string;
    subtopic: string;
    difficulty: string;
  }) => {
    localStorage.setItem('hasCompletedInitialQuestions', 'true');
    localStorage.setItem('initialAnswers', JSON.stringify(answers));
    setShowInitialModal(false);

    const conceptId = answers.subtopic === 'pecahan' ? DEFAULT_PECAHAN_CONCEPT_ID : '00000000-0000-0000-0000-000000000201';
    
    // Request initial AI roadmap
    const aiRoadmap = await requestDynamicRoadmap(
      answers.topic,
      answers.subtopic,
      answers.goal,
      answers.difficulty
    );

    const pathData: LearningPathData = {
      ...answers,
      conceptId,
      diagnosticCompleted: false,
      roadmap: aiRoadmap.steps,
      roadmapReasoning: aiRoadmap.reasoning,
      aiMessage: aiRoadmap.isFallback ? aiRoadmap.message : undefined,
    };

    setLearningPathData(pathData);
    saveLearningPathData(pathData);
    setShowRoadmap(true);
    setMascotMessage(`Roadmap untuk ${answers.subtopic} sudah dibuat! Yuk mulai dengan tes diagnostik awal 🚀`);
    setMascotMood('happy');

    // Pre-fetch diagnostic exercises
    const diag = await fetchCurriculumExercises(conceptId, true);
    setDiagnosticExercises(diag);
  };

  const handleStartDiagnostic = async () => {
    if (!learningPathData) return;
    let exercises = diagnosticExercises;
    if (exercises.length === 0) {
      exercises = await fetchCurriculumExercises(learningPathData.conceptId, true);
      setDiagnosticExercises(exercises);
    }
    if (exercises.length > 0) {
      setIsDiagnosticMode(true);
      setShowRoadmap(false);
      setMascotMessage('Yuk kerjakan tes diagnostik singkat ini dengan jujur ya! Kak Ambis akan menganalisis pemahamanmu. 🔍');
      setMascotMood('thinking');
    } else {
      alert('Belum ada soal diagnostik yang tersedia untuk konsep ini.');
    }
  };

  const handleDiagnosticComplete = async (finalMastery: number, misconceptions: string[]) => {
    if (!learningPathData) return;

    // Call dynamic roadmap generation with diagnostic assessment findings
    const aiRoadmap = await requestDynamicRoadmap(
      learningPathData.topic,
      learningPathData.subtopic,
      learningPathData.goal,
      learningPathData.difficulty,
      finalMastery,
      misconceptions
    );

    const updatedData: LearningPathData = {
      ...learningPathData,
      diagnosticCompleted: true,
      diagnosticScore: finalMastery,
      misconceptions,
      roadmap: aiRoadmap.steps,
      roadmapReasoning: aiRoadmap.reasoning,
      aiMessage: aiRoadmap.isFallback ? aiRoadmap.message : undefined,
    };

    setLearningPathData(updatedData);
    saveLearningPathData(updatedData);
    updateStudentProgressStorage('pecahan', 'Pecahan', finalMastery);

    setMascotMessage(`Asesmen diagnostik selesai! Penguasaan awalmu: ${finalMastery}%. Roadmap belajar telah dipersonalisasi oleh AI! 🌟`);
    setMascotMood('happy');
  };

  const handleCloseDiagnostic = () => {
    setIsDiagnosticMode(false);
    setShowRoadmap(true);
  };

  const handleEnterStepChat = (step: RoadmapStep) => {
    if (!learningPathData) return;
    // Set step as current
    const updatedRoadmap = learningPathData.roadmap.map((s) => ({
      ...s,
      current: s.id === step.id,
    }));
    const updatedData = { ...learningPathData, roadmap: updatedRoadmap };
    setLearningPathData(updatedData);
    saveLearningPathData(updatedData);

    setShowRoadmap(false);
    loadProactiveLessonIntro(step, learningPathData.subtopic);
  };

  const handleTakePracticeQuiz = async (step: RoadmapStep) => {
    if (!learningPathData) return;
    setCurrentQuizStep(step);
    const exercises = await fetchCurriculumExercises(learningPathData.conceptId, false);
    setPracticeExercises(exercises);
    setIsPracticeMode(true);
    setShowRoadmap(false);
    setMascotMessage(`Waktunya latihan terbimbing pada tahap: ${step.title}! Semangat, ada Kak Ambis yang dampingi! 💪`);
  };

  const handlePracticeComplete = (finalMastery: number) => {
    if (!learningPathData || !currentQuizStep) return;

    // Advance roadmap step
    const currentIndex = learningPathData.roadmap.findIndex((s) => s.id === currentQuizStep.id);
    const updatedRoadmap = learningPathData.roadmap.map((step, idx) => {
      if (step.id === currentQuizStep.id) {
        return { ...step, completed: true, current: false };
      }
      if (idx === currentIndex + 1) {
        return { ...step, current: true };
      }
      return step;
    });

    const updatedData: LearningPathData = {
      ...learningPathData,
      roadmap: updatedRoadmap,
    };

    setLearningPathData(updatedData);
    saveLearningPathData(updatedData);
    updateStudentProgressStorage('pecahan', 'Pecahan', finalMastery);

    setMascotMessage(`Hebat sekali! Latihan ${currentQuizStep.title} selesai! Mastery-mu sekarang ${finalMastery}%! 🎉`);
    setMascotMood('happy');
  };

  const handleClosePractice = () => {
    setIsPracticeMode(false);
    setCurrentQuizStep(null);
    setShowRoadmap(true);
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

  const handleNewChat = () => { window.location.href = '/'; };
  const handleSelectChat = (chatId: string) => { const chat = chatHistory.find((c) => c.id === chatId); if (chat) { setMessages(chat.messages); setCurrentChatId(chat.id); } };
  const handleLearningPathClick = () => {};

  const currentStep = learningPathData?.roadmap.find((s) => s.current);
  const completedCount = learningPathData?.roadmap.filter((s) => s.completed).length || 0;
  const totalCount = learningPathData?.roadmap.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

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
      closeSidebarOnMount={true}
    >
      <div className="flex flex-col h-full">
        {/* VIEW 1: Diagnostic Assessment Mode */}
        {isDiagnosticMode && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleCloseDiagnostic}
                className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Roadmap
              </button>
              <Quiz
                questions={diagnosticExercises}
                conceptTitle={learningPathData?.subtopic || 'Pecahan'}
                isDiagnostic={true}
                onComplete={handleDiagnosticComplete}
                onClose={handleCloseDiagnostic}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Practice & Scaffolding Quiz Mode */}
        {isPracticeMode && currentQuizStep && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleClosePractice}
                className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Roadmap
              </button>
              <Quiz
                questions={practiceExercises}
                conceptTitle={currentQuizStep.title}
                isDiagnostic={false}
                onComplete={handlePracticeComplete}
                onClose={handleClosePractice}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: Roadmap Overview Mode */}
        {!isDiagnosticMode && !isPracticeMode && showRoadmap && learningPathData && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <span>🗺️ Mode 1: Guided Learning Path</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1.5">
                  Roadmap Belajar: {learningPathData.subtopic.toUpperCase()}
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm max-w-lg mx-auto">
                  Target: {learningPathData.goal || 'Penguasaan Konsep Mandiri'} • Level:{' '}
                  {learningPathData.difficulty === 'beginner'
                    ? 'Pemula'
                    : learningPathData.difficulty === 'intermediate'
                    ? 'Menengah'
                    : 'Lanjutan'}
                </p>
              </div>

              {/* AI Reasoning / Decision Banner */}
              {learningPathData.roadmapReasoning && (
                <div className="mb-6 p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 flex items-start gap-3 shadow-2xs">
                  <span className="text-2xl shrink-0">🧠</span>
                  <div>
                    <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Analisis & Keputusan Kurikulum Personal Kak Ambis:
                    </h4>
                    <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                      {learningPathData.roadmapReasoning}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Connection Apology Banner (If fallback occurred) */}
              {learningPathData.aiMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 shadow-2xs">
                  <span className="text-2xl shrink-0">⚠️</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                      Informasi Sambungan AI:
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      {learningPathData.aiMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Diagnostic Banner (If not yet completed) */}
              {!learningPathData.diagnosticCompleted && (
                <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🔍</span>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Tes Diagnostik Belum Dikerjakan</h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Yuk kerjakan 2 soal cepat agar Kak Ambis bisa memetakan miskonsepsi dan menyusun roadmap yang pas buat kamu!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleStartDiagnostic}
                    disabled={isFetchingExercises}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition shrink-0 cursor-pointer"
                  >
                    {isFetchingExercises ? 'Memuat Soal...' : 'Mulai Tes Diagnostik ⚡'}
                  </button>
                </div>
              )}

              {/* Diagnostic Result Banner (If completed) */}
              {learningPathData.diagnosticCompleted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                        Hasil Diagnostik Berhasil Dipetakan
                      </span>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Baseline Mastery:{' '}
                        <span className="font-bold">{learningPathData.diagnosticScore || 0}%</span>. Roadmap telah dipersonalisasi AI!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleStartDiagnostic}
                    className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline cursor-pointer"
                  >
                    Ulangi Tes
                  </button>
                </div>
              )}

              {/* Roadmap Timeline */}
              <div className="relative max-w-lg mx-auto space-y-4">
                {learningPathData.roadmap.map((step, index) => {
                  const isCompleted = step.completed;
                  const isCurrent = step.current;

                  return (
                    <div key={step.id} className="relative">
                      {/* Connector line */}
                      {index < learningPathData.roadmap.length - 1 && (
                        <div className="flex justify-center -mb-2">
                          <div
                            className={`w-1 h-8 ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : isCurrent
                                ? 'bg-gradient-to-b from-blue-500 to-gray-200'
                                : 'bg-gray-200'
                            }`}
                          />
                        </div>
                      )}

                      <div
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCompleted
                            ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-sm'
                            : isCurrent
                            ? 'bg-white border-blue-500 text-gray-900 shadow-md ring-2 ring-blue-100'
                            : 'bg-white/80 border-gray-200 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isCompleted ? '✓' : index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-bold text-sm ${isCurrent ? 'text-blue-900' : ''}`}>
                                {step.title}
                              </h3>
                              {step.recommendedBadge && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                                  {step.recommendedBadge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        {/* Node Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {step.hasQuiz ? (
                            <button
                              onClick={() => handleTakePracticeQuiz(step)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                isCompleted
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : isCurrent
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              <span>{isCompleted ? 'Latihan Ulang' : 'Kerja Latihan'}</span>
                              <span>✏️</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnterStepChat(step)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                isCurrent
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <span>Pelajari Materi</span>
                              <span>💬</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Summary Card */}
              <div className="mt-8 max-w-lg mx-auto p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="font-semibold text-gray-600">Total Kemajuan Milestone</span>
                  <span className="font-bold text-gray-900">{progressPercent}% Selesai</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Bottom CTA to Chat */}
              {currentStep && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => handleEnterStepChat(currentStep)}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <span>Masuk ke Tahap: {currentStep.title}</span>
                    <span>💬</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: Interactive Chat Mode (Never Blank!) */}
        {!isDiagnosticMode && !isPracticeMode && (!showRoadmap || !learningPathData) && (
          <>
            {learningPathData && currentStep && (
              <div className="bg-white px-4 py-3 border-b border-gray-200 shadow-xs">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Step {learningPathData.roadmap.findIndex((s) => s.id === currentStep.id) + 1}
                    </span>
                    <h2 className="text-sm font-bold text-gray-900">
                      {currentStep.title} — {learningPathData.subtopic}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentStep.hasQuiz && (
                      <button
                        onClick={() => handleTakePracticeQuiz(currentStep)}
                        className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold rounded-lg text-xs transition cursor-pointer"
                      >
                        Kerjakan Soal ✏️
                      </button>
                    )}
                    <button
                      onClick={() => setShowRoadmap(true)}
                      className="px-3 py-1 text-xs text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    >
                      Lihat Roadmap 🗺️
                    </button>
                  </div>
                </div>
              </div>
            )}
            <ChatContainer
              messages={messages}
              message={message}
              isLoading={isLoading}
              mode="learning-path"
              quickPrompts={quickPrompts}
              onQuickPromptClick={(prompt) => handleSendMessage(prompt)}
              onMessageChange={setMessage}
              onSendMessage={handleSendMessage}
            />
          </>
        )}
      </div>

      <InitialQuestionsModal
        isOpen={showInitialModal}
        onClose={() => setShowInitialModal(false)}
        onSkip={() => setShowInitialModal(false)}
        onSubmit={handleInitialQuestionsSubmit}
      />
      <Mascot message={mascotMessage} mood={mascotMood} showChat={true} />
    </MainLayout>
  );
}
