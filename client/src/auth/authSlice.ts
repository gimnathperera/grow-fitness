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

export interface Kid {
  id: string;
  name: string;
  parentId?: string;
  birthDate?: string;
  age?: number;
  gender: 'boy' | 'girl';
  location: string;
  goals?: string[];
  medicalCondition?: string;
  isInSports?: boolean;
  trainingPreference?: 'personal' | 'group';
  preferredTrainingStyle?: 'personal' | 'group';
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: UserProfile | null;
  status: 'idle' | 'hydrated';
  selectedKidId: string | null;
  selectedKidDetails: Kid | null;
}

const BASE_STATE: AuthState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  user: null,
  status: 'idle',
  selectedKidId: null,
  selectedKidDetails: null,
};

const persisted = loadAuthState();

const initialState: AuthState = {
  ...BASE_STATE,
  ...(persisted ?? {}),
  status: persisted ? 'hydrated' : 'idle',
  selectedKidId: persisted?.selectedKidId ?? null,
  selectedKidDetails: persisted?.selectedKidDetails ?? null,
};

const persist = (state: AuthState) => {
  const payload: PersistedAuthState = {
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    expiresAt: state.expiresAt,
    user: state.user,
    selectedKidId: state.selectedKidId,
    selectedKidDetails: state.selectedKidDetails,
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
        state.selectedKidId = action.payload.selectedKidId ?? null;
        state.selectedKidDetails = action.payload.selectedKidDetails ?? null;
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
    setSelectedKidDetails(state, action: PayloadAction<Kid | null>) {
      state.selectedKidDetails = action.payload ?? null;
      persist(state);
    },
    clearSession() {
      clearAuthState();
      return { ...BASE_STATE, status: 'hydrated' };
    },
  },
});

export const {
  hydrateFromStorage,
  setTokens,
  setUser,
  setSelectedKidId,
  setSelectedKidDetails,
  clearSession,
} = authSlice.actions;

// selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken);
export const selectSelectedKidId = (state: RootState) => state.auth.selectedKidId;
export const selectSelectedKidDetails = (state: RootState) =>
  state.auth.selectedKidDetails;

export default authSlice.reducer;
