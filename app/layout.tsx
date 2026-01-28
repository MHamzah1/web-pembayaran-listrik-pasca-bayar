import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PLN Postpaid - Sistem Pembayaran Listrik Pasca Bayar",
  description:
    "Sistem pembayaran listrik pasca bayar yang modern dan efisien untuk mengelola tagihan listrik pelanggan PLN",
  keywords: ["PLN", "listrik", "pembayaran", "pasca bayar", "tagihan"],
  authors: [{ name: "PLN Postpaid Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
