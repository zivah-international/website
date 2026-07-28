import { NextRequest, NextResponse } from 'next/server';

import { query } from '@/lib/db';
import { generateSessionToken, verifyPassword } from '@/lib/password';

const SESSION_COOKIE = 'session_token';
const SESSION_MAX_AGE_DAYS = 7;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const result = await query<{ id: string; password_hash: string; is_active: boolean }>(
      `SELECT id, password_hash, is_active FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is disabled' }, { status: 403 });
    }

    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

    await query(`INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`, [
      user.id,
      token,
      expiresAt,
    ]);

    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
