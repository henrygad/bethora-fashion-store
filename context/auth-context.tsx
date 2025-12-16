"use client";

import { createContext, ReactNode, useContext, useEffect, useState, } from "react";

interface AuthContextType {
  token: boolean | null;
  user: {};
  login: (user: {}, token: boolean | null) => void;
  logout: () => void;
  loading: boolean;
  error: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<boolean | null>(null);

  // Load token from localStorage on first render
  useEffect(() => {
    const t = localStorage.getItem("auth_token") as boolean | null;
    if (t) setToken(t);
  }, []);

  // Fetches profile only if token exists
  const [user, setUser] = useState<{}>({ role: "admin", name: "Henry Gad", age: "25" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = (user: {}, token: boolean | null) => {
    setToken(token);
    setUser(user);
    localStorage.setItem("auth_token", JSON.stringify(token));
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}


