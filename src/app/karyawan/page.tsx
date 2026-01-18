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
  Users,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useKaryawan,
  useCreateKaryawan,
  useUpdateKaryawan,
  useDeleteKaryawan,
} from "@/hooks/use-karyawan";

interface Karyawan {
  id: string;
  nik: string;
  nama: string;
  jabatan: string;
  telepon?: string;
  alamat?: string;
  createdAt: string;
}

export default function KaryawanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: karyawanList = [], refetch } = useKaryawan(searchTerm);
  const createKaryawan = useCreateKaryawan();
  const updateKaryawan = useUpdateKaryawan();
  const deleteKaryawan = useDeleteKaryawan();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null);
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    jabatan: "",
    telepon: "",
    alamat: "",
  });

  const jabatanOptions = [
    "Tukang Rakit",
    "Tukang Cat",
    "Tukang Aksesoris",
    "Supervisor",
    "Admin",
    "Security",
    "Driver",
  ];

  /* Filtering done via hook */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingKaryawan) {
        await updateKaryawan.mutateAsync({
          id: editingKaryawan.id,
          ...formData,
        });
      } else {
        await createKaryawan.mutateAsync({
          ...formData,
        });
      }

      setFormData({ nik: "", nama: "", jabatan: "", telepon: "", alamat: "" });
      setEditingKaryawan(null);
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Failed to save karyawan", error);
      alert("Gagal menyimpan data karyawan");
    }
  };

  const handleEdit = (karyawan: Karyawan) => {
    setEditingKaryawan(karyawan);
    setFormData({
      nik: karyawan.nik,
      nama: karyawan.nama,
      jabatan: karyawan.jabatan,
      telepon: karyawan.telepon || "",
      alamat: karyawan.alamat || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data karyawan ini?")) {
      try {
        await deleteKaryawan.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Failed to delete karyawan", error);
        alert("Gagal menghapus karyawan");
      }
    }
  };

  const openAddDialog = () => {
    setEditingKaryawan(null);
    setFormData({ nik: "", nama: "", jabatan: "", telepon: "", alamat: "" });
    setIsDialogOpen(true);
  };

  const getJabatanBadge = (jabatan: string) => {
    const jabatanConfig = {
      "Tukang Rakit": { color: "bg-blue-100 text-blue-800" },
      "Tukang Cat": { color: "bg-green-100 text-green-800" },
      "Tukang Aksesoris": { color: "bg-purple-100 text-purple-800" },
      Supervisor: { color: "bg-orange-100 text-orange-800" },
      Admin: { color: "bg-slate-100 text-slate-800" },
      Security: { color: "bg-red-100 text-red-800" },
      Driver: { color: "bg-yellow-100 text-yellow-800" },
    };

    const config =
      jabatanConfig[jabatan as keyof typeof jabatanConfig] ||
      jabatanConfig["Tukang Rakit"];
    return (
      <Badge variant="secondary" className={cn("font-medium", config.color)}>
        {jabatan}
      </Badge>
    );
  };

  const getStatsByJabatan = () => {
    const stats: { [key: string]: number } = {};
    karyawanList.forEach((k) => {
      stats[k.jabatan] = (stats[k.jabatan] || 0) + 1;
    });
    return stats;
  };

  const jabatanStats = getStatsByJabatan();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Manajemen Karyawan
            </h1>
            <p className="text-sm text-slate-500">
              Data karyawan dan informasi kontak
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Karyawan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingKaryawan ? "Edit Karyawan" : "Tambah Karyawan Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingKaryawan
                      ? "Edit data karyawan yang sudah ada."
                      : "Isi form berikut untuk menambahkan karyawan baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label htmlFor="nik" className="text-slate-700 font-medium">
                      NIK
                    </Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nik: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder="Nomor Induk Kependudukan"
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Lengkap
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
                      placeholder="Nama lengkap karyawan"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="jabatan"
                        className="text-slate-700 font-medium"
                      >
                        Jabatan
                      </Label>
                      <Select
                        value={formData.jabatan}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, jabatan: value }))
                        }
                        required
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih jabatan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {jabatanOptions.map((jab) => (
                            <SelectItem
                              key={jab}
                              value={jab}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {jab}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                        placeholder="08xx-xxxx-xxxx"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="alamat"
                      className="text-slate-700 font-medium"
                    >
                      Alamat
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
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 resize-none"
                      placeholder="Alamat lengkap karyawan"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
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
                    {editingKaryawan ? "Simpan Perubahan" : "Simpan Karyawan"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Karyawan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {karyawanList.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(jabatanStats)
            .slice(0, 3)
            .map(([jabatan, count]) => (
              <Card
                key={jabatan}
                className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        {jabatan}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">
                        {count}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Briefcase className="h-6 w-6 text-slate-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Karyawan
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari karyawan..."
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
                    NIK
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Nama
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Jabatan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kontak
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
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
                {karyawanList.length > 0 ? (
                  karyawanList.map((karyawan) => (
                    <TableRow
                      key={karyawan.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        {karyawan.nik}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                            <span className="text-blue-700 text-xs font-bold">
                              {karyawan.nama
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-slate-900">
                            {karyawan.nama}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        {getJabatanBadge(karyawan.jabatan)}
                      </TableCell>
                      <TableCell className="px-6">
                        {karyawan.telepon ? (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {karyawan.telepon}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-sm">
                            Tidak ada
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6">
                        {karyawan.alamat ? (
                          <div className="flex items-start gap-2 text-sm max-w-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {karyawan.alamat}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-sm">
                            Tidak ada
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600 text-sm">
                        {karyawan.createdAt}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(karyawan)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(karyawan.id)}
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
