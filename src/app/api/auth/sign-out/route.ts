import { NextResponse } from 'next/server';

import { query } from '@/lib/db';

const SESSION_COOKIE = 'session_token';

export async function POST() {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (token) {
      await query(`DELETE FROM sessions WHERE token = $1`, [token]);
    }
  } catch {
    // Ignore errors during sign out
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
