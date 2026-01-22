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
  Package,
  User,
  ArrowRight,
  Briefcase,
  Wrench,
  Edit,
} from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";

import { useBarang } from "@/hooks/use-barang";
import {
  BarangKeluar,
  JenisPengeluaran,
  useBarangKeluar,
  useCreateBarangKeluar,
  useUpdateBarangKeluar, // Less likely to be used for modification but good to have
  useDeleteBarangKeluar,
  useKaryawan,
  useKendaraan,
} from "@/hooks/use-barang-keluar";

export default function BarangKeluarPage() {
  const { data: barangList = [] } = useBarang();
  const { data: karyawanList = [] } = useKaryawan();
  const { data: kendaraanList = [] } = useKendaraan();

  const [searchTerm, setSearchTerm] = useState("");
  const { data: barangKeluarList = [], isLoading } =
    useBarangKeluar(searchTerm);
  const createBarangKeluar = useCreateBarangKeluar();
  const updateBarangKeluar = useUpdateBarangKeluar();
  const deleteBarangKeluar = useDeleteBarangKeluar();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarangKeluar, setEditingBarangKeluar] =
    useState<BarangKeluar | null>(null);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    jenis: "PRODUKSI" as JenisPengeluaran,
    barangId: "",
    jumlah: 0,
    karyawanId: "",
    kendaraanId: "",
    deskripsi: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBarangKeluar, setDeletingBarangKeluar] =
    useState<BarangKeluar | null>(null);

  const filteredBarangKeluar = barangKeluarList.filter(
    (bk) =>
      bk.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.jenis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.karyawan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.kendaraan?.nomorPolisi
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBarang = barangList.find((b) => b.id === formData.barangId);

    if (!selectedBarang) return; // Should be handled by required select

    if (formData.jenis === "PRODUKSI" && !formData.kendaraanId) {
      alert("Untuk pengeluaran PRODUKSI, wajib memilih kendaraan.");
      return;
    }

    if (formData.jumlah > (selectedBarang.stok || 0)) {
      alert(
        `Jumlah melebihi stok tersedia! Stok tersedia: ${selectedBarang.stok} ${selectedBarang.satuanBarang?.nama || "Unit"}`,
      );
      return;
    }

    try {
      if (editingBarangKeluar) {
        // Editing might be complex due to stock recalculation, but let's assume backend handles diffs
        await updateBarangKeluar.mutateAsync({
          id: editingBarangKeluar.id,
          ...formData,
          kendaraanId: formData.kendaraanId || undefined,
        });
        toast({
          title: "Berhasil",
          description: "Data barang keluar berhasil diperbarui",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      } else {
        await createBarangKeluar.mutateAsync({
          ...formData,
          kendaraanId: formData.kendaraanId || undefined,
        });
        toast({
          title: "Berhasil",
          description: "Data barang keluar berhasil dicatat",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      setEditingBarangKeluar(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menyimpan data barang keluar",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split("T")[0],
      jenis: "PRODUKSI",
      barangId: "",
      jumlah: 0,
      karyawanId: "",
      kendaraanId: "",
      deskripsi: "",
    });
  };

  const handleEdit = (barangKeluar: BarangKeluar) => {
    setEditingBarangKeluar(barangKeluar);
    setFormData({
      tanggal: barangKeluar.tanggal,
      jenis: barangKeluar.jenis,
      barangId: barangKeluar.barangId,
      jumlah: barangKeluar.jumlah,
      karyawanId: barangKeluar.karyawanId,
      kendaraanId: barangKeluar.kendaraanId || "",
      deskripsi: barangKeluar.deskripsi,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (barangKeluar: BarangKeluar) => {
    setDeletingBarangKeluar(barangKeluar);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBarangKeluar) return;

    try {
      await deleteBarangKeluar.mutateAsync(deletingBarangKeluar.id);
      toast({
        title: "Berhasil",
        description: "Data barang keluar berhasil dihapus",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      setIsDeleteModalOpen(false);
      setDeletingBarangKeluar(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menghapus data barang keluar",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingBarangKeluar(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayItems = barangKeluarList.filter((bk) => bk.tanggal === today);

    return {
      total: todayItems.length,
      totalItems: todayItems.reduce((sum, bk) => sum + bk.jumlah, 0),
      uniqueKaryawan: [...new Set(todayItems.map((bk) => bk.karyawanId))]
        .length,
      uniqueKendaraan: [
        ...new Set(todayItems.map((bk) => bk.kendaraanId).filter(Boolean)),
      ].length,
    };
  };

  const todayStats = getTodayStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Barang Keluar
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pencatatan pemakaian barang untuk kebutuhan produksi.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Catat Barang Keluar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingBarangKeluar
                      ? "Edit Barang Keluar"
                      : "Catat Barang Keluar"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingBarangKeluar
                      ? "Update informasi pemakaian barang."
                      : "Isi formulir untuk mencatat barang yang keluar dari gudang."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                  <div className="space-y-4">
                    <Label className="text-slate-700 font-medium">
                      Jenis Pengeluaran
                    </Label>
                    <RadioGroup
                      defaultValue="PRODUKSI"
                      value={formData.jenis}
                      onValueChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          jenis: val as JenisPengeluaran,
                        }))
                      }
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="PRODUKSI"
                          id="produksi"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="produksi"
                          className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                        >
                          <Wrench className="mb-2 h-6 w-6" />
                          <span className="font-semibold">Produksi</span>
                          <span className="text-xs text-slate-500 mt-1 text-center">
                            Untuk Kendaraan
                          </span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="OPERASIONAL"
                          id="operasional"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="operasional"
                          className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:text-blue-600 cursor-pointer transition-all"
                        >
                          <Briefcase className="mb-2 h-6 w-6" />
                          <span className="font-semibold">Operasional</span>
                          <span className="text-xs text-slate-500 mt-1 text-center">
                            Alat / Umum
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="tanggal"
                        className="text-slate-700 font-medium"
                      >
                        Tanggal
                      </Label>
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggal: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 bg-white"
                        required
                      />
                    </div>
                    {formData.jenis === "PRODUKSI" && (
                      <div className="grid gap-2">
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
                          <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0 bg-white">
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
                    )}
                  </div>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="karyawanId"
                          className="text-slate-700 font-medium"
                        >
                          Karyawan / Teknisi
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
                            {karyawanList.map((karyawan) => (
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
                      <div className="grid gap-2">
                        <Label
                          htmlFor="jumlah"
                          className="text-slate-700 font-medium"
                        >
                          Jumlah
                        </Label>
                        <Input
                          id="jumlah"
                          type="number"
                          value={formData.jumlah}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              jumlah: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="0"
                          min="1"
                          className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="barangId"
                        className="text-slate-700 font-medium"
                      >
                        Barang
                      </Label>
                      <Select
                        value={formData.barangId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, barangId: value }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih barang" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {barangList.map((barang) => (
                            <SelectItem
                              key={barang.id}
                              value={barang.id}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {barang.kode} - {barang.nama} (Stok: {barang.stok}{" "}
                              {barang.satuanBarang?.nama || "Unit"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="deskripsi"
                        className="text-slate-700 font-medium"
                      >
                        Keterangan / Deskripsi
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
                        placeholder="Deskripsikan detail pemakaian barang untuk keperluan apa..."
                        rows={3}
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="gap-2">
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
                    {editingBarangKeluar
                      ? "Simpan Perubahan"
                      : "Catat Pengeluaran"}
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
                    Total Transaksi
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {barangKeluarList.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Hari Ini</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {todayStats.total}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <ArrowRight className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Item Keluar (Hari Ini)
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {todayStats.totalItems}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Teknisi Aktif
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {todayStats.uniqueKaryawan}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-100">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Riwayat Barang Keluar
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari barang keluar..."
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
                  <TableHead className="font-semibold text-slate-500">
                    Nomor
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Tanggal
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Jenis
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Barang
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Jumlah
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Karyawan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kendaraan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Deskripsi
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBarangKeluar.length > 0 ? (
                  filteredBarangKeluar.map((barangKeluar) => (
                    <TableRow
                      key={barangKeluar.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-900">
                        {barangKeluar.nomor}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {barangKeluar.tanggal}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant={
                            barangKeluar.jenis === "PRODUKSI"
                              ? "default"
                              : "secondary"
                          }
                          className={`font-normal ${
                            barangKeluar.jenis === "PRODUKSI"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {barangKeluar.jenis}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {barangKeluar.barang.nama}
                          </p>
                          <p className="text-xs text-slate-500">
                            {barangKeluar.barang.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant="outline"
                          className="border-slate-200 text-slate-600 font-normal"
                        >
                          {barangKeluar.jumlah}{" "}
                          {barangKeluar.barang.satuanBarang?.nama || "Unit"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        <div>
                          <p className="font-medium text-slate-900">
                            {barangKeluar.karyawan.nama}
                          </p>
                          <p className="text-xs text-slate-500">
                            {barangKeluar.karyawan.jabatan}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {barangKeluar.kendaraan ? (
                          <div>
                            <p className="font-medium text-slate-900">
                              {barangKeluar.kendaraan.nomorPolisi}
                            </p>
                            <p className="text-xs text-slate-500">
                              {barangKeluar.kendaraan.merek}{" "}
                              {barangKeluar.kendaraan.tipe}
                            </p>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        className="px-6 text-slate-600 max-w-xs truncate"
                        title={barangKeluar.deskripsi}
                      >
                        {barangKeluar.deskripsi}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          {/* Edit Button */}
                          {/* For inventory logs, editing is tricky. But let's add it if needed. 
                               Original mock code didn't show it but we added it in other pages. 
                               The state `editingBarangKeluar` exists effectively. */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(barangKeluar)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(barangKeluar)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
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
                      colSpan={9}
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
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBarangKeluar(null);
        }}
        onConfirm={async () => handleDeleteConfirm()}
        itemName={deletingBarangKeluar?.nomor}
        title="Hapus Data Barang Keluar"
        description="Apakah Anda yakin ingin menghapus data ini? Stok barang akan dikembalikan."
      />
    </DashboardLayout>
  );
}
