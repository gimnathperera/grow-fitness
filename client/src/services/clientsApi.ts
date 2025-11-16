import { baseApi } from '@/services/baseApi';
import type { ApiSuccessResponse } from '@/types/api';

export interface ClientProfile extends Record<string, unknown> {
  _id?: string;
  id?: string;
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  profilePic?: string;
  assignedCoachId?: string;
  status?: string;
  kids?: any[];
  invoices?: any[];
}

export interface ClientsListResponse {
  clients: ClientProfile[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientsQueryParams {
  assignedCoachId?: string;
  tags?: string[];
  status?: string;
  page?: number;
  limit?: number;
}

export const clientsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getClients: builder.query<ApiSuccessResponse<ClientsListResponse>, ClientsQueryParams | void>({
      query: params => ({
        url: '/users',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['Client'],
    }),

    getClientById: builder.query<ApiSuccessResponse<ClientProfile>, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: 'Client', id }, 'Client'],
    }),

    getMyClientProfile: builder.query<ApiSuccessResponse<ClientProfile>, void>({
      query: () => ({
        url: '/users/my-profile',
        method: 'GET',
      }),
      providesTags: ['Client'],
    }),

    updateClient: builder.mutation<ApiSuccessResponse<ClientProfile>, { id: string; payload: Partial<ClientProfile> }>({
      query: ({ id, payload }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Client', id }, 'Client'],
    }),

    deleteKid: builder.mutation<ApiSuccessResponse<{ success: boolean }>, { kidId: string }>({
      query: ({ kidId }) => ({
        url: `/kids/${kidId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Client'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetClientsQuery,
  useLazyGetClientsQuery,
  useGetClientByIdQuery,
  useGetMyClientProfileQuery,
  useUpdateClientMutation,
  useDeleteKidMutation,
} = clientsApi;
