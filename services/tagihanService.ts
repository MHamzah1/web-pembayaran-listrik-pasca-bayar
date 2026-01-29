import api from "@/lib/api";
import { Tagihan, TagihanRequest, PaginatedResponse } from "@/types";

interface TagihanFilters {
  page?: number;
  perPage?: number;
  pelangganId?: string;
  bulanTagihan?: string;
  statusPembayaran?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export const tagihanService = {
  getAll: async (
    filters: TagihanFilters = {},
  ): Promise<PaginatedResponse<Tagihan>> => {
    const {
      page = 1,
      perPage = 10,
      pelangganId,
      bulanTagihan,
      statusPembayaran,
      startDate,
      endDate,
      orderBy,
      sortDirection,
    } = filters;
    const response = await api.get("/tagihan", {
      params: {
        page,
        perPage,
        pelangganId,
        bulanTagihan,
        statusPembayaran,
        startDate,
        endDate,
        orderBy,
        sortDirection,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Tagihan> => {
    const response = await api.get(`/tagihan/${id}`);
    return response.data;
  },

  getByIdPelanggan: async (idPelanggan: string): Promise<Tagihan[]> => {
    const response = await api.get(`/tagihan/cek/${idPelanggan}`);
    return response.data;
  },

  getUnpaidByIdPelanggan: async (idPelanggan: string): Promise<Tagihan[]> => {
    const response = await api.get(`/tagihan/cek/${idPelanggan}/belum-bayar`);
    return response.data;
  },

  create: async (data: TagihanRequest): Promise<Tagihan> => {
    const response = await api.post("/tagihan", data);
    return response.data;
  },

  updateDenda: async (id: string, denda: number): Promise<Tagihan> => {
    const response = await api.patch(`/tagihan/${id}/denda`, { denda });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tagihan/${id}`);
  },
};
