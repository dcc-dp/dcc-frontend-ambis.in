'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { DesktopNav, MobileNav } from '@/components/Layout/AppNav';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-paper text-ink">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:m-2 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-lg focus:bg-accent focus:px-4 focus:text-lg focus:font-semibold focus:text-on-accent focus-pop"
      >
        Lewati ke konten
      </a>
      <header className="sticky top-0 z-30 bg-card border-b border-theme border-line">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-2">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 focus-pop">
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent text-lg font-bold text-on-accent"
            >
              A
            </span>
            <span className="text-xl font-semibold text-ink">Ambis.In</span>
          </Link>
          <div className="hidden flex-1 justify-center md:flex">
            <Suspense fallback={null}>
              <DesktopNav />
            </Suspense>
          </div>
          <div className="ml-auto md:ml-0">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main id="konten" className="flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <div className="md:hidden">
        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
      </div>
    </div>
  );
}
