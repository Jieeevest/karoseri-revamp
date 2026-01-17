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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Wrench,
  Eye,
  Receipt,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Karyawan {
  id: string;
  nik: string;
  nama: string;
  jabatan: string;
}

interface Kendaraan {
  id: string;
  nomorPolisi: string;
  merek: string;
  tipe: string;
}

interface PembayaranSpek {
  id: string;
  jumlah: number;
  metode: "TRANSFER" | "CASH" | "GIRO";
  bukti?: string;
  createdAt: string;
}

interface SpekOrder {
  id: string;
  nomor: string;
  kendaraanId: string;
  kendaraan: Kendaraan;
  karyawanId: string;
  karyawan: Karyawan;
  jenis: "TUKANG_RAKIT" | "TUKANG_CAT" | "TUKANG_AKSESORIS";
  deskripsi: string;
  upah: number;
  status: "BELUM_DIBAYAR" | "SUDAH_DIBAYAR";
  createdAt: string;
  pembayaran: PembayaranSpek[];
}

export default function SpekOrderPage() {
  const [karyawanList] = useState<Karyawan[]>([
    {
      id: "1",
      nik: "1234567890123456",
      nama: "Ahmad Fauzi",
      jabatan: "Tukang Rakit",
    },
    {
      id: "2",
      nik: "2345678901234567",
      nama: "Budi Santoso",
      jabatan: "Tukang Cat",
    },
    {
      id: "3",
      nik: "3456789012345678",
      nama: "Chandra Wijaya",
      jabatan: "Tukang Aksesoris",
    },
    {
      id: "4",
      nik: "4567890123456789",
      nama: "Dedi Kurniawan",
      jabatan: "Tukang Rakit",
    },
  ]);

  const [kendaraanList] = useState<Kendaraan[]>([
    { id: "1", nomorPolisi: "B 1234 ABC", merek: "Hino", tipe: "Ranger" },
    { id: "2", nomorPolisi: "B 5678 DEF", merek: "Isuzu", tipe: "Dutro" },
    { id: "3", nomorPolisi: "B 9012 GHI", merek: "Isuzu", tipe: "Elf" },
  ]);

  const [spekOrderList, setSpekOrderList] = useState<SpekOrder[]>([
    {
      id: "1",
      nomor: "SO-2024-001",
      kendaraanId: "1",
      kendaraan: {
        id: "1",
        nomorPolisi: "B 1234 ABC",
        merek: "Hino",
        tipe: "Ranger",
      },
      karyawanId: "1",
      karyawan: {
        id: "1",
        nik: "1234567890123456",
        nama: "Ahmad Fauzi",
        jabatan: "Tukang Rakit",
      },
      jenis: "TUKANG_RAKIT",
      deskripsi:
        "Pembuatan wing box ukuran standar dengan pintu samping hidrolik",
      upah: 3500000,
      status: "BELUM_DIBAYAR",
      createdAt: "2024-01-15",
      pembayaran: [],
    },
    {
      id: "2",
      nomor: "SO-2024-002",
      kendaraanId: "2",
      kendaraan: {
        id: "2",
        nomorPolisi: "B 5678 DEF",
        merek: "Isuzu",
        tipe: "Dutro",
      },
      karyawanId: "2",
      karyawan: {
        id: "2",
        nik: "2345678901234567",
        nama: "Budi Santoso",
        jabatan: "Tukang Cat",
      },
      jenis: "TUKANG_CAT",
      deskripsi: "Cat ulang kabin dan pembuatan logo perusahaan",
      upah: 2500000,
      status: "SUDAH_DIBAYAR",
      createdAt: "2024-01-16",
      pembayaran: [
        {
          id: "1",
          jumlah: 2500000,
          metode: "TRANSFER",
          bukti: "bukti_transfer_001.jpg",
          createdAt: "2024-01-17",
        },
      ],
    },
    {
      id: "3",
      nomor: "SO-2024-003",
      kendaraanId: "3",
      kendaraan: {
        id: "3",
        nomorPolisi: "B 9012 GHI",
        merek: "Isuzu",
        tipe: "Elf",
      },
      karyawanId: "3",
      karyawan: {
        id: "3",
        nik: "3456789012345678",
        nama: "Chandra Wijaya",
        jabatan: "Tukang Aksesoris",
      },
      jenis: "TUKANG_AKSESORIS",
      deskripsi: "Pemasangan topi kabin fiber dan aksesoris interior",
      upah: 1500000,
      status: "BELUM_DIBAYAR",
      createdAt: "2024-01-18",
      pembayaran: [],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingSpekOrder, setEditingSpekOrder] = useState<SpekOrder | null>(
    null
  );
  const [viewingSpekOrder, setViewingSpekOrder] = useState<SpekOrder | null>(
    null
  );
  const [payingSpekOrder, setPayingSpekOrder] = useState<SpekOrder | null>(
    null
  );
  const [formData, setFormData] = useState({
    kendaraanId: "",
    karyawanId: "",
    jenis: "" as "TUKANG_RAKIT" | "TUKANG_CAT" | "TUKANG_AKSESORIS" | "",
    deskripsi: "",
    upah: 0,
  });
  const [paymentFormData, setPaymentFormData] = useState({
    jumlah: 0,
    metode: "TRANSFER" as "TRANSFER" | "CASH" | "GIRO",
    bukti: "",
  });

  const filteredSpekOrder = spekOrderList.filter(
    (spek) =>
      spek.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spek.kendaraan.nomorPolisi
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      spek.karyawan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spek.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getJenisSpekBadge = (jenis: string) => {
    const jenisConfig = {
      TUKANG_RAKIT: {
        color: "bg-blue-100 text-blue-800",
        label: "Tukang Rakit",
      },
      TUKANG_CAT: { color: "bg-green-100 text-green-800", label: "Tukang Cat" },
      TUKANG_AKSESORIS: {
        color: "bg-purple-100 text-purple-800",
        label: "Tukang Aksesoris",
      },
    };

    const config =
      jenisConfig[jenis as keyof typeof jenisConfig] ||
      jenisConfig.TUKANG_RAKIT;
    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      BELUM_DIBAYAR: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Belum Dibayar",
      },
      SUDAH_DIBAYAR: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Sudah Dibayar",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.BELUM_DIBAYAR;
    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const getMetodeBadge = (metode: string) => {
    const metodeConfig = {
      TRANSFER: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Transfer",
      },
      CASH: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Cash",
      },
      GIRO: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Giro",
      },
    };

    const config =
      metodeConfig[metode as keyof typeof metodeConfig] ||
      metodeConfig.TRANSFER;
    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedKaryawan = karyawanList.find(
      (k) => k.id === formData.karyawanId
    );
    const selectedKendaraan = kendaraanList.find(
      (k) => k.id === formData.kendaraanId
    );

    if (!selectedKaryawan || !selectedKendaraan) return;

    const newSpekOrder: SpekOrder = {
      id: Date.now().toString(),
      nomor: `SO-2024-${String(spekOrderList.length + 1).padStart(3, "0")}`,
      kendaraanId: formData.kendaraanId,
      kendaraan: selectedKendaraan,
      karyawanId: formData.karyawanId,
      karyawan: selectedKaryawan,
      jenis: formData.jenis as
        | "TUKANG_RAKIT"
        | "TUKANG_CAT"
        | "TUKANG_AKSESORIS",
      deskripsi: formData.deskripsi,
      upah: formData.upah,
      status: "BELUM_DIBAYAR",
      createdAt: new Date().toISOString().split("T")[0],
      pembayaran: [],
    };

    setSpekOrderList([...spekOrderList, newSpekOrder]);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      kendaraanId: "",
      karyawanId: "",
      jenis: "",
      deskripsi: "",
      upah: 0,
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!payingSpekOrder) return;

    const newPembayaran: PembayaranSpek = {
      id: Date.now().toString(),
      jumlah: paymentFormData.jumlah,
      metode: paymentFormData.metode,
      bukti: paymentFormData.bukti,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setSpekOrderList((prev) =>
      prev.map((spek) =>
        spek.id === payingSpekOrder.id
          ? {
              ...spek,
              status: "SUDAH_DIBAYAR" as const,
              pembayaran: [...spek.pembayaran, newPembayaran],
            }
          : spek
      )
    );

    setPaymentFormData({ jumlah: 0, metode: "TRANSFER", bukti: "" });
    setPayingSpekOrder(null);
    setIsPaymentDialogOpen(false);
  };

  const handleView = (spekOrder: SpekOrder) => {
    setViewingSpekOrder(spekOrder);
    setIsDetailDialogOpen(true);
  };

  const handlePaymentDialog = (spekOrder: SpekOrder) => {
    setPayingSpekOrder(spekOrder);
    setPaymentFormData({
      jumlah: spekOrder.upah,
      metode: "TRANSFER",
      bukti: "",
    });
    setIsPaymentDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus spek order ini?")) {
      setSpekOrderList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getKaryawanByJenis = (jenis: string) => {
    const jabatanMap = {
      TUKANG_RAKIT: "Tukang Rakit",
      TUKANG_CAT: "Tukang Cat",
      TUKANG_AKSESORIS: "Tukang Aksesoris",
    };

    const jabatan = jabatanMap[jenis as keyof typeof jabatanMap];
    return karyawanList.filter((k) => k.jabatan === jabatan);
  };

  const getStatsByJenis = () => {
    const stats: { [key: string]: number } = {};
    spekOrderList.forEach((s) => {
      stats[s.jenis] = (stats[s.jenis] || 0) + 1;
    });
    return stats;
  };

  const jenisStats = getStatsByJenis();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Data Spek Order
            </h1>
            <p className="text-sm text-slate-500">
              Manajemen spek order dan pembayaran upah karyawan
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Buat Spek Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Buat Spek Order Baru
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Buat spek order untuk pengerjaan kendaraan
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="kendaraanId"
                        className="text-slate-700 font-medium"
                      >
                        Kendaraan
                      </Label>
                      <Select
                        value={formData.kendaraanId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            kendaraanId: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih kendaraan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {kendaraanList.map((kendaraan) => (
                            <SelectItem
                              key={kendaraan.id}
                              value={kendaraan.id}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {kendaraan.nomorPolisi} - {kendaraan.merek}{" "}
                              {kendaraan.tipe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="jenis"
                        className="text-slate-700 font-medium"
                      >
                        Jenis Pekerjaan
                      </Label>
                      <Select
                        value={formData.jenis}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            jenis: value as any,
                            karyawanId: "",
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          <SelectItem value="TUKANG_RAKIT">
                            Tukang Rakit
                          </SelectItem>
                          <SelectItem value="TUKANG_CAT">Tukang Cat</SelectItem>
                          <SelectItem value="TUKANG_AKSESORIS">
                            Tukang Aksesoris
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid items-center gap-2">
                    <Label
                      htmlFor="karyawanId"
                      className="text-slate-700 font-medium"
                    >
                      Karyawan
                    </Label>
                    <Select
                      value={formData.karyawanId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, karyawanId: value }))
                      }
                      disabled={!formData.jenis}
                    >
                      <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0 disabled:opacity-50">
                        <SelectValue placeholder="Pilih karyawan" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {getKaryawanByJenis(formData.jenis).map((karyawan) => (
                          <SelectItem
                            key={karyawan.id}
                            value={karyawan.id}
                            className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                          >
                            {karyawan.nama} ({karyawan.jabatan})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid items-center gap-2">
                    <Label
                      htmlFor="deskripsi"
                      className="text-slate-700 font-medium"
                    >
                      Deskripsi Pekerjaan
                    </Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          deskripsi: e.target.value,
                        }))
                      }
                      placeholder="Deskripsi detail pekerjaan yang akan dilakukan"
                      rows={3}
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 resize-none"
                      required
                    />
                  </div>

                  <div className="grid items-center gap-2">
                    <Label
                      htmlFor="upah"
                      className="text-slate-700 font-medium"
                    >
                      Upah (Rp)
                    </Label>
                    <Input
                      id="upah"
                      type="number"
                      value={formData.upah}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          upah: parseInt(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                      min="0"
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer"
                  >
                    Simpan Spek Order
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Spek Order
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {spekOrderList.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(jenisStats).map(([jenis, count]) => {
            const jenisConfig = {
              TUKANG_RAKIT: {
                color: "bg-blue-50 text-blue-600 border-blue-100",
                label: "Tukang Rakit",
              },
              TUKANG_CAT: {
                color: "bg-green-50 text-green-600 border-green-100",
                label: "Tukang Cat",
              },
              TUKANG_AKSESORIS: {
                color: "bg-purple-50 text-purple-600 border-purple-100",
                label: "Tukang Aksesoris",
              },
            };

            const config =
              jenisConfig[jenis as keyof typeof jenisConfig] ||
              jenisConfig.TUKANG_RAKIT;

            return (
              <Card
                key={jenis}
                className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {config.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {count}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl border ${
                        config.color
                          .replace("text-", "border-")
                          .split(" ")[2] || "border-slate-100"
                      } ${config.color.split(" ")[0]}`}
                    >
                      <Wrench
                        className={`h-6 w-6 ${config.color.split(" ")[1]}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Spek Order
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari spek order..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100">
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Nomor
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kendaraan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Karyawan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Jenis
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Upah
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpekOrder.length > 0 ? (
                  filteredSpekOrder.map((spekOrder) => (
                    <TableRow
                      key={spekOrder.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50"
                        >
                          {spekOrder.nomor}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {spekOrder.kendaraan.nomorPolisi}
                          </p>
                          <p className="text-sm text-slate-500">
                            {spekOrder.kendaraan.merek}{" "}
                            {spekOrder.kendaraan.tipe}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {spekOrder.karyawan.nama}
                          </p>
                          <p className="text-sm text-slate-500">
                            {spekOrder.karyawan.jabatan}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        {getJenisSpekBadge(spekOrder.jenis)}
                      </TableCell>
                      <TableCell className="px-6 font-medium text-slate-700">
                        {formatCurrency(spekOrder.upah)}
                      </TableCell>
                      <TableCell className="px-6">
                        {getStatusBadge(spekOrder.status)}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(spekOrder)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {spekOrder.status === "BELUM_DIBAYAR" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePaymentDialog(spekOrder)}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg cursor-pointer"
                              title="Bayar Upah"
                            >
                              <Receipt className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(spekOrder.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-6 h-24 text-center text-slate-500"
                    >
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Detail Spek Order
              </DialogTitle>
            </DialogHeader>
            {viewingSpekOrder && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nomor Spek Order
                    </Label>
                    <p className="font-bold text-lg text-slate-900">
                      {viewingSpekOrder.nomor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status Pembayaran
                    </Label>
                    <div>{getStatusBadge(viewingSpekOrder.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Kendaraan
                    </Label>
                    <p className="font-semibold text-slate-900">
                      {viewingSpekOrder.kendaraan.nomorPolisi}
                    </p>
                    <p className="text-sm text-slate-500">
                      {viewingSpekOrder.kendaraan.merek}{" "}
                      {viewingSpekOrder.kendaraan.tipe}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Karyawan
                    </Label>
                    <p className="font-semibold text-slate-900">
                      {viewingSpekOrder.karyawan.nama}
                    </p>
                    <p className="text-sm text-slate-500">
                      {viewingSpekOrder.karyawan.jabatan}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Jenis Pekerjaan
                    </Label>
                    <div className="mt-1">
                      {getJenisSpekBadge(viewingSpekOrder.jenis)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Upah
                    </Label>
                    <p className="font-bold text-lg text-slate-900">
                      {formatCurrency(viewingSpekOrder.upah)}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Deskripsi Pekerjaan
                    </Label>
                    <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                      {viewingSpekOrder.deskripsi}
                    </p>
                  </div>
                </div>

                {viewingSpekOrder.pembayaran.length > 0 && (
                  <div className="border-t border-slate-100 pt-4">
                    <Label className="text-sm font-semibold text-slate-900 mb-3 block">
                      Riwayat Pembayaran
                    </Label>
                    <div className="space-y-3">
                      {viewingSpekOrder.pembayaran.map((pembayaran) => (
                        <div
                          key={pembayaran.id}
                          className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-slate-900">
                              {formatCurrency(pembayaran.jumlah)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {getMetodeBadge(pembayaran.metode)}
                              <span className="text-xs text-slate-400">
                                • {pembayaran.createdAt}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            {pembayaran.bukti && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 border-blue-100"
                              >
                                <Wallet className="w-3 h-3 mr-1" />
                                Bukti Ada
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px] rounded-xl border-slate-100 shadow-2xl">
            <form onSubmit={handlePayment}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Pembayaran Upah
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Catat pembayaran upah untuk spek order
                </DialogDescription>
              </DialogHeader>
              {payingSpekOrder && (
                <div className="space-y-6 py-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                        {payingSpekOrder.nomor}
                      </span>
                      <span className="text-xs text-slate-500">
                        {payingSpekOrder.createdAt}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900">
                      {payingSpekOrder.karyawan.nama}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {formatCurrency(payingSpekOrder.upah)}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {payingSpekOrder.deskripsi}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="jumlah"
                        className="text-slate-700 font-medium"
                      >
                        Jumlah Pembayaran
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                          Rp
                        </span>
                        <Input
                          id="jumlah"
                          type="number"
                          value={paymentFormData.jumlah}
                          onChange={(e) =>
                            setPaymentFormData((prev) => ({
                              ...prev,
                              jumlah: parseInt(e.target.value) || 0,
                            }))
                          }
                          min="0"
                          max={payingSpekOrder.upah}
                          className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 font-semibold text-slate-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="metode"
                        className="text-slate-700 font-medium"
                      >
                        Metode Pembayaran
                      </Label>
                      <Select
                        value={paymentFormData.metode}
                        onValueChange={(value) =>
                          setPaymentFormData((prev) => ({
                            ...prev,
                            metode: value as any,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          <SelectItem value="TRANSFER">Transfer</SelectItem>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="GIRO">Giro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="bukti"
                        className="text-slate-700 font-medium"
                      >
                        Bukti Pembayaran (Opsional)
                      </Label>
                      <Input
                        id="bukti"
                        value={paymentFormData.bukti}
                        onChange={(e) =>
                          setPaymentFormData((prev) => ({
                            ...prev,
                            bukti: e.target.value,
                          }))
                        }
                        placeholder="Nama file bukti pembayaran"
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md cursor-pointer w-full sm:w-auto"
                >
                  Bayar Sekarang
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
