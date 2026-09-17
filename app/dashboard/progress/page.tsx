'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';

interface ConceptProgress {
  id: string;
  name: string;
  progress: number;
  previousProgress: number;
  icon: string;
  category: 'matematika' | 'informatika';
}

const STORAGE_KEY = 'ambisin_student_progress';

function loadProgress(): ConceptProgress[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return getDefaultProgress();
}

function saveProgress(progress: ConceptProgress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getDefaultProgress(): ConceptProgress[] {
  return [
    { id: 'pecahan', name: 'Pecahan', progress: 35, previousProgress: 20, icon: '🍰', category: 'matematika' },
    { id: 'aljabar', name: 'Aljabar', progress: 42, previousProgress: 35, icon: '🔢', category: 'matematika' },
    { id: 'geometri', name: 'Geometri', progress: 67, previousProgress: 55, icon: '📐', category: 'matematika' },
    { id: 'statistika', name: 'Statistika', progress: 23, previousProgress: 15, icon: '📊', category: 'matematika' },
    { id: 'kalkulus', name: 'Kalkulus Dasar', progress: 15, previousProgress: 10, icon: '📈', category: 'matematika' },
    { id: 'pemrograman', name: 'Pemrograman Dasar', progress: 78, previousProgress: 60, icon: '💻', category: 'informatika' },
    { id: 'algoritma', name: 'Algoritma', progress: 55, previousProgress: 40, icon: '🧩', category: 'informatika' },
    { id: 'web', name: 'Web Development', progress: 31, previousProgress: 20, icon: '🌐', category: 'informatika' },
    { id: 'database', name: 'Database', progress: 45, previousProgress: 30, icon: '🗄️', category: 'informatika' },
  ];
}

export default function StudentDashboardPage() {
  const [concepts, setConcepts] = useState<ConceptProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'matematika' | 'informatika'>('all');

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

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressBg = (progress: number) => {
    if (progress >= 75) return 'bg-green-100';
    if (progress >= 50) return 'bg-blue-100';
    if (progress >= 25) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = current - previous;
    if (change > 0) return { text: `+${change}%`, color: 'text-green-600', bg: 'bg-green-100', icon: '↑' };
    if (change < 0) return { text: `${change}%`, color: 'text-red-600', bg: 'bg-red-100', icon: '↓' };
    return { text: '0%', color: 'text-gray-500', bg: 'bg-gray-100', icon: '→' };
  };

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
    <MainLayout closeSidebarOnMount={true}>
      <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              📊 Dashboard Progress Siswa
            </h1>
            <p className="text-gray-600">
              Pantau perkembangan pemahamanmu di setiap konsep
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl md:text-2xl">
                  🎯
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Total Progress</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{overallProgress}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl md:text-2xl">
                  📈
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Peningkatan</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">+{totalImprovement}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xl md:text-2xl">
                  🔢
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Matematika</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{matematikaProgress}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl md:text-2xl">
                  💻
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Informatika</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{informatikaProgress}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedCategory('matematika')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'matematika'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              🔢 Matematika
            </button>
            <button
              onClick={() => setSelectedCategory('informatika')}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                selectedCategory === 'informatika'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              💻 Informatika
            </button>
          </div>

          {/* Concept Progress List */}
          <div className="space-y-4">
            {filteredConcepts.map((concept) => {
              const change = getChangeIndicator(concept.progress, concept.previousProgress);
              return (
                <div
                  key={concept.id}
                  className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl md:text-3xl flex-shrink-0">
                      {concept.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-base md:text-lg">{concept.name}</h3>
                        <div className="flex items-center gap-2 md:gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${change.bg} ${change.color}`}>
                            {change.icon} {change.text}
                          </span>
                          <span className="text-base md:text-lg font-bold text-gray-900">{concept.progress}%</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className={`w-full h-3 rounded-full ${getProgressBg(concept.progress)}`}>
                        <div
                          className={`h-3 rounded-full transition-all duration-700 ${getProgressColor(concept.progress)}`}
                          style={{ width: `${concept.progress}%` }}
                        />
                      </div>

                      {/* Previous vs Current */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Sebelumnya: {concept.previousProgress}%</span>
                        <span>•</span>
                        <span className="capitalize">{concept.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Motivational Footer */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white text-center">
            <p className="text-lg font-semibold mb-2">Terus Semangat! 💪</p>
            <p className="text-white/80">
              {overallProgress >= 75 
                ? 'Luar biasa! Kamu sudah menguasai sebagian besar konsep!'
                : overallProgress >= 50
                ? 'Bagus! Terus tingkatkan pemahamanmu!'
                : 'Jangan menyerah! Setiap latihan membuatmu lebih baik!'}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
