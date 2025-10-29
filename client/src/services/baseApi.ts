import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { clearSession, selectAuth, setTokens } from '@/auth/authSlice';
import { normalizeApiError } from '@/services/errorNormalizer';

const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

type RefreshResponse = {
  ok: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresAt?: string;
  };
};

type CustomBaseQuery = BaseQueryFn<FetchArgs, unknown, FetchBaseQueryError>;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: DEFAULT_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = selectAuth(getState() as RootState);
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  credentials: 'include',
});

type BaseQueryReturn = Awaited<ReturnType<typeof rawBaseQuery>>;

export const baseQueryWithReauth: CustomBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  console.log('[API] Request:', {
    url: args.url,
    method: args.method,
    body: args.body,
    params: args.params
  });

  try {
    let result = await rawBaseQuery(args, api, extraOptions);
    
    console.log('[API] Response:', {
      url: args.url,
      status: result.meta?.response?.status,
      data: result.data,
      error: result.error
    });

    if (result.error?.status === 401) {
      console.log('[API] 401 Unauthorized, attempting token refresh...');
      const { refreshToken } = selectAuth(api.getState() as RootState);

      if (!refreshToken) {
        console.log('[API] No refresh token available, clearing session');
        api.dispatch(clearSession());
        return result;
      }

      try {
        console.log('[API] Refreshing token...');
        const refreshResult = await rawBaseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          { ...extraOptions, _retry: true }
        );

        console.log('[API] Token refresh response:', refreshResult);
        const parsed = refreshResult.data as RefreshResponse | undefined;
        const tokens = parsed?.data;

        if (tokens?.accessToken && tokens.refreshToken) {
          console.log('[API] Token refresh successful, updating tokens');
          api.dispatch(setTokens(tokens));
          // Retry the original request with new token
          console.log('[API] Retrying original request with new token');
          result = await rawBaseQuery(args, api, extraOptions);
          console.log('[API] Retry response:', {
            status: result.meta?.response?.status,
            data: result.data,
            error: result.error
          });
        } else {
          console.log('[API] Token refresh failed, clearing session');
          api.dispatch(clearSession());
          result = refreshResult as BaseQueryReturn;
        }
      } catch (error) {
        console.error('[API] Error during token refresh:', error);
        api.dispatch(clearSession());
        throw error;
      }
    }

    if (result.error) {
      console.error('[API] Request failed:', {
        url: args.url,
        status: result.error.status,
        error: result.error,
        data: result.data
      });
      result.error = normalizeApiError(result.error);
    }

    return result;
  } catch (error) {
    console.error('[API] Unhandled error in baseQueryWithReauth:', error);
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: 'An unexpected error occurred',
        data: error
      }
    };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Auth',
    'User',
    'Client',
    'Kid',
    'Coach',
    'Session',
    'Team',
    'Calendar',
    'Notification',
    'Pass',
    'Milestone',
    'CollectInfo',
    'Payment',
  ],
  endpoints: () => ({}),
});

export type BaseApi = typeof baseApi;
export type ApiTags = (typeof baseApi)['reducerPath'];
