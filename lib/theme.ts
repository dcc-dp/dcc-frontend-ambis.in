export const THEMES = ['buku-tulis', 'papan-kapur'] as const;

export type ThemeName = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeName = 'buku-tulis';

export const THEME_STORAGE_KEY = 'ambis-theme';

export const THEME_LABELS: Record<ThemeName, string> = {
  'buku-tulis': 'Buku Tulis',
  'papan-kapur': 'Papan Kapur',
};

export const THEME_HINTS: Record<ThemeName, string> = {
  'buku-tulis': 'Terang',
  'papan-kapur': 'Gelap',
};

export function isTheme(v: unknown): v is ThemeName {
  return typeof v === 'string' && (THEMES as readonly string[]).includes(v);
}

export function readTheme(): ThemeName {
  if (typeof document === 'undefined') {
    return DEFAULT_THEME;
  }
  const value = document.documentElement.getAttribute('data-theme');
  return isTheme(value) ? value : DEFAULT_THEME;
}

export function applyTheme(t: ThemeName): void {
  document.documentElement.setAttribute('data-theme', t);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, t);
  } catch {}
}

export const THEME_INIT_SCRIPT = '(function(){try{var d=document.documentElement,t=localStorage.getItem("ambis-theme");if(t!=="buku-tulis"&&t!=="papan-kapur"){t="buku-tulis";}d.setAttribute("data-theme",t);}catch(e){}})();';
