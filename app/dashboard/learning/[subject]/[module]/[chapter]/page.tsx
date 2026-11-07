'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { ChapterActions } from '@/components/lesson/ChapterActions';
import { ChapterBody } from '@/components/lesson/ChapterBody';
import { ChapterSidebar } from '@/components/lesson/ChapterSidebar';
import { useCompletedChapters } from '@/components/lesson/useCompletedChapters';
import { chapterData, moduleNames } from '@/lib/learning/chapterData';

export default function ChapterContentPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string || 'matematika';
  const moduleId = params.module as string || 'aljabar-dasar';
  const chapterId = params.chapter as string;

  const chapters = chapterData[subject]?.[moduleId] || [];
  const moduleTitle = moduleNames[subject]?.[moduleId] || moduleId;

  const currentChapterId = chapterId || (chapters[0]?.id ?? '');
  const currentChapter = chapters.find((c) => c.id === currentChapterId) || chapters[0];

  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const { completedChapters, markCompleted } = useCompletedChapters(chapters);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === false,
    }));
  };

  const handleComplete = () => {
    setIsCompleted(true);
    markCompleted(currentChapter?.id || '');
  };

  const handleStartQuiz = () => {
    router.push(`/dashboard/learning/${subject}/${moduleId}/${currentChapter?.id}/quiz`);
  };

  const handleChapterClick = (id: string) => {
    router.push(`/dashboard/learning/${subject}/${moduleId}/${id}`);
  };

  const handleBackToSubject = () => {
    router.push(`/dashboard/learning/${subject}`);
  };

  if (!currentChapter) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-ink">Bab Tidak Ditemukan</h2>
        <p className="mb-4 text-lg text-ink-soft">Bab yang kamu cari tidak tersedia.</p>
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
    );
  }

  const currentIndex = chapters.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="flex h-full">
      <ChapterSidebar
        chapters={chapters}
        currentChapterId={currentChapter.id}
        completedChapters={completedChapters}
        moduleTitle={moduleTitle}
        onBack={handleBackToSubject}
        onSelect={handleChapterClick}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl p-4 md:p-8">
          <nav aria-label="Jejak halaman" className="mb-4 flex flex-wrap items-center gap-x-2 text-base text-ink-soft md:mb-6">
            <button
              type="button"
              onClick={handleBackToSubject}
              className="focus-pop min-h-11 rounded-md text-accent hover:text-accent-ink"
            >
              ← Kembali
            </button>
            <span aria-hidden="true">/</span>
            <span>{moduleTitle}</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-ink">{currentChapter.title}</span>
          </nav>

          <h1 className="mb-4 text-3xl font-bold text-ink md:mb-6">{currentChapter.title}</h1>

          <ChapterBody
            content={currentChapter.content}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
          />

          <ChapterActions
            isCompleted={isCompleted}
            prevChapter={prevChapter}
            nextChapter={nextChapter}
            onComplete={handleComplete}
            onStartQuiz={handleStartQuiz}
            onSelectChapter={handleChapterClick}
          />
        </div>
      </div>
    </div>
  );
}
