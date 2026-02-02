import api from "@/lib/api";
import { User, PaginatedResponse, UserRequest } from "@/types";

interface UserFilters {
  page?: number;
  perPage?: number;
  search?: string;
  orderBy?: string;
  sortDirection?: "ASC" | "DESC";
  role?: string;
  startDate?: string;
  endDate?: string;
  periode?: string;
}

export const userService = {
  getPaged: async (
    filters: UserFilters = {},
  ): Promise<PaginatedResponse<User>> => {
    const {
      page = 1,
      perPage = 10,
      search,
      orderBy,
      sortDirection,
      role,
      startDate,
      endDate,
      periode,
    } = filters;
    const response = await api.get("/users/paged", {
      params: {
        page,
        perPage,
        search,
        orderBy,
        sortDirection,
        role,
        startDate,
        endDate,
        periode,
      },
    });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: UserRequest): Promise<{ message: string }> => {
    const response = await api.post("/users/register", data);
    return response.data;
  },

  update: async (id: string, data: Partial<UserRequest>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
