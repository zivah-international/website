'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { Button } from '@/components/ui/button';

const inputClass =
  'mt-1 h-11 w-full rounded-[2px] border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get('redirectTo') || '/admin';

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Sign up failed');
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
      <h2 className='mb-6 font-serif text-2xl text-foreground'>Crear cuenta</h2>

      {error && (
        <div
          role='alert'
          className='mb-4 rounded-[2px] border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive'
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSignUp}
        className='space-y-4'
      >
        <div>
          <label
            htmlFor='fullName'
            className='block text-sm font-medium text-foreground'
          >
            Nombre completo
          </label>
          <input
            id='fullName'
            type='text'
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className={inputClass}
            autoComplete='name'
            placeholder='Nombre y apellido'
          />
        </div>

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
            minLength={8}
            className={inputClass}
            autoComplete='new-password'
            placeholder='••••••••'
          />
          <p className='mt-1 text-xs text-muted-foreground'>Mínimo 8 caracteres.</p>
        </div>

        <Button
          type='submit'
          disabled={loading}
          variant='brand'
          size='brand'
          className='w-full'
        >
          {loading ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>

      <p className='mt-6 text-center text-sm text-muted-foreground'>
        ¿Ya tienes una cuenta?{' '}
        <Link
          href={`/sign-in${redirectTo !== '/admin' ? `?redirectTo=${redirectTo}` : ''}`}
          className='font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent'
        >
          Inicia sesión
        </Link>
      </p>

      <p className='mt-4 text-center text-xs leading-relaxed text-muted-foreground'>
        Al crear una cuenta, aceptas nuestros{' '}
        <Link
          href='/legal/terms-of-service'
          className='underline underline-offset-4 hover:text-accent'
        >
          Términos del servicio
        </Link>{' '}
        y nuestra{' '}
        <Link
          href='/legal/privacy-policy'
          className='underline underline-offset-4 hover:text-accent'
        >
          Política de privacidad
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={<div className='py-8 text-center text-sm text-muted-foreground'>Cargando…</div>}
    >
      <SignUpForm />
    </Suspense>
  );
}
