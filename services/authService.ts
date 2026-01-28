import api from "@/lib/api";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ApiResponse,
  User,
} from "@/types";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await api.post("/users/register", data);
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  },
};
