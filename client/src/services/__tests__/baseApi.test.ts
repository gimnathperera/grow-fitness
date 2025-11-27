import { describe, expect, it, vi, beforeEach } from 'vitest';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  BaseQueryApi,
} from '@reduxjs/toolkit/query/react';
import { clearSession, setTokens } from '@/auth/authSlice';

type BaseQuery = BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError>;
const mockRawBaseQuery = vi.fn<BaseQuery>();

// Mock RTK Query's fetchBaseQuery
vi.mock('@reduxjs/toolkit/query/react', async () => {
  const actual = await vi.importActual<
    typeof import('@reduxjs/toolkit/query/react')
  >('@reduxjs/toolkit/query/react');
  return {
    ...actual,
    fetchBaseQuery: vi.fn(
      () =>
        mockRawBaseQuery as unknown as ReturnType<typeof actual.fetchBaseQuery>,
    ),
  };
});

const { baseQueryWithReauth } = await import('@/services/baseApi');

describe('baseQueryWithReauth', () => {
  beforeEach(() => {
    mockRawBaseQuery.mockReset();
  });

  const baseState = {
    auth: {
      accessToken: 'expired-token',
      refreshToken: 'refresh-token',
      expiresAt: null as string | null,
      user: null,
      status: 'hydrated' as const,
    },
  };

  it('refreshes tokens and retries the original request', async () => {
    mockRawBaseQuery
      .mockResolvedValueOnce({
        error: {
          status: 401,
          data: { error: { message: 'Unauthorized' } },
        },
      })
      .mockResolvedValueOnce({
        data: {
          ok: true,
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
            expiresAt: '2025-01-01T00:00:00.000Z',
          },
        },
      })
      .mockResolvedValueOnce({
        data: { ok: true, data: { result: 'success' } },
      });

    const dispatch = vi.fn();
    const getState = () => baseState;

    // Cast partial to BaseQueryApi to satisfy TS
    const result = await baseQueryWithReauth(
      { url: '/secure', method: 'GET' },
      { dispatch, getState } as Partial<BaseQueryApi> as BaseQueryApi,
      {},
    );

    expect(mockRawBaseQuery).toHaveBeenCalledTimes(3);
    expect(mockRawBaseQuery.mock.calls[1][0]).toMatchObject({
      url: '/auth/refresh',
      method: 'POST',
    });
    expect(dispatch).toHaveBeenCalledWith(
      setTokens({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: '2025-01-01T00:00:00.000Z',
      }),
    );
    expect(result.data).toEqual({ ok: true, data: { result: 'success' } });
  });

  it('clears the session when refresh token is unavailable', async () => {
    mockRawBaseQuery.mockResolvedValueOnce({
      error: {
        status: 401,
        data: { error: { message: 'Unauthorized' } },
      },
    });

    const dispatch = vi.fn();
    const getState = () => ({
      auth: { ...baseState.auth, refreshToken: null },
    });

    const result = await baseQueryWithReauth(
      { url: '/secure', method: 'GET' },
      { dispatch, getState } as Partial<BaseQueryApi> as BaseQueryApi,
      {},
    );

    expect(mockRawBaseQuery).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(clearSession());
    expect(result.error).toBeTruthy();
  });
});
