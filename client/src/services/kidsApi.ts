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
        url: '/kids',
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['Kid'],
    }),
    getKid: builder.query<ApiSuccessResponse<any>, string>({
      query: (id) => ({
        url: `/kids/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Kid', id }, 'Kid'],
    }),
    updateKid: builder.mutation<ApiSuccessResponse<any>, { id: string; payload: UpdateKidPayload }>({
      query: ({ id, payload }) => ({
        url: `/kids/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Kid', id }, 'Kid'],
    }),
    createKids: builder.mutation<ApiSuccessResponse<unknown>, CreateKidsPayload>({
      query: payload => ({
        url: '/kids',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Kid'],
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
} = kidsApi;
