"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users,
  Receipt,
  CreditCard,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  Badge,
  Loading,
} from "@/components/ui";
import {
  pelangganService,
  tagihanService,
  pembayaranService,
} from "@/services";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAppSelector } from "@/hooks/useRedux";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const { data: pelangganData, isLoading: loadingPelanggan } = useQuery({
    queryKey: ["pelanggan"],
    queryFn: () => pelangganService.getAll(1, 1000),
  });

  const { data: tagihanData, isLoading: loadingTagihan } = useQuery({
    queryKey: ["tagihan"],
    queryFn: () => tagihanService.getAll(1, 1000),
  });

  const { data: pembayaranData, isLoading: loadingPembayaran } = useQuery({
    queryKey: ["pembayaran"],
    queryFn: () => pembayaranService.getAll(1, 10),
  });

  const { data: laporanData, isLoading: loadingLaporan } = useQuery({
    queryKey: ["laporan-harian"],
    queryFn: () => pembayaranService.getLaporanHarian(),
  });

  const totalPelanggan = pelangganData?.pagination?.total || 0;
  const totalTagihanBelumBayar =
    tagihanData?.data?.filter((t) => t.status === "belum_bayar").length || 0;
  const totalPendapatanHariIni = laporanData?.data?.total_pendapatan || 0;
  const totalTransaksiHariIni = laporanData?.data?.total_transaksi || 0;

  const recentPembayaran = pembayaranData?.data?.slice(0, 5) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 text-white">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-200 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Selamat Datang, {user?.nama_admin || "User"}! 👋
            </h1>
            <p className="text-blue-100 text-lg max-w-xl">
              Kelola pembayaran listrik pasca bayar dengan mudah dan efisien
              melalui dashboard ini.
            </p>
          </div>

          <div className="absolute right-8 bottom-8 hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Pelanggan"
          value={loadingPelanggan ? "..." : totalPelanggan}
          icon={Users}
          gradient="blue"
          description="Pelanggan terdaftar"
        />
        <StatCard
          title="Tagihan Belum Bayar"
          value={loadingTagihan ? "..." : totalTagihanBelumBayar}
          icon={Receipt}
          gradient="orange"
          description="Menunggu pembayaran"
        />
        <StatCard
          title="Transaksi Hari Ini"
          value={loadingLaporan ? "..." : totalTransaksiHariIni}
          icon={CreditCard}
          gradient="green"
          description="Pembayaran berhasil"
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={
            loadingLaporan ? "..." : formatCurrency(totalPendapatanHariIni)
          }
          icon={TrendingUp}
          gradient="purple"
          description="Total pendapatan"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transaksi Terbaru</CardTitle>
              <Link
                href="/dashboard/pembayaran"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Lihat Semua
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {loadingPembayaran ? (
                <Loading className="py-8" />
              ) : recentPembayaran.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada transaksi</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPembayaran.map((pembayaran, index) => (
                    <motion.div
                      key={pembayaran.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {pembayaran.nomor_transaksi}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(pembayaran.tanggal_pembayaran)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(pembayaran.total_akhir)}
                        </p>
                        <Badge variant="success">Lunas</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/dashboard/pembayaran/new"
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Proses Pembayaran
                  </p>
                  <p className="text-sm text-gray-500">
                    Bayar tagihan pelanggan
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/pelanggan/new"
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    Tambah Pelanggan
                  </p>
                  <p className="text-sm text-gray-500">
                    Daftarkan pelanggan baru
                  </p>
                </div>
              </Link>

              <Link
                href="/dashboard/tagihan/new"
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    Buat Tagihan
                  </p>
                  <p className="text-sm text-gray-500">Input tagihan bulanan</p>
                </div>
              </Link>

              <Link
                href="/dashboard/laporan"
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Lihat Laporan
                  </p>
                  <p className="text-sm text-gray-500">
                    Laporan harian & statistik
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
