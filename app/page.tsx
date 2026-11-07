import Link from 'next/link';
import type { ReactNode } from 'react';
import { AppShell } from '@/components/Layout/AppShell';
import { HomeCard } from '@/components/home/HomeCard';
import { ThemeSwitcher } from '@/components/theme/ThemeSwitcher';
import { Card } from '@/components/ui';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="28"
      height="28"
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

const CARDS = [
  {
    href: '/dashboard/canvas',
    title: 'Latihan soal',
    description: 'Kerjakan soal, lihat penjelasannya bergambar.',
    icon: (
      <Icon>
        <path d="M4 20l4-1 11-11-3-3L5 16z" />
        <path d="M14 6l3 3" />
      </Icon>
    ),
  },
  {
    href: '/dashboard/canvas?tab=ask',
    title: 'Tanya bebas',
    description: 'Tulis pertanyaanmu, dijawab dengan gambar.',
    icon: (
      <Icon>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M9 10h6" />
      </Icon>
    ),
  },
  {
    href: '/dashboard/learning',
    title: 'Belajar',
    description: 'Ikuti jalur belajar Matematika dan Informatika.',
    icon: (
      <Icon>
        <path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z" />
        <path d="M12 6v14" />
      </Icon>
    ),
  },
  {
    href: '/dashboard/progress',
    title: 'Progres',
    description: 'Lihat sampai mana kamu sudah paham.',
    icon: (
      <Icon>
        <path d="M5 20V12" />
        <path d="M12 20V6" />
        <path d="M19 20v-5" />
      </Icon>
    ),
  },
];

export default function HomePage() {
  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">Mau belajar apa hari ini?</h1>
          <p className="mt-2 text-lg text-ink-soft">Pilih salah satu, lalu mulai.</p>
        </div>
        <HomeCard {...CARDS[0]} featured />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.slice(1).map((card) => (
            <HomeCard key={card.href} {...card} />
          ))}
        </div>
        <Card as="section" aria-labelledby="judul-tampilan" padding="lg">
          <h2 id="judul-tampilan" className="mb-4 text-xl font-semibold text-ink">
            Pilih tampilan belajarmu
          </h2>
          <ThemeSwitcher />
        </Card>
        {process.env.NODE_ENV !== 'production' && (
          <Link
            href="/chat"
            className="inline-flex min-h-11 items-center self-start text-base text-accent underline focus-pop"
          >
            Chat versi lama (sementara)
          </Link>
        )}
      </div>
    </AppShell>
  );
}
