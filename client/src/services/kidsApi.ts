import { baseApi } from '@/services/baseApi';
import type { ApiSuccessResponse } from '@/types/api';

export interface CreateKidRequest {
  parentId: string;
  name: string;
  gender: 'girl' | 'boy';
  age: number;
  location: string;
  isInSports?: boolean;
  preferredTrainingStyle?: 'personal' | 'group';
}

export type CreateKidsPayload = CreateKidRequest[];

export type UpdateKidPayload = Partial<{
  coachId: string | null;
  name: string;
  gender: 'girl' | 'boy';
  age: number;
  location: string;
  isInSports: boolean;
  preferredTrainingStyle: 'personal' | 'group';
}>;

export const kidsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getKids: builder.query<ApiSuccessResponse<any[]>, { parentId?: string } | void>({
      query: (params) => ({
        url: '/children',
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['Kid'],
      extraOptions: { maxRetries: 0 },
    }),

    getKid: builder.query<ApiSuccessResponse<any>, string>({
      query: (id) => ({
        url: `/children/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Kid', id }, 'Kid'],
      extraOptions: { maxRetries: 0 },
    }),

    updateKid: builder.mutation<ApiSuccessResponse<any>, { id: string; payload: UpdateKidPayload }>({
      query: ({ id, payload }) => ({
        url: `/children/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Kid', id }, 'Kid'],
      extraOptions: { maxRetries: 0 },
    }),
    
    createKids: builder.mutation<ApiSuccessResponse<unknown>, CreateKidsPayload>({
      query: (payload) => ({
        url: '/children',
        method: 'POST',
        body: payload,
        // Ensure credentials are included
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // The Authorization header will be added automatically by baseQueryWithReauth
        },
      }),
      // Invalidate the cache for the kids list
      invalidatesTags: ['Kid'],
      extraOptions: { maxRetries: 0 },
    }),
    
    deleteKid: builder.mutation<ApiSuccessResponse<{ success: boolean }>, string>({
      query: (id) => ({
        url: `/children/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Kid'],
      extraOptions: { maxRetries: 0 },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateKidsMutation,
  useGetKidQuery,
  useGetKidsQuery,
  useLazyGetKidQuery,
  useUpdateKidMutation,
  useDeleteKidMutation,
} = kidsApi;
