'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { isValidStudentName, loadChatHistory, MODEL_STORAGE_KEY } from '@/lib/chat/storage';
import { DEFAULT_MODEL_ID, DEFAULT_STUDENT_ID, STUDENT_PROFILE_KEY } from '@/lib/chat/types';
import { safeGet, safeSet } from '@/lib/safeStorage';
import type { ChatHistory, InitialAnswers, StudentProfile } from '@/lib/chat/types';

interface BootstrapParams {
  setChatHistory: Dispatch<SetStateAction<ChatHistory[]>>;
}

function readStoredProfile(): StudentProfile {
  let activeProfile: StudentProfile = { studentId: DEFAULT_STUDENT_ID };
  try {
    const storedProfile = safeGet(STUDENT_PROFILE_KEY);
    if (storedProfile) {
      activeProfile = { ...activeProfile, ...JSON.parse(storedProfile) };
    }
  } catch (e) {
    console.warn('Error reading student profile:', e);
  }
  if (activeProfile.name && !isValidStudentName(activeProfile.name)) {
    activeProfile.name = undefined;
    safeSet(STUDENT_PROFILE_KEY, JSON.stringify(activeProfile));
  }
  return activeProfile;
}

function syncMemoryFromDb(
  studentId: string,
  setStudentProfile: Dispatch<SetStateAction<StudentProfile>>
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
  fetch(`${baseUrl}/api/v1/chat/memory?student_id=${studentId}`)
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
          safeSet(STUDENT_PROFILE_KEY, JSON.stringify(merged));
          return merged;
        });
      }
    })
    .catch(() => {});
}

async function pushMemoryToDb(profile: StudentProfile) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    await fetch(`${baseUrl}/api/v1/chat/memory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: profile.studentId,
        name: profile.name,
        goal: profile.goal,
        topic: profile.topic,
      }),
    });
  } catch (err) {
    console.warn('Sync memory to backend skipped:', err);
  }
}

export function useChatBootstrap({ setChatHistory }: BootstrapParams) {
  const router = useRouter();
  const hasLoaded = useRef(false);
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [hasAnsweredQuestions, setHasAnsweredQuestions] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    studentId: DEFAULT_STUDENT_ID,
  });

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const history = loadChatHistory('ask');

    const savedModel = safeGet(MODEL_STORAGE_KEY);
    const isModelUsable =
      savedModel && !savedModel.includes('llama-3.3') && !savedModel.includes('compound');
    const modelId = isModelUsable ? savedModel : DEFAULT_MODEL_ID;

    const activeProfile = readStoredProfile();
    const hasCompleted = safeGet('hasCompletedInitialQuestions') === 'true';

    queueMicrotask(() => {
      setChatHistory(history);
      setSelectedModelId(modelId);
      setStudentProfile(activeProfile);
      setHasAnsweredQuestions(hasCompleted);
      setShowInitialModal(!hasCompleted);
    });
    syncMemoryFromDb(activeProfile.studentId, setStudentProfile);
  }, [setChatHistory]);

  const handleInitialQuestionsSubmit = async (answers: InitialAnswers) => {
    safeSet('hasCompletedInitialQuestions', 'true');
    safeSet('initialAnswers', JSON.stringify(answers));
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
    safeSet(STUDENT_PROFILE_KEY, JSON.stringify(updatedProfile));
    await pushMemoryToDb(updatedProfile);
  };

  const handleLearningPathClick = () => {
    if (hasAnsweredQuestions) {
      router.push('/dashboard/learning');
    } else {
      setShowInitialModal(true);
    }
  };

  return {
    hasLoaded,
    studentProfile,
    setStudentProfile,
    selectedModelId,
    setSelectedModelId,
    showInitialModal,
    setShowInitialModal,
    handleInitialQuestionsSubmit,
    handleLearningPathClick,
  };
}
