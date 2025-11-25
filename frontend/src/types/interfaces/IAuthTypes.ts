import type { ERoles } from "../enums/ERoles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: ERoles;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
}