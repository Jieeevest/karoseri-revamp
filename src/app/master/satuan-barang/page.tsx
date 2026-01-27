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
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

import { useToast } from "@/hooks/use-toast";
import {
  SatuanBarang,
  useSatuanBarang,
  useCreateSatuanBarang,
  useUpdateSatuanBarang,
  useDeleteSatuanBarang,
} from "@/hooks/use-master";

import { PaginationControls } from "@/components/ui/pagination-controls";
import { ArrowUpDown } from "lucide-react";

export default function SatuanBarangPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSatuan, setEditingSatuan] = useState<SatuanBarang | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSatuan, setDeletingSatuan] = useState<SatuanBarang | null>(
    null,
  );

  const { data: queryData, isLoading } = useSatuanBarang({
    page,
    limit,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const createSatuan = useCreateSatuanBarang();
  const updateSatuan = useUpdateSatuanBarang();
  const deleteSatuan = useDeleteSatuanBarang();
  const { toast } = useToast();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSatuan) {
        await updateSatuan.mutateAsync({
          id: editingSatuan.id,
          ...formData,
        });
        toast({
          title: "Berhasil",
          description: "Satuan barang berhasil diperbarui",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      } else {
        await createSatuan.mutateAsync(formData);
        toast({
          title: "Berhasil",
          description: "Satuan barang berhasil ditambahkan",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      }

      setFormData({ nama: "" });
      setEditingSatuan(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (satuan: SatuanBarang) => {
    setEditingSatuan(satuan);
    setFormData({
      nama: satuan.nama,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (satuan: SatuanBarang) => {
    setDeletingSatuan(satuan);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSatuan) return;

    try {
      await deleteSatuan.mutateAsync(deletingSatuan.id);
      toast({
        title: "Berhasil",
        description: "Satuan barang berhasil dihapus",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      setIsDeleteModalOpen(false);
      setDeletingSatuan(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menghapus satuan barang",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingSatuan(null);
    setFormData({ nama: "" });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Satuan Barang
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Master data satuan barang untuk sistem inventaris.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Satuan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingSatuan ? "Edit Satuan" : "Tambah Satuan Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingSatuan
                      ? "Perbarui informasi satuan barang di sini."
                      : "Isi form berikut untuk menambahkan satuan barang baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Satuan
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
                      placeholder="Contoh: Kg, Liter, Unit"
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
                    {editingSatuan ? "Simpan Perubahan" : "Buat Satuan"}
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
                Daftar Satuan Barang
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari satuan..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
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
                  <TableHead
                    className="px-6 font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("nama")}
                  >
                    <div className="flex items-center gap-2">
                      Nama Satuan
                      {sortBy === "nama" && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="px-6 font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Tanggal Dibuat
                      {sortBy === "createdAt" && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-slate-500"
                    >
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : queryData?.data && queryData.data.length > 0 ? (
                  queryData.data.map((satuan, index) => (
                    <TableRow
                      key={satuan.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 text-center text-slate-500">
                        {index + 1 + (page - 1) * limit}
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 rounded-md px-2.5 py-0.5 font-medium transition-colors"
                        >
                          {satuan.nama}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-slate-500 text-sm">
                        {satuan.createdAt
                          ? new Date(satuan.createdAt).toLocaleDateString(
                              "id-ID",
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(satuan)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(satuan)}
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

            {queryData?.pagination && (
              <PaginationControls
                currentPage={queryData.pagination.page}
                totalPages={queryData.pagination.totalPages}
                totalData={queryData.pagination.total}
                limit={queryData.pagination.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSatuan(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingSatuan?.nama}
        title="Hapus Satuan Barang"
        description="Apakah Anda yakin ingin menghapus satuan barang ini? Tindakan ini tidak dapat dibatalkan."
      />
    </DashboardLayout>
  );
}
