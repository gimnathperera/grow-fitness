import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "coach" | "parent";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      login: (user: User, token: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", token);
          // Set cookie for middleware to read
          document.cookie = `auth-storage=${JSON.stringify({
            state: { user, token, isAuthenticated: true },
            version: 0,
          })}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          // Clear cookie for middleware
          document.cookie =
            "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync cookie when rehydrating from localStorage
        if (state && typeof window !== "undefined") {
          if (state.isAuthenticated && state.user && state.token) {
            document.cookie = `auth-storage=${JSON.stringify({
              state: {
                user: state.user,
                token: state.token,
                isAuthenticated: true,
              },
              version: 0,
            })}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
          } else {
            document.cookie =
              "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        }
        state?.setHydrated();
      },
    }
  )
);
