import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { get, post } from "../api/client";

export type User = {
  id: number;
  email: string;
  role: "user" | "admin" | string;
  firstName?: string;
  lastName?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await get<User | { error: string }>("/login");
        if ("error" in data) setUser(null);
        else setUser(data as User);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(email: string, password: string) {
    const data = await post<{ email: string; password: string }, User | { error: string }>(
      "/login", // ✅ inte /api/login!
      { email, password }
    );
    if ("error" in data) throw new Error(data.error);
    setUser(data as User);
  }

  async function logout() {
    await fetch("/api/login", { method: "DELETE", credentials: "include" });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
