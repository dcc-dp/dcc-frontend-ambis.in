import React from 'react';

const FRACTION_PATTERN = /([0-9?]+)\/([0-9?]+)/g;

function Fraction({ n, d }: { n: string; d: string }) {
  return (
    <span className="mx-0.5 inline-flex flex-col items-center align-middle text-[0.85em] leading-tight">
      <span className="border-b border-current px-0.5 font-semibold">{n}</span>
      <span className="px-0.5 font-semibold">{d}</span>
    </span>
  );
}

export function formatMathText(text: string): string {
  return text.replace(/(?<=\s|^)x(?=\s|$)/g, '×');
}

export default function RichText({ text, className }: { text: string; className?: string }) {
  const source = formatMathText(text);
  const parts: React.ReactNode[] = [];
  let last = 0;

  for (const match of source.matchAll(FRACTION_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(source.slice(last, index));
    parts.push(<Fraction key={`f-${index}`} n={match[1]} d={match[2]} />);
    last = index + match[0].length;
  }
  if (last < source.length) parts.push(source.slice(last));

  return <span className={className}>{parts}</span>;
}
