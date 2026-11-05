import { Fragment } from 'react';
import { Card } from '@/components/ui';

interface ChapterBodyProps {
  content: string;
  expandedSections: Record<string, boolean>;
  onToggleSection: (sectionId: string) => void;
}

function ChevronIcon({ isExpanded }: { isExpanded: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 shrink-0 text-ink-soft transition-transform motion-reduce:transition-none ${isExpanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function isListLine(paragraph: string): boolean {
  return (
    paragraph.startsWith('- ') ||
    paragraph.startsWith('1. ') ||
    paragraph.startsWith('2. ') ||
    paragraph.startsWith('3. ') ||
    paragraph.startsWith('4. ')
  );
}

function renderLine(paragraph: string, idx: number) {
  if (isListLine(paragraph)) {
    return (
      <div key={idx} className="mb-2 ml-4 flex items-start gap-2">
        <span aria-hidden="true" className="mt-1 text-lg text-accent">
          •
        </span>
        <p className="flex-1 text-lg leading-relaxed text-ink">
          {paragraph.replace(/^- /, '').replace(/^\d+\. /, '')}
        </p>
      </div>
    );
  }
  if (paragraph.startsWith('```')) return null;
  if (paragraph.trim() === '') return <div key={idx} className="h-3" />;
  return (
    <p key={idx} className="mb-3 text-lg leading-relaxed text-ink">
      {paragraph}
    </p>
  );
}

interface Section {
  id: string;
  title: string | null;
  lines: Array<{ text: string; idx: number }>;
}

function isHeaderLine(paragraph: string): boolean {
  return paragraph.startsWith('**') && paragraph.endsWith('**');
}

function splitSections(content: string): Section[] {
  const sections: Section[] = [{ id: 'intro', title: null, lines: [] }];
  content.split('\n').forEach((text, idx) => {
    if (isHeaderLine(text)) {
      sections.push({ id: `section-${idx}`, title: text.replace(/\*\*/g, ''), lines: [] });
      return;
    }
    sections[sections.length - 1].lines.push({ text, idx });
  });
  return sections;
}

interface DisclosureProps {
  section: Section;
  isExpanded: boolean;
  onToggle: () => void;
}

function Disclosure({ section, isExpanded, onToggle }: DisclosureProps) {
  const panelId = `${section.id}-panel`;
  const buttonId = `${section.id}-button`;
  return (
    <div className="mb-4">
      <button
        type="button"
        id={buttonId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="focus-pop flex min-h-11 w-full items-center justify-between gap-3 rounded-md text-left"
      >
        <h2 className="text-xl font-bold text-ink">{section.title}</h2>
        <ChevronIcon isExpanded={isExpanded} />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isExpanded}
        className="mt-2 border-l-4 border-accent-fill pl-4"
      >
        {section.lines.map((line) => renderLine(line.text, line.idx))}
      </div>
    </div>
  );
}

export function ChapterBody({ content, expandedSections, onToggleSection }: ChapterBodyProps) {
  const sections = splitSections(content);
  return (
    <Card padding="lg" className="mb-6">
      <div className="max-w-[65ch]">
        {sections.map((section) =>
          section.title === null ? (
            <Fragment key={section.id}>{section.lines.map((line) => renderLine(line.text, line.idx))}</Fragment>
          ) : (
            <Disclosure
              key={section.id}
              section={section}
              isExpanded={expandedSections[section.id] !== false}
              onToggle={() => onToggleSection(section.id)}
            />
          ),
        )}
      </div>
    </Card>
  );
}
