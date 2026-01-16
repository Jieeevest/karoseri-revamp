import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Manajemen Karoseri",
  description:
    "Sistem manajemen untuk karoseri meliputi inventori barang, manajemen kendaraan, karyawan, dan purchase order. Dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Prisma.",
  keywords: [
    "Karoseri",
    "Manajemen",
    "Inventori",
    "Kendaraan",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
  ],
  authors: [{ name: "Karoseri Team" }],
  openGraph: {
    title: "Sistem Manajemen Karoseri",
    description:
      "Sistem manajemen untuk karoseri meliputi inventori barang, manajemen kendaraan, dan karyawan",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
