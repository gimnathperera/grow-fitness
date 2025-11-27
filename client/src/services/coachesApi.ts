import { baseApi } from "@/services/baseApi";
import type { ApiSuccessResponse } from "@/types/api";

export interface CoachProfile extends Record<string, unknown> {
  _id?: string;
  id?: string;
  userId?: string;
  status?: string;
  specialization?: string;
  timeSlots?: {
    id: string;
    day: string;
    time: string;
    available: boolean;
  }[];
}

export interface CoachesListResponse {
  coaches: CoachProfile[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CoachesQueryParams {
  tags?: string[];
  status?: string;
  page?: number;
  limit?: number;
}

// Define tag types for cache invalidation
const CoachTags = {
  COACH: 'Coach',
  MY_COACH_PROFILE: 'MyCoachProfile',
  COACHES_LIST: 'CoachesList',
} as const;

export const coachesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoaches: builder.query<
      ApiSuccessResponse<CoachesListResponse>,
      CoachesQueryParams | void
    >({
      query: (params) => ({
        url: "/coaches",
        method: "GET",
        params: params || {},
      }),
      providesTags: [CoachTags.COACHES_LIST],
    }),
    getCoachById: builder.query<ApiSuccessResponse<CoachProfile>, string>({
      query: (id) => ({
        url: `/coaches/${id}`,
        method: "GET",
      }),
      providesTags: (_, __, id) => [{ type: CoachTags.COACH, id }],
    }),
    getMyCoachProfile: builder.query<ApiSuccessResponse<CoachProfile | null>, void>({
      query: () => ({
        url: "/coaches/my-profile",
        method: "GET",
      }),
      providesTags: [CoachTags.MY_COACH_PROFILE],
      transformResponse: (response: any) => {
        // If the server returns { ok: true, data: null } for no profile
        if (response?.data === null) {
          return response; // Return as is, the component will handle the null data
        }
        return response;
      },
    }),
    createCoachProfile: builder.mutation<ApiSuccessResponse<CoachProfile>, Partial<CoachProfile>>({
      query: (data) => ({
        url: "/coaches/my-profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [CoachTags.MY_COACH_PROFILE, CoachTags.COACHES_LIST],
    }),
    updateCoach: builder.mutation<
      ApiSuccessResponse<CoachProfile>,
      { id: string; payload: Partial<CoachProfile> }
    >({
      query: ({ id, payload }) => ({
        url: `/coaches/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: CoachTags.COACH, id },
        CoachTags.MY_COACH_PROFILE,
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCoachesQuery,
  useLazyGetCoachesQuery,
  useGetCoachByIdQuery,
  useGetMyCoachProfileQuery,
  useCreateCoachProfileMutation,
  useUpdateCoachMutation,
} = coachesApi;
