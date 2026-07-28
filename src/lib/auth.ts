import { cookies } from 'next/headers';

import type { AuthUser, UserRole } from './auth-shared';
import { query } from './db';

export { type AuthUser, canManage, hasRole, isAdmin, type UserRole } from './auth-shared';

const SESSION_COOKIE = 'session_token';
const SESSION_MAX_AGE_DAYS = 7;

async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const token = await getSessionCookie();
    if (!token) return null;

    const result = await query<{
      id: string;
      email: string;
      full_name: string | null;
      avatar_url: string | null;
      role: UserRole;
      department: string | null;
      phone: string | null;
      company: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string | null;
    }>(
      `SELECT u.id, u.email, u.full_name, u.avatar_url, u.role, u.department, u.phone, u.company, u.is_active, u.created_at, u.updated_at
       FROM sessions s JOIN users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.expires_at > NOW() AND u.is_active = true`,
      [token]
    );

    if (result.rows.length === 0) return null;

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      name: user.full_name || undefined,
      role: user.role,
      avatarUrl: user.avatar_url || undefined,
    };
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return user !== null;
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

import { hasRole } from './auth-shared';

export async function requireRole(requiredRole: UserRole): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasRole(user.role, requiredRole)) {
    throw new Error(`Role '${requiredRole}' or higher required`);
  }
  return user;
}

export async function getSessionToken(): Promise<string | undefined> {
  return getSessionCookie();
}
