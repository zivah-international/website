'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className='no-print fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 active:scale-95'
      aria-label='Imprimir ficha técnica'
    >
      🖨️ Imprimir / Descargar PDF
    </button>
  );
}
