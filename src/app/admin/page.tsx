import Link from 'next/link';
import { Suspense } from 'react';

import { canManage, getAuthUser, isAdmin } from '@/lib/auth';
import { query } from '@/lib/db';

// Stats Card Component
function StatsCard({
  title,
  value,
  icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-500 dark:text-gray-400'>{title}</p>
          <p className='mt-1 text-2xl font-bold text-gray-900 dark:text-white'>{value}</p>
          {trend && (
            <p
              className={`mt-1 text-xs ${
                trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div className='text-3xl'>{icon}</div>
      </div>
    </div>
  );
}

// Recent Quotes Component
async function RecentQuotes() {
  try {
    const result = await query<{
      id: number;
      quote_number: string;
      customer_name: string;
      customer_email: string;
      status: string;
      total_amount: number;
      created_at: Date;
    }>(
      `SELECT id, quote_number, customer_name, customer_email, status, total_amount, created_at
       FROM quotes
       ORDER BY created_at DESC
       LIMIT 5`
    );

    const quotes = result.rows;

    if (quotes.length === 0) {
      return (
        <p className='py-4 text-center text-gray-500 dark:text-gray-400'>
          No quotes yet. They will appear here once customers submit requests.
        </p>
      );
    }

    return (
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-200 dark:border-gray-700'>
              <th className='pb-3 text-left font-medium text-gray-500 dark:text-gray-400'>
                Quote #
              </th>
              <th className='pb-3 text-left font-medium text-gray-500 dark:text-gray-400'>
                Customer
              </th>
              <th className='pb-3 text-left font-medium text-gray-500 dark:text-gray-400'>
                Status
              </th>
              <th className='pb-3 text-right font-medium text-gray-500 dark:text-gray-400'>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {quotes.map(quote => (
              <tr
                key={quote.id}
                className='border-b border-gray-100 dark:border-gray-700/50'
              >
                <td className='py-3 font-medium text-green-600 dark:text-green-400'>
                  {quote.quote_number}
                </td>
                <td className='py-3'>
                  <p className='text-gray-900 dark:text-white'>{quote.customer_name}</p>
                  <p className='text-xs text-gray-500'>{quote.customer_email}</p>
                </td>
                <td className='py-3'>
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      quote.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                        : quote.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                          : quote.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className='py-3 text-right'>${quote.total_amount?.toLocaleString() || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch {
    return (
      <p className='py-4 text-center text-gray-500 dark:text-gray-400'>
        Unable to load quotes. Database may not be initialized yet.
      </p>
    );
  }
}

// Dashboard Stats
async function DashboardStats() {
  try {
    // Run queries in parallel
    const [quotesResult, productsResult, contactsResult, pendingQuotesResult] = await Promise.all([
      query<{ count: string }>('SELECT COUNT(*) as count FROM quotes'),
      query<{ count: string }>('SELECT COUNT(*) as count FROM products WHERE is_active = true'),
      query<{ count: string }>('SELECT COUNT(*) as count FROM contact_submissions'),
      query<{ count: string }>(`SELECT COUNT(*) as count FROM quotes WHERE status = 'PENDING'`),
    ]);

    return (
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Quotes'
          value={quotesResult.rows[0]?.count || 0}
          icon='📋'
          trend='this month'
          trendUp
        />
        <StatsCard
          title='Pending Quotes'
          value={pendingQuotesResult.rows[0]?.count || 0}
          icon='⏳'
        />
        <StatsCard
          title='Active Products'
          value={productsResult.rows[0]?.count || 0}
          icon='📦'
        />
        <StatsCard
          title='Contact Requests'
          value={contactsResult.rows[0]?.count || 0}
          icon='👥'
        />
      </div>
    );
  } catch {
    return (
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total Quotes'
          value='—'
          icon='📋'
        />
        <StatsCard
          title='Pending Quotes'
          value='—'
          icon='⏳'
        />
        <StatsCard
          title='Active Products'
          value='—'
          icon='📦'
        />
        <StatsCard
          title='Contact Requests'
          value='—'
          icon='👥'
        />
      </div>
    );
  }
}

export default async function AdminDashboardPage() {
  const user = await getAuthUser();
  const isManager = canManage(user);
  const isAdminUser = isAdmin(user);

  return (
    <div className='space-y-6'>
      {/* Welcome Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
        </h1>
        <p className='mt-1 text-gray-500 dark:text-gray-400'>
          Here&apos;s what&apos;s happening with your export business today.
        </p>
      </div>

      {/* Stats Grid */}
      <Suspense
        fallback={
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700'
              />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Quick Actions */}
      {isManager && (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <Link
            href='/admin/quotes/new'
            className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
          >
            <span className='text-2xl'>➕</span>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>New Quote</p>
              <p className='text-xs text-gray-500'>Create a quote manually</p>
            </div>
          </Link>
          <Link
            href='/admin/products/new'
            className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
          >
            <span className='text-2xl'>📦</span>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>Add Product</p>
              <p className='text-xs text-gray-500'>Add a new product</p>
            </div>
          </Link>
          {isAdminUser && (
            <>
              <Link
                href='/admin/users'
                className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
              >
                <span className='text-2xl'>👤</span>
                <div>
                  <p className='font-medium text-gray-900 dark:text-white'>Manage Users</p>
                  <p className='text-xs text-gray-500'>Add or edit team members</p>
                </div>
              </Link>
              <Link
                href='/admin/settings'
                className='flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800'
              >
                <span className='text-2xl'>⚙️</span>
                <div>
                  <p className='font-medium text-gray-900 dark:text-white'>Settings</p>
                  <p className='text-xs text-gray-500'>Configure site settings</p>
                </div>
              </Link>
            </>
          )}
        </div>
      )}

      {/* Recent Quotes */}
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Recent Quotes</h2>
          <Link
            href='/admin/quotes'
            className='text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
          >
            View all →
          </Link>
        </div>
        <Suspense
          fallback={
            <div className='space-y-3'>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className='h-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700'
                />
              ))}
            </div>
          }
        >
          <RecentQuotes />
        </Suspense>
      </div>
    </div>
  );
}
