import api from "@/lib/api";
import {
  Tagihan,
  TagihanRequest,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const tagihanService = {
  getAll: async (
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<Tagihan>> => {
    const response = await api.get("/tagihan", {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Tagihan>> => {
    const response = await api.get(`/tagihan/${id}`);
    return response.data;
  },

  getByIdPelanggan: async (
    idPelanggan: string,
  ): Promise<ApiResponse<Tagihan[]>> => {
    const response = await api.get(`/tagihan/cek/${idPelanggan}`);
    return response.data;
  },

  getUnpaidByIdPelanggan: async (
    idPelanggan: string,
  ): Promise<ApiResponse<Tagihan[]>> => {
    const response = await api.get(`/tagihan/cek/${idPelanggan}/belum-bayar`);
    return response.data;
  },

  create: async (data: TagihanRequest): Promise<ApiResponse<Tagihan>> => {
    const response = await api.post("/tagihan", data);
    return response.data;
  },

  updateDenda: async (
    id: string,
    denda: number,
  ): Promise<ApiResponse<Tagihan>> => {
    const response = await api.patch(`/tagihan/${id}/denda`, { denda });
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/tagihan/${id}`);
    return response.data;
  },
};
