import { useMemo, useSyncExternalStore } from 'react';
import { applyCompleted, countCompleted } from '@/lib/learning/progress';
import type { ModuleItem } from '@/lib/learning/subjectData';

const subscribeNothing = () => () => {};

export function useModuleProgress(subject: string, modules: ModuleItem[]): ModuleItem[] {
  const key = useSyncExternalStore(
    subscribeNothing,
    () => modules.map((module) => countCompleted(subject, module.id)).join(','),
    () => modules.map(() => 0).join(','),
  );

  return useMemo(() => applyCompleted(modules, key.split(',').map(Number)), [modules, key]);
}
