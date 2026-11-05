'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SvgIcon } from '@/components/chat-page/SvgIcon';
import { Button, IconButton } from '@/components/ui';
import { cn } from '@/lib/cn';

interface HeaderProps {
  userName?: string;
  onLogout?: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
  isMobile?: boolean;
}

function progressTone(progress: number): string {
  if (progress >= 75) return 'text-correct';
  if (progress >= 50) return 'text-accent';
  if (progress >= 25) return 'text-attention';
  return 'text-wrong';
}

function ProgressRing({ progress }: { progress: number }) {
  return (
    <div className="relative w-8 h-8">
      <svg aria-hidden="true" className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-line" />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={`${progress * 0.88} 88`}
          strokeLinecap="round"
          className={cn('transition-all duration-500', progressTone(progress))}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-ink">
        {progress}
      </span>
    </div>
  );
}

function useOverallProgress(): number {
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const refreshProgress = () => {
      const stored = localStorage.getItem('ambisin_student_progress');
      if (stored) {
        try {
          const concepts: Array<{ progress: number }> = JSON.parse(stored);
          const avg = concepts.length > 0
            ? Math.round(concepts.reduce((sum, c) => sum + c.progress, 0) / concepts.length)
            : 0;
          setOverallProgress(avg);
        } catch { /* ignore */ }
      }
    };

    refreshProgress();
    window.addEventListener('ambisin_progress_updated', refreshProgress);
    window.addEventListener('storage', refreshProgress);
    return () => {
      window.removeEventListener('ambisin_progress_updated', refreshProgress);
      window.removeEventListener('storage', refreshProgress);
    };
  }, []);

  return overallProgress;
}

export function Header({ userName, onLogout, onSidebarToggle, sidebarOpen = true }: HeaderProps) {
  const overallProgress = useOverallProgress();

  return (
    <header className="bg-card text-ink border-b border-theme border-line px-4 md:px-6 py-2 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2 md:gap-4">
        {onSidebarToggle && (
          <IconButton
            label={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            title={sidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            onClick={onSidebarToggle}
            icon={
              <SvgIcon
                className="w-5 h-5"
                d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            }
          />
        )}
        <Link href="/" className="flex items-center gap-2 min-h-11 focus-pop">
          <SvgIcon
            className="w-7 h-7 md:w-8 md:h-8 text-accent"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
          <span className="text-lg md:text-xl font-bold text-ink">Ambis.In</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Link
          href="/dashboard/progress"
          className="flex items-center gap-2 px-3 min-h-11 bg-paper-deep hover:bg-accent-soft rounded-lg transition-colors focus-pop"
        >
          <ProgressRing progress={overallProgress} />
          <span className="text-base font-medium text-ink hidden sm:inline">Dashboard</span>
        </Link>

        {userName && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-accent text-on-accent flex items-center justify-center text-base font-medium">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-ink text-base hidden sm:inline">Halo, {userName}</span>
          </div>
        )}
        {onLogout && (
          <Button size="sm" variant="ghost" onClick={onLogout} aria-label="Logout">
            <SvgIcon
              className="w-5 h-5"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
