/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { authService } from "@/services";
import { useAppDispatch } from "@/hooks/useRedux";
import { setCredentials } from "@/store/slices/authSlice";

const loginSchema = z.object({
  email: z.string().min(3, "Email minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);

      if (response.accessToken && response.user) {
        // Save to cookies
        Cookies.set("token", response.accessToken, { expires: 7 });
        Cookies.set("refreshToken", response.refreshToken, { expires: 7 });
        Cookies.set("user", JSON.stringify(response.user), { expires: 7 });

        // Update Redux state
        dispatch(
          setCredentials({
            user: response.user,
            token: response.accessToken,
          }),
        );

        toast.success("Login berhasil! Selamat datang.");
        router.push("/dashboard");
      } else {
        toast.error("Login gagal");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Terjadi kesalahan saat login";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
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
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">PLN Postpaid</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-md">
              Sistem Pembayaran Listrik Pasca Bayar yang Modern dan Efisien
            </p>
            <div className="flex items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm">Pelanggan</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">PLN Postpaid</h1>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Selamat Datang!
                </h2>
                <p className="text-gray-500 mt-2">
                  Masuk ke akun Anda untuk melanjutkan
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="email"
                  placeholder="Masukkan email"
                  leftIcon={Mail}
                  error={errors.email?.message}
                  {...register("email")}
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

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isLoading}
                >
                  Masuk
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Daftar sekarang
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
