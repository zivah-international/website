'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className='no-print bg-primary text-primary-foreground fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition hover:opacity-90 active:scale-95'
      aria-label='Imprimir ficha técnica'
    >
      🖨️ Imprimir / Descargar PDF
    </button>
  );
}
