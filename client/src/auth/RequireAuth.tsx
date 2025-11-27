import type { PropsWithChildren, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Permission } from '@/auth/acl';
import type { UserRole } from '@/auth/authSlice';
import { useAuth } from '@/auth/useAuth';

interface RequireAuthProps extends PropsWithChildren {
  redirectTo?: string;
  requiredRoles?: UserRole | UserRole[];
  requiredPermissions?: Permission | Permission[];
  loadingFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
}

export function RequireAuth({
  children,
  redirectTo = '/sign-in',
  requiredRoles,
  requiredPermissions,
  loadingFallback = null,
  unauthorizedFallback = null,
}: RequireAuthProps) {
  const location = useLocation();
  const auth = useAuth();

  if (!auth.isHydrated) {
    return <>{loadingFallback}</>;
  }

  if (!auth.isAuthenticated) {
    return (
      <Navigate to={redirectTo} replace state={{ from: location.pathname }} />
    );
  }

  if (requiredRoles && !auth.hasRole(requiredRoles)) {
    return <>{unauthorizedFallback}</>;
  }

  if (requiredPermissions && !auth.can(requiredPermissions)) {
    return <>{unauthorizedFallback}</>;
  }

  return <>{children}</>;
}
