import { useCallback, useEffect, useMemo } from 'react';
import { baseApi } from '@/services/baseApi';
import {
  useGetProfileQuery,
  useLoginMutation,
  useLogoutMutation,
  type LoginDto,
  type LoginResponse,
} from '@/services/authApi';
import {
  clearSession,
  hydrateFromStorage,
  selectAuth,
  setTokens,
  setUser,
} from '@/auth/authSlice';
import { loadAuthState } from '@/auth/tokenStorage';
import {
  can as canAccess,
  getUserPermissions,
  hasRole as hasRoleCheck,
} from '@/auth/acl';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import type { Permission } from '@/auth/acl';

interface UseAuthResult {
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: Permission[];
  roles: LoginResponse['user']['role'][];
  isHydrated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  hasRole: (
    role: LoginResponse['user']['role'] | LoginResponse['user']['role'][],
  ) => boolean;
  can: (permission: Permission | Permission[]) => boolean;
}

const extractLoginPayload = (response: unknown): LoginResponse => {
  if (
    response &&
    typeof response === 'object' &&
    'tokens' in response &&
    'user' in response
  ) {
    return response as LoginResponse;
  }

  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    response.data &&
    typeof response.data === 'object'
  ) {
    const payload = (response as { data: unknown }).data;
    if (
      payload &&
      typeof payload === 'object' &&
      'tokens' in payload &&
      'user' in payload
    ) {
      return payload as LoginResponse;
    }
  }

  throw new Error('Unexpected login response shape.');
};

export const useAuth = (): UseAuthResult => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: profileResponse, isFetching: isFetchingProfile } =
    useGetProfileQuery(undefined, {
      skip: !authState.accessToken || Boolean(authState.user),
    });

  useEffect(() => {
    if (authState.status === 'idle') {
      dispatch(hydrateFromStorage(loadAuthState()));
    }
  }, [authState.status, dispatch]);

  useEffect(() => {
    if (
      profileResponse &&
      'ok' in profileResponse &&
      profileResponse.ok &&
      profileResponse.data
    ) {
      dispatch(setUser(profileResponse.data));
    }
  }, [dispatch, profileResponse]);

  const handleLogin = useCallback(
    async (credentials: LoginDto) => {
      const response = await login(credentials).unwrap();
      const payload = extractLoginPayload(response);

      dispatch(setTokens(payload.tokens));
      dispatch(setUser(payload.user));

      return payload;
    },
    [dispatch, login],
  );

  const handleLogout = useCallback(async () => {
    const refreshToken = authState.refreshToken ?? undefined;

    try {
      await logoutRequest({ refreshToken }).unwrap();
    } catch (error) {
      console.warn('[auth] Logout request failed:', error);
    } finally {
      dispatch(clearSession());
      dispatch(baseApi.util.resetApiState());
    }
  }, [authState.refreshToken, dispatch, logoutRequest]);

  const permissions = useMemo(
    () => getUserPermissions(authState.user),
    [authState.user],
  );
  const roles = useMemo(
    () => (authState.user ? [authState.user.role] : []),
    [authState.user],
  );

  return {
    user: authState.user,
    isAuthenticated: Boolean(authState.accessToken),
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    permissions,
    roles,
    isHydrated: authState.status === 'hydrated',
    isLoading: isLoggingIn || isLoggingOut || isFetchingProfile,
    login: handleLogin,
    logout: handleLogout,
    hasRole: role => hasRoleCheck(authState.user, role),
    can: permission => canAccess(authState.user, permission),
  };
};
