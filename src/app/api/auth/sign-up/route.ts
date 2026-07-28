import { NextRequest, NextResponse } from 'next/server';

import { query } from '@/lib/db';
import { generateSessionToken, hashPassword } from '@/lib/password';

const SESSION_COOKIE = 'session_token';
const SESSION_MAX_AGE_DAYS = 7;

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await query(`SELECT id FROM users WHERE email = $1`, [normalizedEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const result = await query<{ id: string }>(
      `INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, 'viewer') RETURNING id`,
      [normalizedEmail, passwordHash, fullName || null]
    );

    const userId = result.rows[0].id;
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

    await query(`INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`, [
      userId,
      token,
      expiresAt,
    ]);

    const response = NextResponse.json({ success: true }, { status: 201 });
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
