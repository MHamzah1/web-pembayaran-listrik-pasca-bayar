import api from "@/lib/api";
import { Tarif, TarifRequest } from "@/types";

export const tarifService = {
  getAll: async (): Promise<Tarif[]> => {
    const response = await api.get("/tarif");
    return response.data;
  },

  getById: async (id: string): Promise<Tarif> => {
    const response = await api.get(`/tarif/${id}`);
    return response.data;
  },

  create: async (data: TarifRequest): Promise<Tarif> => {
    const response = await api.post("/tarif", data);
    return response.data;
  },

  update: async (id: string, data: TarifRequest): Promise<Tarif> => {
    const response = await api.put(`/tarif/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tarif/${id}`);
  },
};
