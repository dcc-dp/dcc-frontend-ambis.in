import type { ReactNode } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  action: string;
  icon: ReactNode;
  iconClassName: string;
  onClick: () => void;
}

interface FeatureCardsProps {
  onLearningPathClick: () => void;
}

const CARD_CLASS =
  'flex-1 max-w-sm mx-auto sm:mx-0 w-full sm:w-auto min-h-11 bg-card text-ink rounded-xl shadow-sm hover:bg-paper-deep transition-colors p-4 sm:p-5 border-theme border-line hover:border-edge group text-left focus-pop';

function FeatureCard({ title, description, action, icon, iconClassName, onClick }: FeatureCardProps) {
  return (
    <button type="button" onClick={onClick} className={CARD_CLASS}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${iconClassName}`}>
        <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="text-lg font-bold text-ink mb-1">{title}</h3>
      <p className="text-ink-soft text-base mb-3">{description}</p>
      <span className="text-base font-semibold text-accent group-hover:underline">{action} &rarr;</span>
    </button>
  );
}

function focusTextarea() {
  const textarea = document.querySelector('textarea');
  if (textarea) textarea.focus();
}

export function FeatureCards({ onLearningPathClick }: FeatureCardsProps) {
  return (
    <div className="px-4 pb-4 flex-shrink-0">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4">
        <FeatureCard
          title="Tanya Apapun"
          description="Tanya materi, rumus, konsep, atau kode pemrograman"
          action="Mulai Bertanya"
          iconClassName="bg-accent-soft text-accent"
          onClick={focusTextarea}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          }
        />
        <FeatureCard
          title="Jalur Belajar"
          description="Program belajar terstruktur Matematika & Informatika"
          action="Buka Jalur Belajar"
          iconClassName="bg-mark text-ink"
          onClick={onLearningPathClick}
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          }
        />
      </div>
    </div>
  );
}
