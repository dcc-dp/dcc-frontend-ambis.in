import { providerStyle, type ModelInfo } from './constants';
import ModelOption from './ModelOption';

interface ModelPanelProps {
  models: ModelInfo[];
  selectedModelId: string;
  onSelect: (modelId: string) => void;
}

function groupByProvider(models: ModelInfo[]) {
  return models.reduce<Record<string, ModelInfo[]>>((acc, m) => {
    if (!acc[m.provider]) acc[m.provider] = [];
    acc[m.provider].push(m);
    return acc;
  }, {});
}

function ProviderHeader({ provider, label }: { provider: string; label: string }) {
  const line = `h-0.5 flex-1 rounded-full ${providerStyle(provider).line}`;
  return (
    <div className="flex items-center gap-2 px-4 py-1.5">
      <div className={line} />
      <span className="whitespace-nowrap text-sm font-bold uppercase tracking-wider text-ink-soft">{label}</span>
      <div className={line} />
    </div>
  );
}

export default function ModelPanel({ models, selectedModelId, onSelect }: ModelPanelProps) {
  const grouped = groupByProvider(models);

  return (
    <div className="absolute bottom-full left-0 z-50 mb-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border-theme border-line bg-card shadow-lg animate-fade-in">
      <div className="border-b border-line bg-paper-deep px-4 py-3">
        <p className="text-sm font-bold text-ink">🤖 Pilih Model AI</p>
        <p className="mt-0.5 text-sm text-ink-soft">Semua model gratis • Dipowered oleh multi-provider</p>
      </div>

      <div className="max-h-72 overflow-y-auto py-2">
        {Object.entries(grouped).map(([provider, providerModels]) => (
          <div key={provider}>
            <ProviderHeader provider={provider} label={providerModels[0].provider_label} />
            {providerModels.map((model) => (
              <ModelOption
                key={model.id}
                model={model}
                isSelected={model.id === selectedModelId}
                onSelect={onSelect}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-line bg-paper-deep px-4 py-2">
        <p className="text-center text-sm text-ink-soft">✨ Powered by Google Gemini · Groq · OpenRouter</p>
      </div>
    </div>
  );
}
