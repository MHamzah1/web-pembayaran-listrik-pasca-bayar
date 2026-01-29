import api from "@/lib/api";
import { Pelanggan, PelangganRequest, PaginatedResponse } from "@/types";

interface PelangganFilters {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  tarifId?: string;
  orderBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export const pelangganService = {
  getAll: async (
    filters: PelangganFilters = {},
  ): Promise<PaginatedResponse<Pelanggan>> => {
    const {
      page = 1,
      perPage = 10,
      search,
      status,
      tarifId,
      orderBy,
      sortDirection,
    } = filters;
    const response = await api.get("/pelanggan", {
      params: {
        page,
        perPage,
        search,
        status,
        tarifId,
        orderBy,
        sortDirection,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Pelanggan> => {
    const response = await api.get(`/pelanggan/${id}`);
    return response.data;
  },

  getByIdPelanggan: async (idPelanggan: string): Promise<Pelanggan> => {
    const response = await api.get(`/pelanggan/cek/${idPelanggan}`);
    return response.data;
  },

  create: async (data: PelangganRequest): Promise<Pelanggan> => {
    const response = await api.post("/pelanggan", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<PelangganRequest>,
  ): Promise<Pelanggan> => {
    const response = await api.put(`/pelanggan/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pelanggan/${id}`);
  },
};
