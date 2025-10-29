import { baseApi } from '@/services/baseApi';
import type { ApiResponse, ApiSuccessResponse, components } from '@/types/api';
import { setTokens, setUser } from '@/auth/authSlice';

export type LoginDto = components['schemas']['LoginDto'];
export type RegisterDto = components['schemas']['RegisterDto'];
export type LoginResponse = components['schemas']['LoginResponseDto'];
export type AuthTokens = components['schemas']['AuthTokensDto'];
export type ChangePasswordDto = components['schemas']['ChangePasswordDto'];

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<ApiResponse<LoginResponse>, LoginDto>({
      query: body => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.ok && data.data?.tokens) {
            dispatch(
              setTokens({
                accessToken: data.data.tokens.accessToken,
                refreshToken: data.data.tokens.refreshToken,
                expiresAt: data.data.tokens.expiresAt,
              })
            );
            dispatch(setUser(data.data.user));
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    register: builder.mutation<ApiResponse<LoginResponse>, RegisterDto>({
      query: body => ({
        url: '/auth/register/patient',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    registerParent: builder.mutation<ApiResponse<{
      access_token: string;
      refresh_token: string;
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
      user: any;
    }>, any>({
      query: (body) => ({
        url: '/auth/register/parent',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.ok && data.data?.tokens) {
            dispatch(
              setTokens({
                accessToken: data.data.tokens.accessToken,
                refreshToken: data.data.tokens.refreshToken,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
              })
            );
            dispatch(setUser(data.data.user));
          }
        } catch (error) {
          console.error('Registration failed:', error);
        }
      },
    }),
    getProfile: builder.query<ApiResponse<LoginResponse['user']>, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User', 'Auth'],
    }),
    refreshTokens: builder.mutation<
      ApiResponse<AuthTokens>,
      { refreshToken: string }
    >({
      query: body => ({
        url: '/auth/refresh',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    changePassword: builder.mutation<
      ApiSuccessResponse<null>,
      ChangePasswordDto
    >({
      query: body => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<
      ApiSuccessResponse<null>,
      { refreshToken?: string }
    >({
      query: body => ({
        url: '/auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
  overrideExisting: false,
});

// Add child creation endpoint
export const childrenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createChild: builder.mutation<ApiResponse<any>, any>({
      query: (childData) => ({
        url: '/children',
        method: 'POST',
        body: childData,
      }),
      invalidatesTags: ['Kid'],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useRegisterParentMutation,
  useGetProfileQuery, 
  useLazyGetProfileQuery,
  useRefreshTokensMutation, 
  useChangePasswordMutation, 
  useLogoutMutation,
} = authApi;

export const { useCreateChildMutation } = childrenApi;
