'use client';

import { useState, useEffect } from 'react';
import { Callout, Card, TabPanel, Tabs, type TabItem } from '@/components/ui';
import { ConceptRow } from '@/components/progress/ConceptRow';
import { STAT_ICONS, StatCard } from '@/components/progress/StatCard';
import { loadProgress, type ConceptProgress } from '@/components/progress/progressData';

type CategoryFilter = 'all' | 'matematika' | 'informatika';

const FILTER_ITEMS: TabItem<CategoryFilter>[] = [
  { value: 'all', label: 'Semua' },
  { value: 'matematika', label: 'Matematika' },
  { value: 'informatika', label: 'Informatika' },
];

export default function StudentDashboardPage() {
  const [concepts, setConcepts] = useState<ConceptProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  useEffect(() => {
    const refresh = () => setConcepts(loadProgress());
    refresh();
    window.addEventListener('ambisin_progress_updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('ambisin_progress_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const filteredConcepts = selectedCategory === 'all'
    ? concepts
    : concepts.filter(c => c.category === selectedCategory);

  const overallProgress = concepts.length > 0
    ? Math.round(concepts.reduce((sum, c) => sum + c.progress, 0) / concepts.length)
    : 0;

  const matematikaProgress = concepts.filter(c => c.category === 'matematika').length > 0
    ? Math.round(concepts.filter(c => c.category === 'matematika').reduce((sum, c) => sum + c.progress, 0) / concepts.filter(c => c.category === 'matematika').length)
    : 0;

  const informatikaProgress = concepts.filter(c => c.category === 'informatika').length > 0
    ? Math.round(concepts.filter(c => c.category === 'informatika').reduce((sum, c) => sum + c.progress, 0) / concepts.filter(c => c.category === 'informatika').length)
    : 0;

  const totalImprovement = concepts.reduce((sum, c) => sum + (c.progress - c.previousProgress), 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-ink">
            Progresmu
          </h1>
          <p className="text-lg text-ink-soft">
            Pantau perkembangan pemahamanmu di setiap konsep
          </p>
        </div>

        <Callout tone="info" className="mb-4">
          Angka di halaman ini masih contoh untuk tampilan demo.
        </Callout>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={STAT_ICONS.total} label="Total Progress" value={`${overallProgress}%`} />
          <StatCard icon={STAT_ICONS.improvement} label="Peningkatan" value={`+${totalImprovement}%`} emphasis />
          <StatCard icon={STAT_ICONS.matematika} label="Matematika" value={`${matematikaProgress}%`} />
          <StatCard icon={STAT_ICONS.informatika} label="Informatika" value={`${informatikaProgress}%`} />
        </div>

        <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 z-10 h-12 w-10 bg-linear-to-r from-transparent to-paper sm:hidden"
        />
        <Tabs
          label="Filter mata pelajaran"
          value={selectedCategory}
          onChange={setSelectedCategory}
          items={FILTER_ITEMS}
        >
        <TabPanel value={selectedCategory}>
          <div className="space-y-4">
            {filteredConcepts.map((concept) => (
              <ConceptRow
                key={concept.id}
                name={concept.name}
                progress={concept.progress}
                previousProgress={concept.previousProgress}
                category={concept.category}
              />
            ))}
          </div>
        </TabPanel>
        </Tabs>
        </div>

        <Card padding="lg" className="mt-8 text-center">
          <p className="mb-2 text-lg font-semibold text-ink">
            Terus semangat!
          </p>
          <p className="text-base text-ink-soft">
            {overallProgress >= 75
              ? 'Luar biasa! Kamu sudah menguasai sebagian besar konsep!'
              : overallProgress >= 50
              ? 'Bagus! Terus tingkatkan pemahamanmu!'
              : 'Jangan menyerah! Setiap latihan membuatmu lebih baik!'}
          </p>
        </Card>
      </div>
    </div>
  );
}
