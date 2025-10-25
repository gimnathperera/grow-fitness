import { baseApi } from './baseApi';
import type { ApiSuccessResponse } from '@/types/api';

export interface CollectInfoPayload {
  fullName: string;
  phoneNumber: string;
  email: string;
  location: string;
  planType: string;
}

export interface CollectInfoResponse {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  location: string;
  planType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectInfoQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  planType?: string;
  location?: string;
}

export interface CollectInfoListResponse {
  data: CollectInfoResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CollectInfoStats {
  total: number;
  pending: number;
  contacted: number;
  converted: number;
  rejected: number;
}

export const collectInfoApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createCollectInfo: builder.mutation<
      ApiSuccessResponse<CollectInfoResponse>,
      CollectInfoPayload
    >({
      query: body => ({
        url: '/collect-info',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CollectInfo'],
    }),
    getCollectInfoList: builder.query<
      ApiSuccessResponse<CollectInfoListResponse>,
      CollectInfoQueryParams | void
    >({
      query: params => ({
        url: '/collect-info',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['CollectInfo'],
    }),
    getCollectInfoById: builder.query<
      ApiSuccessResponse<CollectInfoResponse>,
      string
    >({
      query: id => ({
        url: `/collect-info/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'CollectInfo', id }, 'CollectInfo'],
    }),
    updateCollectInfo: builder.mutation<
      ApiSuccessResponse<CollectInfoResponse>,
      { id: string; payload: Partial<CollectInfoPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/collect-info/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'CollectInfo', id },
        'CollectInfo',
      ],
    }),
    deleteCollectInfo: builder.mutation<ApiSuccessResponse<null>, string>({
      query: id => ({
        url: `/collect-info/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CollectInfo'],
    }),
    getCollectInfoStats: builder.query<
      ApiSuccessResponse<CollectInfoStats>,
      void
    >({
      query: () => ({
        url: '/collect-info/stats',
        method: 'GET',
      }),
      providesTags: ['CollectInfo'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCollectInfoMutation,
  useGetCollectInfoListQuery,
  useLazyGetCollectInfoListQuery,
  useGetCollectInfoByIdQuery,
  useUpdateCollectInfoMutation,
  useDeleteCollectInfoMutation,
  useGetCollectInfoStatsQuery,
} = collectInfoApi;
