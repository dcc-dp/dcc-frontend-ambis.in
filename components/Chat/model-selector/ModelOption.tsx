import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { ModelInfo } from './constants';

interface ModelOptionProps {
  model: ModelInfo;
  isSelected: boolean;
  onSelect: (modelId: string) => void;
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function ModelOption({ model, isSelected, onSelect }: ModelOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(model.id)}
      className={cn(
        'flex min-h-11 w-full items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-paper-deep focus-pop',
        isSelected && 'bg-accent-soft',
      )}
      id={`model-option-${model.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
    >
      <span className="mt-0.5 shrink-0 text-base">{model.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn('truncate text-sm font-semibold', isSelected ? 'text-accent-ink' : 'text-ink')}>
            {model.name}
          </span>
          {model.is_free && (
            <Badge tone="correct" className="shrink-0 rounded-full font-bold">
              FREE
            </Badge>
          )}
        </div>
        <p className="mt-0.5 truncate text-sm text-ink-soft">{model.description}</p>
      </div>
      {isSelected && <CheckIcon />}
    </button>
  );
}
