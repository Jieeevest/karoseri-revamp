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
import { Plus, Edit, Trash2, Search, Car } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

interface MerekKendaraan {
  id: string;
  nama: string;
  createdAt: string;
}

export default function MerekKendaraanPage() {
  const [merekList, setMerekList] = useState<MerekKendaraan[]>([
    { id: "1", nama: "Hino", createdAt: "2024-01-15" },
    { id: "2", nama: "Isuzu", createdAt: "2024-01-16" },
    { id: "3", nama: "Mitsubishi", createdAt: "2024-01-17" },
    { id: "4", nama: "Toyota", createdAt: "2024-01-18" },
    { id: "5", nama: "Suzuki", createdAt: "2024-01-19" },
    { id: "6", nama: "Daihatsu", createdAt: "2024-01-20" },
    { id: "7", nama: "Mercedes-Benz", createdAt: "2024-01-21" },
    { id: "8", nama: "Volvo", createdAt: "2024-01-22" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMerek, setEditingMerek] = useState<MerekKendaraan | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingMerek, setDeletingMerek] = useState<MerekKendaraan | null>(
    null,
  );

  const filteredMerek = merekList.filter((merek) =>
    merek.nama.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingMerek) {
      setMerekList((prev) =>
        prev.map((m) => (m.id === editingMerek.id ? { ...m, ...formData } : m)),
      );
    } else {
      const newMerek: MerekKendaraan = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setMerekList((prev) => [...prev, newMerek]);
    }

    setFormData({ nama: "" });
    setEditingMerek(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (merek: MerekKendaraan) => {
    setEditingMerek(merek);
    setFormData({
      nama: merek.nama,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (merek: MerekKendaraan) => {
    setDeletingMerek(merek);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMerek) return;
    setMerekList((prev) => prev.filter((m) => m.id !== deletingMerek.id));
    setIsDeleteModalOpen(false);
    setDeletingMerek(null);
  };

  const openAddDialog = () => {
    setEditingMerek(null);
    setFormData({ nama: "" });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Merek Kendaraan
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Master data merek kendaraan untuk sistem inventaris.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Merek
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingMerek ? "Edit Merek" : "Tambah Merek Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingMerek
                      ? "Perbarui informasi merek kendaraan di sini."
                      : "Isi form berikut untuk menambahkan merek kendaraan baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Merek
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
                      placeholder="Contoh: Hino, Isuzu, Mitsubishi"
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
                    {editingMerek ? "Simpan Perubahan" : "Buat Merek"}
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
                Daftar Merek Kendaraan
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari merek..."
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
                    Nama Merek
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
                {filteredMerek.length > 0 ? (
                  filteredMerek.map((merek, index) => (
                    <TableRow
                      key={merek.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 text-center text-slate-500">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-blue-600" />
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 rounded-md px-2.5 py-0.5 font-medium transition-colors"
                          >
                            {merek.nama}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-slate-500 text-sm">
                        {merek.createdAt}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(merek)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(merek)}
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
                      colSpan={4}
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
          setDeletingMerek(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingMerek?.nama}
        title="Hapus Merek Kendaraan"
        description="Apakah Anda yakin ingin menghapus merek kendaraan ini? Tindakan ini tidak dapat dibatalkan."
      />
    </DashboardLayout>
  );
}
