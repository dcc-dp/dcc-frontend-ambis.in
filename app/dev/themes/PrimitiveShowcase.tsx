'use client';

import { useState } from 'react';
import { Button, Modal, Tabs, TabPanel } from '@/components/ui';
import {
  BadgeSection,
  ButtonSection,
  CalloutSection,
  CardSection,
  FieldSection,
  IconSection,
  ProgressSection,
  Section,
} from './StaticSections';

const TAB_ITEMS = [
  { value: 'soal', label: 'Soal' },
  { value: 'latihan', label: 'Latihan' },
  { value: 'catatan', label: 'Catatan' },
] as const;
type TabValue = (typeof TAB_ITEMS)[number]['value'];

function TabsSection() {
  const [tab, setTab] = useState<TabValue>('soal');
  return (
    <Section title="Tabs">
      <Tabs label="Bagian belajar" value={tab} onChange={setTab} items={[...TAB_ITEMS]}>
        {TAB_ITEMS.map((item) => (
          <TabPanel key={item.value} value={item.value}>
            Isi panel {item.label.toLowerCase()}: Ibu punya 3/5 kg gula.
          </TabPanel>
        ))}
      </Tabs>
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
