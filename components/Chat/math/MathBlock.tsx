import { renderKaTeX } from './inline';

export function MathBlock({ content, isUser }: { content: string; isUser: boolean }) {
  const html = renderKaTeX(content, true);

  if (isUser) {
    return (
      <div
        className="my-2 overflow-x-auto rounded-md border-theme border-accent-ink bg-accent-ink p-2.5 text-center text-on-accent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="my-3 overflow-hidden rounded-lg border-theme border-line bg-accent-soft p-3.5">
      <div className="mb-2 flex items-center justify-between gap-2 border-b border-line pb-1">
        <span className="text-sm font-semibold text-accent-ink">
          Kotak Rumus & Perhitungan
        </span>
        <span className="font-mono text-sm uppercase text-ink-soft">
          Matematika
        </span>
      </div>
      <div
        className="overflow-x-auto py-2 text-center text-ink"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
