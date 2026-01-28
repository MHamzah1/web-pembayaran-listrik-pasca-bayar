// User Types
export interface User {
  id: string;
  username: string;
  nama_admin: string;
  role: "admin" | "petugas";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  nama_admin: string;
  role: "admin" | "petugas";
}

// Tarif Types
export interface Tarif {
  id: string;
  daya: number;
  tarifperkwh: number;
  createdAt: string;
  updatedAt: string;
}

export interface TarifRequest {
  daya: number;
  tarifperkwh: number;
}

// Pelanggan Types
export interface Pelanggan {
  id: string;
  id_pelanggan: string;
  nama: string;
  alamat: string;
  no_telp: string;
  id_tarif: string;
  tarif?: Tarif;
  createdAt: string;
  updatedAt: string;
}

export interface PelangganRequest {
  id_pelanggan: string;
  nama: string;
  alamat: string;
  no_telp: string;
  id_tarif: string;
}

// Tagihan Types
export interface Tagihan {
  id: string;
  id_pelanggan: string;
  bulan: string;
  tahun: string;
  meter_awal: number;
  meter_akhir: number;
  jumlah_meter: number;
  total_bayar: number;
  status: "belum_bayar" | "lunas";
  denda: number;
  pelanggan?: Pelanggan;
  createdAt: string;
  updatedAt: string;
}

export interface TagihanRequest {
  id_pelanggan: string;
  bulan: string;
  tahun: string;
  meter_awal: number;
  meter_akhir: number;
}

// Pembayaran Types
export interface Pembayaran {
  id: string;
  id_tagihan: string;
  id_user: string;
  tanggal_pembayaran: string;
  total_bayar: number;
  biaya_admin: number;
  total_akhir: number;
  nomor_transaksi: string;
  tagihan?: Tagihan;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PembayaranRequest {
  id_tagihan: string;
}

export interface Struk {
  nomor_transaksi: string;
  tanggal_pembayaran: string;
  nama_pelanggan: string;
  id_pelanggan: string;
  alamat: string;
  bulan: string;
  tahun: string;
  meter_awal: number;
  meter_akhir: number;
  jumlah_meter: number;
  tarif_per_kwh: number;
  daya: number;
  total_bayar: number;
  denda: number;
  biaya_admin: number;
  total_akhir: number;
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
