'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button, Modal } from '@/components/ui';

export function LoginPromptModal({
  isOpen,
  onClose,
  onDevBypass,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDevBypass?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Lanjutkan dengan Login"
      description="Kamu sudah mencapai batas chat gratis. Yuk login dulu supaya bisa lanjut belajar."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Lanjutkan Nanti
          </Button>
          <Button variant="secondary" onClick={onDevBypass || onClose}>
            Mode Dev / Lokal: Lewati Batas Chat
          </Button>
          <Button onClick={handleGoogleSignIn} disabled={isLoading} loading={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk dengan Google'}
          </Button>
        </>
      }
    >
      <p className="text-base text-ink-soft">
        Kamu tetap bisa lanjut tanpa login, tapi beberapa fitur akan dibatasi.
      </p>
    </Modal>
  );
}
