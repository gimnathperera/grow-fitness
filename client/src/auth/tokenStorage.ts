import type { components } from '@/types/api';

export interface PersistedAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: components['schemas']['UserProfileDto'] | null;
  selectedKidId?: string | null;
}

const STORAGE_KEY = 'grow-fitness/auth';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn('[auth] Unable to access localStorage:', error);
    return null;
  }
};

export const loadAuthState = (): PersistedAuthState | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const raw = storage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedAuthState;
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      expiresAt: parsed.expiresAt ?? null,
      user: parsed.user ?? null,
      selectedKidId: parsed.selectedKidId ?? null,
    };
  } catch (error) {
    console.warn('[auth] Failed to parse persisted state:', error);
    storage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const saveAuthState = (state: PersistedAuthState) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  const payload = JSON.stringify(state);
  storage.setItem(STORAGE_KEY, payload);
};

export const clearAuthState = () => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(STORAGE_KEY);
};
