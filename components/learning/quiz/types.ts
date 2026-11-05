export interface ExerciseItem {
  id: string;
  concept_id?: string;
  question: string;
  options?: Array<{ key: string; label: string; misconception_id?: string | null }> | null;
  correct_answer?: string;
  difficulty?: number;
  kind?: string;
  solution_steps?: string[] | null;
}

export interface QuizProps {
  questions: ExerciseItem[];
  conceptTitle?: string;
  isDiagnostic?: boolean;
  onComplete?: (finalMastery: number, misconceptions: string[]) => void;
  onClose?: () => void;
}

export interface AgentFeedback {
  is_correct: boolean;
  error_type: string | null;
  misconception_code: string | null;
  intervention: {
    kind: string;
    rule_code: string;
    reason: string;
    text?: string;
    visual?: unknown;
  } | null;
  mastery: number;
}
