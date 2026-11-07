import { Button, IconButton } from '@/components/ui';

interface FlowControlsProps {
  activeStep: number;
  total: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export default function FlowControls({
  activeStep,
  total,
  isPlaying,
  onTogglePlay,
  onReset,
}: FlowControlsProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border-theme border-line bg-paper-deep px-3.5 py-2.5">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent motion-reduce:animate-none" />
        <span className="text-sm font-bold text-ink">
          Langkah {activeStep + 1} dari {total}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant={isPlaying ? 'secondary' : 'primary'}
          onClick={onTogglePlay}
          title={isPlaying ? 'Jeda animasi' : 'Putar alur otomatis'}
        >
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d={isPlaying ? 'M6 4h4v16H6V4zm8 0h4v16h-4V4z' : 'M8 5v14l11-7z'} />
          </svg>
          <span>{isPlaying ? 'Jeda' : 'Putar Alur'}</span>
        </Button>

        <IconButton
          label="Kembali ke langkah pertama"
          title="Kembali ke langkah pertama"
          onClick={onReset}
          icon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
        />
      </div>
    </div>
  );
}
