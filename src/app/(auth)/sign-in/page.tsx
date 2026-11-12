'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Button } from '@/components/ui/button';

const inputClass =
  'mt-1 h-11 w-full rounded-[2px] border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirectTo') || '/admin';

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Sign in failed');
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className='mb-6 font-serif text-2xl text-foreground'>Iniciar sesión</h2>

      {error && (
        <div
          role='alert'
          className='mb-4 rounded-[2px] border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive'
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSignIn}
        className='space-y-4'
      >
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-foreground'
          >
            Correo electrónico
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={inputClass}
            autoComplete='email'
            placeholder='nombre@empresa.com'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-foreground'
          >
            Contraseña
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={inputClass}
            autoComplete='current-password'
            placeholder='••••••••'
          />
        </div>

        <Button
          type='submit'
          disabled={loading}
          variant='brand'
          size='brand'
          className='w-full'
        >
          {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </Button>
      </form>

      <p className='mt-6 text-center text-sm text-muted-foreground'>
        ¿No tienes una cuenta?{' '}
        <Link
          href={`/sign-up${redirectTo !== '/admin' ? `?redirectTo=${redirectTo}` : ''}`}
          className='font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent'
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={<div className='py-8 text-center text-sm text-muted-foreground'>Cargando…</div>}
    >
      <SignInForm />
    </Suspense>
  );
}
