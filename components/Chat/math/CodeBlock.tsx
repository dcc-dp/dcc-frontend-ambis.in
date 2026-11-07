'use client';

import { useState } from 'react';

export function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg border-theme border-line bg-paper-deep text-ink">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-1 text-sm">
        <span className="font-mono font-semibold uppercase text-ink-soft">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-11 rounded-md px-3 text-sm font-semibold text-accent-ink hover:bg-accent-soft focus-pop"
        >
          {copied ? 'Tersalin' : 'Salin Kode'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-sm leading-relaxed text-ink">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
