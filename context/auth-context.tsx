"use client";

import Controller from "@/lib/firebase/controler";
import { UserType } from "@/type/user";
import { createContext, ReactNode, useContext, useEffect, useState, } from "react";

interface TokenType { id: string, role: "Admin" | "Customer" }

interface AuthContextType {
  token: TokenType | null;
  user: UserType | null;
  login: (user: UserType, token:  TokenType) => void;
  logout: () => void;
  loading: boolean;
  error: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {

  // Load token from localStorage on first render
  const [token, setToken] = useState<TokenType | null>(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth_token") || "null") as TokenType | null
    if (token) {     
      setToken(token);
      
      // Featch user data on render    
      setLoading(true);        
      (async () => {
        try {
          const user = await Controller.getData<UserType>("users", token.id);
          if(user) setUser(user);    
        } catch (error) {
          setError("User not found!");
          console.log(error);
        } finally {
          setLoading(false)
        }
      })()
    }
  }, []);

  // Fetches profile only if token exists
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = (user: UserType, token:  TokenType) => {
    setToken(token);
    localStorage.setItem("auth_token", JSON.stringify(token));
    setUser(user);
  };

  const logout = () => {
    setToken(null)
    localStorage.removeItem("auth_token");
    setUser(null)
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, error}}>
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
};

