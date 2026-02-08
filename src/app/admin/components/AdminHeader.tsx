'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthUser } from '@/lib/auth';
import { createClient } from '@/utils/supabase/client';

interface AdminHeaderProps {
  user: AuthUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <header className='flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className='rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-700'
      >
        <svg
          className='h-6 w-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
      </button>

      {/* Search Bar */}
      <div className='hidden flex-1 px-4 md:block'>
        <div className='relative max-w-md'>
          <input
            type='search'
            placeholder='Search...'
            className='w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
          />
          <svg
            className='absolute top-2.5 left-3 h-4 w-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex items-center gap-4'>
        {/* Notifications */}
        <button className='relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'>
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
            />
          </svg>
          <span className='absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500' />
        </button>

        {/* Back to Site */}
        <a
          href='/'
          target='_blank'
          rel='noopener noreferrer'
          className='hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 sm:block dark:text-gray-400 dark:hover:bg-gray-700'
          title='View Site'
        >
          <svg
            className='h-5 w-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
            />
          </svg>
        </a>

        {/* User Dropdown */}
        <div className='relative'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600 dark:bg-green-900/50 dark:text-green-400'>
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <svg
              className='h-4 w-4 text-gray-500'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className='fixed inset-0 z-10'
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className='absolute right-0 z-20 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
                <div className='border-b border-gray-200 px-4 py-2 dark:border-gray-700'>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {user.name || 'User'}
                  </p>
                  <p className='truncate text-xs text-gray-500 dark:text-gray-400'>{user.email}</p>
                </div>
                <a
                  href='/admin/profile'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                >
                  Profile Settings
                </a>
                <button
                  onClick={handleSignOut}
                  className='block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700'
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
