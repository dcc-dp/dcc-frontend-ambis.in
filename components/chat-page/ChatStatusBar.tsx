import { Badge, Button } from '@/components/ui';

interface ChatStatusBarProps {
  profileName?: string;
  canReopenCanvas: boolean;
  devBypassLimit: boolean;
  onReopenCanvas: () => void;
  onToggleBypass: () => void;
}

const isDev = process.env.NODE_ENV !== 'production';

function CanvasIcon() {
  return (
    <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );
}

export function ChatStatusBar({
  profileName,
  canReopenCanvas,
  devBypassLimit,
  onReopenCanvas,
  onToggleBypass,
}: ChatStatusBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-1.5 border-t-theme border-b-theme border-line bg-paper-deep text-base text-ink-soft flex-shrink-0">
      <div className="flex items-center gap-2 text-ink font-medium">
        <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent" />
        <span>Chat Belajar Interaktif</span>
        {profileName && <Badge tone="accent">Profil: {profileName}</Badge>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {canReopenCanvas && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onReopenCanvas}
            title="Buka kembali Learning Canvas"
          >
            <CanvasIcon />
            <span>Buka Canvas</span>
          </Button>
        )}
        {isDev && (
          <>
            <span className="font-medium text-ink-soft">Mode Dev:</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={onToggleBypass}
              title="Klik untuk aktifkan / matikan batas 3 chat gratis"
            >
              <span
                aria-hidden="true"
                className={`w-2 h-2 rounded-full ${devBypassLimit ? 'bg-correct animate-pulse' : 'bg-attention'}`}
              />
              {devBypassLimit ? 'Batas Chat: OFF (Unlimited)' : 'Batas Chat: ON (Maks 3)'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
