import { safeGet } from '@/lib/safeStorage';
import { chapterData } from '@/lib/learning/chapterData';
import type { ModuleItem } from '@/lib/learning/subjectData';

export function completedKey(chapterId: string): string {
  return `chapterCompleted_${chapterId}`;
}

export function countCompleted(subject: string, moduleId: string): number {
  const chapters = chapterData[subject]?.[moduleId] ?? [];
  return chapters.filter((chapter) => safeGet(completedKey(chapter.id)) === 'true').length;
}

export function applyCompleted(modules: ModuleItem[], counts: number[]): ModuleItem[] {
  return modules.map((module, index) => {
    const done = Math.min(counts[index] ?? 0, module.chapterCount);
    const progress = module.chapterCount > 0 ? Math.round((done / module.chapterCount) * 100) : 0;
    return { ...module, completedChapters: done, progress };
  });
}
