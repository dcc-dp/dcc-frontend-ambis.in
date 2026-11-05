import { normalizeMathDelimiters } from './inline';

export type BlockItem =
  | { type: 'code'; language: string; content: string }
  | { type: 'math'; content: string }
  | { type: 'text'; content: string };

export function parseBlocks(content: string): BlockItem[] {
  if (!content) return [];

  const normalized = normalizeMathDelimiters(content);

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
}
