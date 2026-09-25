'use client';

import React, { useMemo, useState } from 'react';
import katex from 'katex';

interface MathContentProps {
  content: string;
  isUser?: boolean;
}

// Strip emojis from text
function stripEmojis(text: string): string {
  return text
    .replace(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu,
      ''
    )
    .trim();
}

// Normalize LaTeX delimiters:
// Converts \[ ... \] to $$ ... $$ (display math)
// Converts \( ... \) to $ ... $ (inline math)
function normalizeMathDelimiters(text: string): string {
  if (!text) return '';
  // Convert display math \[ ... \] to $$ ... $$
  let result = text.replace(/\\\[([\s\S]*?)\\\]/g, (_match, eq) => `$$${eq.trim()}$$`);
  // Convert inline math \( ... \) to $ ... $
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_match, eq) => `$${eq.trim()}$`);
  return result;
}

// Safely render KaTeX to HTML string using output: 'html'
// (avoids hidden MathML duplicate layer that causes vertical text stacking)
function renderKaTeX(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
      output: 'html',
    });
  } catch {
    return latex;
  }
}

// Code Block Component with Soft/Harmonious Background (No harsh contrast, No emojis)
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50/80 shadow-2xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-gray-100/90 border-b border-gray-200/80 text-xs">
        <span className="font-mono font-semibold uppercase text-gray-600 text-[11px] tracking-wider">
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="px-2 py-0.5 rounded text-[11px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition cursor-pointer active:scale-95"
        >
          {copied ? 'Tersalin' : 'Salin Kode'}
        </button>
      </div>
      <pre className="p-3.5 font-mono text-xs sm:text-[13px] overflow-x-auto leading-relaxed text-gray-800 bg-gray-50/40">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

