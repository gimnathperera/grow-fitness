import type { PropsWithChildren, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import { getDefaultRouteForUser } from '@/auth/navigation';

interface RequireGuestProps extends PropsWithChildren {
  redirectTo?: string;
  loadingFallback?: ReactNode;
}

export function RequireGuest({
  children,
  redirectTo,
  loadingFallback = null,
}: RequireGuestProps) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isHydrated) {
    return <>{loadingFallback}</>;
  }

  if (auth.isAuthenticated) {
    const destination = redirectTo ?? getDefaultRouteForUser(auth.user);

    return (
      <Navigate to={destination} replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}
