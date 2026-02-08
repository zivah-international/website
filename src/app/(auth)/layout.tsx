import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - ZIVAH International',
  description: 'Sign in or create an account to access ZIVAH International admin panel',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='w-full max-w-md px-4'>
        {/* Logo */}
        <div className='mb-8 text-center'>
          <h1 className='text-3xl font-bold text-green-700 dark:text-green-400'>
            🌿 ZIVAH International
          </h1>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
            Premium Ecuadorian Exports
          </p>
        </div>

        {/* Auth Card */}
        <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800'>
          {children}
        </div>

        {/* Footer */}
        <p className='mt-6 text-center text-xs text-gray-500 dark:text-gray-400'>
          &copy; {new Date().getFullYear()} ZIVAH International. All rights reserved.
        </p>
      </div>
    </div>
  );
}
