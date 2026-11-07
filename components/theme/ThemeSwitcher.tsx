'use client';

import { cn } from '@/lib/cn';
import { THEMES, THEME_HINTS, THEME_LABELS } from '@/lib/theme';
import type { ThemeName } from '@/lib/theme';
import { useTheme } from '@/components/theme/ThemeProvider';

interface ThemeOptionProps {
  name: ThemeName;
  selected: boolean;
  onSelect: (t: ThemeName) => void;
}

function ThemePreview({ name }: { name: ThemeName }) {
  return (
    <span
      data-theme={name}
      aria-hidden="true"
      className="relative flex h-8 w-12 shrink-0 flex-col justify-center gap-1.5 overflow-hidden rounded-sm border-theme border-edge bg-paper px-1.5"
    >
      <span className="h-1 w-6 rounded-full bg-ink" />
      <span className="relative flex h-2 w-full items-center rounded-sm bg-mark">
        <span className="absolute right-0.5 h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
    </span>
  );
}

function CheckGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-auto h-5 w-5 shrink-0 text-accent-ink"
    >
      <path d="M5 12l5 5L19 7" />
    </svg>
  );
}

function ThemeOption({ name, selected, onSelect }: ThemeOptionProps) {
  return (
    <label
      className={cn(
        'flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border-theme px-3 py-2 text-ink',
        'has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-focus',
        selected ? 'border-accent bg-accent-soft' : 'border-edge bg-card',
      )}
    >
      <input
        type="radio"
        name="ambis-theme"
        value={name}
        checked={selected}
        onChange={() => onSelect(name)}
        className="sr-only"
      />
      <ThemePreview name={name} />
      <span className="flex flex-col">
        <span className="text-base font-semibold">{THEME_LABELS[name]}</span>
        <span className="text-sm text-ink-soft">{THEME_HINTS[name]}</span>
      </span>
      {selected && <CheckGlyph />}
    </label>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <fieldset className="flex flex-wrap gap-2">
      <legend className="text-base font-semibold text-ink">Tema</legend>
      {THEMES.map((name) => (
        <ThemeOption
          key={name}
          name={name}
          selected={theme === name}
          onSelect={setTheme}
        />
      ))}
    </fieldset>
  );
}
