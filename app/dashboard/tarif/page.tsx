/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Bolt } from "lucide-react";
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
  SearchInput,
} from "@/components/ui";
import { tarifService } from "@/services";
import { formatCurrency } from "@/lib/utils";
import { Tarif, TarifRequest } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const tarifSchema = z.object({
  kodeTarif: z.string().min(1, "Kode tarif wajib diisi"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  tarifPerKwh: z.number().min(1, "Tarif minimal Rp 1"),
  daya: z.number().min(1, "Daya minimal 1 VA"),
});

type TarifFormData = z.infer<typeof tarifSchema>;

export default function TarifPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarif, setEditingTarif] = useState<Tarif | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, isLoading, error } = useQuery({
    queryKey: ["tarif"],
    queryFn: tarifService.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TarifFormData>({
    resolver: zodResolver(tarifSchema),
  });

  const createMutation = useMutation({
    mutationFn: tarifService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarif"] });
      toast.success("Tarif berhasil ditambahkan");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan tarif");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TarifRequest }) =>
      tarifService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarif"] });
      toast.success("Tarif berhasil diperbarui");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui tarif");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tarifService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarif"] });
      toast.success("Tarif berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus tarif");
    },
  });

  const openCreateModal = () => {
    setEditingTarif(null);
    reset({ kodeTarif: "", deskripsi: "", tarifPerKwh: 0, daya: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (tarif: Tarif) => {
    setEditingTarif(tarif);
    setValue("kodeTarif", tarif.kodeTarif);
    setValue("deskripsi", tarif.deskripsi);
    setValue("tarifPerKwh", tarif.tarifPerKwh);
    setValue("daya", tarif.daya);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTarif(null);
    reset();
  };

  const onSubmit = (formData: TarifFormData) => {
    if (editingTarif) {
      updateMutation.mutate({ id: editingTarif.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (tarif: Tarif) => {
    Swal.fire({
      title: "Hapus Tarif?",
      text: `Apakah Anda yakin ingin menghapus tarif ${tarif.daya} VA?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(tarif.id);
      }
    });
  };

  const tarifList = data?.data || [];
  const filteredTarif = tarifList.filter(
    (t) =>
      t.kodeTarif.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.daya.toString().includes(searchQuery) ||
      t.tarifPerKwh.toString().includes(searchQuery),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Tarif</h1>
          <p className="text-gray-500 mt-1">
            Kelola tarif listrik berdasarkan daya
          </p>
        </div>
        <Button onClick={openCreateModal} leftIcon={Plus}>
          Tambah Tarif
        </Button>
      </div>

      {/* Search & Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Bolt className="w-5 h-5 text-blue-600" />
              Daftar Tarif
            </CardTitle>
            <SearchInput
              onSearch={setSearchQuery}
              placeholder="Cari tarif..."
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading className="py-12" />
          ) : filteredTarif.length === 0 ? (
            <div className="text-center py-12">
              <Bolt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada data tarif</p>
              <p className="text-gray-400 mb-4">
                Tambahkan tarif baru untuk memulai
              </p>
              <Button onClick={openCreateModal} leftIcon={Plus}>
                Tambah Tarif Pertama
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kode Tarif</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Daya (VA)</TableHead>
                  <TableHead>Tarif per kWh</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTarif.map((tarif, index) => (
                  <TableRow key={tarif.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-blue-600">
                        {tarif.kodeTarif}
                      </span>
                    </TableCell>
                    <TableCell>{tarif.deskripsi}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Bolt className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="font-semibold">{tarif.daya} VA</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">
                      {formatCurrency(tarif.tarifPerKwh)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditModal(tarif)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(tarif)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTarif ? "Edit Tarif" : "Tambah Tarif Baru"}
        description={
          editingTarif
            ? "Perbarui informasi tarif listrik"
            : "Masukkan data tarif listrik baru"
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Kode Tarif"
            placeholder="Contoh: R1"
            error={errors.kodeTarif?.message}
            {...register("kodeTarif")}
          />

          <Input
            label="Deskripsi"
            placeholder="Contoh: Rumah Tangga Kecil"
            error={errors.deskripsi?.message}
            {...register("deskripsi")}
          />

          <Input
            label="Daya (VA)"
            type="number"
            placeholder="Contoh: 900"
            error={errors.daya?.message}
            {...register("daya", { valueAsNumber: true })}
          />

          <Input
            label="Tarif per kWh (Rp)"
            type="number"
            placeholder="Contoh: 1500"
            error={errors.tarifPerKwh?.message}
            {...register("tarifPerKwh", { valueAsNumber: true })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingTarif ? "Simpan Perubahan" : "Tambah Tarif"}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
