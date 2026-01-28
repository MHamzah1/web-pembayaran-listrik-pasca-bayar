"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Zap, User, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button, Input, Select, Card, CardContent } from "@/components/ui";
import { authService } from "@/services";

const registerSchema = z
  .object({
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(6, "Konfirmasi password minimal 6 karakter"),
    nama_admin: z.string().min(3, "Nama minimal 3 karakter"),
    role: z.enum(["admin", "petugas"], { message: "Pilih role" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "petugas",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);

      if (response.success) {
        toast.success("Registrasi berhasil! Silakan login.");
        router.push("/login");
      } else {
        toast.error(response.message || "Registrasi gagal");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError.response?.data?.message ||
        "Terjadi kesalahan saat registrasi";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Bergabung Bersama Kami
            </h1>
            <p className="text-xl text-emerald-100 mb-8 max-w-md">
              Daftar sebagai petugas atau admin untuk mengelola sistem
              pembayaran listrik
            </p>
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold">🔒</div>
                <div className="text-sm mt-2">Aman</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold">⚡</div>
                <div className="text-sm mt-2">Cepat</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold">✅</div>
                <div className="text-sm mt-2">Mudah</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PLN Postpaid</h1>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Buat Akun Baru
                </h2>
                <p className="text-gray-500 mt-2">
                  Lengkapi data untuk mendaftar
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                  leftIcon={User}
                  error={errors.nama_admin?.message}
                  {...register("nama_admin")}
                />

                <Input
                  label="Username"
                  placeholder="Masukkan username"
                  leftIcon={Mail}
                  error={errors.username?.message}
                  {...register("username")}
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan password"
                    leftIcon={Lock}
                    error={errors.password?.message}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Konfirmasi Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    leftIcon={Lock}
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <Select
                  label="Role"
                  error={errors.role?.message}
                  options={[
                    { value: "petugas", label: "Petugas" },
                    { value: "admin", label: "Admin" },
                  ]}
                  {...register("role")}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  size="lg"
                  isLoading={isLoading}
                >
                  Daftar
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Sudah punya akun?{" "}
                  <Link
                    href="/login"
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-gray-400 text-sm mt-8">
            © 2026 PLN Postpaid. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
