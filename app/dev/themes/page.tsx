'use client';

import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { TokenSwatches } from './TokenSwatches';
import { PrimitiveShowcase } from './PrimitiveShowcase';

const PANES = [
  { theme: 'buku-tulis', label: 'Buku Tulis' },
  { theme: 'papan-kapur', label: 'Papan Kapur' },
] as const;

export default function ThemeGalleryPage() {
  return (
    <main className="flex min-h-screen flex-col gap-6 bg-paper p-4 text-ink sm:p-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-ink">Galeri tema</h1>
        <p className="text-lg text-ink-soft">
          Halaman ini memperlihatkan semua warna token dan komponen dasar untuk kedua tema
          berdampingan. Pilihan di bawah ini juga mengubah tema aplikasi yang sebenarnya.
        </p>
        <div>
          <ThemeSwitcher />
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">
        {PANES.map((pane) => (
          <div key={pane.theme} data-theme={pane.theme} className="theme-surface rounded-xl p-4">
            <h2 className="mb-4 text-xl font-bold text-ink">{pane.label}</h2>
            <div className="flex flex-col gap-8">
              <TokenSwatches />
              <PrimitiveShowcase />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
