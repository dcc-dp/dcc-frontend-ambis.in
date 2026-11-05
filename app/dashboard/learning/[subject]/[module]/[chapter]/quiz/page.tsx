'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { QuizQuestionCard } from '@/components/lesson/QuizQuestionCard';
import { QuizResult } from '@/components/lesson/QuizResult';
import { chapterNames, quizData } from '@/lib/learning/quizData';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const subject = params.subject as string;
  const moduleId = params.module as string;
  const chapterId = params.chapter as string;

  const questions = quizData[chapterId] || [];
  const chapterTitle = chapterNames[chapterId] || chapterId;

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Harap jawab semua soal terlebih dahulu!');
      return;
    }
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleBackToChapter = () => {
    router.push(`/dashboard/learning/${subject}/${moduleId}/${chapterId}`);
  };

  const calculateScore = () => {
    if (!isSubmitted) return 0;
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= 70;

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="mb-2 text-2xl font-bold text-ink">Quiz Tidak Tersedia</h2>
        <p className="mb-4 text-lg text-ink-soft">Quiz untuk chapter ini belum tersedia.</p>
        <Button onClick={handleBackToChapter}>Kembali ke Chapter</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 pb-16 md:p-8">
      <div className="mb-6 md:mb-8">
        <Button variant="ghost" size="sm" onClick={handleBackToChapter} className="mb-3 md:mb-4">
          ← Kembali ke Chapter
        </Button>
        <h1 className="mb-2 text-3xl font-bold text-ink">Quiz: {chapterTitle}</h1>
        <p className="text-lg text-ink-soft">
          Jawab semua soal di bawah ini. Nilai minimum untuk lulus adalah 70%.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, qIdx) => (
          <QuizQuestionCard
            key={question.id}
            question={question}
            index={qIdx}
            selectedAnswer={answers[question.id]}
            isSubmitted={isSubmitted}
            onSelect={handleAnswerSelect}
          />
        ))}
      </div>

      {!isSubmitted ? (
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit Jawaban ({Object.keys(answers).length}/{questions.length} terjawab)
          </Button>
        </div>
      ) : (
        <QuizResult
          score={score}
          passed={passed}
          onRetake={handleRetake}
          onBackToChapter={handleBackToChapter}
          onContinue={() => router.push(`/dashboard/learning/${subject}`)}
        />
      )}
    </div>
  );
}
