'use client';

import React, { useMemo, useState } from 'react';
import katex from 'katex';

interface MathContentProps {
  content: string;
  isUser?: boolean;
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

// Code Block Component with Copy to Clipboard
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-gray-800 bg-[#1e1e2e] text-gray-100 shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#181825] border-b border-gray-800/80 text-xs">
        <span className="font-mono font-medium lowercase text-blue-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          {language || 'code'}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-gray-700/60 transition text-gray-300 hover:text-white cursor-pointer active:scale-95"
        >
          {copied ? (
            <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
              ✓ Tersalin!
            </span>
          ) : (
            <span className="text-[11px] text-gray-300 flex items-center gap-1">
              📋 Salin Kode
            </span>
          )}
        </button>
      </div>
      <pre className="p-3.5 font-mono text-xs sm:text-[13px] overflow-x-auto leading-relaxed text-gray-200">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

// Tokenize an inline text line into LaTeX, bold, italic, code, and plain text
function renderInlineTokens(text: string, isUser: boolean) {
  // Matches:
  // 1. $$...$$ (rarely inline, but catch if present)
  // 2. $...$ (inline LaTeX)
  // 3. **...** (bold)
  // 4. *...* (italic)
  // 5. `...` (inline code)
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        <span key={`txt-${keyIndex++}`}>
          {text.slice(lastIndex, match.index)}
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
              ? 'bg-blue-700/50 text-white'
              : 'bg-blue-50/80 text-blue-900 border border-blue-200/50 shadow-2xs'
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      elements.push(
        <strong key={`bold-${keyIndex++}`} className="font-bold text-gray-900">
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
          className="px-1.5 py-0.5 rounded bg-gray-100 text-pink-600 font-mono text-xs border border-gray-200 mx-0.5"
        >
          {codeText}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(
      <span key={`txt-${keyIndex++}`}>{text.slice(lastIndex)}</span>
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

    // Split content into distinct blocks:
    // 1. Code blocks: ```python ... ```
    // 2. Display math blocks: $$ ... $$
    // 3. Regular text chunks
    const rawBlocks: BlockItem[] = [];
    const blockRegex = /(?:```([a-zA-Z0-9_-]*)\n([\s\S]*?)```|\$\$([\s\S]*?)\$\$)/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = blockRegex.exec(content)) !== null) {
      if (m.index > lastIdx) {
        const textChunk = content.slice(lastIdx, m.index).trim();
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

    if (lastIdx < content.length) {
      const remaining = content.slice(lastIdx).trim();
      if (remaining) {
        rawBlocks.push({ type: 'text', content: remaining });
      }
    }

    return rawBlocks;
  }, [content]);

  if (isUser) {
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-gray-800">
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

        // 2. Render Math Block Card
        if (block.type === 'math') {
          const html = renderKaTeX(block.content, true);
          return (
            <div
              key={`block-math-${idx}`}
              className="my-3 overflow-hidden rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 p-3.5 shadow-xs transition-all hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-blue-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
                  📐 Kotak Rumus & Perhitungan
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
                    className="my-2.5 border-t border-gray-200"
                  />
                );
              }

              // B. Headings: #, ##, ###
              if (trimmed.startsWith('### ')) {
                const headingText = trimmed.replace(/^###\s+/, '');
                const isTip = headingText.includes('Tips') || headingText.includes('💡');
                return (
                  <div
                    key={`h3-${lineIdx}`}
                    className={`font-bold text-sm mt-3 mb-1 flex items-center gap-1.5 ${
                      isTip ? 'text-indigo-800' : 'text-blue-900'
                    }`}
                  >
                    <span>{isTip ? '💡' : '📌'}</span>
                    <span>{renderInlineTokens(headingText.replace(/^[💡📌]\s*/, ''), isUser)}</span>
                  </div>
                );
              }
              if (trimmed.startsWith('## ')) {
                const headingText = trimmed.replace(/^##\s+/, '');
                return (
                  <h4
                    key={`h2-${lineIdx}`}
                    className="font-bold text-base text-gray-900 mt-3.5 mb-1.5"
                  >
                    {renderInlineTokens(headingText, isUser)}
                  </h4>
                );
              }
              if (trimmed.startsWith('# ')) {
                const headingText = trimmed.replace(/^#\s+/, '');
                return (
                  <h3
                    key={`h1-${lineIdx}`}
                    className="font-extrabold text-base text-gray-900 mt-4 mb-2"
                  >
                    {renderInlineTokens(headingText, isUser)}
                  </h3>
                );
              }

              // C. Step detection: e.g. **Langkah 1: ...** or Langkah 1:
              const stepMatch = trimmed.match(/^(\*\*Langkah\s+\d+[:\.]?|\bLangkah\s+\d+[:\.]?)(.*)$/i);
              if (stepMatch) {
                const stepLabel = stepMatch[1].replace(/\*\*/g, '').trim();
                const stepDesc = stepMatch[2].replace(/\*\*/g, '').replace(/^[:\s-]+/, '').trim();
                return (
                  <div
                    key={`step-${lineIdx}`}
                    className="flex items-start gap-2 mt-2.5 mb-1"
                  >
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-blue-600 text-white font-bold text-xs shadow-xs shrink-0 tracking-wide">
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

              // D. Conclusion detection: e.g. "Jadi, ..." or "Kesimpulan: ..."
              const isConclusion = /^(Jadi,|Kesimpulan:|Maka,)/i.test(trimmed);
              if (isConclusion) {
                return (
                  <div
                    key={`conclusion-${lineIdx}`}
                    className="my-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-amber-950 shadow-xs flex items-start gap-2"
                  >
                    <span className="text-base leading-none shrink-0 mt-0.5">🌟</span>
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
                    <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
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
                    <span className="text-blue-600 font-semibold text-xs shrink-0 mt-0.5 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200/60">
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
