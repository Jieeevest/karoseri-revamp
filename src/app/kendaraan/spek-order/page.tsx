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
  Trash2,
  Search,
  Eye,
  Wallet,
  Receipt,
  CheckCircle,
  Clock,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import {
  useSpekOrder,
  useCreateSpekOrder,
  useDeleteSpekOrder,
  useCreatePayment,
} from "@/hooks/use-spek-order";
import { useKendaraan } from "@/hooks/use-kendaraan";
import { useKaryawan } from "@/hooks/use-karyawan";

export default function SpekOrderPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const [viewingSpekOrder, setViewingSpekOrder] = useState<any | null>(null);
  const [payingSpekOrder, setPayingSpekOrder] = useState<any | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSpekOrder, setDeletingSpekOrder] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    kendaraanId: "",
    karyawanId: "",
    jenis: "",
    deskripsi: "",
    upah: 0,
  });

  const [paymentFormData, setPaymentFormData] = useState({
    jumlah: 0,
    metode: "TRANSFER",
    bukti: "",
  });

  // Queries
  const { data: spekOrderList = [] } = useSpekOrder(searchTerm);
  const { data: allKendaraanData } = useKendaraan();
  const kendaraanList = (allKendaraanData as any[]) || [];
  const { data: karyawanList = [] } = useKaryawan();

  // Mutations
  const createSpekOrder = useCreateSpekOrder();
  const deleteSpekOrder = useDeleteSpekOrder();
  const createPayment = useCreatePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSpekOrder.mutateAsync(formData);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create spek order", error);
      alert("Gagal menyimpan data");
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingSpekOrder) return;

    try {
      await createPayment.mutateAsync({
        spekOrderId: payingSpekOrder.id,
        ...paymentFormData,
      });
      setPayingSpekOrder(null);
      setIsPaymentDialogOpen(false);
      setPaymentFormData({ jumlah: 0, metode: "TRANSFER", bukti: "" });
    } catch (error) {
      console.error("Failed to create payment", error);
      alert("Gagal menyimpan pembayaran");
    }
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

  const handleView = (spekOrder: any) => {
    setViewingSpekOrder(spekOrder);
    setIsDetailDialogOpen(true);
  };

  const handlePaymentDialog = (spekOrder: any) => {
    setPayingSpekOrder(spekOrder);
    setPaymentFormData({
      jumlah: spekOrder.upah, // Default to full amount
      metode: "TRANSFER",
      bukti: "",
    });
    setIsPaymentDialogOpen(true);
  };

  const handleDeleteClick = (spekOrder: any) => {
    setDeletingSpekOrder(spekOrder);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSpekOrder) return;
    try {
      await deleteSpekOrder.mutateAsync(deletingSpekOrder.id);
      setIsDeleteModalOpen(false);
      setDeletingSpekOrder(null);
    } catch (error) {
      console.error("Failed to delete", error);
      alert("Gagal menghapus data");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUDAH_DIBAYAR":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Sudah Dibayar
          </Badge>
        );
      case "BELUM_DIBAYAR":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Belum Dibayar
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMetodeBadge = (metode: string) => {
    switch (metode) {
      case "TRANSFER":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Transfer
          </Badge>
        );
      case "CASH":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Cash
          </Badge>
        );
      case "GIRO":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Giro
          </Badge>
        );
      default:
        return <Badge variant="outline">{metode}</Badge>;
    }
  };

  const getJenisSpekBadge = (jenis: string) => {
    return (
      <Badge
        variant="secondary"
        className="bg-slate-100 text-slate-700 font-normal"
      >
        {jenis}
      </Badge>
    );
  };

  // Stats
  const totalUpah = spekOrderList.reduce(
    (acc: number, curr: any) => acc + (curr.upah || 0),
    0,
  );
  const paidCount = spekOrderList.filter(
    (item: any) => item.status === "SUDAH_DIBAYAR",
  ).length;
  const unpaidCount = spekOrderList.filter(
    (item: any) => item.status === "BELUM_DIBAYAR",
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Spek Order & Upah Borongan
            </h1>
            <p className="text-sm text-slate-500">
              Manajemen pekerjaan borongan dan pembayaran upah karyawan
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Buat Spek Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader className="border-b border-slate-100 pb-4">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Form Spek Order Baru
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Buat surat perintah kerja borongan untuk karyawan
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
                          {kendaraanList.map((k: any) => (
                            <SelectItem key={k.id} value={k.id}>
                              {k.nomorPolisi} -{" "}
                              {k.merekKendaraan?.nama || k.merek}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="karyawanId"
                        className="text-slate-700 font-medium"
                      >
                        Karyawan / Tim
                      </Label>
                      <Select
                        value={formData.karyawanId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            karyawanId: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih karyawan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {karyawanList.map((k: any) => (
                            <SelectItem key={k.id} value={k.id}>
                              {k.nama} ({k.jabatan})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="jenis"
                      className="text-slate-700 font-medium"
                    >
                      Jenis Pekerjaan
                    </Label>
                    <Select
                      value={formData.jenis}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, jenis: value }))
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                        <SelectValue placeholder="Pilih jenis pekerjaan" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="LAS_BODY">Las Body</SelectItem>
                        <SelectItem value="CAT_FINISHING">
                          Cat & Finishing
                        </SelectItem>
                        <SelectItem value="INSTALASI_LISTRIK">
                          Instalasi Listrik
                        </SelectItem>
                        <SelectItem value="INTERIOR">Interior</SelectItem>
                        <SelectItem value="LAINNYA">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="deskripsi"
                      className="text-slate-700 font-medium"
                    >
                      Deskripsi Detail
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
                      placeholder="Jelaskan detail pekerjaan yang harus dilakukan"
                      rows={3}
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="upah"
                      className="text-slate-700 font-medium"
                    >
                      Nominal Upah Borongan
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                        Rp
                      </span>
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
                        className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 font-semibold text-slate-900"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2 pt-4 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="rounded-xl cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-200 cursor-pointer"
                  >
                    Simpan Data
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Upah Terbayar
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {/* Simplified calculation: sum of paid items OR sum of actual payments */}
                    {/* Assuming full payment for SUDAH_DIBAYAR for simplicity */}
                    {formatCurrency(
                      spekOrderList
                        .filter((s: any) => s.status === "SUDAH_DIBAYAR")
                        .reduce(
                          (acc: number, curr: any) => acc + (curr.upah || 0),
                          0,
                        ),
                    )}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Sudah Dibayar
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {paidCount}{" "}
                    <span className="text-sm font-normal text-slate-400">
                      Order
                    </span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Belum Dibayar
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">
                    {unpaidCount}{" "}
                    <span className="text-sm font-normal text-slate-400">
                      Order
                    </span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                    Pekerjaan
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
                {spekOrderList.length > 0 ? (
                  spekOrderList.map((spekOrder: any) => (
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
                            {spekOrder.kendaraan?.nomorPolisi || "-"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {spekOrder.kendaraan?.merekKendaraan?.nama ||
                              spekOrder.kendaraan?.merek}{" "}
                            {spekOrder.kendaraan?.tipeKendaraan?.nama ||
                              spekOrder.kendaraan?.tipe}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {spekOrder.karyawan?.nama}
                          </p>
                          <p className="text-sm text-slate-500">
                            {spekOrder.karyawan?.jabatan}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          {getJenisSpekBadge(spekOrder.jenis)}
                          <p className="text-sm text-slate-500 mt-1 line-clamp-1 max-w-[150px]">
                            {spekOrder.deskripsi}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 font-medium text-slate-900">
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
                            onClick={() => handleDeleteClick(spekOrder)}
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
                      {viewingSpekOrder.kendaraan?.nomorPolisi || "-"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {viewingSpekOrder.kendaraan?.merekKendaraan?.nama ||
                        viewingSpekOrder.kendaraan?.merek ||
                        ""}{" "}
                      {viewingSpekOrder.kendaraan?.tipeKendaraan?.nama ||
                        viewingSpekOrder.kendaraan?.tipe ||
                        ""}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Karyawan
                    </Label>
                    <p className="font-semibold text-slate-900">
                      {viewingSpekOrder.karyawan?.nama}
                    </p>
                    <p className="text-sm text-slate-500">
                      {viewingSpekOrder.karyawan?.jabatan}
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

                {viewingSpekOrder.pembayaran &&
                  viewingSpekOrder.pembayaran.length > 0 && (
                    <div className="border-t border-slate-100 pt-4">
                      <Label className="text-sm font-semibold text-slate-900 mb-3 block">
                        Riwayat Pembayaran
                      </Label>
                      <div className="space-y-3">
                        {viewingSpekOrder.pembayaran.map((pembayaran: any) => (
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
                                  •{" "}
                                  {pembayaran.createdAt
                                    ? new Date(
                                        pembayaran.createdAt,
                                      ).toLocaleDateString()
                                    : "-"}
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
                        {payingSpekOrder.createdAt
                          ? new Date(
                              payingSpekOrder.createdAt,
                            ).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900">
                      {payingSpekOrder.karyawan?.nama}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSpekOrder(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingSpekOrder?.nomor}
        title="Hapus Spek Order"
        description="Apakah Anda yakin ingin menghapus spek order ini? Tindakan ini tidak dapat dibatalkan."
      />
    </DashboardLayout>
  );
}
