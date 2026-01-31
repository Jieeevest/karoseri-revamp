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
import { Plus, Calculator, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  Project,
} from "@/hooks/use-project";
import { useCustomer } from "@/hooks/use-customer";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

import { PaginationControls } from "@/components/ui/pagination-controls"; // Import Added

export default function ProjectPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // Pagination & Sort State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: projectData, refetch } = useProject({
    page,
    limit,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const projects = projectData?.data || [];
  const pagination = projectData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };
  const { data: customers = [] } = useCustomer();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    customerId: "",
    deskripsi: "",
    quantity: 1,
    hargaPerUnit: 0,
    status: "OFFER",
    specs: {
      panjang: 0,
      lebar: 0,
      tinggi: 0,
      pintuSamping: 0,
    },
  });

  // Smart Planning Calculation
  const calculateMaterials = () => {
    // Basic logic for demonstration
    // Assume 1 sheet of plat for every 3m^2 surface area
    // Assume 10 bars of besi for frame per unit
    const surfaceArea =
      2 *
      (formData.specs.panjang * formData.specs.lebar +
        formData.specs.panjang * formData.specs.tinggi +
        formData.specs.lebar * formData.specs.tinggi); // in mm^2
    const platSheets = Math.ceil(surfaceArea / 1000000 / 3) * formData.quantity;
    const besiBars = 20 * formData.quantity; // Simplification

    return { platSheets, besiBars };
  };

  const estimates = calculateMaterials();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          id: editingProject.id,
          ...formData,
          status: formData.status as any,
          totalHarga: formData.quantity * formData.hargaPerUnit,
        });
        toast({
          title: "Project Diperbarui",
          description: "Data project berhasil diperbarui.",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        await createProject.mutateAsync({
          ...formData,
          status: formData.status as any,
          totalHarga: formData.quantity * formData.hargaPerUnit,
        });
        toast({
          title: "Project Dibuat",
          description: "Data project/penawaran berhasil dibuat.",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error("Failed to save project", error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan data project.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      customerId: "",
      deskripsi: "",
      quantity: 1,
      hargaPerUnit: 0,
      status: "OFFER",
      specs: { panjang: 0, lebar: 0, tinggi: 0, pintuSamping: 0 },
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      customerId: project.customerId,
      deskripsi: project.deskripsi,
      quantity: project.quantity,
      hargaPerUnit: project.hargaPerUnit,
      status: project.status,
      specs: {
        panjang: project.specs?.panjang || 0,
        lebar: project.specs?.lebar || 0,
        tinggi: project.specs?.tinggi || 0,
        pintuSamping: project.specs?.pintuSamping || 0,
      },
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      await deleteProject.mutateAsync(deletingProject.id);
      toast({
        title: "Project Dihapus",
        description: "Data project berhasil dihapus.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      refetch();
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error || "Gagal menghapus project.";
      toast({
        title: "Gagal Menghapus",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Project & Estimasi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen penawaran project dan fitur Smart Planning.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Buat Penawaran Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] rounded-xl border-slate-100 shadow-2xl overflow-y-auto max-h-[90vh]">
              <form onSubmit={handleSubmit}>
                <DialogHeader className="border-b border-slate-100 pb-4">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingProject
                      ? "Edit Penawaran"
                      : "Smart Planning: Penawaran Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingProject
                      ? "Perbarui informasi penawaran project."
                      : "Masukkan spesifikasi untuk kalkulasi otomatis kebutuhan material."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Customer</Label>
                      <Select
                        value={formData.customerId}
                        onValueChange={(val) =>
                          setFormData({ ...formData, customerId: val })
                        }
                      >
                        <SelectTrigger className="rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih Customer" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {customers.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Judul Project</Label>
                      <Input
                        value={formData.deskripsi}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deskripsi: e.target.value,
                          })
                        }
                        placeholder="Contoh: Wing Box Hydraulic"
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Jumlah Unit</Label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Harga Per Unit (Rp)</Label>
                      <Input
                        type="number"
                        value={formData.hargaPerUnit}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hargaPerUnit: parseInt(e.target.value) || 0,
                          })
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>

                  {/* Status Selection (Only for Edit) */}
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) =>
                        setFormData({ ...formData, status: val })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                        <SelectItem value="OFFER">Offer</SelectItem>
                        <SelectItem value="DEAL">Deal</SelectItem>
                        <SelectItem value="ON_PROGRESS">On Progress</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Specs Input */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center">
                      <Calculator className="w-4 h-4 mr-2" /> Spesifikasi Teknis
                      (mm)
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label>Panjang</Label>
                        <Input
                          type="number"
                          value={formData.specs.panjang}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specs: {
                                ...formData.specs,
                                panjang: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-white rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Lebar</Label>
                        <Input
                          type="number"
                          value={formData.specs.lebar}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specs: {
                                ...formData.specs,
                                lebar: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-white rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Tinggi</Label>
                        <Input
                          type="number"
                          value={formData.specs.tinggi}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              specs: {
                                ...formData.specs,
                                tinggi: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="bg-white rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Smart Output */}
                  {formData.specs.panjang > 0 && formData.quantity > 0 && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Estimasi Material (Otomatis)
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                        <div className="flex justify-between border-b border-blue-200 pb-1">
                          <span>Plat Besi (Lembar):</span>
                          <span className="font-bold">
                            {estimates.platSheets}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-blue-200 pb-1">
                          <span>Besi UNP (Batang):</span>
                          <span className="font-bold">
                            {estimates.besiBars}
                          </span>
                        </div>
                        <div className="col-span-2 pt-2 text-xs text-blue-600">
                          *Estimasi kasar berdasarkan dimensi input. Selalu
                          verifikasi manual.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 pt-4 border-t border-slate-100">
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
                    {editingProject ? "Simpan Perubahan" : "Simpan Penawaran"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Table */}
        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Project Active
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Input
                  placeholder="Cari project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100">
                  <TableHead className="px-6 font-semibold text-slate-500">
                    No. SPK / Penawaran
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (sortBy === "customer.nama") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("customer.nama");
                          setSortOrder("asc");
                        }
                      }}
                      className="p-0 hover:bg-transparent font-semibold text-slate-500"
                    >
                      Customer
                      {sortBy === "customer.nama" && (
                        <span className="ml-1 text-slate-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (sortBy === "deskripsi") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("deskripsi");
                          setSortOrder("asc");
                        }
                      }}
                      className="p-0 hover:bg-transparent font-semibold text-slate-500"
                    >
                      Deskripsi
                      {sortBy === "deskripsi" && (
                        <span className="ml-1 text-slate-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (sortBy === "totalHarga") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("totalHarga");
                          setSortOrder("asc");
                        }
                      }}
                      className="p-0 hover:bg-transparent font-semibold text-slate-500"
                    >
                      Nilai Project
                      {sortBy === "totalHarga" && (
                        <span className="ml-1 text-slate-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (sortBy === "status") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("status");
                          setSortOrder("asc");
                        }
                      }}
                      className="p-0 hover:bg-transparent font-semibold text-slate-500"
                    >
                      Status
                      {sortBy === "status" && (
                        <span className="ml-1 text-slate-400">
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        {project.nomor}
                      </TableCell>
                      <TableCell className="px-6">
                        {project.customer.nama}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="text-slate-900">
                          {project.deskripsi}
                        </div>
                        <div className="text-xs text-slate-500">
                          {project.specs?.panjang
                            ? `${project.specs?.panjang}x${project.specs?.lebar}x${project.specs?.tinggi} mm`
                            : ""}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="font-medium text-slate-900">
                          Rp {project.totalHarga.toLocaleString("id-ID")}
                        </div>
                        <div className="text-xs text-slate-500">
                          {project.quantity} Unit
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant={
                            project.status === "DEAL" ? "default" : "secondary"
                          }
                          className={
                            project.status === "DEAL"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200 shadow-none"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(project)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(project)}
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
                      Belum ada project.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalData={pagination.total}
              limit={pagination.limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProject(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingProject?.nomor}
        title="Hapus Project"
      />
    </DashboardLayout>
  );
}
