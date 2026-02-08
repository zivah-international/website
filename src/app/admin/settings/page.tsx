import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getAuthUser, isAdmin } from '@/lib/auth';

export default async function AdminSettingsPage() {
  const user = await getAuthUser();

  if (!user || !isAdmin(user)) {
    redirect('/admin');
  }

  const settingsItems = [
    {
      name: 'Languages',
      description: 'View available languages and translation statistics',
      href: '/admin/settings/languages',
      icon: '🌐',
    },
    {
      name: 'Site Settings',
      description: 'General site configuration',
      href: '/admin/settings/general',
      icon: '⚙️',
      disabled: true,
    },
    {
      name: 'Email Templates',
      description: 'Customize email notifications',
      href: '/admin/settings/emails',
      icon: '📧',
      disabled: true,
    },
    {
      name: 'Security',
      description: 'Security and authentication settings',
      href: '/admin/settings/security',
      icon: '🔒',
      disabled: true,
    },
  ];

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white'>
          <span>⚙️</span> Settings
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Configure system settings and preferences
        </p>
      </div>

      {/* Settings Grid */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {settingsItems.map(item =>
          item.disabled ? (
            <div
              key={item.name}
              className='cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 p-6 opacity-50 dark:border-gray-700 dark:bg-gray-800/50'
            >
              <div className='flex items-start gap-4'>
                <span className='text-3xl'>{item.icon}</span>
                <div>
                  <p className='font-medium text-gray-900 dark:text-white'>{item.name}</p>
                  <p className='mt-1 text-sm text-gray-500'>{item.description}</p>
                  <span className='mt-2 inline-block rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700'>
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={item.name}
              href={item.href}
              className='rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-green-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
            >
              <div className='flex items-start gap-4'>
                <span className='text-3xl'>{item.icon}</span>
                <div>
                  <p className='font-medium text-gray-900 dark:text-white'>{item.name}</p>
                  <p className='mt-1 text-sm text-gray-500'>{item.description}</p>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
}
