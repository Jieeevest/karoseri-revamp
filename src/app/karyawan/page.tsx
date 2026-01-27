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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  type Karyawan,
} from "@/hooks/use-karyawan";
import { useToast } from "@/hooks/use-toast";

export default function KaryawanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: karyawanList = [], refetch } = useKaryawan(searchTerm);
  const createKaryawan = useCreateKaryawan();
  const updateKaryawan = useUpdateKaryawan();
  const deleteKaryawan = useDeleteKaryawan();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null);
  const [formData, setFormData] = useState({
    nik: "",
    nama: "",
    jabatan: "",
    telepon: "",
    alamat: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    agama: "",
    statusPernikahan: "",
    pendidikanTerakhir: "",
    jurusan: "",
    tahunLulus: "",
    tanggalBergabung: "",
    statusKaryawan: "",
    namaBank: "",
    nomorRekening: "",
    pemilikRekening: "",
    kontakDaruratNama: "",
    kontakDaruratHubungan: "",
    kontakDaruratTelepon: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingKaryawan, setDeletingKaryawan] = useState<Karyawan | null>(
    null,
  );

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

    // Validate NIK
    if (!/^\d{16}$/.test(formData.nik)) {
      toast({
        title: "Input Tidak Valid",
        description: "NIK harus terdiri dari 16 digit angka.",
        variant: "destructive",
      });
      return;
    }

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

      setFormData({
        nik: "",
        nama: "",
        jabatan: "",
        telepon: "",
        alamat: "",
        tempatLahir: "",
        tanggalLahir: "",
        jenisKelamin: "",
        agama: "",
        statusPernikahan: "",
        pendidikanTerakhir: "",
        jurusan: "",
        tahunLulus: "",
        tanggalBergabung: "",
        statusKaryawan: "",
        namaBank: "",
        nomorRekening: "",
        pemilikRekening: "",
        kontakDaruratNama: "",
        kontakDaruratHubungan: "",
        kontakDaruratTelepon: "",
      });
      setEditingKaryawan(null);
      setIsDialogOpen(false);
      refetch();

      toast({
        title: editingKaryawan ? "Karyawan diperbarui" : "Karyawan ditambahkan",
        description: editingKaryawan
          ? "Data karyawan berhasil diperbarui."
          : "Karyawan baru berhasil ditambahkan.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error: any) {
      console.error("Failed to save karyawan", error);
      const errorMessage =
        error.response?.data?.error ||
        "Terjadi kesalahan saat menyimpan data karyawan.";
      toast({
        title: "Gagal menyimpan",
        description: errorMessage,
        variant: "destructive",
      });
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
      tempatLahir: karyawan.tempatLahir || "",
      tanggalLahir: karyawan.tanggalLahir
        ? new Date(karyawan.tanggalLahir).toISOString().split("T")[0]
        : "",
      jenisKelamin: karyawan.jenisKelamin || "",
      agama: karyawan.agama || "",
      statusPernikahan: karyawan.statusPernikahan || "",
      pendidikanTerakhir: karyawan.pendidikanTerakhir || "",
      jurusan: karyawan.jurusan || "",
      tahunLulus: karyawan.tahunLulus || "",
      tanggalBergabung: karyawan.tanggalBergabung
        ? new Date(karyawan.tanggalBergabung).toISOString().split("T")[0]
        : "",
      statusKaryawan: karyawan.statusKaryawan || "",
      namaBank: karyawan.namaBank || "",
      nomorRekening: karyawan.nomorRekening || "",
      pemilikRekening: karyawan.pemilikRekening || "",
      kontakDaruratNama: karyawan.kontakDaruratNama || "",
      kontakDaruratHubungan: karyawan.kontakDaruratHubungan || "",
      kontakDaruratTelepon: karyawan.kontakDaruratTelepon || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (karyawan: Karyawan) => {
    setDeletingKaryawan(karyawan);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingKaryawan) return;

    try {
      await deleteKaryawan.mutateAsync(deletingKaryawan.id);
      refetch();
      setIsDeleteModalOpen(false);
      setDeletingKaryawan(null);

      toast({
        title: "Karyawan dihapus",
        description: "Data karyawan berhasil dihapus.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Failed to delete karyawan", error);
      toast({
        title: "Gagal menghapus",
        description: "Gagal menghapus data karyawan.",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingKaryawan(null);
    setFormData({
      nik: "",
      nama: "",
      jabatan: "",
      telepon: "",
      alamat: "",
      tempatLahir: "",
      tanggalLahir: "",
      jenisKelamin: "",
      agama: "",
      statusPernikahan: "",
      pendidikanTerakhir: "",
      jurusan: "",
      tahunLulus: "",
      tanggalBergabung: "",
      statusKaryawan: "",
      namaBank: "",
      nomorRekening: "",
      pemilikRekening: "",
      kontakDaruratNama: "",
      kontakDaruratHubungan: "",
      kontakDaruratTelepon: "",
    });
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
            <DialogContent className="sm:max-w-[700px] h-[90vh] sm:h-auto rounded-xl border-slate-100 shadow-2xl flex flex-col">
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
                <ScrollArea className="flex-1 px-1 -mx-1">
                  <Tabs defaultValue="profil" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                      <TabsTrigger value="profil">Profil</TabsTrigger>
                      <TabsTrigger value="pribadi">Pribadi</TabsTrigger>
                      <TabsTrigger value="pekerjaan">Pekerjaan</TabsTrigger>
                      <TabsTrigger value="lainnya">Lainnya</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profil" className="space-y-4 py-2">
                      {/* Basic Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="nik">NIK</Label>
                          <Input
                            id="nik"
                            value={formData.nik}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                nik: e.target.value,
                              }))
                            }
                            maxLength={16}
                            required
                            placeholder="Nomor Induk Kependudukan"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="nama">Nama Lengkap</Label>
                          <Input
                            id="nama"
                            value={formData.nama}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                nama: e.target.value,
                              }))
                            }
                            required
                            placeholder="Nama Lengkap"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="jabatan">Jabatan</Label>
                          <Select
                            value={formData.jabatan}
                            onValueChange={(val) =>
                              setFormData((prev) => ({ ...prev, jabatan: val }))
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jabatan" />
                            </SelectTrigger>
                            <SelectContent>
                              {jabatanOptions.map((jab) => (
                                <SelectItem key={jab} value={jab}>
                                  {jab}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="telepon">Telepon / WA</Label>
                          <Input
                            id="telepon"
                            value={formData.telepon}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                telepon: e.target.value,
                              }))
                            }
                            placeholder="08xx-xxxx-xxxx"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="statusKaryawan">Status Karyawan</Label>
                        <Select
                          value={formData.statusKaryawan}
                          onValueChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              statusKaryawan: val,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tetap">Tetap</SelectItem>
                            <SelectItem value="Kontrak">Kontrak</SelectItem>
                            <SelectItem value="Magang">Magang</SelectItem>
                            <SelectItem value="Harian">Harian</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="pribadi" className="space-y-4 py-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                          <Input
                            id="tempatLahir"
                            value={formData.tempatLahir}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                tempatLahir: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                          <Input
                            id="tanggalLahir"
                            type="date"
                            value={formData.tanggalLahir}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                tanggalLahir: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                          <Select
                            value={formData.jenisKelamin}
                            onValueChange={(val) =>
                              setFormData((prev) => ({
                                ...prev,
                                jenisKelamin: val,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Jenis Kelamin" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Laki-laki">
                                Laki-laki
                              </SelectItem>
                              <SelectItem value="Perempuan">
                                Perempuan
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="agama">Agama</Label>
                          <Input
                            id="agama"
                            value={formData.agama}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                agama: e.target.value,
                              }))
                            }
                            placeholder="Islam, Kristen, dll"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="statusPernikahan">
                          Status Pernikahan
                        </Label>
                        <Select
                          value={formData.statusPernikahan}
                          onValueChange={(val) =>
                            setFormData((prev) => ({
                              ...prev,
                              statusPernikahan: val,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Belum Menikah">
                              Belum Menikah
                            </SelectItem>
                            <SelectItem value="Menikah">Menikah</SelectItem>
                            <SelectItem value="Cerai">Cerai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="pekerjaan" className="space-y-4 py-2">
                      <div className="grid gap-2">
                        <Label htmlFor="tanggalBergabung">
                          Tanggal Bergabung
                        </Label>
                        <Input
                          id="tanggalBergabung"
                          type="date"
                          value={formData.tanggalBergabung}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tanggalBergabung: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold mb-3">
                          Pendidikan Terakhir
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="grid gap-2">
                            <Label htmlFor="pendidikanTerakhir">Jenjang</Label>
                            <Select
                              value={formData.pendidikanTerakhir}
                              onValueChange={(val) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  pendidikanTerakhir: val,
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Jenjang" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="SD">SD</SelectItem>
                                <SelectItem value="SMP">SMP</SelectItem>
                                <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                                <SelectItem value="D3">D3</SelectItem>
                                <SelectItem value="S1">S1</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="tahunLulus">Tahun Lulus</Label>
                            <Input
                              id="tahunLulus"
                              value={formData.tahunLulus}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  tahunLulus: e.target.value,
                                }))
                              }
                              placeholder="20XX"
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="jurusan">Jurusan</Label>
                          <Input
                            id="jurusan"
                            value={formData.jurusan}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                jurusan: e.target.value,
                              }))
                            }
                            placeholder="Contoh: Teknik Mesin"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="lainnya" className="space-y-4 py-2">
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold">
                          Alamat Domisili
                        </h4>
                        <Textarea
                          id="alamat"
                          value={formData.alamat}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              alamat: e.target.value,
                            }))
                          }
                          rows={2}
                          placeholder="Alamat lengkap..."
                        />
                      </div>

                      <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold">Rekening Bank</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="namaBank">Nama Bank</Label>
                            <Input
                              id="namaBank"
                              value={formData.namaBank}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  namaBank: e.target.value,
                                }))
                              }
                              placeholder="BCA/Mandiri/..."
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="nomorRekening">
                              Nomor Rekening
                            </Label>
                            <Input
                              id="nomorRekening"
                              value={formData.nomorRekening}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  nomorRekening: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="pemilikRekening">Atas Nama</Label>
                          <Input
                            id="pemilikRekening"
                            value={formData.pemilikRekening}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                pemilikRekening: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-2 border-t">
                        <h4 className="text-sm font-semibold">
                          Kontak Darurat
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="kontakDaruratNama">
                              Nama Kontak
                            </Label>
                            <Input
                              id="kontakDaruratNama"
                              value={formData.kontakDaruratNama}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  kontakDaruratNama: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="kontakDaruratHubungan">
                              Hubungan
                            </Label>
                            <Input
                              id="kontakDaruratHubungan"
                              value={formData.kontakDaruratHubungan}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  kontakDaruratHubungan: e.target.value,
                                }))
                              }
                              placeholder="Orang Tua/Istri/..."
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="kontakDaruratTelepon">
                            Telepon Darurat
                          </Label>
                          <Input
                            id="kontakDaruratTelepon"
                            value={formData.kontakDaruratTelepon}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                kontakDaruratTelepon: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
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
                            onClick={() => handleDeleteClick(karyawan)}
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingKaryawan(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingKaryawan?.nama}
      />
    </DashboardLayout>
  );
}
