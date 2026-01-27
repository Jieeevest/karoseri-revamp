"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, TrendingUp, TrendingDown, Minus, History } from "lucide-react";
import { useState } from "react";
import { useRiwayatHarga } from "@/hooks/use-riwayat-harga";
// import { formatCurrency } from "@/lib/utils"; // Removed as it doesn't exist

export default function PriceMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: riwayatList = [], isLoading } = useRiwayatHarga(searchTerm);

  // Helper currency formatter if not imported or different
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentageChange = (oldPrice: number, newPrice: number) => {
    if (oldPrice === 0) return 100; // New price established
    return ((newPrice - oldPrice) / oldPrice) * 100;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Monitoring Harga Barang
          </h1>
          <p className="text-sm text-slate-500">
            Pantau pergerakan dan riwayat perubahan harga barang dari supplier
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  Riwayat Perubahan Harga
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Daftar kronologis update harga
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari produk, SKU, atau supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100">
                  <TableHead className="w-[150px]">Tanggal</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Harga Lama</TableHead>
                  <TableHead className="text-right">Harga Baru</TableHead>
                  <TableHead className="text-right">Selisih</TableHead>
                  <TableHead className="text-center w-[100px]">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-slate-500"
                    >
                      Memuat data riwayat...
                    </TableCell>
                  </TableRow>
                ) : riwayatList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-slate-500"
                    >
                      Tidak ada riwayat perubahan harga.
                    </TableCell>
                  </TableRow>
                ) : (
                  riwayatList.map((log) => {
                    const diff = log.hargaBaru - log.hargaLama;
                    const percent = getPercentageChange(
                      log.hargaLama,
                      log.hargaBaru,
                    );
                    const isIncrease = diff > 0;
                    const isNew = log.hargaLama === 0;

                    return (
                      <TableRow
                        key={log.id}
                        className="hover:bg-slate-50 border-slate-100"
                      >
                        <TableCell className="text-slate-500 text-sm">
                          {new Date(log.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-900">
                            {log.barang.nama}
                          </div>
                          <div className="text-xs text-slate-500">
                            {log.barang.kode}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {log.supplier.nama}
                        </TableCell>
                        <TableCell className="text-right text-slate-500">
                          {isNew ? "-" : formatIDR(log.hargaLama)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatIDR(log.hargaBaru)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              isIncrease
                                ? "text-red-600"
                                : isNew
                                  ? "text-blue-600"
                                  : "text-green-600"
                            }
                          >
                            {isIncrease ? "+" : ""}
                            {formatIDR(diff)}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {isNew ? "Baru" : `${percent.toFixed(1)}%`}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {isNew ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600 border-blue-200"
                            >
                              New
                            </Badge>
                          ) : isIncrease ? (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-600 border-red-200 flex items-center justify-center gap-1 w-full"
                            >
                              <TrendingUp className="w-3 h-3" /> Naik
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600 border-green-200 flex items-center justify-center gap-1 w-full"
                            >
                              <TrendingDown className="w-3 h-3" /> Turun
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
