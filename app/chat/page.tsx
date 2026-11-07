'use client';

import ChatContainer from '@/components/Chat/ChatContainer';
import { CanvasPanel } from '@/components/chat-page/CanvasPanel';
import { ChatStatusBar } from '@/components/chat-page/ChatStatusBar';
import { FeatureCards } from '@/components/chat-page/FeatureCards';
import { WelcomeHero } from '@/components/chat-page/WelcomeHero';
import MainLayout from '@/components/Layout/MainLayout';
import Mascot from '@/components/Mascot/Mascot';
import { InitialQuestionsModal } from '@/components/Modal/InitialQuestionsModal';
import { LoginPromptModal } from '@/components/Modal/LoginPromptModal';
import { useChatPage } from '@/hooks/useChatPage';

export default function HomePage() {
  const chat = useChatPage();
  const { profile, limit } = chat;
  const isEmpty = chat.messages.length === 0;

  return (
    <MainLayout
      onNewChat={chat.handleNewChat}
      onSelectChat={chat.handleSelectChat}
      onLearningPathClick={profile.handleLearningPathClick}
      chats={chat.sidebarChats}
    >
      <div className="flex h-full w-full overflow-hidden relative">
        <div className="flex-1 flex flex-col h-full min-w-0">
          {isEmpty && <WelcomeHero name={profile.studentProfile.name} />}
          {isEmpty && (
            <FeatureCards onLearningPathClick={profile.handleLearningPathClick} />
          )}
          <ChatStatusBar
            profileName={profile.studentProfile.name}
            canReopenCanvas={Boolean(chat.canvasData) && !chat.canvasOpen}
            devBypassLimit={limit.devBypassLimit}
            onReopenCanvas={() => chat.setCanvasOpen(true)}
            onToggleBypass={limit.handleToggleBypass}
          />
          <div className="flex-1 min-h-0 flex flex-col">
            <ChatContainer
              messages={chat.messages}
              message={chat.message}
              isLoading={chat.isLoading}
              mode="ask"
              onMessageChange={chat.setMessage}
              onSendMessage={chat.handleSendMessage}
              selectedModelId={profile.selectedModelId}
              onModelChange={profile.setSelectedModelId}
              onOpenCanvas={chat.openCanvas}
            />
          </div>
        </div>
        <CanvasPanel
          data={chat.canvasData}
          isOpen={chat.canvasOpen}
          onClose={() => chat.setCanvasOpen(false)}
        />
      </div>

      <InitialQuestionsModal
        isOpen={profile.showInitialModal}
        onClose={() => profile.setShowInitialModal(false)}
        onSkip={() => profile.setShowInitialModal(false)}
        onSubmit={profile.handleInitialQuestionsSubmit}
      />

      <LoginPromptModal
        isOpen={limit.showLoginModal}
        onClose={limit.handleContinueLater}
        onDevBypass={limit.handleDevBypass}
      />

      {!chat.canvasOpen && (
        <Mascot message={chat.mascotMessage} mood={chat.mascotMood} showChat={true} />
      )}
    </MainLayout>
  );
}