// Tokenize an inline text line into LaTeX, bold, italic, code, and plain text (No emojis)
function renderInlineTokens(text: string, isUser: boolean) {
  const cleanText = stripEmojis(text);
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = regex.exec(cleanText)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <span key={`txt-${keyIndex++}`}>
          {cleanText.slice(lastIndex, match.index)}
        </span>
      );
    }

    const token = match[0];
    if (token.startsWith('$$') && token.endsWith('$$')) {
      const latex = token.slice(2, -2);
      const html = renderKaTeX(latex, true);
      elements.push(
        <span
          key={`math-block-${keyIndex++}`}
          className="my-1.5 block text-center overflow-x-auto py-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (token.startsWith('$') && token.endsWith('$')) {
      const latex = token.slice(1, -1);
      const html = renderKaTeX(latex, false);
      elements.push(
        <span
          key={`math-inline-${keyIndex++}`}
          className={`inline-flex items-center px-1.5 py-0.5 rounded font-serif whitespace-nowrap mx-0.5 align-middle text-xs sm:text-sm ${
            isUser
              ? 'bg-blue-700/60 text-white border border-blue-400/40 shadow-xs'
              : 'bg-blue-50/80 text-blue-900 border border-blue-200/50 shadow-2xs'
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      elements.push(
        <strong key={`bold-${keyIndex++}`} className={`font-bold ${isUser ? 'text-white' : 'text-gray-900'}`}>
          {renderInlineTokens(boldText, isUser)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      const italicText = token.slice(1, -1);
      elements.push(
        <em key={`em-${keyIndex++}`} className="italic">
          {italicText}
        </em>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const codeText = token.slice(1, -1);
      elements.push(
        <code
          key={`code-${keyIndex++}`}
          className={`px-1.5 py-0.5 rounded font-mono text-xs mx-0.5 border ${
            isUser
              ? 'bg-blue-700/70 text-blue-100 border-blue-500/50'
              : 'bg-gray-100 text-pink-600 border-gray-200'
          }`}
        >
          {codeText}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < cleanText.length) {
    elements.push(
      <span key={`txt-${keyIndex++}`}>{cleanText.slice(lastIndex)}</span>
    );
  }

  return elements;
}

type BlockItem =
  | { type: 'code'; language: string; content: string }
  | { type: 'math'; content: string }
  | { type: 'text'; content: string };

export default function MathContent({ content, isUser = false }: MathContentProps) {
  const blocks = useMemo(() => {
    if (!content) return [];

    // Normalize LaTeX \( ... \) and \[ ... \] into standard $ and $$
    const normalized = normalizeMathDelimiters(content);

    // Split content into distinct blocks:
    // 1. Code blocks: ```python ... ```
    // 2. Display math blocks: $$ ... $$
    // 3. Regular text chunks
    const rawBlocks: BlockItem[] = [];
    const blockRegex = /(?:```([a-zA-Z0-9_-]*)\n([\s\S]*?)```|\$\$([\s\S]*?)\$\$)/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = blockRegex.exec(normalized)) !== null) {
      if (m.index > lastIdx) {
        const textChunk = normalized.slice(lastIdx, m.index).trim();
        if (textChunk) {
          rawBlocks.push({ type: 'text', content: textChunk });
        }
      }

      if (m[0].startsWith('```')) {
        rawBlocks.push({
          type: 'code',
          language: m[1] || 'text',
          content: m[2] || '',
        });
      } else if (m[0].startsWith('$$')) {
        rawBlocks.push({
          type: 'math',
          content: m[3] ? m[3].trim() : '',
        });
      }

      lastIdx = blockRegex.lastIndex;
    }

    if (lastIdx < normalized.length) {
      const remaining = normalized.slice(lastIdx).trim();
      if (remaining) {
        rawBlocks.push({ type: 'text', content: remaining });
      }
    }

    return rawBlocks;
  }, [content]);

  return (
    <div className={`space-y-2.5 text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
      {blocks.map((block, idx) => {
        // 1. Render Code Block
        if (block.type === 'code') {
          return (
            <CodeBlock
              key={`block-code-${idx}`}
              language={block.language}
              code={block.content}
            />
          );
        }

        // 2. Render Math Block Card (No emojis)
        if (block.type === 'math') {
          const html = renderKaTeX(block.content, true);

          if (isUser) {
            return (
              <div
                key={`block-math-${idx}`}
                className="my-2 overflow-x-auto rounded-lg bg-blue-700/60 border border-blue-400/30 p-2.5 text-center text-white"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          }

          return (
            <div
              key={`block-math-${idx}`}
              className="my-3 overflow-hidden rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-blue-50/70 p-3.5 shadow-2xs transition-all hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-blue-100">
                <span className="text-xs font-semibold text-blue-700">
                  Kotak Rumus & Perhitungan
                </span>
                <span className="text-[10px] text-blue-500/80 font-mono uppercase tracking-wider">
                  Matematika
                </span>
              </div>
              <div
                className="overflow-x-auto py-2 text-center text-gray-900"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          );
        }

        // 3. Render Structured Text Block
        const lines = block.content.split('\n');

        return (
          <div key={`block-text-${idx}`} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // A. Horizontal Rule: ---
              if (/^---+$/.test(trimmed)) {
                return (
                  <hr
                    key={`hr-${lineIdx}`}
                    className={`my-2.5 border-t ${isUser ? 'border-blue-400/40' : 'border-gray-200'}`}
                  />
                );
              }

              // B. Headings: catches ###, ##, # with or without space and with emojis attached
              const headingMatch = trimmed.match(/^(#{1,6})\s*(.*)$/);
              if (headingMatch && !isUser) {
                const level = headingMatch[1].length;
                const rawTitle = headingMatch[2];
                const cleanTitle = stripEmojis(rawTitle).replace(/^[:\s-]+/, '');

                if (level >= 3) {
                  return (
                    <div
                      key={`h3-${lineIdx}`}
                      className="font-bold text-sm text-blue-900 mt-3 mb-1 pl-2.5 border-l-2 border-blue-500"
                    >
                      {renderInlineTokens(cleanTitle, isUser)}
                    </div>
                  );
                }
                if (level === 2) {
                  return (
                    <h4
                      key={`h2-${lineIdx}`}
                      className="font-bold text-base text-gray-900 mt-3.5 mb-1.5 pl-2.5 border-l-2 border-blue-600"
                    >
                      {renderInlineTokens(cleanTitle, isUser)}
                    </h4>
                  );
                }
                return (
                  <h3
                    key={`h1-${lineIdx}`}
                    className="font-extrabold text-base text-gray-900 mt-4 mb-2"
                  >
                    {renderInlineTokens(cleanTitle, isUser)}
                  </h3>
                );
              }

              // C. Step detection: e.g. **Langkah 1: ...** or Langkah 1:
              const stepMatch = trimmed.match(/^(\*\*Langkah\s+\d+[:\.]?|\bLangkah\s+\d+[:\.]?)(.*)$/i);
              if (stepMatch && !isUser) {
                const stepLabel = stepMatch[1].replace(/\*\*/g, '').trim();
                const stepDesc = stepMatch[2].replace(/\*\*/g, '').replace(/^[:\s-]+/, '').trim();
                return (
                  <div
                    key={`step-${lineIdx}`}
                    className="flex items-start gap-2 mt-2.5 mb-1"
                  >
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-xs shadow-2xs shrink-0 tracking-wide">
                      {stepLabel}
                    </span>
                    {stepDesc && (
                      <span className="font-semibold text-gray-900 text-sm self-center">
                        {renderInlineTokens(stepDesc, isUser)}
                      </span>
                    )}
                  </div>
                );
              }

              // D. Conclusion detection: e.g. "Jadi, ..." or "Kesimpulan: ..." (No emojis)
              const isConclusion = /^(Jadi,|Kesimpulan:|Maka,)/i.test(trimmed);
              if (isConclusion && !isUser) {
                return (
                  <div
                    key={`conclusion-${lineIdx}`}
                    className="my-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-amber-950 shadow-2xs flex items-start gap-2.5"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900 text-[10px] font-bold uppercase shrink-0 mt-0.5">
                      Inti
                    </span>
                    <div className="flex-1 font-medium leading-relaxed text-xs sm:text-sm">
                      {renderInlineTokens(trimmed, isUser)}
                    </div>
                  </div>
                );
              }

              // E. Bullet list item: - or *
              if (/^[-*]\s+/.test(trimmed)) {
                const bulletText = trimmed.replace(/^[-*]\s+/, '');
                return (
                  <div key={`bullet-${lineIdx}`} className="flex items-start gap-2 pl-2 my-0.5">
                    <span className={`font-bold shrink-0 mt-0.5 ${isUser ? 'text-blue-200' : 'text-blue-500'}`}>•</span>
                    <div className="flex-1">
                      {renderInlineTokens(bulletText, isUser)}
                    </div>
                  </div>
                );
              }

              // F. Numbered list item: e.g. 1. or 2.
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={`num-${lineIdx}`} className="flex items-start gap-2 pl-2 my-0.5">
                    <span className={`font-semibold text-xs shrink-0 mt-0.5 px-1.5 py-0.2 rounded-full border ${
                      isUser
                        ? 'bg-blue-700/60 text-white border-blue-400/40'
                        : 'bg-blue-50 text-blue-600 border-blue-200/60'
                    }`}>
                      {numMatch[1]}
                    </span>
                    <div className="flex-1">
                      {renderInlineTokens(numMatch[2], isUser)}
                    </div>
                  </div>
                );
              }

              // G. Standard paragraph with inline formatting
              return (
                <p key={`p-${lineIdx}`} className="leading-relaxed my-0.5">
                  {renderInlineTokens(line, isUser)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
