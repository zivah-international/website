import { redirect } from 'next/navigation';

import { getAuthUser } from '@/lib/auth';

import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/sign-in?redirectTo=/admin');
  }

  return (
    <div className='flex h-screen bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <AdminHeader user={user} />

        {/* Page Content */}
        <main className='flex-1 overflow-auto p-6'>{children}</main>
      </div>
    </div>
  );
}
