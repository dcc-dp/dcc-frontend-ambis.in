'use client';

import { useState } from 'react';
import { InitialQuestionsModal } from '@/components/Modal/InitialQuestionsModal';
import Mascot from '@/components/Mascot/Mascot';
import { ChatView } from '@/components/learning-path/ChatView';
import { HistoryModal } from '@/components/learning-path/HistoryModal';
import { QuizView } from '@/components/learning-path/QuizView';
import { RoadmapView } from '@/components/learning-path/RoadmapView';
import { Button } from '@/components/ui';
import { useLearningPathPage } from '@/hooks/useLearningPathPage';

function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default function LearningPathsPage() {
  const [showHistory, setShowHistory] = useState(false);
  const page = useLearningPathPage();
  const { chat, learningPathData, currentStep, currentQuizStep } = page;
  const isQuizMode = page.isDiagnosticMode || page.isPracticeMode;

  const handleNewChat = () => {
    chat.handleNewChat();
    page.setShowRoadmap(false);
  };

  return (
    <div className="flex flex-col">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 pt-4">
        <h1 className="text-2xl font-bold text-ink">Jalur belajar</h1>
        <div className="flex flex-wrap items-center gap-2">
          {!learningPathData && (
            <Button size="sm" onClick={() => page.setShowInitialModal(true)}>
              Atur jalur belajar
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => setShowHistory(true)}>
            <HistoryIcon />
            Riwayat belajar
          </Button>
        </div>
      </div>

      {page.isDiagnosticMode && (
        <QuizView
          questions={page.diagnosticExercises}
          conceptTitle={learningPathData?.subtopic || 'Pecahan'}
          isDiagnostic={true}
          onComplete={page.handleDiagnosticComplete}
          onClose={page.handleCloseDiagnostic}
        />
      )}

      {page.isPracticeMode && currentQuizStep && (
        <QuizView
          questions={page.practiceExercises}
          conceptTitle={currentQuizStep.title}
          isDiagnostic={false}
          onComplete={page.handlePracticeComplete}
          onClose={page.handleClosePractice}
        />
      )}

      {!isQuizMode && page.showRoadmap && learningPathData && (
        <RoadmapView
          data={learningPathData}
          currentStep={currentStep}
          progressPercent={page.progressPercent}
          isFetchingExercises={page.isFetchingExercises}
          notice={page.diagnosticNotice}
          onStartDiagnostic={page.handleStartDiagnostic}
          onEnterStep={page.handleEnterStepChat}
          onTakeQuiz={page.handleTakePracticeQuiz}
        />
      )}

      {!isQuizMode && (!page.showRoadmap || !learningPathData) && (
        <ChatView
          data={learningPathData}
          currentStep={currentStep}
          messages={chat.messages}
          message={chat.message}
          isLoading={chat.isLoading}
          quickPrompts={chat.quickPrompts}
          onMessageChange={chat.setMessage}
          onSendMessage={chat.handleSendMessage}
          onTakeQuiz={page.handleTakePracticeQuiz}
          onShowRoadmap={() => page.setShowRoadmap(true)}
        />
      )}

      <HistoryModal
        open={showHistory}
        chats={chat.chatHistory}
        onClose={() => setShowHistory(false)}
        onNewChat={handleNewChat}
        onSelectChat={chat.handleSelectChat}
      />
      <InitialQuestionsModal
        isOpen={page.showInitialModal}
        onClose={() => page.setShowInitialModal(false)}
        onSkip={() => page.setShowInitialModal(false)}
        onSubmit={page.handleInitialQuestionsSubmit}
      />
      {!isQuizMode && page.showRoadmap && learningPathData && (
        <Mascot message={page.mascotMessage} mood={page.mascotMood} showChat={true} />
      )}
    </div>
  );
}
