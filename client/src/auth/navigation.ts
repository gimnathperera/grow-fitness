import type { UserProfile, UserRole } from '@/auth/authSlice';

const roleDefaultRoutes: Record<UserRole, string> = {
  admin: '/client-dashboard',
  team: '/client-dashboard',
  coach: '/coach-dashboard',
  client: '/parent-dashboard',
};

export const getDefaultRouteForRole = (role: UserRole | undefined | null) => {
  if (!role) {
    return '/client-dashboard';
  }

  return roleDefaultRoutes[role] ?? '/client-dashboard';
};

export const getDefaultRouteForUser = (user: UserProfile | null | undefined) =>
  user ? getDefaultRouteForRole(user.role) : '/client-dashboard';
