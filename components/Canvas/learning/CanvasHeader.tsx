import { Badge, IconButton } from '@/components/ui';
import { cn } from '@/lib/cn';
import { subjectTone } from './subject-tone';
import type { CanvasData } from './types';

interface CanvasHeaderProps {
  data: CanvasData;
  onClose: () => void;
}

const CODE_PATH = 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4';
const CALC_PATH =
  'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z';

function SubjectIcon({ subject, className }: { subject: string; className: string }) {
  return (
    <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', className)}>
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={subject === 'Informatika' ? CODE_PATH : CALC_PATH}
        />
      </svg>
    </div>
  );
}

export default function CanvasHeader({ data, onClose }: CanvasHeaderProps) {
  const tone = subjectTone(data.subject);

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line bg-paper-deep px-5 py-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <SubjectIcon subject={data.subject} className={tone.solid} />
        <div className="min-w-0">
          <p className="mb-0.5 text-sm font-semibold uppercase tracking-widest text-ink-soft">Learning Canvas</p>
          <h2 className="truncate text-base font-bold leading-tight text-ink">{data.title}</h2>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Badge tone={tone.badge} className="rounded-full">
          {data.subject}
        </Badge>
        <IconButton
          label="Tutup canvas"
          title="Tutup canvas"
          onClick={onClose}
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
