import type { BadgeTone } from '@/components/ui';

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  provider_label: string;
  description: string;
  is_free: boolean;
  icon: string;
}

export interface ProviderStyle {
  line: string;
  tone: BadgeTone;
}

export const MODEL_STORAGE_KEY = 'ambisin_selected_model';

export const FALLBACK_STYLE: ProviderStyle = { line: 'bg-edge', tone: 'neutral' };

export const PROVIDER_STYLE: Record<string, ProviderStyle> = {
  google: { line: 'bg-accent', tone: 'accent' },
  groq: { line: 'bg-attention', tone: 'attention' },
  openrouter: { line: 'bg-correct', tone: 'correct' },
};

export function providerStyle(provider: string): ProviderStyle {
  return PROVIDER_STYLE[provider] || FALLBACK_STYLE;
}

export const FALLBACK_MODELS: ModelInfo[] = [
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
