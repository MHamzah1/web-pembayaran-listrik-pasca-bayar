import api from "@/lib/api";
import { User, ApiResponse, PaginatedResponse, RegisterRequest } from "@/types";

export const userService = {
  getAll: async (
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get("/users", {
      params: { page, limit, search },
    });
    return response.data;
  },

  getPaged: async (
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get("/users/paged", {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await api.post("/users/register", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<RegisterRequest>,
  ): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
