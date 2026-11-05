'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';

const subscribeNothing = () => () => {};

interface MascotProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'waving' | 'idle';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left';
  showChat?: boolean;
  onToggle?: () => void;
}

const SIZE_CLASSES = {
  sm: 'h-11 w-11 text-base',
  md: 'h-12 w-12 text-lg',
  lg: 'h-14 w-14 text-xl',
};

const AVATAR =
  'flex items-center justify-center rounded-full bg-accent font-bold text-on-accent transition-colors focus-pop hover:bg-accent-ink';

export default function Mascot({
  message = 'Halo! Kak Ambis siap membantu belajarmu',
  mood = 'idle',
  size = 'md',
  position = 'bottom-right',
  showChat = false,
  onToggle,
}: MascotProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaveDone, setIsWaveDone] = useState(false);
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const currentMood = isWaveDone ? 'idle' : mounted ? 'waving' : mood;
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 200);
      }, delay);
    };

    scheduleBlink();
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const timer = setTimeout(() => setIsWaveDone(true), 2000);
    return () => clearTimeout(timer);
  }, [mounted]);

  const positionClasses = position === 'bottom-right' ? 'right-4 bottom-4' : 'left-4 bottom-4';

  if (!isVisible) {
    return (
      <button
        type="button"
        onClick={() => {
          setIsVisible(true);
          onToggle?.();
        }}
        className={`fixed ${positionClasses} z-50 hidden h-12 w-12 text-lg md:flex ${AVATAR}`}
        title="Buka status Kak Ambis"
        aria-label="Buka status Kak Ambis"
      >
        A
      </button>
    );
  }

  const blinkClass = mounted && isBlinking ? 'scale-y-[0.2] motion-reduce:scale-y-100' : 'scale-y-100';

  return (
    <div className={`fixed ${positionClasses} pointer-events-none z-50 hidden flex-col items-end gap-2 md:flex`}>
      {showChat && message && (
        <div className="max-w-[260px] rounded-xl border-theme border-line bg-card p-3 animate-fade-in">
          <p className="text-base text-ink">{message}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          setIsVisible(false);
          onToggle?.();
        }}
        className={`pointer-events-auto ${SIZE_CLASSES[size]} animate-bounce-subtle ${AVATAR}`}
        title="Tutup status Kak Ambis"
        aria-label="Tutup status Kak Ambis"
      >
        {currentMood === 'thinking' ? (
          <svg
            className="h-5 w-5 animate-spin motion-reduce:animate-none"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          <span
            className={`inline-block tracking-tighter transition-transform duration-100 motion-reduce:transition-none ${blinkClass}`}
          >
            A
          </span>
        )}
      </button>
    </div>
  );
}
