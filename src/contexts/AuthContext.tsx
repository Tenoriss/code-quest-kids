import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { AuthState, UserProfile } from "@/types";

interface AuthContextType {
  authState: AuthState;
  signUp: (profile: UserProfile) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  teacherLogin: () => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  currentUserProfile: UserProfile | null;
}

const DEFAULT_AUTH: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  users: {},
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useLocalStorage<AuthState>("codequest_auth", DEFAULT_AUTH);

  const signUp = useCallback(
    (profile: UserProfile): { success: boolean; error?: string } => {
      setAuthState((prev) => {
        // Check if email already exists
        const existingUser = Object.values(prev.users).find((u) => u.email === profile.email);
        if (existingUser) {
          return prev; // We handle errors via the return value
        }

        const newUsers = { ...prev.users, [profile.email]: profile };
        return {
          isAuthenticated: true,
          currentUser: profile.email,
          users: newUsers,
        };
      });

      // Check if it already existed
      const existing = Object.values(authState.users).find((u) => u.email === profile.email);
      if (existing) {
        return { success: false, error: "Email already registered!" };
      }

      return { success: true };
    },
    [authState.users, setAuthState]
  );

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const user = authState.users[email];
      if (!user) {
        return { success: false, error: "Email not found!" };
      }
      if (user.password !== password) {
        return { success: false, error: "Incorrect password!" };
      }

      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        currentUser: email,
      }));

      return { success: true };
    },
    [authState.users, setAuthState]
  );

  const teacherLogin = useCallback((): { success: boolean; error?: string } => {
    const teacherEmail = "teacher@codequest.app";
    const teacherPassword = "teacher123";

    // Create teacher account if not exists
    if (!authState.users[teacherEmail]) {
      setAuthState((prev) => ({
        ...prev,
        users: {
          ...prev.users,
          [teacherEmail]: {
            fullName: "Ms. Johnson",
            nickname: "Teacher",
            email: teacherEmail,
            password: teacherPassword,
            role: "teacher" as const,
            birthday: "",
            grade: "",
            country: "",
            avatarUrl: "",
            avatarFrame: "default",
            favoriteColor: "#10b981",
            favoriteCharacter: "Byte",
            bio: "Computer Science Teacher",
          },
        },
      }));
    }

    // Login
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      currentUser: teacherEmail,
    }));

    return { success: true };
  }, [authState.users, setAuthState]);

  const logout = useCallback(() => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: false,
      currentUser: null,
    }));
  }, [setAuthState]);

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      if (!authState.currentUser) return;
      setAuthState((prev) => {
        const currentProfile = prev.users[prev.currentUser!];
        if (!currentProfile) return prev;
        return {
          ...prev,
          users: {
            ...prev.users,
            [prev.currentUser!]: { ...currentProfile, ...updates },
          },
        };
      });
    },
    [authState.currentUser, setAuthState]
  );

  const currentUserProfile = authState.currentUser
    ? authState.users[authState.currentUser] || null
    : null;

  return (
    <AuthContext.Provider
      value={{
        authState,
        signUp,
        login,
        teacherLogin,
        logout,
        updateProfile,
        isAuthenticated: authState.isAuthenticated,
        currentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
