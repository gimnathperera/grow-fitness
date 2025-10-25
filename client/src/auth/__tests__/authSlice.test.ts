import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/auth/tokenStorage', () => ({
  loadAuthState: vi.fn(() => null),
  saveAuthState: vi.fn(),
  clearAuthState: vi.fn(),
}));

import authReducer, {
  clearSession,
  hydrateFromStorage,
  setTokens,
  setUser,
} from '@/auth/authSlice';
import { saveAuthState, clearAuthState } from '@/auth/tokenStorage';

const createInitialState = () => authReducer(undefined, { type: 'init' });

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('stores tokens and persists them', () => {
    const initialState = createInitialState();

    const nextState = authReducer(
      initialState,
      setTokens({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresAt: '2025-01-01T00:00:00.000Z',
      }),
    );

    expect(nextState.accessToken).toBe('access-token');
    expect(nextState.refreshToken).toBe('refresh-token');
    expect(nextState.expiresAt).toBe('2025-01-01T00:00:00.000Z');
    expect(saveAuthState).toHaveBeenCalledWith({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresAt: '2025-01-01T00:00:00.000Z',
      user: null,
    });
  });

  it('updates user profile and persists it', () => {
    const initialState = createInitialState();

    const nextState = authReducer(
      initialState,
      setUser({
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        phone: '1234567890',
        role: 'client',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }),
    );

    expect(nextState.user?.email).toBe('user@example.com');
    expect(saveAuthState).toHaveBeenCalledWith({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: nextState.user,
    });
  });

  it('hydrates from storage payloads', () => {
    const nextState = authReducer(
      createInitialState(),
      hydrateFromStorage({
        accessToken: 'persisted-access',
        refreshToken: 'persisted-refresh',
        expiresAt: '2025-01-01T00:00:00.000Z',
        user: {
          id: '1',
          email: 'persisted@example.com',
          name: 'Persisted User',
          phone: '555-1111',
          role: 'coach',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      }),
    );

    expect(nextState.accessToken).toBe('persisted-access');
    expect(nextState.user?.role).toBe('coach');
    expect(nextState.status).toBe('hydrated');
  });

  it('clears session and removes persistence', () => {
    const hydratedState = authReducer(
      createInitialState(),
      hydrateFromStorage({
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: '2025-01-01T00:00:00.000Z',
        user: null,
      }),
    );

    const nextState = authReducer(hydratedState, clearSession());

    expect(nextState.accessToken).toBeNull();
    expect(nextState.refreshToken).toBeNull();
    expect(nextState.status).toBe('hydrated');
    expect(clearAuthState).toHaveBeenCalled();
  });
});
