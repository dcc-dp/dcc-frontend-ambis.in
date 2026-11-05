'use client';

import { useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Callout,
  Card,
  Field,
  IconButton,
  Input,
  Modal,
  ProgressBar,
  Tabs,
  TabPanel,
} from '@/components/ui';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const VARIANT_LABEL = {
  primary: 'Utama',
  secondary: 'Sekunder',
  ghost: 'Ringan',
  danger: 'Bahaya',
} as const;
const TAB_ITEMS = [
  { value: 'soal', label: 'Soal' },
  { value: 'latihan', label: 'Latihan' },
  { value: 'catatan', label: 'Catatan' },
] as const;
type TabValue = (typeof TAB_ITEMS)[number]['value'];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {children}
    </section>
  );
}

function ButtonSection() {
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

function IconSection() {
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

function CardSection() {
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

function BadgeSection() {
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

function CalloutSection() {
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

function FieldSection() {
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

function TabsSection() {
  const [tab, setTab] = useState<TabValue>('soal');
  return (
    <Section title="Tabs">
      <Tabs label="Bagian belajar" value={tab} onChange={setTab} items={[...TAB_ITEMS]} />
      {TAB_ITEMS.map((item) => (
        <TabPanel key={item.value} value={item.value}>
          Isi panel {item.label.toLowerCase()}: Ibu punya 3/5 kg gula.
        </TabPanel>
      ))}
    </Section>
  );
}

function ProgressSection() {
  return (
    <Section title="ProgressBar">
      <ProgressBar ratio={0} label="Materi pecahan" />
      <ProgressBar ratio={0.43} label="Latihan minggu ini" />
      <ProgressBar ratio={1} label="Skor akhir" kind="meter" />
    </Section>
  );
}

function ModalSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section title="Modal">
      <div>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Buka jendela
        </Button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Lanjut ke soal berikutnya?"
        description="Jawabanmu sudah tersimpan."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={() => setOpen(false)}>Lanjut</Button>
          </>
        }
      >
        <p>Kamu bisa kembali ke soal ini kapan saja.</p>
      </Modal>
    </Section>
  );
}

export function PrimitiveShowcase() {
  return (
    <div className="flex flex-col gap-8">
      <ButtonSection />
      <IconSection />
      <CardSection />
      <BadgeSection />
      <CalloutSection />
      <FieldSection />
      <TabsSection />
      <ProgressSection />
      <ModalSection />
    </div>
  );
}
