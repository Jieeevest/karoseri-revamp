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
} from "lucide-react";
import { useState } from "react";

interface Supplier {
  id: string;
  kode: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  createdAt: string;
}

export default function SupplierPage() {
  const [supplierList, setSupplierList] = useState<Supplier[]>([
    {
      id: "1",
      kode: "SUP001",
      nama: "Supplier ABC",
      alamat: "Jl. Industri No. 123, Jakarta",
      telepon: "021-12345678",
      email: "info@supplierabc.com",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      kode: "SUP002",
      nama: "Supplier XYZ",
      alamat: "Jl. Pabrik No. 456, Surabaya",
      telepon: "031-87654321",
      email: "contact@supplierxyz.com",
      createdAt: "2024-01-16",
    },
    {
      id: "3",
      kode: "SUP003",
      nama: "Supplier Jaya",
      alamat: "Jl. Raya No. 789, Bandung",
      telepon: "022-11223344",
      email: "sales@supplierjaya.com",
      createdAt: "2024-01-17",
    },
    {
      id: "4",
      kode: "SUP004",
      nama: "Supplier Makmur",
      alamat: "Jl. Gatot Subroto No. 100, Semarang",
      telepon: "024-55667788",
      email: "info@suppliermakmur.com",
      createdAt: "2024-01-18",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredSupplier = supplierList.filter(
    (supplier) =>
      supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.alamat?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSupplier) {
      setSupplierList((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id ? { ...s, ...formData } : s,
        ),
      );
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setSupplierList((prev) => [...prev, newSupplier]);
    }

    setFormData({ kode: "", nama: "", alamat: "", telepon: "", email: "" });
    setEditingSupplier(null);
    setIsDialogOpen(false);
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

    setSupplierList((prev) => prev.filter((s) => s.id !== deletingSupplier.id));
    setIsDeleteModalOpen(false);
    setDeletingSupplier(null);
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
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Supplier
              </Button>
            </DialogTrigger>
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
                    Kode
                  </TableHead>
                  <TableHead className="font-semibold text-slate-500">
                    Nama Supplier
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
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplier.length > 0 ? (
                  filteredSupplier.map((supplier) => (
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
