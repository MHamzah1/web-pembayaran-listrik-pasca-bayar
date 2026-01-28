"use client";

import { motion } from "framer-motion";
import {
  Zap,
  CreditCard,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function HomePage() {
  const features = [
    {
      icon: CreditCard,
      title: "Pembayaran Mudah",
      description: "Proses pembayaran tagihan listrik yang cepat dan efisien",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Manajemen Pelanggan",
      description: "Kelola data pelanggan PLN dengan mudah dan terorganisir",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Sistem keamanan yang handal untuk melindungi data Anda",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const benefits = [
    "Proses pembayaran real-time",
    "Laporan transaksi harian otomatis",
    "Cetak struk pembayaran instan",
    "Dashboard monitoring lengkap",
    "Multi-user dengan role berbeda",
    "Pencatatan meter yang akurat",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                PLN Postpaid
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button>Daftar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Sistem Pembayaran Listrik Modern
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Kelola Pembayaran{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Listrik
                </span>{" "}
                dengan Mudah
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Platform pembayaran listrik pasca bayar yang modern, efisien,
                dan terpercaya untuk membantu Anda mengelola tagihan pelanggan
                dengan lebih baik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" rightIcon={ArrowRight}>
                    Mulai Sekarang
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-3xl font-bold text-gray-900">10K+</p>
                  <p className="text-gray-500">Pelanggan</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">99.9%</p>
                  <p className="text-gray-500">Uptime</p>
                </div>
                <div className="w-px h-12 bg-gray-200" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">24/7</p>
                  <p className="text-gray-500">Support</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Hero Image/Illustration */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl rotate-3 scale-105 opacity-10" />
                <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                      <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      Dashboard Pembayaran
                    </h3>
                    <p className="text-blue-100 mb-6">
                      Pantau transaksi, kelola pelanggan, dan proses pembayaran
                      dalam satu platform terintegrasi.
                    </p>

                    {/* Mock Dashboard Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-blue-200 text-sm">Total Transaksi</p>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-blue-200 text-sm">Pendapatan</p>
                        <p className="text-2xl font-bold">Rp 45M</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dilengkapi dengan berbagai fitur yang memudahkan pengelolaan
              pembayaran listrik
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Mengapa Memilih PLN Postpaid?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Platform kami dirancang untuk memberikan pengalaman terbaik
                dalam mengelola pembayaran listrik pasca bayar.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Pembayaran Berhasil
                      </p>
                      <p className="text-sm text-gray-500">
                        Transaksi #TRX-2024-001234
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pelanggan</span>
                      <span className="font-medium">Ahmad Rizky</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID Pelanggan</span>
                      <span className="font-mono">123456789</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Periode</span>
                      <span>Januari 2026</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between">
                      <span className="text-gray-900 font-semibold">
                        Total Bayar
                      </span>
                      <span className="text-emerald-600 font-bold">
                        Rp 250.000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Siap untuk Memulai?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Bergabunglah sekarang dan rasakan kemudahan dalam mengelola
              pembayaran listrik pasca bayar.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  rightIcon={ArrowRight}
                >
                  Daftar Gratis
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Sudah Punya Akun? Masuk
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  PLN Postpaid
                </span>
              </Link>
              <p className="text-gray-400 mb-4 max-w-md">
                Sistem pembayaran listrik pasca bayar yang modern dan efisien
                untuk mengelola tagihan listrik pelanggan PLN.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Kontak</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" />
                  <span>+62 123 456 7890</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>info@plnpostpaid.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Links</h3>
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="block hover:text-white transition-colors"
                >
                  Daftar
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2026 PLN Postpaid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
