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
import { Plus, Edit, Trash2, Search, Car } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

interface MerekKendaraan {
  id: string;
  nama: string;
}

interface TipeKendaraan {
  id: string;
  nama: string;
  merekId: string;
  merekKendaraan: MerekKendaraan;
  createdAt: string;
}

export default function TipeKendaraanPage() {
  const [merekList] = useState<MerekKendaraan[]>([
    { id: "1", nama: "Hino" },
    { id: "2", nama: "Isuzu" },
    { id: "3", nama: "Mitsubishi" },
    { id: "4", nama: "Toyota" },
    { id: "5", nama: "Suzuki" },
  ]);

  const [tipeList, setTipeList] = useState<TipeKendaraan[]>([
    {
      id: "1",
      nama: "Ranger",
      merekId: "1",
      merekKendaraan: { id: "1", nama: "Hino" },
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      nama: "Dutro",
      merekId: "2",
      merekKendaraan: { id: "2", nama: "Isuzu" },
      createdAt: "2024-01-16",
    },
    {
      id: "3",
      nama: "Elf",
      merekId: "2",
      merekKendaraan: { id: "2", nama: "Isuzu" },
      createdAt: "2024-01-17",
    },
    {
      id: "4",
      nama: "L300",
      merekId: "4",
      merekKendaraan: { id: "4", nama: "Mitsubishi" },
      createdAt: "2024-01-18",
    },
    {
      id: "5",
      nama: "Colt Diesel",
      merekId: "4",
      merekKendaraan: { id: "4", nama: "Mitsubishi" },
      createdAt: "2024-01-19",
    },
    {
      id: "6",
      nama: "Great Dyna",
      merekId: "4",
      merekKendaraan: { id: "4", nama: "Toyota" },
      createdAt: "2024-01-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTipe, setEditingTipe] = useState<TipeKendaraan | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    merekId: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTipe, setDeletingTipe] = useState<TipeKendaraan | null>(null);

  const filteredTipe = tipeList.filter(
    (tipe) =>
      tipe.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipe.merekKendaraan.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTipe) {
      setTipeList((prev) =>
        prev.map((t) =>
          t.id === editingTipe.id
            ? {
                ...t,
                ...formData,
                merekKendaraan:
                  merekList.find((m) => m.id === formData.merekId) ||
                  t.merekKendaraan,
              }
            : t,
        ),
      );
    } else {
      const newTipe: TipeKendaraan = {
        id: Date.now().toString(),
        ...formData,
        merekKendaraan: merekList.find((m) => m.id === formData.merekId) || {
          id: "",
          nama: "",
        },
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTipeList((prev) => [...prev, newTipe]);
    }

    setFormData({ nama: "", merekId: "" });
    setEditingTipe(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (tipe: TipeKendaraan) => {
    setEditingTipe(tipe);
    setFormData({
      nama: tipe.nama,
      merekId: tipe.merekId,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (tipe: TipeKendaraan) => {
    setDeletingTipe(tipe);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTipe) return;
    setTipeList((prev) => prev.filter((t) => t.id !== deletingTipe.id));
    setIsDeleteModalOpen(false);
    setDeletingTipe(null);
  };

  const openAddDialog = () => {
    setEditingTipe(null);
    setFormData({ nama: "", merekId: "" });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tipe Kendaraan
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Master data tipe kendaraan untuk sistem inventaris.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Tipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingTipe
                      ? "Edit Tipe Kendaraan"
                      : "Tambah Tipe Kendaraan Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingTipe
                      ? "Perbarui informasi tipe kendaraan di sini."
                      : "Isi form berikut untuk menambahkan tipe kendaraan baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
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
                        setFormData((prev) => ({ ...prev, merekId: value }))
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                        <SelectValue placeholder="Pilih merek kendaraan" />
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
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Tipe
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
                      placeholder="Contoh: Ranger, Dutro, Elf"
                      required
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
                    {editingTipe ? "Simpan Perubahan" : "Buat Tipe"}
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
                Daftar Tipe Kendaraan
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari tipe kendaraan..."
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
                    Merek
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Tipe Kendaraan
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
                {filteredTipe.length > 0 ? (
                  filteredTipe.map((tipe, index) => (
                    <TableRow
                      key={tipe.id}
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
                          {tipe.merekKendaraan.nama}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 font-medium">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">{tipe.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-slate-500 text-sm">
                        {tipe.createdAt}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(tipe)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(tipe)}
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
          setDeletingTipe(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingTipe?.nama}
        title="Hapus Tipe Kendaraan"
        description="Apakah Anda yakin ingin menghapus tipe kendaraan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </DashboardLayout>
  );
}
