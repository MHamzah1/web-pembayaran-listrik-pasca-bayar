"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  UserCircle,
  Phone,
  MapPin,
  Bolt,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Link from "next/link";
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
  Select,
  Loading,
  Pagination,
  SearchInput,
  Badge,
} from "@/components/ui";
import { pelangganService, tarifService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import { Pelanggan, PelangganRequest } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const pelangganSchema = z.object({
  idPelanggan: z.string().length(12, "ID Pelanggan harus 12 digit"),
  namaPelanggan: z.string().min(3, "Nama minimal 3 karakter"),
  alamat: z.string().min(5, "Alamat minimal 5 karakter"),
  nomorTelepon: z.string().min(10, "No. Telepon minimal 10 digit"),
  nomorMeter: z.string().min(1, "Nomor Meter wajib diisi"),
  tarifId: z.string().min(1, "Pilih tarif"),
  status: z.enum(["aktif", "nonaktif"]).optional(),
});

type PelangganFormData = z.infer<typeof pelangganSchema>;

export default function PelangganPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPelanggan, setEditingPelanggan] = useState<Pelanggan | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pelanggan", currentPage, searchQuery],
    queryFn: () => pelangganService.getAll(currentPage, 10, searchQuery),
  });

  const { data: tarifData } = useQuery({
    queryKey: ["tarif"],
    queryFn: tarifService.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PelangganFormData>({
    resolver: zodResolver(pelangganSchema),
  });

  const createMutation = useMutation({
    mutationFn: pelangganService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pelanggan"] });
      toast.success("Pelanggan berhasil ditambahkan");
      closeModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan pelanggan",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<PelangganRequest>;
    }) => pelangganService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pelanggan"] });
      toast.success("Pelanggan berhasil diperbarui");
      closeModal();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui pelanggan",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: pelangganService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pelanggan"] });
      toast.success("Pelanggan berhasil dihapus");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Gagal menghapus pelanggan");
    },
  });

  const openCreateModal = () => {
    setEditingPelanggan(null);
    reset({
      idPelanggan: "",
      namaPelanggan: "",
      alamat: "",
      nomorTelepon: "",
      nomorMeter: "",
      tarifId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pelanggan: Pelanggan) => {
    setEditingPelanggan(pelanggan);
    setValue("idPelanggan", pelanggan.idPelanggan);
    setValue("namaPelanggan", pelanggan.namaPelanggan);
    setValue("alamat", pelanggan.alamat);
    setValue("nomorTelepon", pelanggan.nomorTelepon);
    setValue("nomorMeter", pelanggan.nomorMeter);
    setValue("tarifId", pelanggan.tarifId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPelanggan(null);
    reset();
  };

  const onSubmit = (formData: PelangganFormData) => {
    if (editingPelanggan) {
      updateMutation.mutate({ id: editingPelanggan.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (pelanggan: Pelanggan) => {
    Swal.fire({
      title: "Hapus Pelanggan?",
      text: `Apakah Anda yakin ingin menghapus pelanggan ${pelanggan.namaPelanggan}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(pelanggan.id);
      }
    });
  };

  const tarifOptions = (tarifData?.data || []).map((t) => ({
    value: t.id,
    label: `${t.kodeTarif} - ${t.daya} VA - ${formatCurrency(t.tarifPerKwh)}/kWh`,
  }));

  const pelangganList = data?.data || [];
  const pagination = data?.pagination;

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
            Manajemen Pelanggan
          </h1>
          <p className="text-gray-500 mt-1">Kelola data pelanggan PLN</p>
        </div>
        <Button onClick={openCreateModal} leftIcon={Plus}>
          Tambah Pelanggan
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-blue-600" />
              Daftar Pelanggan
            </CardTitle>
            <SearchInput
              onSearch={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              placeholder="Cari pelanggan..."
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading className="py-12" />
          ) : pelangganList.length === 0 ? (
            <div className="text-center py-12">
              <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada data pelanggan</p>
              <p className="text-gray-400 mb-4">
                Tambahkan pelanggan baru untuk memulai
              </p>
              <Button onClick={openCreateModal} leftIcon={Plus}>
                Tambah Pelanggan Pertama
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pelanggan</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>No. Telepon</TableHead>
                    <TableHead>Tarif</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pelangganList.map((pelanggan) => (
                    <TableRow key={pelanggan.id}>
                      <TableCell>
                        <span className="font-mono font-semibold text-blue-600">
                          {pelanggan.idPelanggan}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {pelanggan.namaPelanggan.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">
                            {pelanggan.namaPelanggan}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="max-w-xs truncate">
                            {pelanggan.alamat}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {pelanggan.nomorTelepon}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="primary">
                          <Bolt className="w-3 h-3 mr-1" />
                          {pelanggan.tarif?.daya || "-"} VA
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/pelanggan/${pelanggan.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(pelanggan)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(pelanggan)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination && (
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
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
        title={editingPelanggan ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
        description={
          editingPelanggan
            ? "Perbarui informasi pelanggan"
            : "Masukkan data pelanggan baru"
        }
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="ID Pelanggan (12 digit)"
            placeholder="Contoh: 551234567890"
            error={errors.idPelanggan?.message}
            disabled={!!editingPelanggan}
            {...register("idPelanggan")}
          />

          <Input
            label="Nama Pelanggan"
            placeholder="Masukkan nama lengkap"
            error={errors.namaPelanggan?.message}
            {...register("namaPelanggan")}
          />

          <Input
            label="Alamat"
            placeholder="Masukkan alamat lengkap"
            error={errors.alamat?.message}
            {...register("alamat")}
          />

          <Input
            label="No. Telepon"
            placeholder="Contoh: +628123456789"
            error={errors.nomorTelepon?.message}
            {...register("nomorTelepon")}
          />

          <Input
            label="Nomor Meter"
            placeholder="Contoh: 12345678"
            error={errors.nomorMeter?.message}
            {...register("nomorMeter")}
          />

          <Select
            label="Tarif Listrik"
            placeholder="Pilih tarif"
            options={tarifOptions}
            error={errors.tarifId?.message}
            {...register("tarifId")}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingPelanggan ? "Simpan Perubahan" : "Tambah Pelanggan"}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
