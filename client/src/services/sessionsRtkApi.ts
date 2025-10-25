import { baseApi } from '@/services/baseApi';
import type { ApiSuccessResponse } from '@/types/api';
import type { AvailabilityData } from '@/types/session-booking';

export interface SessionsListResponse {
  sessions: any[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SessionsQueryParams {
  clientId?: string;
  coachId?: string;
  kidId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CreateSessionPayload {
  clientId: string;
  coachId: string;
  kidId?: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  location?: string;
  notes?: string;
  sessionType?: string;
  price?: number;
  tags?: string[];
}

export const sessionsRtkApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSessions: builder.query<ApiSuccessResponse<SessionsListResponse>, SessionsQueryParams | void>({
      query: (params) => ({
        url: '/sessions',
        method: 'GET',
        params: params ?? {},
      }),
      providesTags: ['Session'],
    }),
    getUpcomingSessions: builder.query<ApiSuccessResponse<any[]>, number | void>({
      query: (limit) => ({
        url: '/sessions/upcoming',
        method: 'GET',
        params: typeof limit === 'number' ? { limit } : {},
      }),
      providesTags: ['Session'],
    }),
    getUpcomingByKid: builder.query<ApiSuccessResponse<any[]>, { kidId: string; limit?: number }>({
      query: ({ kidId, limit }) => ({
        url: '/sessions/upcoming-by-kid',
        method: 'GET',
        params: { kidId, ...(limit ? { limit } : {}) },
      }),
      providesTags: ['Session'],
    }),
    getAvailabilityByCoach: builder.query<ApiSuccessResponse<AvailabilityData>, { coachId: string; location?: string }>({
      query: ({ coachId, location }) => ({
        url: '/sessions/check-availability',
        method: 'GET',
        params: { coachId, ...(location ? { location } : {}) },
      }),
      providesTags: ['Session'],
    }),
    createSession: builder.mutation<ApiSuccessResponse<any>, CreateSessionPayload>({
      query: (payload) => ({
        url: '/sessions',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Session'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetSessionsQuery, useLazyGetSessionsQuery, useGetUpcomingSessionsQuery, useLazyGetUpcomingSessionsQuery, useGetUpcomingByKidQuery, useLazyGetUpcomingByKidQuery, useCreateSessionMutation, useGetAvailabilityByCoachQuery, useLazyGetAvailabilityByCoachQuery } = sessionsRtkApi;
