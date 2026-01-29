/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Receipt,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
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
  Modal,
  Input,
  Loading,
  Pagination,
  SearchInput,
  Badge,
} from "@/components/ui";
import { tagihanService, pelangganService } from "@/services";
import { formatCurrency, formatBulanTagihan, formatNumber } from "@/lib/utils";
import { Tagihan, TagihanRequest } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const tagihanSchema = z
  .object({
    pelangganId: z.string().min(1, "ID Pelanggan harus diisi"),
    bulanTagihan: z.string().min(1, "Pilih bulan tagihan (format: YYYY-MM)"),
    meterAwal: z.number().min(0, "Meter awal minimal 0"),
    meterAkhir: z.number().min(0, "Meter akhir minimal 0"),
  })
  .refine((data) => data.meterAkhir >= data.meterAwal, {
    message: "Meter akhir harus lebih besar dari meter awal",
    path: ["meterAkhir"],
  });

type TagihanFormData = z.infer<typeof tagihanSchema>;

export default function TagihanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [idPelanggan, setIdPelanggan] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tagihan", currentPage, searchQuery],
    queryFn: () => tagihanService.getAll({ page: currentPage, perPage: 10 }),
  });

  // Check pelanggan by ID
  const { data: pelangganData, isLoading: loadingPelanggan } = useQuery({
    queryKey: ["pelanggan-check", idPelanggan],
    queryFn: () => pelangganService.getByIdPelanggan(idPelanggan),
    enabled: idPelanggan.length >= 6,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagihanFormData>({
    resolver: zodResolver(tagihanSchema),
    defaultValues: {
      bulanTagihan: new Date().toISOString().slice(0, 7),
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TagihanRequest) => tagihanService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan"] });
      toast.success("Tagihan berhasil dibuat");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat tagihan");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tagihanService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan"] });
      toast.success("Tagihan berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus tagihan");
    },
  });

  const openCreateModal = () => {
    setIdPelanggan("");
    reset({
      pelangganId: "",
      bulanTagihan: new Date().toISOString().slice(0, 7),
      meterAwal: 0,
      meterAkhir: 0,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIdPelanggan("");
    reset();
  };

  const onSubmit = (formData: TagihanFormData) => {
    createMutation.mutate(formData);
  };

  const handleDelete = (tagihan: Tagihan) => {
    if (tagihan.statusPembayaran === "lunas") {
      toast.error("Tagihan yang sudah lunas tidak dapat dihapus");
      return;
    }

    Swal.fire({
      title: "Hapus Tagihan?",
      text: `Apakah Anda yakin ingin menghapus tagihan bulan ${formatBulanTagihan(tagihan.bulanTagihan)}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(tagihan.id);
      }
    });
  };

  const handleIdPelangganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdPelanggan(e.target.value);
  };

  const tagihanList = data?.data || [];
  const totalPages = data?.lastPage || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Tagihan
          </h1>
          <p className="text-gray-500 mt-1">Kelola tagihan listrik bulanan</p>
        </div>
        <Button onClick={openCreateModal} leftIcon={Plus}>
          Buat Tagihan
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              Daftar Tagihan
            </CardTitle>
            <SearchInput
              onSearch={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              placeholder="Cari tagihan..."
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading className="py-12" />
          ) : tagihanList.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada data tagihan</p>
              <p className="text-gray-400 mb-4">
                Buat tagihan baru untuk memulai
              </p>
              <Button onClick={openCreateModal} leftIcon={Plus}>
                Buat Tagihan Pertama
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pelanggan</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Periode</TableHead>
                    <TableHead>Pemakaian</TableHead>
                    <TableHead>Total Bayar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tagihanList.map((tagihan) => (
                    <TableRow key={tagihan.id}>
                      <TableCell>
                        <span className="font-mono font-semibold text-blue-600">
                          {tagihan.pelanggan?.idPelanggan ||
                            tagihan.pelangganId}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {tagihan.pelanggan?.namaPelanggan || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatBulanTagihan(tagihan.bulanTagihan)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            {formatNumber(tagihan.jumlahPemakaian)} kWh
                          </p>
                          <p className="text-gray-400">
                            {formatNumber(tagihan.meterAwal)} -{" "}
                            {formatNumber(tagihan.meterAkhir)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(tagihan.totalTagihan)}
                          </p>
                          {Number(tagihan.denda) > 0 && (
                            <p className="text-xs text-red-500">
                              +{formatCurrency(tagihan.denda)} denda
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {tagihan.statusPembayaran === "lunas" ? (
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Lunas
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Belum Bayar
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {tagihan.statusPembayaran === "belum_bayar" && (
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleDelete(tagihan)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Buat Tagihan Baru"
        description="Input data tagihan listrik bulanan"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Input
              label="ID Pelanggan"
              placeholder="Masukkan ID Pelanggan"
              error={errors.pelangganId?.message}
              {...register("pelangganId", {
                onChange: handleIdPelangganChange,
              })}
            />
            {idPelanggan.length >= 6 && (
              <div className="mt-2">
                {loadingPelanggan ? (
                  <p className="text-sm text-gray-500">Mencari pelanggan...</p>
                ) : pelangganData ? (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800">
                      ✓ {pelangganData.namaPelanggan}
                    </p>
                    <p className="text-xs text-green-600">
                      {pelangganData.alamat} | {pelangganData.tarif?.daya}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-red-500">
                    Pelanggan tidak ditemukan
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Bulan Tagihan (YYYY-MM)"
              type="month"
              error={errors.bulanTagihan?.message}
              {...register("bulanTagihan")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Meter Awal"
              type="number"
              placeholder="0"
              error={errors.meterAwal?.message}
              {...register("meterAwal", { valueAsNumber: true })}
            />
            <Input
              label="Meter Akhir"
              type="number"
              placeholder="0"
              error={errors.meterAkhir?.message}
              {...register("meterAkhir", { valueAsNumber: true })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending}
              disabled={!pelangganData}
            >
              Buat Tagihan
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
