import { cn } from '@/lib/cn';
import type { SubjectTone } from './subject-tone';

interface FlowConnectorProps {
  isActive: boolean;
  isCompleted: boolean;
  tone: SubjectTone;
}

export default function FlowConnector({ isActive, isCompleted, tone }: FlowConnectorProps) {
  const stroke = isActive ? tone.stroke : isCompleted ? 'stroke-correct' : 'stroke-edge';
  const fill = isActive ? tone.fill : isCompleted ? 'fill-correct' : 'fill-edge';

  return (
    <div className="my-0.5 flex h-8 w-full select-none flex-col items-center justify-center" aria-hidden="true">
      <svg className="h-8 w-5 overflow-visible" viewBox="0 0 20 32">
        <line
          x1="10"
          y1="0"
          x2="10"
          y2="24"
          strokeWidth="2.5"
          strokeDasharray={isActive ? '4 4' : 'none'}
          className={cn(stroke, isActive && 'animate-flow-dash motion-reduce:animate-none')}
        />
        <polygon points="6,22 14,22 10,30" className={fill} />
      </svg>
    </div>
  );
}
