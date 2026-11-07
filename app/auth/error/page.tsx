'use client';

import Link from 'next/link';
import { Callout, Card } from '@/components/ui';

export default function ErrorPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-paper text-ink">
      <Card as="section" padding="lg" className="w-full max-w-md text-center">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-attention">
          <path d="M12 3l10 18H2z" />
          <path d="M12 10v5" />
          <path d="M12 18v.01" />
        </svg>
        <h1 className="text-3xl font-bold text-ink mb-2">Ups, ada yang tidak berhasil</h1>
        <div className="mb-6 text-left">
          <Callout tone="error" title="Maaf,">
            ada kesalahan saat memproses permintaanmu. Coba lagi, ya.
          </Callout>
        </div>
        <Link
          href="/"
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-lg border-theme border-accent bg-accent px-5 text-xl font-semibold text-on-accent transition-colors hover:bg-accent-ink focus-pop"
        >
          Kembali ke beranda
        </Link>
      </Card>
    </div>
  );
}
