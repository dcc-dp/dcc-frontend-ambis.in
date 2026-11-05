'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { key: 'beranda', href: '/', label: 'Beranda' },
  { key: 'latihan', href: '/dashboard/canvas', label: 'Latihan' },
  { key: 'tanya', href: '/dashboard/canvas?tab=ask', label: 'Tanya' },
  { key: 'belajar', href: '/dashboard/learning', label: 'Belajar' },
  { key: 'progres', href: '/dashboard/progress', label: 'Progres' },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]['key'];

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const ICONS: Record<NavKey, ReactNode> = {
  beranda: (
    <Icon>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </Icon>
  ),
  latihan: (
    <Icon>
      <path d="M4 20l4-1 11-11-3-3L5 16z" />
      <path d="M14 6l3 3" />
    </Icon>
  ),
  tanya: (
    <Icon>
      <path d="M4 5h16v11H9l-5 4z" />
      <path d="M9 10h6" />
    </Icon>
  ),
  belajar: (
    <Icon>
      <path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z" />
      <path d="M12 6v14" />
    </Icon>
  ),
  progres: (
    <Icon>
      <path d="M5 20V12" />
      <path d="M12 20V6" />
      <path d="M19 20v-5" />
    </Icon>
  ),
};

function useActiveKey(): NavKey | null {
  const pathname = usePathname();
  const tab = useSearchParams().get('tab');

  if (pathname === '/') return 'beranda';
  if (pathname.startsWith('/dashboard/canvas')) return tab === 'ask' ? 'tanya' : 'latihan';
  if (pathname.startsWith('/dashboard/learning')) return 'belajar';
  if (pathname.startsWith('/dashboard/progress')) return 'progres';
  return null;
}

export function DesktopNav() {
  const activeKey = useActiveKey();

  return (
    <nav aria-label="Menu utama" className="flex items-end gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex min-h-11 items-center px-4 text-lg font-semibold border-b-[3px] focus-pop',
              isActive
                ? 'border-accent text-ink'
                : 'border-transparent text-ink-soft hover:text-ink',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const activeKey = useActiveKey();

  return (
    <nav
      aria-label="Menu utama"
      className="fixed inset-x-0 bottom-0 z-40 bg-card border-t-theme border-line pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 gap-1 p-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg border-t-[3px] text-sm focus-pop',
                isActive
                  ? 'border-accent bg-accent-soft font-bold text-accent-ink'
                  : 'border-transparent font-semibold text-ink-soft',
              )}
            >
              {ICONS[item.key]}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
