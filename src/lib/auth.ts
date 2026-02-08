/**
 * Authentication using Supabase Auth (Server-side only)
 *
 * This project uses Supabase Auth for authentication.
 * See src/utils/supabase/ for Supabase client utilities.
 *
 * User management is handled by Supabase's auth.users table.
 * Application tables reference auth_user_id (UUID) instead of a local users table.
 *
 * For client components, import types and utilities from '@/lib/auth-shared' instead.
 */

import { createClient } from '@/utils/supabase/server';

import type { AuthUser, UserRole } from './auth-shared';

// Re-export shared types and utilities for convenience in server components
export { type AuthUser, canManage, hasRole, isAdmin, type UserRole } from './auth-shared';

/**
 * Get the current authenticated user from Supabase
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get user profile with role from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email,
    name: profile?.full_name || user.user_metadata?.name || user.user_metadata?.full_name,
    role: (profile?.role as UserRole) || 'viewer',
    avatarUrl: profile?.avatar_url,
  };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser();
  return user !== null;
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

// Import hasRole from shared module for use in this file
import { hasRole } from './auth-shared';

/**
 * Require specific role - throws if user doesn't have the required role
 */
export async function requireRole(requiredRole: UserRole): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasRole(user.role, requiredRole)) {
    throw new Error(`Role '${requiredRole}' or higher required`);
  }
  return user;
}
