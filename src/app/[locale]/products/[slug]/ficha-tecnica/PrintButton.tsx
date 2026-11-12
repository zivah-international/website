'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      type='button'
      onClick={() => window.print()}
      className='no-print fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-[2px] bg-accent px-5 py-3 text-[11.5px] font-semibold tracking-[0.1em] text-accent-foreground uppercase transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.99]'
      aria-label='Imprimir ficha técnica'
    >
      <Printer
        aria-hidden='true'
        className='size-4'
        strokeWidth={1.5}
      />
      Imprimir / Descargar PDF
    </button>
  );
}
