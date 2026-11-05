'use client';

import { THEME_LABELS } from '@/lib/theme';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={`Ganti tema, sekarang ${THEME_LABELS[theme]}`}
      className="min-w-11"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
      <span className="text-sm">{THEME_LABELS[theme]}</span>
    </Button>
  );
}
