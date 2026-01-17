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

interface KategoriBarang {
  id: number;
  nama: string;
}

interface SatuanBarang {
  id: string;
  nama: string;
}

interface Barang {
  id: string;
  kode: string;
  nama: string;
  kategoriId: number;
  kategoriBarang: KategoriBarang;
  satuanId: string;
  satuanBarang: SatuanBarang;
  stok: number;
  stokMinimum: number;
  createdAt: string;
}

export default function DataBarangPage() {
  const [kategoriList] = useState<KategoriBarang[]>([
    { id: 1, nama: "Cat" },
    { id: 2, nama: "Besi" },
    { id: 3, nama: "Aksesoris" },
    { id: 4, nama: "Paku & Sekrup" },
  ]);

  const [satuanList] = useState<SatuanBarang[]>([
    { id: "1", nama: "Unit" },
    { id: "2", nama: "Kg" },
    { id: "3", nama: "Liter" },
    { id: "4", nama: "Meter" },
    { id: "5", nama: "Dus" },
  ]);

  const [barangList, setBarangList] = useState<Barang[]>([
    {
      id: "1",
      kode: "BRG001",
      nama: "Cat Semprot Hitam",
      kategoriId: 1,
      kategoriBarang: { id: 1, nama: "Cat" },
      satuanId: "3",
      satuanBarang: { id: "3", nama: "Liter" },
      stok: 15,
      stokMinimum: 10,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      kode: "BRG002",
      nama: "Besi Hollow 4x4",
      kategoriId: 2,
      kategoriBarang: { id: 2, nama: "Besi" },
      satuanId: "4",
      satuanBarang: { id: "4", nama: "Meter" },
      stok: 50,
      stokMinimum: 20,
      createdAt: "2024-01-16",
    },
    {
      id: "3",
      kode: "BRG003",
      nama: "Paku 10cm",
      kategoriId: 4,
      kategoriBarang: { id: 4, nama: "Paku & Sekrup" },
      satuanId: "2",
      satuanBarang: { id: "2", nama: "Kg" },
      stok: 8,
      stokMinimum: 15,
      createdAt: "2024-01-17",
    },
    {
      id: "4",
      kode: "BRG004",
      nama: "Lampu LED",
      kategoriId: 3,
      kategoriBarang: { id: 3, nama: "Aksesoris" },
      satuanId: "1",
      satuanBarang: { id: "1", nama: "Unit" },
      stok: 25,
      stokMinimum: 10,
      createdAt: "2024-01-18",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredBarang = barangList.filter(
    (barang) =>
      barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barang.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barang.kategoriBarang.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBarang) {
      setBarangList((prev) =>
        prev.map((b) =>
          b.id === editingBarang.id
            ? {
                ...b,
                ...formData,
                kategoriId: parseInt(formData.kategoriId),
                kategoriBarang:
                  kategoriList.find(
                    (k) => k.id === parseInt(formData.kategoriId)
                  ) || b.kategoriBarang,
                satuanBarang:
                  satuanList.find((s) => s.id === formData.satuanId) ||
                  b.satuanBarang,
              }
            : b
        )
      );
    } else {
      const newBarang: Barang = {
        id: Date.now().toString(),
        ...formData,
        kategoriId: parseInt(formData.kategoriId),
        kategoriBarang: kategoriList.find(
          (k) => k.id === parseInt(formData.kategoriId)
        ) || { id: 0, nama: "" },
        satuanBarang: satuanList.find((s) => s.id === formData.satuanId) || {
          id: "",
          nama: "",
        },
        createdAt: new Date().toISOString().split("T")[0],
      };
      setBarangList((prev) => [...prev, newBarang]);
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

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus barang ini?")) {
      setBarangList((prev) => prev.filter((b) => b.id !== id));
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
                      <Select
                        value={formData.kategoriId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            kategoriId: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {kategoriList.map((kategori) => (
                            <SelectItem
                              key={kategori.id}
                              value={kategori.id.toString()}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {kategori.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="satuanId"
                        className="text-slate-700 font-medium"
                      >
                        Satuan
                      </Label>
                      <Select
                        value={formData.satuanId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, satuanId: value }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih satuan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {satuanList.map((satuan) => (
                            <SelectItem
                              key={satuan.id}
                              value={satuan.id}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {satuan.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                {filteredBarang.length > 0 ? (
                  filteredBarang.map((barang) => {
                    const stockStatus = getStockStatus(
                      barang.stok,
                      barang.stokMinimum
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
                              onClick={() => handleDelete(barang.id)}
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
    </DashboardLayout>
  );
}
