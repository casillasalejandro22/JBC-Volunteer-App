"use client";

// TODO: Replace mock auth with Firebase Authentication
// When integrating Firebase Auth:
//   - Import { onAuthStateChanged } from "firebase/auth"
//   - Replace the mock login with firebase.auth().signInWithEmailAndPassword()
//   - Listen to onAuthStateChanged in useEffect to set the user
//   - Fetch user role from Firestore "users" collection

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User, UserRole } from "@/lib/types";
import { loginByRole } from "@/lib/services/auth";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (role: UserRole) => {
    setIsLoading(true);
    try {
      const loggedInUser = await loginByRole(role);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback(
    async (role: UserRole) => {
      await login(role);
    },
    [login]
  );

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
