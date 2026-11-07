'use client';

import React, { useId, useState } from 'react';
import { Button, Field, Input } from '@/components/ui';

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
  const groupName = useId();

  const isChoice = kind === 'mcq' && options && options.length > 0;
  const answer = isChoice ? picked : text.trim();
  const canSend = Boolean(answer) && !disabled;

  const send = () => {
    if (!canSend || !answer) return;
    onSubmit(answer);
    if (!isChoice) setText('');
  };

  return (
    <div className="space-y-4">
      {isChoice ? (
        <fieldset className="grid min-w-0 gap-2">
          <legend className="mb-2">
            <span className="inline-block rounded-sm bg-mark px-1 text-sm font-semibold text-ink">Pilih jawabanmu</span>
          </legend>
          {options.map((option) => (
            <label
              key={option.key}
              className={`flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg border-theme px-4 py-2 text-left text-lg font-semibold text-ink transition-colors duration-150 has-[:disabled]:cursor-not-allowed has-[:disabled]:border-line has-[:disabled]:bg-paper-deep has-[:disabled]:text-ink-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                picked === option.key
                  ? 'border-accent bg-accent-soft'
                  : 'border-edge bg-card hover:bg-paper-deep'
              }`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.key}
                checked={picked === option.key}
                disabled={disabled}
                onChange={() => setPicked(option.key)}
                className="sr-only"
              />
              <span className="shrink-0 font-bold text-accent">{option.key}.</span>
              <span className="flex-1">{option.label}</span>
              {picked === option.key && (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent-ink" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
            </label>
          ))}
        </fieldset>
      ) : (
        <Field label="Jawabanmu">
          <Input
            value={text}
            disabled={disabled}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') send();
            }}
            maxLength={2000}
            placeholder="Contoh: 3/4"
          />
        </Field>
      )}

      <Button fullWidth disabled={!canSend} onClick={send}>
        {disabled ? 'Sedang memeriksa' : 'Kirim jawaban'}
      </Button>
    </div>
  );
}
