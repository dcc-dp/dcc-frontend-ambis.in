import type { ReactNode } from 'react';
import { Badge, Button, Callout, Card, Field, IconButton, Input, ProgressBar } from '@/components/ui';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const VARIANT_LABEL = {
  primary: 'Utama',
  secondary: 'Sekunder',
  ghost: 'Ringan',
  danger: 'Bahaya',
} as const;

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {children}
    </section>
  );
}

export function ButtonSection() {
  return (
    <Section title="Button">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-2">
          {SIZES.map((size) => (
            <Button key={size} variant={variant} size={size}>
              {VARIANT_LABEL[variant]} {size}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled>Tidak aktif</Button>
        <Button loading>Menyimpan</Button>
      </div>
    </Section>
  );
}

function CloseGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      className="h-6 w-6"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconSection() {
  return (
    <Section title="IconButton">
      <div className="flex flex-wrap items-center gap-2">
        <IconButton label="Tutup 44" icon={<CloseGlyph />} size={44} />
        <IconButton label="Tutup 48" icon={<CloseGlyph />} size={48} variant="secondary" />
        <IconButton label="Tidak aktif" icon={<CloseGlyph />} disabled />
      </div>
    </Section>
  );
}

export function CardSection() {
  return (
    <Section title="Card">
      <Card tone="card">Kartu biasa: Ibu punya 3/5 kg gula.</Card>
      <Card tone="sunken">Kartu cekung: latar sedikit lebih gelap.</Card>
      <Card tone="outline" padding="sm">
        Kartu garis tepi: hanya garis luar.
      </Card>
    </Section>
  );
}

export function BadgeSection() {
  return (
    <Section title="Badge">
      <div className="flex flex-wrap gap-2">
        <Badge>Netral</Badge>
        <Badge tone="accent">Aksen</Badge>
        <Badge tone="correct">Benar</Badge>
        <Badge tone="attention">Perhatikan</Badge>
        <Badge tone="wrong">Salah</Badge>
        <Badge tone="mark">Penanda</Badge>
      </div>
    </Section>
  );
}

export function CalloutSection() {
  return (
    <Section title="Callout">
      <Callout tone="info">Ibu punya 3/5 kg gula, berapa pecahan sisanya?</Callout>
      <Callout tone="success" live="polite">
        Jawabanmu 2/5 kg, tepat sekali.
      </Callout>
      <Callout tone="warn">Cek lagi satuan beratnya.</Callout>
      <Callout tone="error" live="assertive">
        Jawabanmu belum sama dengan hasil pembagian.
      </Callout>
    </Section>
  );
}

export function FieldSection() {
  return (
    <Section title="Field">
      <Field label="Jawaban" hint="Tulis angka saja, contoh: 2">
        <Input placeholder="Contoh: 2" />
      </Field>
      <Field label="Jawaban" error="Perhatikan: Jawabanmu belum tepat, coba hitung ulang.">
        <Input defaultValue="3" />
      </Field>
    </Section>
  );
}

export function ProgressSection() {
  return (
    <Section title="ProgressBar">
      <ProgressBar ratio={0} label="Materi pecahan" />
      <ProgressBar ratio={0.43} label="Latihan minggu ini" />
      <ProgressBar ratio={1} label="Skor akhir" kind="meter" />
    </Section>
  );
}
