import { useEffect, useRef, useState } from 'react';
import { FALLBACK_MODELS, type ModelInfo } from './constants';

export function useModelList(
  apiBaseUrl: string | undefined,
  selectedModelId: string,
  onModelChange: (modelId: string) => void,
) {
  const [models, setModels] = useState<ModelInfo[]>(FALLBACK_MODELS);
  const [isLoading, setIsLoading] = useState(true);
  const latest = useRef({ selectedModelId, onModelChange });

  useEffect(() => {
    latest.current = { selectedModelId, onModelChange };
  });

  useEffect(() => {
    const base = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    fetch(`${base}/api/v1/models/`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.models || data.models.length === 0) return;
        setModels(data.models);
        const currentExists = data.models.find(
          (m: ModelInfo) => m.id === latest.current.selectedModelId,
        );
        if (!currentExists && data.default_model_id) {
          latest.current.onModelChange(data.default_model_id);
        }
      })
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, [apiBaseUrl]);

  return { models, isLoading };
}
