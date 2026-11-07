import { Button, Callout, Card, ProgressBar } from '@/components/ui';
import { getMisconceptionExplanation } from './fallback';

interface QuizResultProps {
  isDiagnostic: boolean;
  conceptTitle: string;
  masteryPercent: number;
  misconceptions: string[];
  onClose?: () => void;
}

export function QuizResult({
  isDiagnostic,
  conceptTitle,
  masteryPercent,
  misconceptions,
  onClose,
}: QuizResultProps) {
  const note = isDiagnostic
    ? masteryPercent >= 60
      ? 'Pemahaman awalmu cukup bagus! Beberapa konsep pengayaan telah ditambahkan ke peta belajar.'
      : 'Kak Ambis telah menyesuaikan urutan peta belajar agar materi fondasi dasar diajarkan bertahap.'
    : masteryPercent >= 70
    ? 'Pemahaman konsepmu sangat baik! Kamu siap lanjut ke tahap berikutnya.'
    : 'Sudah bagus! Terus asah pemahamanmu dengan latihan terbimbing ya.';

  return (
    <Card padding="lg" className="mx-auto max-w-xl space-y-5 text-center">
      <h2 className="text-2xl font-bold text-ink">
        {isDiagnostic ? 'Kuis pemanasan selesai' : 'Hebat! Sesi Belajar Selesai'}
      </h2>
      <p className="text-lg text-ink-soft">
        {isDiagnostic
          ? `Kak Ambis telah memetakan kemampuan awalmu pada konsep ${conceptTitle}.`
          : `Kamu telah menyelesaikan latihan pada konsep ${conceptTitle}.`}
      </p>

      <div className="space-y-2 text-left">
        <ProgressBar
          ratio={masteryPercent / 100}
          label={isDiagnostic ? 'Pemahaman awalmu' : 'Tingkat Pemahaman'}
          kind="meter"
        />
        <p className="text-base text-ink-soft">{note}</p>
      </div>

      {isDiagnostic && (
        <Callout tone="warn" title="Fokus Bimbingan Kak Ambis:" className="text-left">
          {misconceptions.length > 0 ? (
            <ul className="mt-2 space-y-2 text-base text-ink">
              {misconceptions.map((code) => (
                <li key={code} className="flex items-start gap-2 rounded-md bg-card p-2.5">
                  <span className="shrink-0 font-bold text-attention">•</span>
                  <span>{getMisconceptionExplanation(code)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span>
              Tidak terdeteksi miskonsepsi mendasar. Kamu siap langsung memahami materi inti dan menyelesaikan latihan soal!
            </span>
          )}
          <p className="mt-2 text-base font-medium">
            Peta belajarmu sudah disesuaikan berdasarkan hasil di atas.
          </p>
        </Callout>
      )}

      {onClose && (
        <div className="flex justify-center">
          <Button size="lg" onClick={onClose}>
            {isDiagnostic ? 'Buka Peta Belajar yang Disesuaikan' : 'Kembali ke Peta Belajar'}
          </Button>
        </div>
      )}
    </Card>
  );
}
