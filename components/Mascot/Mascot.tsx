'use client';

import { useState, useEffect, useRef } from 'react';

interface MascotProps {
  message?: string;
  mood?: 'happy' | 'thinking' | 'waving' | 'idle';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left';
  showChat?: boolean;
  onToggle?: () => void;
}

export default function Mascot({ 
  message = 'Halo! Kak Ambis siap membantu belajarmu', 
  mood = 'idle',
  size = 'md',
  position = 'bottom-right',
  showChat = false,
  onToggle
}: MascotProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);
  const [mounted, setMounted] = useState(false);
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mark as mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Blink animation - only after mount
  useEffect(() => {
    if (!mounted) return;
    
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      blinkTimeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 200);
      }, delay);
    };
    
    scheduleBlink();
    return () => {
      if (blinkTimeoutRef.current) {
        clearTimeout(blinkTimeoutRef.current);
      }
    };
  }, [mounted]);

  // Wave animation on mount
  useEffect(() => {
    if (!mounted) return;
    setCurrentMood('waving');
    const timer = setTimeout(() => setCurrentMood('idle'), 2000);
    return () => clearTimeout(timer);
  }, [mounted]);

  if (!isVisible) {
    return (
      <button
        onClick={() => { setIsVisible(true); onToggle?.(); }}
        className={`fixed ${position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md flex items-center justify-center text-white font-bold text-base hover:scale-105 transition-transform`}
        title="Buka status Kak Ambis"
      >
        A
      </button>
    );
  }

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg'
  };

  const positionClasses = position === 'bottom-right' 
    ? 'right-4 bottom-4' 
    : 'left-4 bottom-4';

  return (
    <div className={`fixed ${positionClasses} z-50 flex flex-col items-end gap-2`}>
      {/* Chat bubble */}
      {showChat && message && (
        <div className="bg-white rounded-xl shadow-lg p-3 max-w-[260px] border border-gray-200 animate-fade-in relative">
          <p className="text-xs text-gray-700 leading-relaxed font-medium">{message}</p>
          <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
        </div>
      )}

      {/* Mascot button */}
      <button
        onClick={() => { setIsVisible(false); onToggle?.(); }}
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md flex items-center justify-center hover:scale-105 transition-transform relative overflow-hidden font-bold`}
        title="Tutup status Kak Ambis"
      >
        {/* Monogram / Status */}
        <div className="relative z-10 flex items-center justify-center">
          {currentMood === 'thinking' ? (
            <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            <span 
              className="inline-block tracking-tighter" 
              style={{ 
                transform: mounted && isBlinking ? 'scaleY(0.2)' : 'scaleY(1)',
                transition: 'transform 0.12s ease'
              }}
            >
              A
            </span>
          )}
        </div>

        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
      </button>
    </div>
  );
}
