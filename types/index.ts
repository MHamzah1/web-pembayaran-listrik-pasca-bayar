// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  location?: string;
  role: "customer" | "admin" | "salesman";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  location?: string;
  role: "customer" | "admin" | "salesman";
}

// Tarif Types
export interface Tarif {
  id: string;
  kodeTarif: string;
  deskripsi: string;
  tarifPerKwh: number;
  daya: number;
  createdAt: string;
  updatedAt: string;
}

export interface TarifRequest {
  kodeTarif: string;
  deskripsi: string;
  tarifPerKwh: number;
  daya: number;
}

// Pelanggan Types
export interface Pelanggan {
  id: string;
  idPelanggan: string;
  namaPelanggan: string;
  alamat: string;
  nomorTelepon: string;
  nomorMeter: string;
  tarifId: string;
  tarif?: Tarif;
  status: "aktif" | "nonaktif";
  createdAt: string;
  updatedAt: string;
}

export interface PelangganRequest {
  idPelanggan: string;
  namaPelanggan: string;
  alamat: string;
  nomorTelepon: string;
  nomorMeter: string;
  tarifId: string;
  status?: "aktif" | "nonaktif";
}

// Tagihan Types
export interface Tagihan {
  id: string;
  pelangganId: string;
  bulanTagihan: string;
  meterAwal: number;
  meterAkhir: number;
  jumlahPemakaian: number;
  tarifPerKwh: number;
  biayaPemakaian: number;
  biayaAdmin: number;
  denda: number;
  totalTagihan: number;
  statusPembayaran: "belum_bayar" | "lunas";
  jatuhTempo: string;
  pelanggan?: Pelanggan;
  createdAt: string;
  updatedAt: string;
}

export interface TagihanRequest {
  pelangganId: string;
  bulanTagihan: string;
  meterAwal: number;
  meterAkhir: number;
}

// Pembayaran Types
export interface Pembayaran {
  id: string;
  tagihanId: string;
  userId: string;
  nomorTransaksi: string;
  totalBayar: number;
  metodePembayaran: "tunai" | "transfer_bank" | "virtual_account" | "qris";
  namaBank?: string;
  nomorReferensi?: string;
  tanggalPembayaran: string;
  statusTransaksi: "pending" | "success" | "failed";
  tagihan?: Tagihan;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PembayaranRequest {
  tagihanId: string;
  metodePembayaran: "tunai" | "transfer_bank" | "virtual_account" | "qris";
  namaBank?: string;
  nomorReferensi?: string;
}

export interface Struk {
  nomorTransaksi: string;
  tanggalPembayaran: string;
  namaPelanggan: string;
  idPelanggan: string;
  alamat: string;
  bulanTagihan: string;
  meterAwal: number;
  meterAkhir: number;
  jumlahPemakaian: number;
  tarifPerKwh: number;
  daya: number;
  biayaPemakaian: number;
  biayaAdmin: number;
  denda: number;
  totalBayar: number;
  petugas: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Laporan Harian
export interface LaporanHarian {
  tanggal: string;
  total_transaksi: number;
  total_pendapatan: number;
  pembayaran: Pembayaran[];
}
