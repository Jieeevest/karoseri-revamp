"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import {
  FileText,
  Download,
  TrendingUp,
  Package,
  Car,
  Users,
  DollarSign,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLaporan } from "@/hooks/use-laporan";

export default function LaporanPage() {
  const [selectedReport, setSelectedReport] = useState("");
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  const { data: laporanData = [] } = useLaporan(selectedReport, dateRange);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getJenisBadge = (jenis: string) => {
    const jenisConfig = {
      Pemasukan: { color: "bg-green-100 text-green-800", label: "Pemasukan" },
      Pengeluaran: { color: "bg-red-100 text-red-800", label: "Pengeluaran" },
    };

    const config =
      jenisConfig[jenis as keyof typeof jenisConfig] || jenisConfig.Pemasukan;
    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    // Basic status mapping or usage
    const statusConfig: any = {
      Selesai: {
        color: "bg-green-100 text-green-700 border-green-200",
        label: "Selesai",
      },
      Proses: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Proses",
      },
      Aktif: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        label: "Aktif",
      },
    };
    const config = statusConfig[status] || statusConfig.Proses;

    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const exportReport = (type: string) => {
    alert(`Exporting ${type} report... (Feature WIP)`);
  };

  const DateFilter = ({ children }: { children?: React.ReactNode }) => (
    <div className="flex items-end gap-2">
      <div className="grid gap-1.5">
        <Label
          htmlFor="start-date"
          className="text-xs font-medium text-slate-500"
        >
          Dari
        </Label>
        <Input
          id="start-date"
          type="date"
          value={dateRange.start}
          onChange={(e) =>
            setDateRange((prev) => ({
              ...prev,
              start: e.target.value,
            }))
          }
          className="w-36 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600 focus-visible:ring-offset-0"
        />
      </div>
      <div className="grid gap-1.5">
        <Label
          htmlFor="end-date"
          className="text-xs font-medium text-slate-500"
        >
          Sampai
        </Label>
        <Input
          id="end-date"
          type="date"
          value={dateRange.end}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, end: e.target.value }))
          }
          className="w-36 h-9 rounded-xl border-slate-200 text-xs focus-visible:ring-blue-600 focus-visible:ring-offset-0"
        />
      </div>
      {children}
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case "stok":
        return (
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-slate-900">
                  Laporan Stok Barang
                </CardTitle>
                <DateFilter>
                  <Button
                    onClick={() => exportReport("stok")}
                    variant="outline"
                    className="h-9 rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer ml-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DateFilter>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-50/50 border-slate-100">
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Nama Barang
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Stok Awal
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Barang Masuk
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Barang Keluar
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Stok Akhir
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Satuan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanData.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-900">
                        {item.nama}
                      </TableCell>
                      <TableCell className="px-6 font-medium text-slate-700">
                        {item.stokAwal}
                      </TableCell>
                      <TableCell className="px-6 font-medium text-green-600">
                        +{item.masuk}
                      </TableCell>
                      <TableCell className="px-6 font-medium text-red-600">
                        -{item.keluar}
                      </TableCell>
                      <TableCell className="px-6 font-bold text-blue-700">
                        {item.stokAkhir}
                      </TableCell>
                      <TableCell className="px-6 text-slate-500">
                        {item.satuan}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "kendaraan":
        return (
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-slate-900">
                  Laporan Kendaraan
                </CardTitle>
                <DateFilter>
                  <Button
                    onClick={() => exportReport("kendaraan")}
                    variant="outline"
                    className="h-9 rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer ml-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DateFilter>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-50/50 border-slate-100">
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Nomor Polisi
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Customer
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Tanggal Masuk
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Tanggal Keluar
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Status
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Pengerjaan
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanData.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-900">
                        {item.nomorPolisi}
                      </TableCell>
                      <TableCell className="px-6 text-slate-700">
                        {item.customer}
                      </TableCell>
                      <TableCell className="px-6 text-slate-500">
                        {item.tanggalMasuk}
                      </TableCell>
                      <TableCell className="px-6 text-slate-500">
                        {item.tanggalKeluar}
                      </TableCell>
                      <TableCell className="px-6">
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="px-6 text-slate-700">
                        {item.pengerjaan}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "keuangan":
        return (
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-slate-900">
                  Laporan Keuangan
                </CardTitle>
                <DateFilter>
                  <Button
                    onClick={() => exportReport("keuangan")}
                    variant="outline"
                    className="h-9 rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer ml-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DateFilter>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-50/50 border-slate-100">
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Tanggal
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Jenis
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Keterangan
                    </TableHead>
                    <TableHead className="px-6 text-right font-semibold text-slate-500">
                      Jumlah
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanData.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 text-slate-500">
                        {item.tanggal}
                      </TableCell>
                      <TableCell className="px-6">
                        {getJenisBadge(item.jenis)}
                      </TableCell>
                      <TableCell className="px-6 text-slate-700">
                        {item.keterangan}
                      </TableCell>
                      <TableCell
                        className={`px-6 text-right font-bold ${
                          item.jenis === "Pemasukan"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.jenis === "Pemasukan" ? "+" : "-"}
                        {formatCurrency(item.jumlah)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="hover:bg-slate-50/50 bg-slate-50/50 border-slate-100">
                    <TableCell
                      colSpan={3}
                      className="px-6 text-right font-bold text-slate-900"
                    >
                      Total:
                    </TableCell>
                    <TableCell className="px-6 text-right font-bold text-blue-700 text-lg">
                      {formatCurrency(
                        laporanData.reduce(
                          (total: number, item: any) =>
                            total +
                            (item.jenis === "Pemasukan"
                              ? item.jumlah
                              : -item.jumlah),
                          0,
                        ),
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "karyawan":
        return (
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-slate-900">
                  Laporan Karyawan
                </CardTitle>
                <DateFilter>
                  <Button
                    onClick={() => exportReport("karyawan")}
                    variant="outline"
                    className="h-9 rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer ml-2"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </DateFilter>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-50/50 border-slate-100">
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Nama Karyawan
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Jabatan
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Total Spek Order
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Total Upah
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanData.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-900">
                        {item.nama}
                      </TableCell>
                      <TableCell className="px-6 text-slate-700">
                        {item.jabatan}
                      </TableCell>
                      <TableCell className="px-6 text-slate-700 font-medium">
                        {item.totalSpek}
                      </TableCell>
                      <TableCell className="px-6 font-bold text-blue-700">
                        {formatCurrency(item.totalUpah)}
                      </TableCell>
                      <TableCell className="px-6">
                        {getStatusBadge(item.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              className="cursor-pointer border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-blue-200 group"
              onClick={() => setSelectedReport("stok")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="p-3 bg-blue-50 rounded-xl w-fit mb-3 group-hover:bg-blue-100 transition-colors">
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Laporan Stok
                    </h3>
                    <p className="text-sm text-slate-500">
                      Laporan pergerakan stok barang
                    </p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-green-200 group"
              onClick={() => setSelectedReport("kendaraan")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="p-3 bg-green-50 rounded-xl w-fit mb-3 group-hover:bg-green-100 transition-colors">
                      <Car className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Laporan Kendaraan
                    </h3>
                    <p className="text-sm text-slate-500">
                      Laporan kendaraan masuk & keluar
                    </p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-300 group-hover:text-green-400 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-purple-200 group"
              onClick={() => setSelectedReport("keuangan")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="p-3 bg-purple-50 rounded-xl w-fit mb-3 group-hover:bg-purple-100 transition-colors">
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Laporan Keuangan
                    </h3>
                    <p className="text-sm text-slate-500">
                      Laporan pemasukan & pengeluaran
                    </p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-300 group-hover:text-purple-400 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-orange-200 group"
              onClick={() => setSelectedReport("karyawan")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="p-3 bg-orange-50 rounded-xl w-fit mb-3 group-hover:bg-orange-100 transition-colors">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Laporan Karyawan
                    </h3>
                    <p className="text-sm text-slate-500">
                      Laporan performa karyawan
                    </p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-300 group-hover:text-orange-400 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {selectedReport && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedReport("")}
                className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Laporan
              </h1>
              <p className="text-sm text-slate-500">
                Sistem laporan manajemen karoseri
              </p>
            </div>
          </div>
        </div>

        {/* Summary Statistics - hardcoded placeholders for now as dashboard stats API is separate */}
        {!selectedReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Transaksi
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      247
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      +12% dari bulan lalu
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Pendapatan
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      Rp 45.2M
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      +8% dari bulan lalu
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Kendaraan Selesai
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">18</p>
                    <p className="text-xs text-green-600 font-medium">
                      Bulan ini
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Stok Menipis
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">5</p>
                    <p className="text-xs text-red-600 font-medium">
                      Perlu restock
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {renderReportContent()}
      </div>
    </DashboardLayout>
  );
}
