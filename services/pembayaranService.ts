import api from "@/lib/api";
import {
  Pembayaran,
  PembayaranRequest,
  StrukResponse,
  LaporanHarian,
  PaginatedResponse,
} from "@/types";

interface PembayaranFilters {
  page?: number;
  perPage?: number;
  metodePembayaran?: string;
  statusTransaksi?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export const pembayaranService = {
  getAll: async (
    filters: PembayaranFilters = {},
  ): Promise<PaginatedResponse<Pembayaran>> => {
    const {
      page = 1,
      perPage = 10,
      metodePembayaran,
      statusTransaksi,
      startDate,
      endDate,
      orderBy,
      sortDirection,
    } = filters;
    const response = await api.get("/pembayaran", {
      params: {
        page,
        perPage,
        metodePembayaran,
        statusTransaksi,
        startDate,
        endDate,
        orderBy,
        sortDirection,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Pembayaran> => {
    const response = await api.get(`/pembayaran/${id}`);
    return response.data;
  },

  getByNomorTransaksi: async (nomorTransaksi: string): Promise<Pembayaran> => {
    const response = await api.get(`/pembayaran/transaksi/${nomorTransaksi}`);
    return response.data;
  },

  getLaporanHarian: async (tanggal?: string): Promise<LaporanHarian> => {
    const response = await api.get("/pembayaran/laporan-harian", {
      params: { tanggal },
    });
    return response.data;
  },

  getStruk: async (id: string): Promise<StrukResponse> => {
    const response = await api.get(`/pembayaran/${id}/struk`);
    return response.data;
  },

  create: async (data: PembayaranRequest): Promise<Pembayaran> => {
    const response = await api.post("/pembayaran", data);
    return response.data;
  },
};
