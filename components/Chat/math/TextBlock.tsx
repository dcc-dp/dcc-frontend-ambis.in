import { renderInlineTokens, stripEmojis } from './inline';

function renderLine(line: string, lineIdx: number, isUser: boolean) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (/^---+$/.test(trimmed)) {
    return (
      <hr
        key={`hr-${lineIdx}`}
        className={`my-2.5 border-t ${isUser ? 'border-on-accent' : 'border-line'}`}
      />
    );
  }

  const headingMatch = trimmed.match(/^(#{1,6})\s*(.*)$/);
  if (headingMatch && !isUser) {
    const level = headingMatch[1].length;
    const rawTitle = headingMatch[2];
    const cleanTitle = stripEmojis(rawTitle).replace(/^[:\s-]+/, '');

    if (level >= 3) {
      return (
        <div
          key={`h3-${lineIdx}`}
          className="mt-3 mb-1 border-l-2 border-accent pl-2.5 text-base font-bold text-accent-ink"
        >
          {renderInlineTokens(cleanTitle, isUser)}
        </div>
      );
    }
    if (level === 2) {
      return (
        <h4
          key={`h2-${lineIdx}`}
          className="mt-3.5 mb-1.5 border-l-2 border-accent pl-2.5 text-lg font-bold text-ink"
        >
          {renderInlineTokens(cleanTitle, isUser)}
        </h4>
      );
    }
    return (
      <h3 key={`h1-${lineIdx}`} className="mt-4 mb-2 text-lg font-extrabold text-ink">
        {renderInlineTokens(cleanTitle, isUser)}
      </h3>
    );
  }

  const stepMatch = trimmed.match(/^(\*\*Langkah\s+\d+[:\.]?|\bLangkah\s+\d+[:\.]?)(.*)$/i);
  if (stepMatch && !isUser) {
    const stepLabel = stepMatch[1].replace(/\*\*/g, '').trim();
    const stepDesc = stepMatch[2].replace(/\*\*/g, '').replace(/^[:\s-]+/, '').trim();
    return (
      <div key={`step-${lineIdx}`} className="mt-2.5 mb-1 flex items-start gap-2">
        <span className="inline-flex shrink-0 items-center justify-center rounded-md bg-accent px-2 py-0.5 text-sm font-bold tracking-wide text-on-accent">
          {stepLabel}
        </span>
        {stepDesc && (
          <span className="self-center text-base font-semibold text-ink">
            {renderInlineTokens(stepDesc, isUser)}
          </span>
        )}
      </div>
    );
  }

  const isConclusion = /^(Jadi,|Kesimpulan:|Maka,)/i.test(trimmed);
  if (isConclusion && !isUser) {
    return (
      <div
        key={`conclusion-${lineIdx}`}
        className="my-2.5 flex items-start gap-2.5 rounded-lg border-theme border-attention bg-attention-soft p-3 text-attention"
      >
        <span className="mt-0.5 shrink-0 rounded-sm bg-paper-deep px-1.5 py-0.5 text-sm font-bold uppercase text-ink">
          Inti
        </span>
        <div className="flex-1 text-base font-medium leading-relaxed">
          {renderInlineTokens(trimmed, isUser)}
        </div>
      </div>
    );
  }

  if (/^[-*]\s+/.test(trimmed)) {
    const bulletText = trimmed.replace(/^[-*]\s+/, '');
    return (
      <div key={`bullet-${lineIdx}`} className="my-0.5 flex items-start gap-2 pl-2">
        <span className={`mt-0.5 shrink-0 font-bold ${isUser ? 'text-on-accent' : 'text-accent'}`}>•</span>
        <div className="flex-1">{renderInlineTokens(bulletText, isUser)}</div>
      </div>
    );
  }

  const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
  if (numMatch) {
    return (
      <div key={`num-${lineIdx}`} className="my-0.5 flex items-start gap-2 pl-2">
        <span
          className={`mt-0.5 shrink-0 rounded-full border-theme px-2 text-sm font-semibold ${
            isUser
              ? 'border-accent-ink bg-accent-ink text-on-accent'
              : 'border-line bg-accent-soft text-accent-ink'
          }`}
        >
          {numMatch[1]}
        </span>
        <div className="flex-1">{renderInlineTokens(numMatch[2], isUser)}</div>
      </div>
    );
  }

  return (
    <p key={`p-${lineIdx}`} className="my-0.5 leading-relaxed">
      {renderInlineTokens(line, isUser)}
    </p>
  );
}

export function TextBlock({ content, isUser }: { content: string; isUser: boolean }) {
  return (
    <div className="space-y-1.5">
      {content.split('\n').map((line, lineIdx) => renderLine(line, lineIdx, isUser))}
    </div>
  );
}
