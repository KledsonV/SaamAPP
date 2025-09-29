// src/api/authService.ts
import api from "./axiosInstance";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    role: string;
    active: boolean;
    token: string;
  };
  timestamp: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface WelcomeUser {
  name: string;
  email: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(data: RegisterRequest) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async validate() {
    const response = await api.get("/auth/validate");
    return response.data;
  },

  async sendWelcomeMessage(data: WelcomeUser) {
    const response = await api.post("/reports/welcome", data);
    return response.data;
  },
};
