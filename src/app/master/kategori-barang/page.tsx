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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import {
  KategoriBarang,
  useKategoriBarang,
  useCreateKategoriBarang,
  useUpdateKategoriBarang,
  useDeleteKategoriBarang,
} from "@/hooks/use-master";

export default function KategoriBarangPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState<KategoriBarang | null>(
    null,
  );
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
  });

  // Hooks
  const { data: kategoriList = [], isLoading } = useKategoriBarang();
  const createKategori = useCreateKategoriBarang();
  const updateKategori = useUpdateKategoriBarang();
  const deleteKategori = useDeleteKategoriBarang();

  const filteredKategori = kategoriList.filter(
    (kategori) =>
      kategori.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kategori.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingKategori) {
        await updateKategori.mutateAsync({
          id: editingKategori.id,
          ...formData,
        });
      } else {
        await createKategori.mutateAsync(formData);
      }

      setFormData({ nama: "", deskripsi: "" });
      setEditingKategori(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save kategori", error);
      alert("Gagal menyimpan kategori barang");
    }
  };

  const handleEdit = (kategori: KategoriBarang) => {
    setEditingKategori(kategori);
    setFormData({
      nama: kategori.nama,
      deskripsi: kategori.deskripsi || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      try {
        await deleteKategori.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete kategori", error);
        alert("Gagal menghapus kategori barang (mungkin sedang digunakan)");
      }
    }
  };

  const openAddDialog = () => {
    setEditingKategori(null);
    setFormData({ nama: "", deskripsi: "" });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Kategori Barang
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen master data kategori barang untuk sistem inventaris.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingKategori ? "Edit Kategori" : "Tambah Kategori Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingKategori
                      ? "Perbarui informasi kategori barang di sini."
                      : "Isi form berikut untuk menambahkan kategori baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Kategori
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
                      placeholder="Contoh: Sparepart Mesin"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="deskripsi"
                      className="text-slate-700 font-medium"
                    >
                      Deskripsi
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
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 min-h-[100px]"
                      placeholder="Tambahkan keterangan detail kategori..."
                    />
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
                    {editingKategori ? "Simpan Perubahan" : "Buat Kategori"}
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
                Daftar Kategori
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari kategori..."
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
                  <TableHead className="w-[50px] text-center font-semibold text-slate-500">
                    No
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Nama Kategori
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Deskripsi
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Tanggal Dibuat
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKategori.length > 0 ? (
                  filteredKategori.map((kategori, index) => (
                    <TableRow
                      key={kategori.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 text-center text-slate-500">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 rounded-md px-2.5 py-0.5 font-medium transition-colors"
                        >
                          {kategori.nama}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-slate-600 max-w-xs truncate">
                        {kategori.deskripsi || (
                          <span className="text-slate-400 italic">
                            Tidak ada deskripsi
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-slate-500 text-sm">
                        {kategori.createdAt
                          ? new Date(kategori.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(kategori)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(kategori.id)}
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
                      colSpan={5}
                      className="h-24 text-center text-slate-500"
                    >
                      {isLoading ? "Memuat data..." : "Data tidak ditemukan."}
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
