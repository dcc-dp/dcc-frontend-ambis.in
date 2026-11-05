import type { ComponentProps } from 'react';
import AnswerBox from '@/components/Visual/AnswerBox';
import RichText from '@/components/Visual/RichText';
import FeedbackPanel from './FeedbackPanel';
import { exerciseMeta, type PracticeExercise } from './types';

type FeedbackProps = ComponentProps<typeof FeedbackPanel>;

interface PracticeScreenProps extends FeedbackProps {
  exercise: PracticeExercise;
  onSubmit: ComponentProps<typeof AnswerBox>['onSubmit'];
}

export default function PracticeScreen({ exercise, onSubmit, ...feedback }: PracticeScreenProps) {
  return (
    <>
      <article>
        <p className="text-sm text-ink-soft">{exerciseMeta(exercise)}</p>
        <div className="border-b border-line py-6">
          <p className="max-w-[60ch] text-xl font-semibold leading-snug text-ink sm:text-2xl">
            <RichText text={exercise.question} />
          </p>
        </div>
      </article>
      <AnswerBox
        key={exercise.id}
        kind={exercise.kind}
        options={exercise.options}
        disabled={feedback.phase === 'working'}
        onSubmit={onSubmit}
      />
      <FeedbackPanel {...feedback} />
    </>
  );
}
