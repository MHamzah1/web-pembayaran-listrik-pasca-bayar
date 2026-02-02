"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CreditCard,
  Search,
  Receipt,
  CheckCircle,
  Printer,
  Bolt,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Loading,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  SearchInput,
  Modal,
} from "@/components/ui";
import {
  pembayaranService,
  tagihanService,
  pelangganService,
} from "@/services";
import {
  formatCurrency,
  formatBulanTagihan,
  formatNumber,
  formatDateTime,
} from "@/lib/utils";
import { Tagihan, Pelanggan, Struk } from "@/types";

export default function PembayaranPage() {
  const [idPelanggan, setIdPelanggan] = useState("");
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan[]>([]);
  const [pelanggan, setPelanggan] = useState<Pelanggan | null>(null);
  const [tagihanList, setTagihanList] = useState<Tagihan[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);
  const [strukData, setStrukData] = useState<Struk | null>(null);

  // History section
  const [currentPage, setCurrentPage] = useState(1);
  const [historySearch, setHistorySearch] = useState("");

  const queryClient = useQueryClient();

  const { data: historyData, isLoading: loadingHistory } = useQuery({
    queryKey: ["pembayaran-history", currentPage, historySearch],
    queryFn: () => pembayaranService.getAll({ page: currentPage, perPage: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: (tagihanId: string) =>
      pembayaranService.create({ tagihanId, metodePembayaran: "tunai" }),
    onSuccess: async (response) => {
      queryClient.invalidateQueries({ queryKey: ["pembayaran-history"] });
      queryClient.invalidateQueries({ queryKey: ["tagihan"] });
      toast.success("Pembayaran berhasil!");

      // Get struk
      if (response?.id) {
        try {
          const strukResponse = await pembayaranService.getStruk(response.id);
          setStrukData(strukResponse.struk);
          setShowStrukModal(true);
        } catch (error) {
          console.error("Error fetching struk:", error);
        }
      }

      // Reset form
      resetForm();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Gagal memproses pembayaran",
      );
    },
  });

  const handleSearch = async () => {
    if (!idPelanggan.trim()) {
      toast.error("Masukkan ID Pelanggan");
      return;
    }

    setIsSearching(true);
    setSearchDone(false);
    setPelanggan(null);
    setTagihanList([]);
    setSelectedTagihan([]);

    try {
      // Get pelanggan data
      const pelangganResponse =
        await pelangganService.getByIdPelanggan(idPelanggan);
      if (pelangganResponse) {
        setPelanggan(pelangganResponse);

        // Get unpaid tagihan
        const tagihanResponse =
          await tagihanService.getUnpaidByIdPelanggan(idPelanggan);
        if (tagihanResponse) {
          setTagihanList(tagihanResponse);
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Pelanggan tidak ditemukan");
    } finally {
      setIsSearching(false);
      setSearchDone(true);
    }
  };

  const resetForm = () => {
    setIdPelanggan("");
    setPelanggan(null);
    setTagihanList([]);
    setSelectedTagihan([]);
    setSearchDone(false);
  };

  const handleSelectTagihan = (tagihan: Tagihan) => {
    const isSelected = selectedTagihan.some((t) => t.id === tagihan.id);
    if (isSelected) {
      setSelectedTagihan(selectedTagihan.filter((t) => t.id !== tagihan.id));
    } else {
      setSelectedTagihan([...selectedTagihan, tagihan]);
    }
  };

  const handlePayment = () => {
    if (selectedTagihan.length === 0) {
      toast.error("Pilih tagihan yang akan dibayar");
      return;
    }

    // Process payment one by one
    selectedTagihan.forEach((tagihan) => {
      createMutation.mutate(tagihan.id);
    });
  };

  const getTotalBayar = () => {
    return selectedTagihan.reduce((total, tagihan) => {
      return total + Number(tagihan.totalTagihan) + Number(tagihan.denda);
    }, 0);
  };

  const printStruk = () => {
    window.print();
  };

  const historyList = historyData?.data || [];
  const totalPages = historyData?.lastPage || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pembayaran Tagihan</h1>
        <p className="text-gray-500 mt-1">
          Proses pembayaran tagihan listrik pelanggan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Cari Pelanggan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Masukkan ID Pelanggan..."
                  value={idPelanggan}
                  onChange={(e) => setIdPelanggan(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSearch}
                  isLoading={isSearching}
                  leftIcon={Search}
                >
                  Cari
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pelanggan Info */}
          {pelanggan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold">
                      {pelanggan.namaPelanggan.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {pelanggan.namaPelanggan}
                      </h3>
                      <p className="text-blue-600 font-mono font-semibold">
                        {pelanggan.idPelanggan}
                      </p>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{pelanggan.alamat}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">
                            {pelanggan.nomorTelepon}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Bolt className="w-4 h-4" />
                          <span className="text-sm">
                            {pelanggan.tarif?.daya} VA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Tagihan List */}
          {searchDone && pelanggan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-orange-600" />
                    Tagihan Belum Bayar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tagihanList.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        Tidak ada tagihan yang belum dibayar
                      </p>
                      <p className="text-green-600 font-medium">
                        Semua tagihan sudah lunas! 🎉
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tagihanList.map((tagihan) => {
                        const isSelected = selectedTagihan.some(
                          (t) => t.id === tagihan.id,
                        );
                        return (
                          <div
                            key={tagihan.id}
                            onClick={() => handleSelectTagihan(tagihan)}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected
                                    ? "border-blue-500 bg-blue-500"
                                    : "border-gray-300"
                                    }`}
                                >
                                  {isSelected && (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {formatBulanTagihan(tagihan.bulanTagihan)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Pemakaian:{" "}
                                    {formatNumber(tagihan.jumlahPemakaian)} kWh
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {formatCurrency(tagihan.totalTagihan)}
                                </p>
                                {Number(tagihan.denda) > 0 && (
                                  <p className="text-sm text-red-500">
                                    +{formatCurrency(tagihan.denda)} denda
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          {selectedTagihan.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="sticky top-24">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-2xl">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Ringkasan Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {selectedTagihan.map((tagihan) => (
                      <div
                        key={tagihan.id}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {formatBulanTagihan(tagihan.bulanTagihan)}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(
                            Number(tagihan.totalTagihan) +
                              Number(tagihan.denda),
                          )}
                        </span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(getTotalBayar())}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handlePayment}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
                      size="lg"
                      isLoading={createMutation.isPending}
                      leftIcon={CreditCard}
                    >
                      Bayar Sekarang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Riwayat Pembayaran
            </CardTitle>
            <SearchInput
              onSearch={(value) => {
                setHistorySearch(value);
                setCurrentPage(1);
              }}
              placeholder="Cari transaksi..."
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loadingHistory ? (
            <Loading className="py-12" />
          ) : historyList.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada riwayat pembayaran</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Transaksi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Total Bayar</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyList.map((pembayaran) => (
                    <TableRow key={pembayaran.id}>
                      <TableCell>
                        <span className="font-mono font-semibold text-blue-600">
                          {pembayaran.nomorTransaksi}
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(pembayaran.tanggalPembayaran)}
                      </TableCell>
                      <TableCell>
                        {pembayaran.tagihan?.pelanggan?.namaPelanggan || "-"}
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-600">
                        {formatCurrency(pembayaran.totalBayar)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Lunas
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Struk Modal */}
      <Modal
        isOpen={showStrukModal}
        onClose={() => setShowStrukModal(false)}
        title="Struk Pembayaran"
        size="md"
      >
        {strukData && (
          <div className="space-y-4">
            {/* Struk Content */}
            <div className="bg-white p-6 border-2 border-dashed border-gray-300 rounded-xl print:border-solid">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                  <Bolt className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">PLN POSTPAID</h3>
                <p className="text-sm text-gray-500">
                  Struk Pembayaran Listrik
                </p>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">No. Transaksi</span>
                  <span className="font-mono font-semibold">
                    {strukData.nomorTransaksi}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span>{formatDateTime(strukData.tanggalPembayaran)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Pelanggan</span>
                  <span className="font-mono">
                    {strukData.pelanggan.idPelanggan}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span>{strukData.pelanggan.namaPelanggan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Periode</span>
                  <span>
                    {formatBulanTagihan(strukData.tagihan.bulanTagihan)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Daya</span>
                  <span>{strukData.pelanggan.daya}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Meter Awal</span>
                  <span>{formatNumber(strukData.tagihan.meterAwal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Meter Akhir</span>
                  <span>{formatNumber(strukData.tagihan.meterAkhir)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pemakaian</span>
                  <span>
                    {formatNumber(strukData.tagihan.jumlahPemakaian)} kWh
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tagihan</span>
                  <span>
                    {formatCurrency(Number(strukData.tagihan.biayaPemakaian))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Denda</span>
                  <span>{formatCurrency(Number(strukData.tagihan.denda))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Biaya Admin</span>
                  <span>
                    {formatCurrency(Number(strukData.tagihan.biayaAdmin))}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-gray-900 mt-4 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL</span>
                  <span className="text-emerald-600">
                    {formatCurrency(Number(strukData.totalBayar))}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 mt-4 pt-4 text-center text-sm text-gray-500">
                <p>Kasir: {strukData.kasir}</p>
                <p className="mt-2">Terima kasih atas pembayaran Anda</p>
              </div>
            </div>

            <div className="flex gap-3 print:hidden">
              <Button
                variant="outline"
                onClick={() => setShowStrukModal(false)}
                className="flex-1"
              >
                Tutup
              </Button>
              <Button
                onClick={printStruk}
                leftIcon={Printer}
                className="flex-1"
              >
                Cetak Struk
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
