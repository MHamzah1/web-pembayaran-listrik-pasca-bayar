import api from "@/lib/api";
import {
  Pembayaran,
  PembayaranRequest,
  Struk,
  LaporanHarian,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const pembayaranService = {
  getAll: async (
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<Pembayaran>> => {
    const response = await api.get("/pembayaran", {
      params: { page, limit, search },
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Pembayaran>> => {
    const response = await api.get(`/pembayaran/${id}`);
    return response.data;
  },

  getByNomorTransaksi: async (
    nomorTransaksi: string,
  ): Promise<ApiResponse<Pembayaran>> => {
    const response = await api.get(`/pembayaran/transaksi/${nomorTransaksi}`);
    return response.data;
  },

  getLaporanHarian: async (
    tanggal?: string,
  ): Promise<ApiResponse<LaporanHarian>> => {
    const response = await api.get("/pembayaran/laporan-harian", {
      params: { tanggal },
    });
    return response.data;
  },

  getStruk: async (id: string): Promise<ApiResponse<Struk>> => {
    const response = await api.get(`/pembayaran/${id}/struk`);
    return response.data;
  },

  create: async (data: PembayaranRequest): Promise<ApiResponse<Pembayaran>> => {
    const response = await api.post("/pembayaran", data);
    return response.data;
  },
};
