'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathContentProps {
  content: string;
  isUser?: boolean;
}

// Safely render KaTeX to HTML string
function renderKaTeX(latex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode,
      throwOnError: false,
    });
  } catch {
    return latex;
  }
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
          className="my-1 block text-center overflow-x-auto py-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (token.startsWith('$') && token.endsWith('$')) {
      const latex = token.slice(1, -1);
      const html = renderKaTeX(latex, false);
      elements.push(
        <span
          key={`math-inline-${keyIndex++}`}
          className={`inline-block px-1 py-0.2 rounded font-serif ${
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
          className="px-1.5 py-0.5 rounded bg-gray-200/80 text-pink-600 font-mono text-xs"
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

export default function MathContent({ content, isUser = false }: MathContentProps) {
  const blocks = useMemo(() => {
    if (!content) return [];

    // Split content into distinct blocks:
    // 1. Explicit display math blocks: $$ ... $$
    // 2. Markdown paragraphs, step headers, and lists
    const rawBlocks: { type: 'math' | 'text'; content: string }[] = [];
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = blockMathRegex.exec(content)) !== null) {
      if (m.index > lastIdx) {
        const textChunk = content.slice(lastIdx, m.index).trim();
        if (textChunk) {
          rawBlocks.push({ type: 'text', content: textChunk });
        }
      }
      rawBlocks.push({ type: 'math', content: m[1].trim() });
      lastIdx = blockMathRegex.lastIndex;
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
    <div className="space-y-3 text-sm leading-relaxed text-gray-800">
      {blocks.map((block, idx) => {
        if (block.type === 'math') {
          // Render dedicated Math Block Card
          const html = renderKaTeX(block.content, true);
          return (
            <div
              key={`block-math-${idx}`}
              className="my-3 overflow-hidden rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 p-3.5 shadow-xs transition-all hover:border-blue-300"
            >
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-blue-100">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
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

        // Render structured text block (paragraphs, steps, lists, conclusions)
        const lines = block.content.split('\n');

        return (
          <div key={`block-text-${idx}`} className="space-y-2">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // 1. Step detection: e.g. **Langkah 1: ...** or Langkah 1:
              const stepMatch = trimmed.match(/^(\*\*Langkah\s+\d+[:\.]?|\bLangkah\s+\d+[:\.]?)(.*)$/i);
              if (stepMatch) {
                const stepLabel = stepMatch[1].replace(/\*\*/g, '').trim();
                const stepDesc = stepMatch[2].replace(/\*\*/g, '').replace(/^[:\s-]+/, '').trim();
                return (
                  <div
                    key={`step-${lineIdx}`}
                    className="flex items-start gap-2.5 mt-3 mb-1.5"
                  >
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs shrink-0 tracking-wide">
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

              // 2. Conclusion / Final Answer detection: e.g. "Jadi, ..." or "Kesimpulan: ..."
              const isConclusion = /^(Jadi,|Kesimpulan:|Maka,)/i.test(trimmed);
              if (isConclusion) {
                return (
                  <div
                    key={`conclusion-${lineIdx}`}
                    className="my-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-amber-950 shadow-xs flex items-start gap-2.5"
                  >
                    <span className="text-lg leading-none shrink-0 mt-0.5">🌟</span>
                    <div className="flex-1 font-medium leading-relaxed">
                      {renderInlineTokens(trimmed, isUser)}
                    </div>
                  </div>
                );
              }

              // 3. Bullet list item: - or *
              if (/^[-*]\s+/.test(trimmed)) {
                const bulletText = trimmed.replace(/^[-*]\s+/, '');
                return (
                  <div key={`bullet-${lineIdx}`} className="flex items-start gap-2 pl-2">
                    <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                    <div className="flex-1">
                      {renderInlineTokens(bulletText, isUser)}
                    </div>
                  </div>
                );
              }

              // 4. Numbered list item: e.g. 1. or 2.
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (numMatch) {
                return (
                  <div key={`num-${lineIdx}`} className="flex items-start gap-2 pl-2">
                    <span className="text-blue-600 font-semibold text-xs shrink-0 mt-0.5 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200/60">
                      {numMatch[1]}
                    </span>
                    <div className="flex-1">
                      {renderInlineTokens(numMatch[2], isUser)}
                    </div>
                  </div>
                );
              }

              // 5. Standard paragraph with inline formatting
              return (
                <p key={`p-${lineIdx}`} className="leading-relaxed">
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
