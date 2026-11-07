import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { safeGet, safeSet } from '@/lib/safeStorage';
import type { Chapter } from '@/lib/learning/chapterData';

const subscribe = () => () => {};

export function useCompletedChapters(chapters: Chapter[]) {
  const [added, setAdded] = useState<Set<string>>(new Set());

  const storedKey = useSyncExternalStore(
    subscribe,
    () =>
      chapters
        .filter((chapter) => safeGet(`chapterCompleted_${chapter.id}`) === 'true')
        .map((chapter) => chapter.id)
        .join('|'),
    () => '',
  );

  const completedChapters = useMemo(() => {
    const completed = new Set<string>(storedKey ? storedKey.split('|') : []);
    added.forEach((id) => completed.add(id));
    return completed;
  }, [storedKey, added]);

  const markCompleted = useCallback((id: string) => {
    safeSet(`chapterCompleted_${id}`, 'true');
    setAdded((prev) => new Set(prev).add(id));
  }, []);

  return { completedChapters, markCompleted };
}
