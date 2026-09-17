'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function LoginPromptModal({
  isOpen,
  onClose,
  onDevBypass,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDevBypass?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 sm:p-8 text-center">
        {/* Icon */}
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🔒</div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Lanjutkan dengan Login
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
          Anda sudah mencapai batas chat gratis. Silakan login untuk
          melanjutkan pembelajaran
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium text-gray-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? 'Memproses...' : 'Masuk dengan Google'}
        </button>

        {/* Dev Mode Bypass Option */}
        <button
          onClick={onDevBypass || onClose}
          className="w-full px-6 py-2.5 bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-xl transition font-medium text-xs sm:text-sm flex items-center justify-center gap-2 mb-2"
        >
          <span>⚡</span>
          <span>Mode Dev / Lokal: Lewati Batas Chat</span>
        </button>

        {/* Continue without login */}
        <button
          onClick={onClose}
          className="w-full px-6 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition text-xs sm:text-sm"
        >
          Lanjutkan Nanti
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">atau</span>
          </div>
        </div>

        {/* Close anyway */}
        <p className="text-xs text-gray-400">
          Anda dapat melanjutkan tanpa login, tetapi fitur akan dibatasi
        </p>
      </div>
    </div>
  );
}
