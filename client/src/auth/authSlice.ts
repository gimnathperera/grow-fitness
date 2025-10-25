import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { components } from '@/types/api';
import {
  clearAuthState,
  loadAuthState,
  saveAuthState,
  type PersistedAuthState,
} from '@/auth/tokenStorage';

export type UserRole = components['schemas']['UserProfileDto']['role'];
export type UserProfile = components['schemas']['UserProfileDto'];
export type AuthTokens = components['schemas']['AuthTokensDto'];

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: UserProfile | null;
  status: 'idle' | 'hydrated';
  selectedKidId: string | null;
}

const BASE_STATE: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
  status: 'idle',
  selectedKidId: null,
};

const persisted = loadAuthState();

const initialState: AuthState = {
  ...BASE_STATE,
  ...(persisted ?? {}),
  status: persisted ? 'hydrated' : 'idle',
  selectedKidId: persisted?.selectedKidId ?? null,
};

const persist = (state: AuthState) => {
  const payload: PersistedAuthState = {
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    expiresAt: state.expiresAt,
    user: state.user,
    selectedKidId: state.selectedKidId,
  };

  saveAuthState(payload);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateFromStorage(
      state,
      action: PayloadAction<PersistedAuthState | null | undefined>,
    ) {
      if (action.payload) {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiresAt = action.payload.expiresAt;
        state.user = action.payload.user ?? null;
      } else if (!state.accessToken && !state.refreshToken) {
        Object.assign(state, BASE_STATE);
      }

      state.status = 'hydrated';
    },
    setTokens(state, action: PayloadAction<Partial<AuthTokens>>) {
      state.accessToken = action.payload.accessToken ?? state.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      state.expiresAt = action.payload.expiresAt ?? state.expiresAt;
      persist(state);
    },
    setUser(state, action: PayloadAction<UserProfile | null>) {
      state.user = action.payload;
      persist(state);
    },
    setSelectedKidId(state, action: PayloadAction<string | null>) {
      state.selectedKidId = action.payload ?? null;
      persist(state);
    },
    clearSession() {
      clearAuthState();
      return { ...BASE_STATE, status: 'hydrated' };
    },
  },
});

export const { hydrateFromStorage, setTokens, setUser, setSelectedKidId, clearSession } =
  authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken);
export const selectSelectedKidId = (state: RootState) => state.auth.selectedKidId;

export default authSlice.reducer;
