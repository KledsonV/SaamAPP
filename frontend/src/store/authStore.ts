import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AuthStore,
  LoginCredentials,
  ResponseLogin,
  RegisterCredentials,
} from "@/types";
import { authService } from "@/api/authService";
import { AxiosError } from "axios";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: null,

      login: async (
        credentials: LoginCredentials
      ): Promise<true | ResponseLogin> => {
        try {
          const response = await authService.login(credentials);
          const { data } = response;

          set({
            isAuthenticated: true,
            token: data.token,
            user: {
              id: data.id,
              email: data.email,
              name: data.username,
              role: data?.role,
            },
          });

          return true;
        } catch (error: unknown) {
          if ((error as AxiosError)?.response) {
            const backendError = (error as AxiosError).response
              ?.data as ResponseLogin;
            console.error("Erro ao fazer login:", backendError);
            return backendError;
          }
          return {
            timestamp: new Date().toISOString(),
            status: 500,
            error: "Erro desconhecido",
            message: "Não foi possível processar a requisição",
            path: "/api/auth/login",
          };
        }
      },

      registerUser: async (
        payload: RegisterCredentials
      ): Promise<true | ResponseLogin> => {
        try {
          const response = await authService.register({
            username: payload.username,
            email: payload.email,
            password: payload.password,
            role: payload.role ?? "USER",
          });

          const data = response.data;

          if (data?.token) {
            set({
              isAuthenticated: true,
              token: data.token,
              user: {
                id: data.id,
                email: data.email,
                name: data.username,
                role: data?.role,
              },
            });
          }

          await authService.sendWelcomeMessage({
            name: data.username,
            email: data.email,
          });

          return true;
        } catch (error: unknown) {
          if ((error as AxiosError)?.response) {
            const backendError = (error as AxiosError).response
              ?.data as ResponseLogin;
            console.error("Erro ao registrar:", backendError);
            return backendError;
          }
          return {
            timestamp: new Date().toISOString(),
            status: 500,
            error: "Erro desconhecido",
            message: "Não foi possível criar a conta",
            path: "/api/auth/register",
          };
        }
      },

      validateToken: async (): Promise<boolean> => {
        const token = get().token;
        if (!token) return false;
        try {
          await authService.validate();
          return true;
        } catch {
          set({ isAuthenticated: false, token: null, user: null });
          return false;
        }
      },

      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    }
  )
);
