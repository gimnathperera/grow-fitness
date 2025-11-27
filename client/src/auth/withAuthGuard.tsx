import type { ComponentType } from 'react';
import type { Permission } from '@/auth/acl';
import type { UserRole } from '@/auth/authSlice';
import { RequireAuth } from '@/auth/RequireAuth';

interface WithAuthGuardOptions {
  redirectTo?: string;
  requiredRoles?: UserRole | UserRole[];
  requiredPermissions?: Permission | Permission[];
}

export function withAuthGuard<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  options: WithAuthGuardOptions = {},
): ComponentType<P> {
  function GuardedComponent(props: P) {
    return (
      <RequireAuth
        redirectTo={options.redirectTo}
        requiredRoles={options.requiredRoles}
        requiredPermissions={options.requiredPermissions}
      >
        <Component {...props} />
      </RequireAuth>
    );
  }

  GuardedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name || 'Component'})`;

  return GuardedComponent;
}
