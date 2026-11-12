import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Acceso administrativo | ZIVAH International',
  description: 'Acceso al panel administrativo de ZIVAH International.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='public-site flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12'>
      <div className='w-full max-w-[420px]'>
        <header className='mb-8 text-center'>
          <Image
            src='/assets/images/zivah-logo.svg'
            alt='ZIVAH International'
            width={400}
            height={100}
            priority
            className='mx-auto h-10 w-auto'
          />
          <h1 className='mt-5 font-serif text-3xl text-foreground'>Acceso administrativo</h1>
        </header>

        <div className='rounded-[2px] border border-border bg-surface p-6 sm:p-8'>{children}</div>

        <p className='mt-6 text-center text-xs text-muted-foreground'>
          © {new Date().getFullYear()} ZIVAH International S.A.
        </p>
      </div>
    </div>
  );
}
