"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Users, Shield, UserCircle } from "lucide-react";
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
  Select,
  Loading,
  Pagination,
  SearchInput,
  Badge,
} from "@/components/ui";
import { userService } from "@/services";
import { User, RegisterRequest } from "@/types";
import { formatDate } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppSelector } from "@/hooks/useRedux";

const userSchema = z.object({
  email: z.string().min(3, "email minimal 3 karakter"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .optional()
    .or(z.literal("")),
  nama_admin: z.string().min(3, "Nama minimal 3 karakter"),
  role: z.enum(["admin", "petugas"], { required_error: "Pilih role" }),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const { data, isLoading } = useQuery({
    queryKey: ["users", currentPage, searchQuery],
    queryFn: () => userService.getPaged(currentPage, 10, searchQuery),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "petugas",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: RegisterRequest) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil ditambahkan");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan pengguna",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<RegisterRequest>;
    }) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil diperbarui");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui pengguna",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil dihapus");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus pengguna");
    },
  });

  const openCreateModal = () => {
    setEditingUser(null);
    reset({
      email: "",
      password: "",
      nama_admin: "",
      role: "petugas",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setValue("email", user.email);
    setValue("nama_admin", user.nama_admin);
    setValue("role", user.role);
    setValue("password", "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const onSubmit = (formData: UserFormData) => {
    if (editingUser) {
      const updateData: Partial<RegisterRequest> = {
        email: formData.email,
        nama_admin: formData.nama_admin,
        role: formData.role,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      updateMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      if (!formData.password) {
        toast.error("Password harus diisi");
        return;
      }
      createMutation.mutate(formData as RegisterRequest);
    }
  };

  const handleDelete = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error("Tidak dapat menghapus akun sendiri");
      return;
    }

    Swal.fire({
      title: "Hapus Pengguna?",
      text: `Apakah Anda yakin ingin menghapus pengguna ${user.nama_admin}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(user.id);
      }
    });
  };

  const userList = data?.data || [];
  const pagination = data?.pagination;

  // Check if current user is admin
  if (currentUser?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-gray-500">
            Halaman ini hanya dapat diakses oleh admin
          </p>
        </div>
      </div>
    );
  }

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
            Manajemen Pengguna
          </h1>
          <p className="text-gray-500 mt-1">Kelola akun admin dan petugas</p>
        </div>
        <Button onClick={openCreateModal} leftIcon={Plus}>
          Tambah Pengguna
        </Button>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Daftar Pengguna
            </CardTitle>
            <SearchInput
              onSearch={(value) => {
                setSearchQuery(value);
                setCurrentPage(1);
              }}
              placeholder="Cari pengguna..."
              className="w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loading className="py-12" />
          ) : userList.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada data pengguna</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pengguna</TableHead>
                    <TableHead>email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userList.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {user.nama_admin.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{user.nama_admin}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">@{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "purple" : "primary"}
                        >
                          {user.role === "admin" ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <UserCircle className="w-3 h-3 mr-1" />
                              Petugas
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(user)}
                            disabled={user.id === currentUser?.id}
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
        title={editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
        description={
          editingUser
            ? "Perbarui informasi pengguna"
            : "Masukkan data pengguna baru"
        }
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            error={errors.nama_admin?.message}
            {...register("nama_admin")}
          />

          <Input
            label="email"
            placeholder="Masukkan email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label={
              editingUser
                ? "Password Baru (kosongkan jika tidak diubah)"
                : "Password"
            }
            type="password"
            placeholder={
              editingUser ? "Kosongkan jika tidak diubah" : "Masukkan password"
            }
            error={errors.password?.message}
            {...register("password")}
          />

          <Select
            label="Role"
            options={[
              { value: "petugas", label: "Petugas" },
              { value: "admin", label: "Admin" },
            ]}
            error={errors.role?.message}
            {...register("role")}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Batal
            </Button>
            <Button
              type="submit"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? "Simpan Perubahan" : "Tambah Pengguna"}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
