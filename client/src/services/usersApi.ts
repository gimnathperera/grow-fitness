import { baseApi } from '@/services/baseApi';
import type { ApiResponse, ApiSuccessResponse, components } from '@/types/api';

export type UserProfile = components['schemas']['UserProfileDto'];

export interface UsersListResponse {
  users: UserProfile[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  role?: UserProfile['role'];
  status?: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query<
      ApiSuccessResponse<UsersListResponse>,
      UsersQueryParams | void
    >({
      query: params => ({
        url: '/users',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['User'],
    }),
    getUserById: builder.query<ApiSuccessResponse<UserProfile>, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'User', id }, 'User'],
    }),
    updateUser: builder.mutation<
      ApiResponse<UserProfile>,
      { id: string; payload: Partial<UserProfile> }
    >({
      query: ({ id, payload }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'User', id }, 'User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = usersApi;
