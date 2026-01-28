import api from "@/lib/api";
import {
  Pelanggan,
  PelangganRequest,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const pelangganService = {
  getAll: async (
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<Pelanggan>> => {
    const response = await api.get("/pelanggan", {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Pelanggan>> => {
    const response = await api.get(`/pelanggan/${id}`);
    return response.data;
  },

  getByIdPelanggan: async (
    idPelanggan: string,
  ): Promise<ApiResponse<Pelanggan>> => {
    const response = await api.get(`/pelanggan/cek/${idPelanggan}`);
    return response.data;
  },

  create: async (data: PelangganRequest): Promise<ApiResponse<Pelanggan>> => {
    const response = await api.post("/pelanggan", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<PelangganRequest>,
  ): Promise<ApiResponse<Pelanggan>> => {
    const response = await api.put(`/pelanggan/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/pelanggan/${id}`);
    return response.data;
  },
};
