'use client';

import { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { DifficultyStep } from './initial-questions/DifficultyStep';
import { GoalStep } from './initial-questions/GoalStep';
import { StepIndicator } from './initial-questions/StepIndicator';
import { SubtopicStep } from './initial-questions/SubtopicStep';
import { TopicStep } from './initial-questions/TopicStep';
import type { Answers } from './initial-questions/data';

interface InitialQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip?: () => void;
  onSubmit: (answers: {
    name?: string;
    goal: string;
    topic: string;
    subtopic: string;
    difficulty: string;
  }) => void;
}

export function InitialQuestionsModal({
  isOpen,
  onClose,
  onSkip,
  onSubmit,
}: InitialQuestionsModalProps) {
  const [answers, setAnswers] = useState<Answers>({
    name: '',
    goal: '',
    topic: '',
    subtopic: '',
    difficulty: '',
  });
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const update = (patch: Partial<Answers>) => setAnswers((prev) => ({ ...prev, ...patch }));

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSubmit(answers);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onClose();
    onSkip?.();
  };

  const canProceed =
    (step === 0 && answers.goal !== '') ||
    (step === 1 && answers.topic !== '') ||
    (step === 2 && answers.subtopic !== '') ||
    (step === 3 && answers.difficulty !== '');

  const footer = (
    <>
      <Button variant="secondary" onClick={step === 0 ? handleSkip : handleBack}>
        {step === 0 ? 'Lewati' : 'Kembali'}
      </Button>
      <Button onClick={handleNext} disabled={!canProceed}>
        {step === 3 ? 'Mulai Belajar!' : 'Lanjut'}
      </Button>
    </>
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Mari Kita Mulai!"
      description={`Langkah ${step + 1} dari 4`}
      footer={footer}
    >
      <StepIndicator step={step} total={4} />
      {step === 0 && <GoalStep answers={answers} update={update} />}
      {step === 1 && <TopicStep answers={answers} update={update} />}
      {step === 2 && <SubtopicStep answers={answers} update={update} />}
      {step === 3 && <DifficultyStep answers={answers} update={update} />}
    </Modal>
  );
}
