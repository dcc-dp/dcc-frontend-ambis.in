'use client';

import { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { MODEL_STORAGE_KEY, providerStyle, type ModelInfo } from './model-selector/constants';
import { useModelList } from './model-selector/use-model-list';
import ModelPanel from './model-selector/ModelPanel';

export type { ModelInfo };
export { MODEL_STORAGE_KEY };

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  apiBaseUrl?: string;
}

export default function ModelSelector({
  selectedModelId,
  onModelChange,
  apiBaseUrl,
}: ModelSelectorProps) {
  const { models, isLoading } = useModelList(apiBaseUrl, selectedModelId, onModelChange);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (modelId: string) => {
    onModelChange(modelId);
    localStorage.setItem(MODEL_STORAGE_KEY, modelId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative" id="model-selector">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex min-h-11 items-center gap-2 rounded-lg border-theme border-edge bg-card px-3 text-ink transition-colors hover:bg-paper-deep focus-pop"
        title="Pilih model AI"
        id="model-selector-trigger"
      >
        {isLoading ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-line border-t-accent motion-reduce:animate-none" />
        ) : (
          <span className="text-sm">{selectedModel?.icon || '🤖'}</span>
        )}
        <span className="max-w-[110px] truncate text-sm font-semibold">
          {isLoading ? 'Memuat...' : selectedModel?.name || 'Pilih Model'}
        </span>
        {selectedModel && (
          <Badge tone={providerStyle(selectedModel.provider).tone} className="hidden sm:inline-flex">
            {selectedModel.provider_label}
          </Badge>
        )}
        <svg
          className={cn('h-3.5 w-3.5 text-ink-soft transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && <ModelPanel models={models} selectedModelId={selectedModelId} onSelect={handleSelect} />}
    </div>
  );
}
