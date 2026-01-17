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
import { Plus, Edit, Trash2, Search, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

interface KategoriBarang {
  id: number;
  nama: string;
}

interface Barang {
  id: string;
  kode: string;
  nama: string;
  kategoriId: number;
  kategoriBarang: KategoriBarang;
}

interface Supplier {
  id: string;
  kode: string;
  nama: string;
}

interface HargaBarang {
  id: string;
  barangId: string;
  barang: Barang;
  supplierId: string;
  supplier: Supplier;
  kategoriId: number;
  kategoriBarang: KategoriBarang;
  harga: number;
  adalahHargaTerbaik: boolean;
  createdAt: string;
}

export default function HargaBarangPage() {
  const [kategoriList] = useState<KategoriBarang[]>([
    { id: 1, nama: "Cat" },
    { id: 2, nama: "Besi" },
    { id: 3, nama: "Aksesoris" },
    { id: 4, nama: "Paku & Sekrup" },
  ]);

  const [barangList] = useState<Barang[]>([
    {
      id: "1",
      kode: "BRG001",
      nama: "Cat Semprot Hitam",
      kategoriId: 1,
      kategoriBarang: { id: 1, nama: "Cat" },
    },
    {
      id: "2",
      kode: "BRG002",
      nama: "Besi Hollow 4x4",
      kategoriId: 2,
      kategoriBarang: { id: 2, nama: "Besi" },
    },
    {
      id: "3",
      kode: "BRG003",
      nama: "Paku 10cm",
      kategoriId: 4,
      kategoriBarang: { id: 4, nama: "Paku & Sekrup" },
    },
    {
      id: "4",
      kode: "BRG004",
      nama: "Lampu LED",
      kategoriId: 3,
      kategoriBarang: { id: 3, nama: "Aksesoris" },
    },
  ]);

  const [supplierList] = useState<Supplier[]>([
    { id: "1", kode: "SUP001", nama: "Supplier ABC" },
    { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
    { id: "3", kode: "SUP003", nama: "Supplier Jaya" },
  ]);

  const [hargaList, setHargaList] = useState<HargaBarang[]>([
    {
      id: "1",
      barangId: "1",
      barang: {
        id: "1",
        kode: "BRG001",
        nama: "Cat Semprot Hitam",
        kategoriId: 1,
        kategoriBarang: { id: 1, nama: "Cat" },
      },
      supplierId: "1",
      supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
      kategoriId: 1,
      kategoriBarang: { id: 1, nama: "Cat" },
      harga: 150000,
      adalahHargaTerbaik: true,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      barangId: "1",
      barang: {
        id: "1",
        kode: "BRG001",
        nama: "Cat Semprot Hitam",
        kategoriId: 1,
        kategoriBarang: { id: 1, nama: "Cat" },
      },
      supplierId: "2",
      supplier: { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
      kategoriId: 1,
      kategoriBarang: { id: 1, nama: "Cat" },
      harga: 165000,
      adalahHargaTerbaik: false,
      createdAt: "2024-01-16",
    },
    {
      id: "3",
      barangId: "2",
      barang: {
        id: "2",
        kode: "BRG002",
        nama: "Besi Hollow 4x4",
        kategoriId: 2,
        kategoriBarang: { id: 2, nama: "Besi" },
      },
      supplierId: "1",
      supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
      kategoriId: 2,
      kategoriBarang: { id: 2, nama: "Besi" },
      harga: 75000,
      adalahHargaTerbaik: true,
      createdAt: "2024-01-17",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHarga, setEditingHarga] = useState<HargaBarang | null>(null);
  const [formData, setFormData] = useState({
    barangId: "",
    supplierId: "",
    harga: 0,
    adalahHargaTerbaik: false,
  });

  const filteredHarga = hargaList.filter(
    (harga) =>
      harga.barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harga.barang.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harga.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      harga.kategoriBarang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBarang = barangList.find((b) => b.id === formData.barangId);
    const selectedSupplier = supplierList.find(
      (s) => s.id === formData.supplierId
    );

    if (!selectedBarang || !selectedSupplier) return;

    if (editingHarga) {
      setHargaList((prev) =>
        prev.map((h) =>
          h.id === editingHarga.id
            ? {
                ...h,
                ...formData,
                barang: selectedBarang,
                supplier: selectedSupplier,
                kategoriId: selectedBarang.kategoriId,
                kategoriBarang: selectedBarang.kategoriBarang,
              }
            : h
        )
      );
    } else {
      const newHarga: HargaBarang = {
        id: Date.now().toString(),
        ...formData,
        barang: selectedBarang,
        supplier: selectedSupplier,
        kategoriId: selectedBarang.kategoriId,
        kategoriBarang: selectedBarang.kategoriBarang,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setHargaList((prev) => [...prev, newHarga]);
    }

    setFormData({
      barangId: "",
      supplierId: "",
      harga: 0,
      adalahHargaTerbaik: false,
    });
    setEditingHarga(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (harga: HargaBarang) => {
    setEditingHarga(harga);
    setFormData({
      barangId: harga.barangId,
      supplierId: harga.supplierId,
      harga: harga.harga,
      adalahHargaTerbaik: harga.adalahHargaTerbaik,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus harga ini?")) {
      setHargaList((prev) => prev.filter((h) => h.id !== id));
    }
  };

  const openAddDialog = () => {
    setEditingHarga(null);
    setFormData({
      barangId: "",
      supplierId: "",
      harga: 0,
      adalahHargaTerbaik: false,
    });
    setIsDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getBestPricesByCategory = () => {
    const bestPrices: { [key: number]: HargaBarang } = {};

    hargaList.forEach((harga) => {
      if (
        !bestPrices[harga.kategoriId] ||
        harga.harga < bestPrices[harga.kategoriId].harga
      ) {
        bestPrices[harga.kategoriId] = harga;
      }
    });

    return Object.values(bestPrices);
  };

  const bestPrices = getBestPricesByCategory();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Harga Barang
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen harga barang dan supplier.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Harga
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingHarga ? "Edit Harga" : "Tambah Harga Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingHarga
                      ? "Perbarui informasi harga barang di sini."
                      : "Isi form berikut untuk menambahkan harga barang baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
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
                            {barang.kode} - {barang.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="supplierId"
                      className="text-slate-700 font-medium"
                    >
                      Supplier
                    </Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, supplierId: value }))
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                        <SelectValue placeholder="Pilih supplier" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        {supplierList.map((supplier) => (
                          <SelectItem
                            key={supplier.id}
                            value={supplier.id}
                            className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                          >
                            {supplier.kode} - {supplier.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="harga"
                      className="text-slate-700 font-medium"
                    >
                      Harga
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        Rp
                      </span>
                      <Input
                        id="harga"
                        type="number"
                        value={formData.harga}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            harga: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        min="0"
                        placeholder="0"
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
                    {editingHarga ? "Simpan Perubahan" : "Buat Harga"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Harga Terbaik per Kategori */}
        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Star className="h-5 w-5 text-yellow-500" />
              Harga Terbaik per Kategori
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestPrices.map((harga) => (
                <div
                  key={harga.id}
                  className="p-4 border border-yellow-200 rounded-xl bg-yellow-50/50 hover:bg-yellow-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-white text-slate-600 border-slate-200"
                    >
                      {harga.kategoriBarang.nama}
                    </Badge>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="font-semibold text-slate-900">
                    {harga.barang.nama}
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    {harga.supplier.nama}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(harga.harga)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daftar Harga */}
        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Semua Harga Barang
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari harga barang..."
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
                    Barang
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kategori
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Supplier
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Harga
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
                {filteredHarga.length > 0 ? (
                  filteredHarga.map((harga) => (
                    <TableRow
                      key={harga.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {harga.barang.nama}
                          </p>
                          <p className="text-xs text-slate-500">
                            {harga.barang.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant="outline"
                          className="border-slate-200 text-slate-600 font-normal"
                        >
                          {harga.kategoriBarang.nama}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-700">
                            {harga.supplier.nama}
                          </p>
                          <p className="text-xs text-slate-500">
                            {harga.supplier.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 font-medium text-slate-900">
                        {formatCurrency(harga.harga)}
                      </TableCell>
                      <TableCell className="px-6">
                        {harga.adalahHargaTerbaik && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 shadow-none">
                            <Star className="mr-1 h-3 w-3" />
                            Terbaik
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(harga)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(harga.id)}
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
      </div>
    </DashboardLayout>
  );
}
