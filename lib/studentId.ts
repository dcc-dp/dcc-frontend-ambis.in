import { safeGet, safeRemove, safeSet } from '@/lib/safeStorage';

export const STUDENT_ID_KEY = 'ambisin_student_id';
export const FALLBACK_STUDENT_ID = '00000000-0000-0000-0000-000000000901';
export const DEMO_STUDENT_ID = '00000000-0000-0000-0000-0000000000d1';

const DEMO_PARAM = 'siswa';
const DEMO_VALUE = 'demo';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const STUDENT_DATA_KEYS = [
  STUDENT_ID_KEY,
  'ambisin_student_profile',
  'ambisin_chat_history',
  'ambisin_learning_path_data',
  'ambisin_student_progress',
  'ambisin_progress_updated',
  'hasCompletedInitialQuestions',
  'initialAnswers',
];

function isUuid(value: string | null): value is string {
  return value !== null && UUID_PATTERN.test(value);
}

function newUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function demoRequested(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return new URLSearchParams(window.location.search).get(DEMO_PARAM) === DEMO_VALUE;
  } catch {
    return false;
  }
}

export function getStudentId(): string {
  if (typeof window === 'undefined') return FALLBACK_STUDENT_ID;
  if (demoRequested()) {
    safeSet(STUDENT_ID_KEY, DEMO_STUDENT_ID);
    return DEMO_STUDENT_ID;
  }
  const stored = safeGet(STUDENT_ID_KEY);
  if (isUuid(stored)) return stored;
  const created = newUuid();
  safeSet(STUDENT_ID_KEY, created);
  return created;
}

export function isDemoStudent(): boolean {
  if (typeof window === 'undefined') return false;
  return demoRequested() || safeGet(STUDENT_ID_KEY) === DEMO_STUDENT_ID;
}

export function resetStudent(): void {
  STUDENT_DATA_KEYS.forEach((key) => safeRemove(key));
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has(DEMO_PARAM)) {
      url.searchParams.delete(DEMO_PARAM);
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  } catch {}
}
