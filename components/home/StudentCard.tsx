'use client';

import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { Badge, Button, Callout, Card, Modal } from '@/components/ui';
import { isDemoStudent, resetStudent } from '@/lib/studentId';

const subscribeNothing = () => () => {};

export function StudentCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const isDemo = useSyncExternalStore(subscribeNothing, isDemoStudent, () => false) && !done;

  const startOver = () => {
    resetStudent();
    setOpen(false);
    setDone(true);
    router.replace('/');
  };

  return (
    <Card as="section" aria-labelledby="judul-siswa" padding="lg">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h2 id="judul-siswa" className="text-xl font-semibold text-ink">
          Mulai dari awal
        </h2>
        {isDemo && <Badge tone="accent">Siswa contoh</Badge>}
      </div>
      <p className="mb-4 max-w-[60ch] text-lg text-ink-soft">
        Kak Ambis mengenalimu lewat jawabanmu. Mau coba sebagai siswa baru? Catatan belajar di perangkat ini akan dihapus.
      </p>
      {done && (
        <Callout tone="success" className="mb-4">
          Siap! Kak Ambis menganggapmu murid baru.
        </Callout>
      )}
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Mulai sebagai siswa baru
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Mulai sebagai siswa baru?"
        description="Catatan belajar, jalur belajar, dan riwayat di perangkat ini akan dihapus."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={startOver}>
              Ya, mulai dari awal
            </Button>
          </>
        }
      >
        <p className="text-lg text-ink">Setelah ini, Kak Ambis akan menganggapmu murid yang baru.</p>
      </Modal>
    </Card>
  );
}
