'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type AuthUser, hasRole } from '@/lib/auth-shared';

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
  requiredRole?: 'admin' | 'sales_manager' | 'sales_rep' | 'viewer';
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Quotes', href: '/admin/quotes', icon: '📋' },
  { name: 'Products', href: '/admin/products', icon: '📦' },
  { name: 'Categories', href: '/admin/categories', icon: '🏷️', requiredRole: 'sales_manager' },
  { name: 'Pricing', href: '/admin/pricing', icon: '💰', requiredRole: 'sales_manager' },
  { name: 'Contacts', href: '/admin/contacts', icon: '👥', requiredRole: 'sales_rep' },
  { name: 'Countries', href: '/admin/countries', icon: '🌍', requiredRole: 'sales_manager' },
  { name: 'Activity', href: '/admin/activity', icon: '📝', requiredRole: 'sales_manager' },
  { name: 'Users', href: '/admin/users', icon: '👤', requiredRole: 'admin' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️', requiredRole: 'admin' },
];

interface AdminSidebarProps {
  user: AuthUser;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  // Filter items based on user role
  const visibleItems = sidebarItems.filter(item => {
    if (!item.requiredRole) return true;
    return hasRole(user.role, item.requiredRole);
  });

  return (
    <aside className='hidden w-64 flex-shrink-0 bg-white shadow-lg md:block dark:bg-gray-800'>
      <div className='flex h-full flex-col'>
        {/* Logo */}
        <div className='flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700'>
          <Link
            href='/admin'
            className='flex items-center gap-2'
          >
            <span className='text-2xl'>🌿</span>
            <span className='text-lg font-bold text-green-700 dark:text-green-400'>
              ZIVAH Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 space-y-1 overflow-y-auto px-3 py-4'>
          {visibleItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className='text-lg'>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info Footer */}
        <div className='border-t border-gray-200 p-4 dark:border-gray-700'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400'>
              {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className='flex-1 truncate'>
              <p className='truncate text-sm font-medium text-gray-700 dark:text-gray-300'>
                {user.name || 'User'}
              </p>
              <p className='text-xs text-gray-500 capitalize dark:text-gray-400'>
                {user.role?.replace('_', ' ') || 'viewer'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
