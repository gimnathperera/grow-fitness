import { baseApi } from '@/services/baseApi';
import type { ApiResponse, ApiSuccessResponse, components } from '@/types/api';

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
    }),
    register: builder.mutation<ApiResponse<LoginResponse>, RegisterDto>({
      query: body => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'User'],
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

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useRefreshTokensMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;
