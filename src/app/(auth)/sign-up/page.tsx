'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

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
      <h2 className='mb-6 text-center text-2xl font-semibold text-gray-800 dark:text-white'>
        Create Account
      </h2>

      {error && (
        <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/50 dark:text-red-300'>
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
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Full Name
          </label>
          <input
            id='fullName'
            type='text'
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            placeholder='John Doe'
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            placeholder='you@example.com'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            placeholder='••••••••'
          />
          <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>Minimum 8 characters</p>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'>
        Already have an account?{' '}
        <Link
          href={`/sign-in${redirectTo !== '/admin' ? `?redirectTo=${redirectTo}` : ''}`}
          className='font-medium text-green-600 hover:text-green-500 dark:text-green-400'
        >
          Sign in
        </Link>
      </p>

      <p className='mt-4 text-center text-xs text-gray-500 dark:text-gray-400'>
        By signing up, you agree to our{' '}
        <Link
          href='/legal/terms-of-service'
          className='underline hover:no-underline'
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/legal/privacy-policy'
          className='underline hover:no-underline'
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center py-8'>
          <div className='animate-pulse'>Loading...</div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
