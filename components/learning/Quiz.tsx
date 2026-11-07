'use client';

import { useState } from 'react';
import MathContent from '@/components/Chat/MathContent';
import { Badge, Button, Callout, Card, ProgressBar } from '@/components/ui';
import { QuizFeedback } from '@/components/learning/quiz/QuizFeedback';
import { QuizOptions } from '@/components/learning/quiz/QuizOptions';
import { QuizResult } from '@/components/learning/quiz/QuizResult';
import { buildOfflineFallback, buildServiceFallback } from '@/components/learning/quiz/fallback';
import type { AgentFeedback, QuizProps } from '@/components/learning/quiz/types';
import { getStudentId } from '@/lib/studentId';
export type { ExerciseItem } from '@/components/learning/quiz/types';

export function Quiz({
  questions,
  conceptTitle = 'Latihan Interaktif',
  isDiagnostic = false,
  onComplete,
  onClose,
}: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AgentFeedback | null>(null);
  const [attemptsPerQuestion, setAttemptsPerQuestion] = useState<Record<number, number>>({});
  const [, setCompletedQuestions] = useState<Record<number, boolean>>({});
  const [latestMastery, setLatestMastery] = useState<number>(0.3);
  const [detectedMisconceptions, setDetectedMisconceptions] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  if (!currentQuestion) {
    return (
      <Card padding="lg" className="space-y-4 text-center">
        <p className="text-lg text-ink-soft">Tidak ada soal yang tersedia saat ini.</p>
        {onClose && <Button onClick={onClose}>Kembali</Button>}
      </Card>
    );
  }

  const handleCheckAnswer = async () => {
    const answer = currentQuestion.options && currentQuestion.options.length > 0
      ? selectedOption
      : textAnswer.trim();

    if (!answer) return;
    setIsLoading(true);
    const attemptNum = (attemptsPerQuestion[currentIndex] || 0) + 1;
    setAttemptsPerQuestion((prev) => ({ ...prev, [currentIndex]: attemptNum }));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const response = await fetch(`${baseUrl}/api/v1/agent/hermes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: getStudentId(),
          exercise_id: currentQuestion.id,
          student_answer: answer,
          mode: isDiagnostic ? 'diagnostic' : 'learning_path',
          stream: false,
        }),
      });

      if (response.ok) {
        const data: AgentFeedback = await response.json();
        setFeedback(data);
        if (data.mastery !== undefined) {
          setLatestMastery(data.mastery);
        }
        if (data.misconception_code) {
          setDetectedMisconceptions((prev) =>
            prev.includes(data.misconception_code!) ? prev : [...prev, data.misconception_code!]
          );
        }
        if (data.is_correct) {
          setCompletedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
        }
      } else {
        const isCorrect = currentQuestion.correct_answer === answer;
        setFeedback(buildServiceFallback(isCorrect));
        if (isCorrect) {
          setCompletedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
        }
      }
    } catch {
      const isCorrect = currentQuestion.correct_answer === answer;
      setFeedback(buildOfflineFallback(isCorrect));
      if (isCorrect) {
        setCompletedQuestions((prev) => ({ ...prev, [currentIndex]: true }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
      if (onComplete) {
        onComplete(Math.round(latestMastery * 100), detectedMisconceptions);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTextAnswer('');
      setFeedback(null);
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setTextAnswer('');
    setFeedback(null);
  };

  if (isFinished) {
    return (
      <QuizResult
        isDiagnostic={isDiagnostic}
        conceptTitle={conceptTitle}
        masteryPercent={Math.min(Math.round(latestMastery * 100), 100)}
        misconceptions={detectedMisconceptions}
        onClose={onClose}
      />
    );
  }

  const isAnswerSelected = currentQuestion.options && currentQuestion.options.length > 0
    ? Boolean(selectedOption)
    : Boolean(textAnswer.trim());

  return (
    <Card padding="lg" className="mx-auto max-w-2xl space-y-6">
      {isDiagnostic && (
        <Callout tone="info" title="Kuis pemanasan:">
          Tidak dinilai, jadi santai saja.
        </Callout>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Badge tone="accent">
            {isDiagnostic ? 'Soal pemanasan' : 'Soal'} {currentIndex + 1} dari {questions.length}
          </Badge>
          <span className="text-base text-ink-soft">Terus coba, kamu pasti bisa</span>
        </div>
        <ProgressBar
          ratio={(currentIndex + 1) / questions.length}
          label="Kemajuan latihan"
          valueText={`Soal ${currentIndex + 1} dari ${questions.length}`}
        />
      </div>

      <div className="text-xl font-semibold leading-relaxed text-ink">
        <MathContent content={currentQuestion.question} />
      </div>

      <QuizOptions
        question={currentQuestion}
        selectedOption={selectedOption}
        textAnswer={textAnswer}
        feedback={feedback}
        onSelect={setSelectedOption}
        onTextChange={setTextAnswer}
      />

      {feedback && (
        <QuizFeedback
          feedback={feedback}
          isLastQuestion={isLastQuestion}
          onRetry={handleRetry}
          onNext={handleNext}
        />
      )}

      {!feedback && (
        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleCheckAnswer}
            disabled={!isAnswerSelected}
            loading={isLoading}
          >
            {isLoading ? 'Kak Ambis sedang mengevaluasi...' : 'Periksa Jawaban'}
          </Button>
          {onClose && (
            <Button variant="ghost" size="lg" onClick={onClose}>
              Batal
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

export default Quiz;
