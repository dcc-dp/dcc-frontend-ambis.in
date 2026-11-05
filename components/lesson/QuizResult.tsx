import { Button, Callout, Card, ProgressBar } from '@/components/ui';

interface QuizResultProps {
  score: number;
  passed: boolean;
  onRetake: () => void;
  onBackToChapter: () => void;
  onContinue: () => void;
}

export function QuizResult({ score, passed, onRetake, onBackToChapter, onContinue }: QuizResultProps) {
  return (
    <div className="mt-8">
      <Card padding="lg" className="mb-6 text-center">
        <h2 className="mb-3 text-2xl font-bold text-ink">
          {passed ? 'Hebat, kamu berhasil!' : 'Belum berhasil, ayo coba lagi'}
        </h2>
        <div className="mb-4 text-left">
          <ProgressBar kind="meter" ratio={score / 100} label="Nilai kamu" valueText={`${score} persen`} />
        </div>
        <Callout tone={passed ? 'success' : 'warn'} live="polite" title={passed ? 'Hebat:' : 'Ayo coba lagi:'}>
          {passed
            ? 'Kamu telah berhasil menyelesaikan kuis ini!'
            : 'Tidak apa-apa, coba lagi ya. Kamu pasti bisa!'}
        </Callout>
      </Card>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        {!passed && <Button onClick={onRetake}>Coba Lagi</Button>}
        <Button variant="secondary" onClick={onBackToChapter}>
          ← Kembali ke bab
        </Button>
        {passed && <Button onClick={onContinue}>Lanjutkan Belajar →</Button>}
      </div>
    </div>
  );
}
