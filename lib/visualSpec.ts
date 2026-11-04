export type InterventionKind = 'guiding_question' | 'hint' | 'explanation' | 'worked_example';

export interface NoteBlock {
  type: 'note';
  tone: 'info' | 'warn' | 'success';
  text: string;
  caption?: string;
}

export interface FractionBarRow {
  label: string;
  numerator: number;
  denominator: number;
}

export interface FractionBarBlock {
  type: 'fraction_bar';
  rows: FractionBarRow[];
  align_denominator?: number;
  caption?: string;
}

export interface NumberLinePoint {
  at: string;
  label: string;
}

export interface NumberLineArrow {
  from: string;
  by: string;
  label: string;
  hidden_end?: boolean;
}

export interface NumberLineBlock {
  type: 'number_line';
  start: string;
  end: string;
  ticks: number;
  points: NumberLinePoint[];
  arrows: NumberLineArrow[];
  caption?: string;
}

export type AnalogyTemplate = 'pizza' | 'coklat' | 'botol_air' | 'pita';

export interface AnalogySceneBlock {
  type: 'analogy_scene';
  template: AnalogyTemplate;
  story: string;
  items: { fraction: string }[];
  caption?: string;
}

export interface Step {
  n: number;
  title: string;
  detail?: string;
  math?: string;
  locked?: boolean;
}

export interface StepFlowBlock {
  type: 'step_flow';
  steps: Step[];
  caption?: string;
}

export interface AnswerInputBlock {
  type: 'answer_input';
  mode: 'mcq' | 'short' | 'fraction';
  prompt: string;
  options?: { key: string; text: string }[];
  caption?: string;
}

export type VisualBlock =
  | NoteBlock
  | FractionBarBlock
  | NumberLineBlock
  | AnalogySceneBlock
  | StepFlowBlock
  | AnswerInputBlock;

export interface VisualSpec {
  spec_version: string;
  intervention_kind: InterventionKind;
  title: string;
  blocks: VisualBlock[];
}

const KINDS: InterventionKind[] = ['guiding_question', 'hint', 'explanation', 'worked_example'];
const TEMPLATES: AnalogyTemplate[] = ['pizza', 'coklat', 'botol_air', 'pita'];

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const asString = (v: unknown): string | null => (typeof v === 'string' ? v : null);
const asNumber = (v: unknown): number | null =>
  typeof v === 'number' && Number.isFinite(v) ? v : null;

export function fractionParts(value: string): { n: number; d: number } | null {
  const match = /^(\d+)(?:\/(\d+))?$/.exec(value.trim());
  if (!match) return null;
  const n = Number(match[1]);
  const d = match[2] === undefined ? 1 : Number(match[2]);
  return d === 0 ? null : { n, d };
}

export function fractionValue(value: string): number | null {
  const parts = fractionParts(value);
  return parts ? parts.n / parts.d : null;
}

function normalizeBlock(raw: unknown): VisualBlock | null {
  if (!isRecord(raw)) return null;
  const caption = asString(raw.caption) ?? undefined;

  switch (raw.type) {
    case 'note': {
      const text = asString(raw.text);
      if (!text) return null;
      const tone = raw.tone === 'warn' || raw.tone === 'success' ? raw.tone : 'info';
      return { type: 'note', tone, text, caption };
    }
    case 'fraction_bar': {
      if (!Array.isArray(raw.rows)) return null;
      const rows: FractionBarRow[] = [];
      for (const row of raw.rows) {
        if (!isRecord(row)) continue;
        const numerator = asNumber(row.numerator);
        const denominator = asNumber(row.denominator);
        if (numerator === null || denominator === null || denominator < 1) continue;
        rows.push({ label: asString(row.label) ?? '', numerator, denominator });
      }
      if (rows.length === 0) return null;
      const align = asNumber(raw.align_denominator) ?? undefined;
      return { type: 'fraction_bar', rows, align_denominator: align, caption };
    }
    case 'number_line': {
      const start = asString(raw.start) ?? '0';
      const end = asString(raw.end) ?? '1';
      const lo = fractionValue(start);
      const hi = fractionValue(end);
      if (lo === null || hi === null || lo >= hi) return null;
      const points: NumberLinePoint[] = [];
      for (const p of Array.isArray(raw.points) ? raw.points : []) {
        if (isRecord(p) && asString(p.at) && fractionValue(asString(p.at) as string) !== null) {
          points.push({ at: p.at as string, label: asString(p.label) ?? '' });
        }
      }
      const arrows: NumberLineArrow[] = [];
      for (const a of Array.isArray(raw.arrows) ? raw.arrows : []) {
        if (!isRecord(a)) continue;
        const from = asString(a.from);
        const by = asString(a.by);
        if (!from || !by || fractionValue(from) === null || fractionValue(by) === null) continue;
        arrows.push({ from, by, label: asString(a.label) ?? '', hidden_end: a.hidden_end === true });
      }
      const ticks = Math.min(Math.max(Math.round(asNumber(raw.ticks) ?? 10), 1), 40);
      return { type: 'number_line', start, end, ticks, points, arrows, caption };
    }
    case 'analogy_scene': {
      const story = asString(raw.story);
      const template = TEMPLATES.find((t) => t === raw.template);
      if (!story || !template || !Array.isArray(raw.items)) return null;
      const items = raw.items
        .filter(isRecord)
        .map((i) => asString(i.fraction))
        .filter((f): f is string => f !== null && fractionParts(f) !== null)
        .map((fraction) => ({ fraction }));
      if (items.length === 0) return null;
      return { type: 'analogy_scene', template, story, items, caption };
    }
    case 'step_flow': {
      if (!Array.isArray(raw.steps)) return null;
      const steps: Step[] = [];
      for (const s of raw.steps) {
        if (!isRecord(s)) continue;
        const title = asString(s.title);
        if (!title) continue;
        steps.push({
          n: steps.length + 1,
          title,
          detail: asString(s.detail) ?? undefined,
          math: asString(s.math) ?? undefined,
          locked: s.locked === true,
        });
      }
      return steps.length === 0 ? null : { type: 'step_flow', steps, caption };
    }
    case 'answer_input': {
      const prompt = asString(raw.prompt);
      if (!prompt) return null;
      const mode = raw.mode === 'mcq' || raw.mode === 'fraction' ? raw.mode : 'short';
      const options = Array.isArray(raw.options)
        ? raw.options
            .filter(isRecord)
            .map((o) => ({ key: asString(o.key) ?? '', text: asString(o.text) ?? '' }))
            .filter((o) => o.key)
        : undefined;
      return { type: 'answer_input', mode, prompt, options, caption };
    }
    default:
      return null;
  }
}

export function normalizeVisualSpec(raw: unknown): VisualSpec | null {
  if (!isRecord(raw) || !Array.isArray(raw.blocks)) return null;
  const kind = KINDS.find((k) => k === raw.intervention_kind);
  if (!kind) return null;
  const blocks = raw.blocks.map(normalizeBlock).filter((b): b is VisualBlock => b !== null);
  if (blocks.length === 0) return null;
  return {
    spec_version: asString(raw.spec_version) ?? '0.1',
    intervention_kind: kind,
    title: asString(raw.title) ?? '',
    blocks,
  };
}
