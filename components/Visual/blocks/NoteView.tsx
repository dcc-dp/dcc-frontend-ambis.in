'use client';

import RichText from '../RichText';
import { Callout, type CalloutTone } from '@/components/ui';
import type { NoteBlock } from '@/lib/visualSpec';

const NOTE_TONE = { info: 'info', warn: 'warn', success: 'success' } as const satisfies Record<NoteBlock['tone'], CalloutTone>;

export function NoteView({ block }: { block: NoteBlock }) {
  return (
    <Callout tone={NOTE_TONE[block.tone]} className="max-w-[60ch] text-[18px] leading-[1.65]">
      <RichText text={block.text} />
    </Callout>
  );
}
