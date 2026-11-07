import LearningCanvas from '@/components/Canvas/LearningCanvas';
import type { CanvasData } from '@/components/Canvas/LearningCanvas';

interface CanvasPanelProps {
  data: CanvasData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CanvasPanel({ data, isOpen, onClose }: CanvasPanelProps) {
  return (
    <aside
      aria-label="Learning Canvas Panel"
      className={`shrink-0 h-full bg-card flex flex-col z-10 overflow-hidden canvas-panel ${
        isOpen && data ? 'canvas-panel-open border-l-theme border-line shadow-xl md:shadow-none' : 'border-l-0'
      }`}
    >
      {data && <LearningCanvas data={data} isOpen={isOpen} onClose={onClose} />}
    </aside>
  );
}
