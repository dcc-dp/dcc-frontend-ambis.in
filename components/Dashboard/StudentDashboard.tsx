'use client';

import { useState, useEffect, useRef } from 'react';

interface ConceptProgress {
  id: string;
  name: string;
  progress: number;
  previousProgress: number;
  icon: string;
}

interface StudentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
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
    { id: 'pecahan', name: 'Pecahan', progress: 35, previousProgress: 20, icon: '🍰' },
    { id: 'aljabar', name: 'Aljabar', progress: 42, previousProgress: 35, icon: '🔢' },
    { id: 'geometri', name: 'Geometri', progress: 67, previousProgress: 55, icon: '📐' },
    { id: 'statistika', name: 'Statistika', progress: 23, previousProgress: 15, icon: '📊' },
    { id: 'pemrograman', name: 'Pemrograman Dasar', progress: 78, previousProgress: 60, icon: '💻' },
    { id: 'algoritma', name: 'Algoritma', progress: 55, previousProgress: 40, icon: '🧩' },
    { id: 'web', name: 'Web Development', progress: 31, previousProgress: 20, icon: '🌐' },
  ];
}

export function StudentDashboard({ isOpen, onClose }: StudentDashboardProps) {
  const [concepts, setConcepts] = useState<ConceptProgress[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

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
    if (change > 0) return { text: `+${change}%`, color: 'text-green-600', icon: '↑' };
    if (change < 0) return { text: `${change}%`, color: 'text-red-600', icon: '↓' };
    return { text: '0%', color: 'text-gray-500', icon: '→' };
  };

  const overallProgress = concepts.length > 0 
    ? Math.round(concepts.reduce((sum, c) => sum + c.progress, 0) / concepts.length)
    : 0;

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">Dashboard Progress</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            🎓
          </div>
          <div>
            <p className="text-sm text-white/80">Total Progress</p>
            <p className="text-2xl font-bold">{overallProgress}%</p>
          </div>
        </div>
        <div className="mt-3 w-full bg-white/20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Concept List */}
      <div className="p-4 max-h-80 overflow-y-auto">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Progress per Konsep
        </h4>
        <div className="space-y-3">
          {concepts.map((concept) => {
            const change = getChangeIndicator(concept.progress, concept.previousProgress);
            return (
              <div key={concept.id} className="group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{concept.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{concept.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${change.color}`}>
                      {change.icon} {change.text}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{concept.progress}%</span>
                  </div>
                </div>
                <div className={`w-full h-2 rounded-full ${getProgressBg(concept.progress)}`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(concept.progress)}`}
                    style={{ width: `${concept.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Terakhir diperbarui: Hari ini</span>
          <button
            onClick={() => {
              const reset = getDefaultProgress();
              setConcepts(reset);
              saveProgress(reset);
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// Trigger button component for Header
export function DashboardTrigger({ onClick, overallProgress }: { onClick: () => void; overallProgress?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const concepts: ConceptProgress[] = JSON.parse(stored);
        const avg = concepts.length > 0 
          ? Math.round(concepts.reduce((sum, c) => sum + c.progress, 0) / concepts.length)
          : 0;
        setProgress(avg);
      } catch { /* ignore */ }
    }
  }, []);

  const displayProgress = overallProgress ?? progress;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all group"
    >
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke={displayProgress >= 75 ? '#22c55e' : displayProgress >= 50 ? '#3b82f6' : displayProgress >= 25 ? '#eab308' : '#ef4444'}
            strokeWidth="3"
            strokeDasharray={`${displayProgress * 0.88} 88`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {displayProgress}
        </span>
      </div>
      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}
