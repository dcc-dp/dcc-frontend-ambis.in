'use client';

import { useEffect, useRef, useState } from 'react';
import type { ExerciseItem } from '@/components/learning/Quiz';
import { useLearningPathChat } from '@/hooks/useLearningPathChat';
import { requestDynamicRoadmap } from '@/lib/learning-path/api';
import {
  DEFAULT_PECAHAN_CONCEPT_ID,
  loadChatHistory,
  loadLearningPathData,
  saveChatHistory,
  saveLearningPathData,
  updateStudentProgressStorage,
} from '@/lib/learning-path/storage';
import type { InitialAnswers, LearningPathData, MascotMood, RoadmapStep } from '@/lib/learning-path/types';

export function useLearningPathPage() {
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [learningPathData, setLearningPathData] = useState<LearningPathData | null>(null);
  const [mascotMessage, setMascotMessage] = useState('Selamat datang di Jalur Belajar!');
  const [mascotMood, setMascotMood] = useState<MascotMood>('waving');
  const [showRoadmap, setShowRoadmap] = useState(true);

  const [isDiagnosticMode, setIsDiagnosticMode] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentQuizStep, setCurrentQuizStep] = useState<RoadmapStep | null>(null);
  const [diagnosticExercises, setDiagnosticExercises] = useState<ExerciseItem[]>([]);
  const [practiceExercises, setPracticeExercises] = useState<ExerciseItem[]>([]);
  const [isFetchingExercises, setIsFetchingExercises] = useState(false);

  const chat = useLearningPathChat({ learningPathData, setMascotMessage, setMascotMood });
  const { chatHistory, setChatHistory, isSaving, loadProactiveLessonIntro } = chat;

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;
    const history = loadChatHistory('learning-path');
    const pathData = loadLearningPathData();
    queueMicrotask(() => {
      setChatHistory(history);
      if (!pathData) {
        setShowInitialModal(true);
        return;
      }
      setLearningPathData(pathData);
      setMascotMessage(`Kamu sedang belajar ${pathData.subtopic}. Kak Ambis siap menemanimu dari konsep awal sampai mahir!`);
    });
  }, [setChatHistory]);

  useEffect(() => {
    if (!hasLoaded.current || isSaving.current) return;
    saveChatHistory(chatHistory);
  }, [chatHistory, isSaving]);

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

  const handleInitialQuestionsSubmit = async (answers: InitialAnswers) => {
    localStorage.setItem('hasCompletedInitialQuestions', 'true');
    localStorage.setItem('initialAnswers', JSON.stringify(answers));
    setShowInitialModal(false);

    const conceptId = answers.subtopic === 'pecahan' ? DEFAULT_PECAHAN_CONCEPT_ID : '00000000-0000-0000-0000-000000000201';

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
    setMascotMessage(`Roadmap untuk ${answers.subtopic} sudah dibuat! Yuk mulai dengan tes diagnostik awal.`);
    setMascotMood('happy');

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
      setMascotMessage('Yuk kerjakan tes diagnostik singkat ini dengan jujur ya! Kak Ambis akan menganalisis pemahamanmu.');
      setMascotMood('thinking');
    } else {
      alert('Belum ada soal diagnostik yang tersedia untuk konsep ini.');
    }
  };

  const handleDiagnosticComplete = async (finalMastery: number, misconceptions: string[]) => {
    if (!learningPathData) return;

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

    setMascotMessage(`Asesmen diagnostik selesai! Penguasaan awalmu: ${finalMastery}%. Roadmap belajar telah dipersonalisasi oleh AI!`);
    setMascotMood('happy');
  };

  const handleCloseDiagnostic = () => {
    setIsDiagnosticMode(false);
    setShowRoadmap(true);
  };

  const handleEnterStepChat = (step: RoadmapStep) => {
    if (!learningPathData) return;
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
    setMascotMessage(`Waktunya latihan terbimbing pada tahap: ${step.title}! Semangat, ada Kak Ambis yang dampingi!`);
  };

  const handlePracticeComplete = (finalMastery: number) => {
    if (!learningPathData || !currentQuizStep) return;

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

    setMascotMessage(`Hebat sekali! Latihan ${currentQuizStep.title} selesai! Mastery-mu sekarang ${finalMastery}%!`);
    setMascotMood('happy');
  };

  const handleClosePractice = () => {
    setIsPracticeMode(false);
    setCurrentQuizStep(null);
    setShowRoadmap(true);
  };

  const currentStep = learningPathData?.roadmap.find((s) => s.current);
  const completedCount = learningPathData?.roadmap.filter((s) => s.completed).length || 0;
  const totalCount = learningPathData?.roadmap.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return {
    chat,
    showInitialModal,
    setShowInitialModal,
    learningPathData,
    mascotMessage,
    mascotMood,
    showRoadmap,
    setShowRoadmap,
    isDiagnosticMode,
    isPracticeMode,
    currentQuizStep,
    diagnosticExercises,
    practiceExercises,
    isFetchingExercises,
    currentStep,
    progressPercent,
    handleInitialQuestionsSubmit,
    handleStartDiagnostic,
    handleDiagnosticComplete,
    handleCloseDiagnostic,
    handleEnterStepChat,
    handleTakePracticeQuiz,
    handlePracticeComplete,
    handleClosePractice,
  };
}
