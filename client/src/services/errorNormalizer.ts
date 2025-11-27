import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type ErrorPayload = {
  message: string;
  code?: string;
  details?: Record<string, unknown> | string;
  meta?: Record<string, unknown>;
  raw?: unknown;
};

export type NormalizedApiError = FetchBaseQueryError & {
  data?: ErrorPayload;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const normalizeApiError = (
  error: FetchBaseQueryError,
): NormalizedApiError => {
  if (!error) {
    return {
      status: 'CUSTOM_ERROR',
      data: {
        message: 'Unknown error',
      },
    } as NormalizedApiError;
  }

  if (typeof error.status === 'number' && isObject(error.data)) {
    const payload = error.data as Record<string, unknown>;
    const normalized: ErrorPayload = {
      message: 'Something went wrong',
      raw: payload,
    };

    if (isObject(payload.error)) {
      const err = payload.error as Record<string, unknown>;
      normalized.message = String(err.message ?? normalized.message);
      normalized.code = typeof err.code === 'string' ? err.code : undefined;
      normalized.details =
        (err.details as Record<string, unknown>) ?? undefined;
    }

    if (isObject(payload.meta)) {
      normalized.meta = payload.meta;
    }

    if (typeof payload.message === 'string' && !payload.error) {
      normalized.message = payload.message;
    }

    return {
      ...error,
      data: normalized,
    };
  }

  if (error.status === 'FETCH_ERROR') {
    return {
      status: 'CUSTOM_ERROR',
      data: {
        message: 'Network error, please try again.',
      },
      error: 'Network error',
    } as NormalizedApiError;
  }

  if (error.status === 'PARSING_ERROR') {
    return {
      status: 'CUSTOM_ERROR',
      data: {
        message: 'Unable to parse server response.',
        raw: error.data,
      },
      error: 'Parsing error',
    } as NormalizedApiError;
  }

  return {
    status: 'CUSTOM_ERROR',
    data: {
      message: 'Unexpected error occurred.',
      raw: error.data,
    },
    error: 'Unknown error',
  } as NormalizedApiError;
};
