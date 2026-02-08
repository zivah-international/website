/**
 * Shared auth types and utilities that can be used in both server and client components
 */

// User roles for ZIVAH International admin panel
export type UserRole = 'admin' | 'sales_manager' | 'sales_rep' | 'viewer';

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  role?: UserRole;
  avatarUrl?: string;
};

// Role hierarchy: admin > sales_manager > sales_rep > viewer
const roleHierarchy: Record<UserRole, number> = {
  admin: 4,
  sales_manager: 3,
  sales_rep: 2,
  viewer: 1,
};

/**
 * Check if user has at least the required role level
 */
export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin';
}

/**
 * Check if user can manage (admin or sales_manager)
 */
export function canManage(user: AuthUser | null): boolean {
  return hasRole(user?.role, 'sales_manager');
}
