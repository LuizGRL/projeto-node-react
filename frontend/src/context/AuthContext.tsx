import { createContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "../types/interfaces/IAuthTypes";
import { api } from "../services/auth/api";
import { authService } from "../services/auth/authService";

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoverUser = () => {
      const storedToken = localStorage.getItem("@App:token");
      const storedUser = localStorage.getItem("@App:user");

      if (storedToken && storedUser) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        setUser(JSON.parse(storedUser) as User);
      }
      setLoading(false);
    };

    recoverUser();
  }, []);

  const signIn = async (email: string, pass: string) => {
    try {
      const data = await authService.login(email, pass);
      
      const { token, user: userData } = data;

      localStorage.setItem("@App:token", token);
      localStorage.setItem("@App:user", JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
      
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
    api.defaults.headers.Authorization = undefined; 
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      loading, 
      signIn, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};