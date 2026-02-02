"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  TrendingUp,
  CreditCard,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Loading,
  StatCard,
  Badge,
} from "@/components/ui";
import { pembayaranService } from "@/services";
import {
  formatCurrency,
  formatBulanTagihan,
} from "@/lib/utils";

export default function LaporanPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["laporan-harian", selectedDate],
    queryFn: () => pembayaranService.getLaporanHarian(selectedDate),
  });

  const laporanData = data;
  const pembayaranList = laporanData?.pembayaran || [];

  const changeDate = (days: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split("T")[0]);
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Harian</h1>
          <p className="text-gray-500 mt-1">Lihat ringkasan transaksi harian</p>
        </div>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeDate(-1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeDate(1)}
              disabled={selectedDate === new Date().toISOString().split("T")[0]}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-center text-gray-600 mt-3 font-medium">
            {formatDateDisplay(selectedDate)}
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <Loading className="py-12" />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Total Transaksi"
              value={laporanData?.totalTransaksi || 0}
              icon={CreditCard}
              gradient="blue"
              description="Transaksi berhasil"
            />
            <StatCard
              title="Total Pendapatan"
              value={formatCurrency(laporanData?.totalPendapatan || 0)}
              icon={TrendingUp}
              gradient="green"
              description="Pendapatan hari ini"
            />
          </div>

          {/* Transaction List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Detail Transaksi
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {pembayaranList.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Tidak ada transaksi pada tanggal ini
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Transaksi</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead>Periode</TableHead>
                      <TableHead>Total Bayar</TableHead>
                      <TableHead>Petugas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pembayaranList.map((pembayaran) => (
                      <TableRow key={pembayaran.id}>
                        <TableCell>
                          <span className="font-mono font-semibold text-blue-600">
                            {pembayaran.nomorTransaksi}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(
                            pembayaran.tanggalPembayaran,
                          ).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {pembayaran.tagihan?.pelanggan?.namaPelanggan}
                            </p>
                            <p className="text-sm text-gray-500 font-mono">
                              {pembayaran.tagihan?.pelanggan?.idPelanggan}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {pembayaran.tagihan
                            ? formatBulanTagihan(
                                pembayaran.tagihan.bulanTagihan,
                              )
                            : "-"}
                        </TableCell>
                        <TableCell className="font-semibold text-emerald-600">
                          {formatCurrency(pembayaran.totalBayar)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="info">
                            {pembayaran.user?.fullName || "-"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {pembayaranList.length > 0 && (
            <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-emerald-100 font-medium">
                      Total Pendapatan Hari Ini
                    </p>
                    <p className="text-4xl font-bold mt-1">
                      {formatCurrency(laporanData?.totalPendapatan || 0)}
                    </p>
                    <p className="text-emerald-100 mt-2">
                      Dari {laporanData?.totalTransaksi || 0} transaksi
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                      leftIcon={Download}
                      onClick={() => window.print()}
                    >
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </motion.div>
  );
}
