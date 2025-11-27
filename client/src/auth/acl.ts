import type { UserProfile, UserRole } from '@/auth/authSlice';

type Permission =
  | 'manage:users'
  | 'manage:clients'
  | 'manage:coaches'
  | 'view:reports'
  | 'view:dashboard'
  | 'schedule:sessions';

type RolePermissions = Record<UserRole, Permission[]>;

const rolePermissions: RolePermissions = {
  admin: [
    'manage:users',
    'manage:clients',
    'manage:coaches',
    'view:reports',
    'view:dashboard',
    'schedule:sessions',
  ],
  team: [
    'manage:clients',
    'manage:coaches',
    'view:dashboard',
    'schedule:sessions',
  ],
  coach: ['view:dashboard', 'schedule:sessions'],
  client: ['view:dashboard'],
};

export const hasRole = (
  user: UserProfile | null | undefined,
  role: UserRole | UserRole[],
): boolean => {
  if (!user) {
    return false;
  }

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
};

export const can = (
  user: UserProfile | null | undefined,
  permission: Permission | Permission[],
): boolean => {
  if (!user) {
    return false;
  }

  const permissions = rolePermissions[user.role] ?? [];

  if (Array.isArray(permission)) {
    return permission.every(entry => permissions.includes(entry));
  }

  return permissions.includes(permission);
};

export const getPermissionsForRole = (role: UserRole): Permission[] =>
  rolePermissions[role] ?? [];

export const getUserPermissions = (
  user: UserProfile | null | undefined,
): Permission[] => (user ? getPermissionsForRole(user.role) : []);

export type { Permission };
