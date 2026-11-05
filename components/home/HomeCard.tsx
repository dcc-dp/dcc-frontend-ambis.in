import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from '@/components/ui';

interface HomeCardProps {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  featured?: boolean;
}

export function HomeCard({ href, title, description, icon, featured = false }: HomeCardProps) {
  return (
    <Link href={href} className="block rounded-xl focus-pop">
      <Card
        padding="lg"
        className={`flex h-full items-center gap-4 transition-colors hover:bg-paper-deep ${
          featured ? 'border-accent bg-accent-soft' : 'items-start'
        }`}
      >
        <span
          aria-hidden="true"
          className={`inline-flex shrink-0 items-center justify-center rounded-lg ${
            featured ? 'h-14 w-14 bg-card text-accent-ink' : 'h-12 w-12 bg-accent-soft text-accent-ink'
          }`}
        >
          {icon}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={`${featured ? 'text-2xl font-bold' : 'text-xl font-semibold'} text-ink`}>{title}</span>
          <span className="text-base text-ink-soft">{description}</span>
        </span>
        {featured && (
          <span className="flex shrink-0 items-center gap-2 text-lg font-bold text-accent-ink">
            Mulai
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </span>
        )}
      </Card>
    </Link>
  );
}
