import type { LoginResponse } from "../../types/interfaces/IAuthTypes";
import { api } from "./api";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/accounts/login', { email, password });
    return response.data;
  }
};