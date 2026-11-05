export interface CanvasStep {
  number: number;
  title: string;
  body: string;
  formula: string;
  short_desc?: string;
}

export interface CanvasData {
  title: string;
  subject: 'Matematika' | 'Informatika' | 'Umum';
  analogy: string;
  concept: string;
  core_formula?: string;
  steps: CanvasStep[];
  summary: string;
  final_answer?: string;
  raw_content: string;
}

export type CanvasTab = 'flow' | 'concept' | 'summary';
