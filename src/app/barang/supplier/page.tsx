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
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building,
  Phone,
  Mail,
  MapPin,
  ArrowUpDown,
} from "lucide-react";
import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useSession } from "next-auth/react";

import { useToast } from "@/hooks/use-toast";
import {
  Supplier,
  useSupplier,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/hooks/use-supplier";

export default function SupplierPage() {
  const { data: session } = useSession();
  const isGudang = session?.user?.role === "GUDANG";

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null,
  );

  const { data: queryData, isLoading } = useSupplier({
    search: searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const supplierList = (queryData as any)?.data || [];
  const pagination = (queryData as any)?.pagination;

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
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
      if (editingSupplier) {
        await updateSupplier.mutateAsync({
          id: editingSupplier.id,
          ...formData,
        });
        toast({
          title: "Berhasil",
          description: "Data supplier berhasil diperbarui",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      } else {
        await createSupplier.mutateAsync(formData);
        toast({
          title: "Berhasil",
          description: "Supplier berhasil ditambahkan",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      }

      setFormData({ kode: "", nama: "", alamat: "", telepon: "", email: "" });
      setEditingSupplier(null);
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

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      kode: supplier.kode,
      nama: supplier.nama,
      alamat: supplier.alamat || "",
      telepon: supplier.telepon || "",
      email: supplier.email || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setDeletingSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSupplier) return;

    try {
      await deleteSupplier.mutateAsync(deletingSupplier.id);
      toast({
        title: "Berhasil",
        description: "Supplier berhasil dihapus",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      setIsDeleteModalOpen(false);
      setDeletingSupplier(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menghapus supplier",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingSupplier(null);
    setFormData({ kode: "", nama: "", alamat: "", telepon: "", email: "" });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Data Supplier
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen data supplier barang dan kontak.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {!isGudang && (
              <DialogTrigger asChild>
                <Button
                  onClick={openAddDialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Supplier
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[550px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingSupplier ? "Edit Supplier" : "Tambah Supplier Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingSupplier
                      ? "Perbarui informasi supplier di sini."
                      : "Isi form berikut untuk menambahkan supplier baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="kode"
                      className="text-slate-700 font-medium"
                    >
                      Kode Supplier
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
                      placeholder="Contoh: SUP001"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Supplier
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
                      placeholder="Contoh: Supplier ABC"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="alamat"
                      className="text-slate-700 font-medium"
                    >
                      Alamat Lengkap
                    </Label>
                    <Textarea
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          alamat: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder="Alamat lengkap supplier"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="telepon"
                        className="text-slate-700 font-medium"
                      >
                        Telepon
                      </Label>
                      <Input
                        id="telepon"
                        value={formData.telepon}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            telepon: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        placeholder="Contoh: 021-12345678"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-slate-700 font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        placeholder="Contoh: info@supplier.com"
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
                    {editingSupplier ? "Simpan Perubahan" : "Buat Supplier"}
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
                Daftar Supplier
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari supplier..."
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
                  <TableHead
                    className="font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("kode")}
                  >
                    <div className="flex items-center gap-2">
                      Kode
                      {sortBy === "kode" && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("nama")}
                  >
                    <div className="flex items-center gap-2">
                      Nama Supplier
                      {sortBy === "nama" && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Kontak
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Alamat
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Tanggal Dibuat
                  </TableHead>
                  {!isGudang && (
                    <TableHead className="px-6 text-center font-semibold text-slate-500">
                      Aksi
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierList.length > 0 ? (
                  supplierList.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium">
                        <Badge
                          variant="outline"
                          className="border-slate-200 text-slate-600 font-normal"
                        >
                          {supplier.kode}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-slate-900">
                            {supplier.nama}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="space-y-1">
                          {supplier.telepon && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {supplier.telepon}
                            </div>
                          )}
                          {supplier.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-slate-400" />
                              <span className="text-blue-600 hover:underline cursor-pointer">
                                {supplier.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        {supplier.alamat && (
                          <div className="flex items-start gap-2 text-sm max-w-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {supplier.alamat}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {supplier.createdAt}
                      </TableCell>
                      {!isGudang && (
                        <TableCell className="px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(supplier)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(supplier)}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-slate-500"
                    >
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            {pagination && (
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalData={pagination.total}
                limit={pagination.limit}
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
          setDeletingSupplier(null);
        }}
        onConfirm={async () => handleDeleteConfirm()}
        itemName={deletingSupplier?.nama}
      />
    </DashboardLayout>
  );
}
