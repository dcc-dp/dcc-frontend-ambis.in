'use client';

import { useMemo } from 'react';
import { CodeBlock } from '@/components/Chat/math/CodeBlock';
import { MathBlock } from '@/components/Chat/math/MathBlock';
import { TextBlock } from '@/components/Chat/math/TextBlock';
import { parseBlocks } from '@/components/Chat/math/parse';

interface MathContentProps {
  content: string;
  isUser?: boolean;
}

export default function MathContent({ content, isUser = false }: MathContentProps) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={`max-w-full space-y-2.5 text-base leading-relaxed [&_.katex]:text-[1.1em] [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden ${isUser ? 'text-on-accent' : 'text-ink'}`}>
      {blocks.map((block, idx) => {
        if (block.type === 'code') {
          return (
            <CodeBlock
              key={`block-code-${idx}`}
              language={block.language}
              code={block.content}
            />
          );
        }
        if (block.type === 'math') {
          return <MathBlock key={`block-math-${idx}`} content={block.content} isUser={isUser} />;
        }
        return <TextBlock key={`block-text-${idx}`} content={block.content} isUser={isUser} />;
      })}
    </div>
  );
}
