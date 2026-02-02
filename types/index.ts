// User Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  location: string;
  role: "customer" | "admin";
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
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    whatsappNumber: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  location: string;
  role: "customer" | "admin";
}

export interface UserRequest {
  email: string;
  password?: string;
  fullName: string;
  phoneNumber: string;
  whatsappNumber: string;
  location: string;
  role: "customer" | "admin";
}

// Tarif Types
export interface Tarif {
  id: string;
  kodeTarif: string;
  deskripsi: string;
  tarifPerKwh: string | number;
  daya: number;
  createdAt: string;
  updatedAt: string;
}

export interface TarifRequest {
  kodeTarif: string;
  deskripsi: string;
  tarifPerKwh: number;
  daya: string;
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
  pelanggan?: Pelanggan;
  bulanTagihan: string;
  meterAwal: string | number;
  meterAkhir: string | number;
  jumlahPemakaian: string | number;
  tarifPerKwh: string | number;
  biayaPemakaian: string | number;
  biayaAdmin: string | number;
  denda: string | number;
  totalTagihan: string | number;
  statusPembayaran: "belum_bayar" | "lunas";
  jatuhTempo: string;
  pembayaran?: Pembayaran | null;
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
  tagihan?: Tagihan;
  userId: string;
  user?: User;
  nomorTransaksi: string;
  totalBayar: string | number;
  metodePembayaran: "tunai" | "transfer_bank" | "virtual_account" | "qris";
  namaBank?: string;
  nomorReferensi?: string;
  tanggalPembayaran: string;
  statusTransaksi: "pending" | "success" | "failed";
}

export interface PembayaranRequest {
  tagihanId: string;
  metodePembayaran: "tunai" | "transfer_bank" | "virtual_account" | "qris";
  namaBank?: string;
  nomorReferensi?: string;
}

// Struk Types - sesuai response API
export interface StrukPelanggan {
  idPelanggan: string;
  namaPelanggan: string;
  alamat: string;
  tarif: string;
  daya: number;
}

export interface StrukTagihan {
  bulanTagihan: string;
  meterAwal: string | number;
  meterAkhir: string | number;
  jumlahPemakaian: string | number;
  tarifPerKwh: string | number;
  biayaPemakaian: string | number;
  biayaAdmin: string | number;
  denda: string | number;
  totalTagihan: string | number;
}

export interface Struk {
  nomorTransaksi: string;
  tanggalPembayaran: string;
  metodePembayaran: string;
  namaBank?: string;
  pelanggan: StrukPelanggan;
  tagihan: StrukTagihan;
  totalBayar: string | number;
  statusTransaksi: string;
  kasir: string;
}

export interface StrukResponse {
  struk: Struk;
}

// API Response Types - sesuai response API
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

// Laporan Harian - sesuai response API
export interface LaporanHarian {
  tanggal: string;
  totalTransaksi: number;
  totalPendapatan: number;
  pembayaran: Pembayaran[];
}
