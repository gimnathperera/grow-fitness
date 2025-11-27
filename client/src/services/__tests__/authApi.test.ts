import { afterEach, describe, expect, it, vi } from 'vitest';
import { authApi } from '@/services/authApi';
import { createAppStore } from '@/store';

const createResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

class MockAbortSignal {
  aborted = false;
  onabort: null | ((this: MockAbortSignal, ev: Event) => void) = null;
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent(): boolean {
    return false;
  }
}

class MockAbortController {
  signal = new MockAbortSignal();
  abort() {
    this.signal.aborted = true;
    if (this.signal.onabort) {
      this.signal.onabort.call(this.signal, new Event('abort'));
    }
  }
}

class MockRequest {
  url: string;
  init?: RequestInit;
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.toString();
    this.init = init;
  }
}

// Assign mocks safely without `any`
globalThis.AbortController =
  MockAbortController as unknown as typeof AbortController;
globalThis.AbortSignal = MockAbortSignal as unknown as typeof AbortSignal;
globalThis.Request = MockRequest as unknown as typeof Request;

describe('authApi endpoints', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('executes login mutation and returns payload', async () => {
    const store = createAppStore();
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createResponse({
        ok: true,
        data: {
          tokens: {
            accessToken: 'token',
            refreshToken: 'refresh',
            expiresAt: '2025-01-01T00:00:00.000Z',
          },
          user: {
            id: '1',
            email: 'user@example.com',
            name: 'Test User',
            phone: '555-0000',
            role: 'client',
            status: 'active',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        },
      }),
    );

    const result = await store
      .dispatch(
        authApi.endpoints.login.initiate({
          email: 'user@example.com',
          password: 'password',
        }),
      )
      .unwrap();

    const [request] = fetchSpy.mock.calls[0] ?? [];
    expect(request).toBeInstanceOf(MockRequest);
    expect((request as MockRequest).url).toBe(
      'http://localhost:3000/auth/login',
    );
    expect((request as MockRequest).init?.method).toBe('POST');
    expect(result).toMatchObject({
      ok: true,
      data: {
        user: { email: 'user@example.com', role: 'client' },
      },
    });
  });
});
