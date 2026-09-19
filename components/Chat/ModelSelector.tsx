'use client';

import { useState, useEffect, useRef } from 'react';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  provider_label: string;
  description: string;
  is_free: boolean;
  icon: string;
}

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  apiBaseUrl?: string;
}

const PROVIDER_COLORS: Record<string, string> = {
  google: 'from-blue-500 to-blue-600',
  groq: 'from-orange-500 to-yellow-500',
  openrouter: 'from-purple-500 to-violet-600',
};

const PROVIDER_BG: Record<string, string> = {
  google: 'bg-blue-50 border-blue-200 text-blue-700',
  groq: 'bg-orange-50 border-orange-200 text-orange-700',
  openrouter: 'bg-purple-50 border-purple-200 text-purple-700',
};

// Fallback models jika API tidak tersedia
const FALLBACK_MODELS: ModelInfo[] = [
  {
    id: 'groq/llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    provider: 'groq',
    provider_label: 'Groq',
    description: 'Meta Llama 70B - super cepat via Groq',
    is_free: true,
    icon: '⚡',
  },
  {
    id: 'gemini/gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    provider_label: 'Google Gemini',
    description: 'Model terbaru Google, cepat & pintar',
    is_free: true,
    icon: '🔵',
  },
  {
    id: 'gemini/gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    provider_label: 'Google Gemini',
    description: 'Stabil, 1 juta token context window',
    is_free: true,
    icon: '🔵',
  },
  {
    id: 'groq/llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    provider: 'groq',
    provider_label: 'Groq',
    description: 'Paling cepat, cocok untuk Q&A singkat',
    is_free: true,
    icon: '⚡',
  },
  {
    id: 'groq/gemma2-9b-it',
    name: 'Gemma 2 9B',
    provider: 'groq',
    provider_label: 'Groq',
    description: 'Google Gemma 2 dijalankan di Groq',
    is_free: true,
    icon: '⚡',
  },
  {
    id: 'openrouter/meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B (OpenRouter)',
    provider: 'openrouter',
    provider_label: 'OpenRouter',
    description: 'Llama 3.1 8B gratis via OpenRouter',
    is_free: true,
    icon: '🌐',
  },
  {
    id: 'openrouter/mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B (OpenRouter)',
    provider: 'openrouter',
    provider_label: 'OpenRouter',
    description: 'Mistral 7B gratis via OpenRouter',
    is_free: true,
    icon: '🌐',
  },
];

const MODEL_STORAGE_KEY = 'ambisin_selected_model';

export default function ModelSelector({
  selectedModelId,
  onModelChange,
  apiBaseUrl,
}: ModelSelectorProps) {
  const [models, setModels] = useState<ModelInfo[]>(FALLBACK_MODELS);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel = models.find((m) => m.id === selectedModelId) || models[0];

  // Fetch daftar model dari backend
  useEffect(() => {
    const base = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    fetch(`${base}/api/v1/models/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.models && data.models.length > 0) {
          setModels(data.models);
          // Jika model yang dipilih tidak ada di list baru, pakai default
          const currentExists = data.models.find((m: ModelInfo) => m.id === selectedModelId);
          if (!currentExists && data.default_model_id) {
            onModelChange(data.default_model_id);
          }
        }
      })
      .catch(() => {
        // Pakai fallback models - sudah di-set di state awal
      })
      .finally(() => setIsLoading(false));
  }, [apiBaseUrl]);

  // Close dropdown saat klik di luar
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

  // Group models by provider
  const grouped = models.reduce<Record<string, ModelInfo[]>>((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {});

  return (
    <div ref={dropdownRef} className="relative" id="model-selector">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 shadow-sm group cursor-pointer"
        title="Pilih model AI"
        id="model-selector-trigger"
      >
        {isLoading ? (
          <span className="w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        ) : (
          <span className="text-sm">{selectedModel?.icon || '🤖'}</span>
        )}
        <span className="text-xs font-semibold text-gray-700 max-w-[110px] truncate">
          {isLoading ? 'Memuat...' : (selectedModel?.name || 'Pilih Model')}
        </span>
        {selectedModel && (
          <span
            className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${
              PROVIDER_BG[selectedModel.provider] || 'bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
            {selectedModel.provider_label}
          </span>
        )}
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
            <p className="text-xs font-bold text-gray-800">🤖 Pilih Model AI</p>
            <p className="text-[10px] text-gray-500 mt-0.5">Semua model gratis • Dipowered oleh multi-provider</p>
          </div>

          {/* Model Groups */}
          <div className="max-h-72 overflow-y-auto py-2">
            {Object.entries(grouped).map(([provider, providerModels]) => {
              const firstModel = providerModels[0];
              return (
                <div key={provider}>
                  {/* Provider Header */}
                  <div className="px-4 py-1.5 flex items-center gap-2">
                    <div
                      className={`h-0.5 flex-1 rounded-full bg-gradient-to-r ${
                        PROVIDER_COLORS[provider] || 'from-gray-300 to-gray-400'
                      }`}
                    />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {firstModel.provider_label}
                    </span>
                    <div
                      className={`h-0.5 flex-1 rounded-full bg-gradient-to-r ${
                        PROVIDER_COLORS[provider] || 'from-gray-300 to-gray-400'
                      }`}
                    />
                  </div>

                  {/* Models in this provider */}
                  {providerModels.map((model) => {
                    const isSelected = model.id === selectedModelId;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => handleSelect(model.id)}
                        className={`w-full text-left px-4 py-2.5 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer group/item ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                        id={`model-option-${model.id.replace(/[^a-zA-Z0-9]/g, '-')}`}
                      >
                        <span className="text-base mt-0.5 shrink-0">{model.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-semibold truncate ${
                                isSelected ? 'text-blue-700' : 'text-gray-800'
                              }`}
                            >
                              {model.name}
                            </span>
                            {model.is_free && (
                              <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">
                                FREE
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{model.description}</p>
                        </div>
                        {isSelected && (
                          <svg className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 text-center">
              ✨ Powered by Google Gemini · Groq · OpenRouter
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export { MODEL_STORAGE_KEY };
