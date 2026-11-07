import { generateInitialRoadmap } from './roadmap';
import type { RoadmapResult, RoadmapStep } from './types';

interface ApiStep {
  id?: string;
  title: string;
  description: string;
  type?: RoadmapStep['type'];
  has_quiz?: boolean;
  recommended_badge?: string;
}

export async function requestDynamicRoadmap(
  topic: string,
  subtopic: string,
  goal: string,
  difficulty: string,
  diagnosticScore?: number,
  misconceptions?: string[]
): Promise<RoadmapResult> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    const res = await fetch(`${baseUrl}/api/v1/learning-paths/generate-roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        subtopic,
        goal,
        difficulty,
        diagnostic_score: diagnosticScore,
        misconceptions,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const steps: RoadmapStep[] = data.steps.map((s: ApiStep, idx: number) => ({
        id: s.id || `step-${idx + 1}`,
        title: s.title,
        description: s.description,
        type: s.type || 'lesson',
        completed: false,
        current: idx === 0,
        hasQuiz: Boolean(s.has_quiz),
        recommendedBadge: s.recommended_badge || undefined,
      }));
      return {
        steps,
        reasoning: data.reasoning,
        isFallback: data.is_fallback,
        message: data.message,
      };
    }
  } catch (err) {
    console.error('Failed to call generate-roadmap:', err);
  }

  return {
    steps: generateInitialRoadmap(subtopic),
    reasoning: 'Roadmap terstruktur disusun berdasarkan kurikulum acuan.',
    isFallback: true,
    message: 'Maaf ya, Kak Ambis sedang mengalami sedikit kendala koneksi ke server AI saat menyusun roadmap otomatis. Untuk sementara, Kak Ambis siapkan rekomendasi kurikulum standar ini ya!',
  };
}
