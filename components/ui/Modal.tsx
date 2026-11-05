'use client';

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './IconButton';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleClose() {
    if (open) onClose();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onClose();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onCancel={handleCancel}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={handleBackdropClick}
      className={cn('w-[calc(100%-2rem)] max-w-lg bg-transparent p-0 text-ink')}
    >
      <div className="max-h-[90dvh] overflow-y-auto rounded-xl border-theme border-line bg-card p-6 text-ink shadow-md">
      <div className="flex items-start justify-between gap-4">
        <h2 id={titleId} className="text-xl font-bold text-ink">
          {title}
        </h2>
        <IconButton label="Tutup" variant="ghost" size={44} onClick={onClose} icon={<CloseIcon />} />
      </div>
      {description && (
        <p id={descriptionId} className="mt-2 text-lg text-ink-soft">
          {description}
        </p>
      )}
      <div className="mt-4 text-lg text-ink">{children}</div>
      {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </dialog>
  );
}
