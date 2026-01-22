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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Car, Eye } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { cn } from "@/lib/utils";
import {
  useKendaraan,
  useCreateKendaraan,
  useUpdateKendaraan,
  useDeleteKendaraan,
  Kendaraan,
} from "@/hooks/use-kendaraan";
import {
  useMerekKendaraan,
  useTipeKendaraan,
  MerekKendaraan,
  TipeKendaraan,
} from "@/hooks/use-master";
import { useCustomer, Customer } from "@/hooks/use-customer";
import { useToast } from "@/hooks/use-toast";

export default function DataKendaraanPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Hooks
  const { data: kendaraanList = [], refetch } = useKendaraan(searchTerm);
  const { data: merekList = [] } = useMerekKendaraan();
  const { data: tipeList = [] } = useTipeKendaraan(); // Fetch all types
  const { data: customerList = [] } = useCustomer();
  const createKendaraan = useCreateKendaraan();
  const updateKendaraan = useUpdateKendaraan();
  const deleteKendaraan = useDeleteKendaraan();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingKendaraan, setEditingKendaraan] = useState<Kendaraan | null>(
    null,
  );
  const [viewingKendaraan, setViewingKendaraan] = useState<Kendaraan | null>(
    null,
  );
  const [formData, setFormData] = useState({
    nomorPolisi: "",
    nomorChasis: "",
    nomorMesin: "",
    merekId: "",
    tipeId: "",
    customerId: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingKendaraan, setDeletingKendaraan] = useState<Kendaraan | null>(
    null,
  );

  // Helper to filter types based on selected Merek in form
  const filteredTipeList = formData.merekId
    ? tipeList.filter((t) => t.merekId === formData.merekId)
    : [];

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      MASUK: { color: "bg-blue-100 text-blue-800", label: "Masuk" },
      TAHAP_PERAKITAN: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Tahap Perakitan",
      },
      PROSES_PENGCATAN: {
        color: "bg-purple-100 text-purple-800",
        label: "Proses Pengecatan",
      },
      PROSES_PEMBUATAN_LOGO: {
        color: "bg-pink-100 text-pink-800",
        label: "Proses Pembuatan Logo",
      },
      SELESAI: { color: "bg-green-100 text-green-800", label: "Selesai" },
      KELUAR: { color: "bg-gray-100 text-gray-800", label: "Keluar" },
    };

    const config = statusConfig[status] || statusConfig.MASUK;
    return (
      <Badge variant="secondary" className={cn("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingKendaraan) {
        await updateKendaraan.mutateAsync({
          id: editingKendaraan.id,
          ...formData,
        });
      } else {
        await createKendaraan.mutateAsync({
          ...formData,
        });
      }

      setFormData({
        nomorPolisi: "",
        nomorChasis: "",
        nomorMesin: "",
        merekId: "",
        tipeId: "",
        customerId: "",
      });
      setEditingKendaraan(null);
      setIsDialogOpen(false);
      refetch();

      toast({
        title: editingKendaraan
          ? "Kendaraan diperbarui"
          : "Kendaraan ditambahkan",
        description: editingKendaraan
          ? "Data kendaraan berhasil diperbarui."
          : "Kendaraan baru berhasil ditambahkan.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Failed to save kendaraan", error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan kendaraan.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (kendaraan: Kendaraan) => {
    setEditingKendaraan(kendaraan);
    setFormData({
      nomorPolisi: kendaraan.nomorPolisi,
      nomorChasis: kendaraan.nomorChasis,
      nomorMesin: kendaraan.nomorMesin,
      merekId: kendaraan.merekId,
      tipeId: kendaraan.tipeId,
      customerId: kendaraan.customerId,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (kendaraan: Kendaraan) => {
    setDeletingKendaraan(kendaraan);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingKendaraan) return;

    try {
      await deleteKendaraan.mutateAsync(deletingKendaraan.id);
      refetch();
      setIsDeleteModalOpen(false);
      setDeletingKendaraan(null);

      toast({
        title: "Kendaraan dihapus",
        description: "Data kendaraan berhasil dihapus.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Delete failed", error);
      toast({
        title: "Gagal menghapus",
        description: "Gagal menghapus kendaraan.",
        variant: "destructive",
      });
    }
  };

  const handleView = (kendaraan: Kendaraan) => {
    setViewingKendaraan(kendaraan);
    setIsDetailDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingKendaraan(null);
    setFormData({
      nomorPolisi: "",
      nomorChasis: "",
      nomorMesin: "",
      merekId: "",
      tipeId: "",
      customerId: "",
    });
    setIsDialogOpen(true);
  };

  const getStatsByStatus = () => {
    const stats: { [key: string]: number } = {};
    kendaraanList.forEach((k) => {
      stats[k.status] = (stats[k.status] || 0) + 1;
    });
    return stats;
  };

  const statusStats = getStatsByStatus();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Data Kendaraan
            </h1>
            <p className="text-sm text-slate-500">
              Manajemen data kendaraan customer
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kendaraan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingKendaraan
                      ? "Edit Kendaraan"
                      : "Tambah Kendaraan Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingKendaraan
                      ? "Edit data kendaraan yang sudah ada."
                      : "Isi form berikut untuk menambahkan kendaraan baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nomorPolisi"
                      className="text-slate-700 font-medium"
                    >
                      Nomor Polisi
                    </Label>
                    <Input
                      id="nomorPolisi"
                      value={formData.nomorPolisi}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nomorPolisi: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder="Contoh: B 1234 ABC"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="nomorChasis"
                        className="text-slate-700 font-medium"
                      >
                        Nomor Chasis
                      </Label>
                      <Input
                        id="nomorChasis"
                        value={formData.nomorChasis}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            nomorChasis: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        placeholder="Nomor chasis"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="nomorMesin"
                        className="text-slate-700 font-medium"
                      >
                        Nomor Mesin
                      </Label>
                      <Input
                        id="nomorMesin"
                        value={formData.nomorMesin}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            nomorMesin: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        placeholder="Nomor mesin"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="customerId"
                      className="text-slate-700 font-medium"
                    >
                      Customer
                    </Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, customerId: value }))
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                        <SelectValue placeholder="Pilih customer" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {customerList.map((customer) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id}
                            className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                          >
                            {customer.kode} - {customer.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="merekId"
                        className="text-slate-700 font-medium"
                      >
                        Merek
                      </Label>
                      <Select
                        value={formData.merekId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            merekId: value,
                            tipeId: "",
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih merek" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {merekList.map((merek) => (
                            <SelectItem
                              key={merek.id}
                              value={merek.id}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {merek.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="tipeId"
                        className="text-slate-700 font-medium"
                      >
                        Tipe
                      </Label>
                      <Select
                        value={formData.tipeId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, tipeId: value }))
                        }
                        disabled={!formData.merekId}
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {filteredTipeList.map((tipe) => (
                            <SelectItem
                              key={tipe.id}
                              value={tipe.id}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {tipe.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    {editingKendaraan ? "Simpan Perubahan" : "Simpan Kendaraan"}
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
                    Total Kendaraan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {kendaraanList.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(statusStats)
            .slice(0, 3)
            .map(([status, count]) => {
              const statusConfig: any = {
                MASUK: { color: "bg-blue-50", icon: "🚛" },
                TAHAP_PERAKITAN: { color: "bg-yellow-50", icon: "🔧" },
                PROSES_PENGCATAN: { color: "bg-purple-50", icon: "🎨" },
                PROSES_PEMBUATAN_LOGO: { color: "bg-pink-50", icon: "🖼️" },
                SELESAI: { color: "bg-green-50", icon: "✅" },
                KELUAR: { color: "bg-gray-50", icon: "🚗" },
              };

              const config = statusConfig[status] || statusConfig.MASUK;
              const statusLabel = status
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase());

              return (
                <Card
                  key={status}
                  className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {statusLabel}
                        </p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">
                          {count}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-xl ${config.color} text-2xl border border-slate-100`}
                      >
                        {config.icon}
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
                Daftar Kendaraan
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari kendaraan..."
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
                    Nomor Polisi
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Merek & Tipe
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Customer
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Nomor Chasis
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
                {kendaraanList.length > 0 ? (
                  kendaraanList.map((kendaraan) => (
                    <TableRow
                      key={kendaraan.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        {kendaraan.nomorPolisi}
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {kendaraan.merekKendaraan.nama}
                          </p>
                          <p className="text-sm text-slate-500">
                            {kendaraan.tipeKendaraan.nama}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {kendaraan.customer.nama}
                          </p>
                          <p className="text-sm text-slate-500">
                            {kendaraan.customer.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 font-mono text-sm text-slate-600">
                        {kendaraan.nomorChasis}
                      </TableCell>
                      <TableCell className="px-6">
                        {getStatusBadge(kendaraan.status)}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(kendaraan)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(kendaraan)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(kendaraan)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
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
                      colSpan={6}
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
                Detail Kendaraan
              </DialogTitle>
            </DialogHeader>
            {viewingKendaraan && (
              <div className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nomor Polisi
                    </Label>
                    <p className="font-semibold text-lg text-slate-900">
                      {viewingKendaraan.nomorPolisi}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </Label>
                    <div>{getStatusBadge(viewingKendaraan.status)}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nomor Chasis
                    </Label>
                    <p className="font-mono text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {viewingKendaraan.nomorChasis}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Nomor Mesin
                    </Label>
                    <p className="font-mono text-sm text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {viewingKendaraan.nomorMesin}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Merek
                    </Label>
                    <p className="font-medium text-slate-900">
                      {viewingKendaraan.merekKendaraan.nama}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tipe
                    </Label>
                    <p className="font-medium text-slate-900">
                      {viewingKendaraan.tipeKendaraan.nama}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Customer
                    </Label>
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <p className="font-semibold text-slate-900">
                        {viewingKendaraan.customer.nama}
                      </p>
                      <p className="text-sm text-slate-500">
                        {viewingKendaraan.customer.kode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="pt-4 border-t border-slate-100">
              <Button
                onClick={() => setIsDetailDialogOpen(false)}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingKendaraan(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingKendaraan?.nomorPolisi}
        title="Hapus Data Kendaraan"
        description="Apakah Anda yakin ingin menghapus data kendaraan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </DashboardLayout>
  );
}
