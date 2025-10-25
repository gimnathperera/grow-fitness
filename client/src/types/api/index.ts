export type { paths, components, operations } from './generated';

export type ApiSuccessResponse<T> = {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | string;
  };
  meta?: Record<string, unknown>;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
