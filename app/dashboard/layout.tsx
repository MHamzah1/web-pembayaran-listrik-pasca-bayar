"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  LayoutDashboard,
  Users,
  UserCircle,
  Receipt,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Bolt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { logout } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

interface SidebarProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Pembayaran",
    href: "/dashboard/pembayaran",
    icon: CreditCard,
  },
  {
    title: "Tagihan",
    href: "/dashboard/tagihan",
    icon: Receipt,
  },
  {
    title: "Pelanggan",
    href: "/dashboard/pelanggan",
    icon: UserCircle,
  },
  {
    title: "Tarif",
    href: "/dashboard/tarif",
    icon: Bolt,
  },
  {
    title: "Laporan",
    href: "/dashboard/laporan",
    icon: FileText,
  },
  {
    title: "Pengguna",
    href: "/dashboard/users",
    icon: Users,
    adminOnly: true,
  },
];

export default function DashboardLayout({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    dispatch(logout());
    toast.success("Berhasil logout");
    router.push("/login");
  };

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === "admin",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              PLN Postpaid
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.nama_admin?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.nama_admin || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "Role"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.nama_admin?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.nama_admin || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.nama_admin}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{user?.username}
                        </p>
                      </div>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Pengaturan
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
