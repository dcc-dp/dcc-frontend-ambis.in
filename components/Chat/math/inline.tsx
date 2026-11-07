import React from 'react';
import katex from 'katex';

export function stripEmojis(text: string): string {
  return text
    .replace(
      /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu,
      ''
    )
    .trim();
}

export function normalizeMathDelimiters(text: string): string {
  if (!text) return '';
  let result = text.replace(/\\\[([\s\S]*?)\\\]/g, (_match, eq) => `$$${eq.trim()}$$`);
  result = result.replace(/\\\(([\s\S]*?)\\\)/g, (_match, eq) => `$${eq.trim()}$`);
  return result;
}

export function renderKaTeX(latex: string, displayMode: boolean): string {
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

export function renderInlineTokens(text: string, isUser: boolean) {
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
          className={`inline-flex items-center px-1.5 py-0.5 rounded-sm font-serif whitespace-nowrap mx-0.5 align-middle text-base border-theme ${
            isUser
              ? 'bg-accent-ink text-on-accent border-accent-ink'
              : 'bg-accent-soft text-ink border-line'
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2);
      elements.push(
        <strong key={`bold-${keyIndex++}`} className="font-bold">
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
          className={`px-1.5 py-0.5 rounded-sm font-mono text-sm mx-0.5 border-theme ${
            isUser
              ? 'bg-accent-ink text-on-accent border-accent-ink'
              : 'bg-paper-deep text-accent-ink border-line'
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
