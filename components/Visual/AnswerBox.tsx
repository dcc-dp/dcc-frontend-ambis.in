'use client';

import React, { useState } from 'react';

export interface PracticeOption {
  key: string;
  label: string;
}

interface AnswerBoxProps {
  kind: string;
  options?: PracticeOption[] | null;
  disabled?: boolean;
  onSubmit: (answer: string) => void;
}

export default function AnswerBox({ kind, options, disabled, onSubmit }: AnswerBoxProps) {
  const [text, setText] = useState('');
  const [picked, setPicked] = useState<string | null>(null);

  const isChoice = kind === 'mcq' && options && options.length > 0;
  const answer = isChoice ? picked : text.trim();
  const canSend = Boolean(answer) && !disabled;

  const send = () => {
    if (!canSend || !answer) return;
    onSubmit(answer);
    if (!isChoice) setText('');
  };

  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4">
      {isChoice ? (
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Pilihan jawaban">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={picked === option.key}
              disabled={disabled}
              onClick={() => setPicked(option.key)}
              className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left text-base transition disabled:opacity-60 ${
                picked === option.key
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-indigo-300'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-700">
                {option.key}
              </span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-gray-700">Jawabanmu</span>
          <input
            value={text}
            disabled={disabled}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') send();
            }}
            maxLength={2000}
            placeholder="Contoh: 3/4"
            className="w-full rounded-xl border-2 border-gray-200 px-3.5 py-2.5 text-lg text-gray-900 outline-none focus:border-indigo-500 disabled:opacity-60"
          />
        </label>
      )}

      <button
        type="button"
        disabled={!canSend}
        onClick={send}
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-base font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {disabled ? 'Memeriksa jawabanmu...' : 'Kirim jawaban'}
      </button>
    </div>
  );
}
