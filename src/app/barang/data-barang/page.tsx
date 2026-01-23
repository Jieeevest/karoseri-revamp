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
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Combobox } from "@/components/ui/combobox";
import {
  useBarang,
  useCreateBarang,
  useUpdateBarang,
  useDeleteBarang,
  Barang,
} from "@/hooks/use-barang";
import { useKategoriBarang, useSatuanBarang } from "@/hooks/use-master";

export default function DataBarangPage() {
  const { data: kategoriList = [] } = useKategoriBarang();
  const { data: satuanList = [] } = useSatuanBarang();

  const [searchTerm, setSearchTerm] = useState("");
  const { data: barangList = [], refetch } = useBarang(searchTerm);
  const createBarang = useCreateBarang();
  const updateBarang = useUpdateBarang();
  const deleteBarang = useDeleteBarang();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarang, setEditingBarang] = useState<Barang | null>(null);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    kategoriId: "",
    satuanId: "",
    stok: 0,
    stokMinimum: 0,
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBarang, setDeletingBarang] = useState<Barang | null>(null);

  const filteredBarang = barangList.filter(
    (barang) =>
      barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barang.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barang.kategoriBarang.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBarang) {
        await updateBarang.mutateAsync({
          id: editingBarang.id,
          ...formData,
          kategoriId: parseInt(formData.kategoriId),
          stok: formData.stok,
          stokMinimum: formData.stokMinimum,
        });
      } else {
        await createBarang.mutateAsync({
          ...formData,
          kategoriId: parseInt(formData.kategoriId),
        });
      }

      setFormData({
        kode: "",
        nama: "",
        kategoriId: "",
        satuanId: "",
        stok: 0,
        stokMinimum: 0,
      });
      setEditingBarang(null);
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save barang", error);
      alert("Gagal menyimpan barang");
    }
  };

  const handleEdit = (barang: Barang) => {
    setEditingBarang(barang);
    setFormData({
      kode: barang.kode,
      nama: barang.nama,
      kategoriId: barang.kategoriId.toString(),
      satuanId: barang.satuanId,
      stok: barang.stok,
      stokMinimum: barang.stokMinimum,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (barang: Barang) => {
    setDeletingBarang(barang);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBarang) return;

    try {
      await deleteBarang.mutateAsync(deletingBarang.id);
      refetch();
      setIsDeleteModalOpen(false);
      setDeletingBarang(null);
    } catch (error) {
      console.error("Failed to delete barang", error);
      alert("Gagal menghapus barang");
    }
  };

  const openAddDialog = () => {
    setEditingBarang(null);
    setFormData({
      kode: "",
      nama: "",
      kategoriId: "",
      satuanId: "",
      stok: 0,
      stokMinimum: 0,
    });
    setIsDialogOpen(true);
  };

  const getStockStatus = (stok: number, stokMinimum: number) => {
    if (stok <= stokMinimum) {
      return {
        color: "text-red-600 bg-red-50",
        label: "Stok Menipis",
        icon: AlertTriangle,
      };
    }
    return {
      color: "text-green-600 bg-green-50",
      label: "Stok Aman",
      icon: Package,
    };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Data Barang
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen data barang dan stok inventaris.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Barang
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingBarang ? "Edit Barang" : "Tambah Barang Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingBarang
                      ? "Perbarui informasi barang di sini."
                      : "Isi form berikut untuk menambahkan barang baru ke inventaris."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="kode"
                      className="text-slate-700 font-medium"
                    >
                      Kode Barang
                    </Label>
                    <Input
                      id="kode"
                      value={formData.kode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kode: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder="Contoh: BRG001"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Barang
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nama: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder="Contoh: Cat Semprot Hitam"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="kategoriId"
                        className="text-slate-700 font-medium"
                      >
                        Kategori
                      </Label>
                      <Combobox
                        value={formData.kategoriId}
                        onChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            kategoriId: value,
                          }))
                        }
                        options={kategoriList.map((cat) => ({
                          value: cat.id.toString(),
                          label: cat.nama,
                        }))}
                        placeholder="Pilih kategori"
                        searchPlaceholder="Cari kategori..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="satuanId"
                        className="text-slate-700 font-medium"
                      >
                        Satuan
                      </Label>
                      <Combobox
                        value={formData.satuanId}
                        onChange={(value) =>
                          setFormData((prev) => ({ ...prev, satuanId: value }))
                        }
                        options={satuanList.map((sat) => ({
                          value: sat.id,
                          label: sat.nama,
                        }))}
                        placeholder="Pilih satuan"
                        searchPlaceholder="Cari satuan..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="stok"
                        className="text-slate-700 font-medium"
                      >
                        Stok Awal
                      </Label>
                      <Input
                        id="stok"
                        type="number"
                        value={formData.stok}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stok: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        min="0"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="stokMinimum"
                        className="text-slate-700 font-medium"
                      >
                        Stok Minimum
                      </Label>
                      <Input
                        id="stokMinimum"
                        type="number"
                        value={formData.stokMinimum}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stokMinimum: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
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
                    {editingBarang ? "Simpan Perubahan" : "Buat Barang"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Barang
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari barang..."
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
                    Kode
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Nama Barang
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kategori
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Satuan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Stok
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
                {barangList.length > 0 ? (
                  barangList.map((barang) => {
                    const stockStatus = getStockStatus(
                      barang.stok,
                      barang.stokMinimum,
                    );
                    const StatusIcon = stockStatus.icon;

                    return (
                      <TableRow
                        key={barang.id}
                        className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                      >
                        <TableCell className="px-6 font-medium text-slate-700">
                          {barang.kode}
                        </TableCell>
                        <TableCell className="px-6 font-medium text-slate-900">
                          {barang.nama}
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge
                            variant="outline"
                            className="border-slate-200 text-slate-600 font-normal"
                          >
                            {barang.kategoriBarang.nama}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-slate-500">
                          {barang.satuanBarang.nama}
                        </TableCell>
                        <TableCell className="px-6">
                          <span
                            className={
                              barang.stok <= barang.stokMinimum
                                ? "text-red-600 font-bold"
                                : "text-slate-700"
                            }
                          >
                            {barang.stok}
                          </span>
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge className={`${stockStatus.color} border-0`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(barang)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(barang)}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBarang(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingBarang?.nama}
      />
    </DashboardLayout>
  );
}
