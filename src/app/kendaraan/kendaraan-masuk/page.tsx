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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Car,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  kode: string;
  nama: string;
}

interface Kendaraan {
  id: string;
  nomorPolisi: string;
  merek: string;
  tipe: string;
  projectId?: string;
  project?: Project;
}

interface Project {
  id: string;
  nomor: string;
  deskripsi: string;
}

interface Pengerjaan {
  id: string;
  jenis: string;
  deskripsi?: string;
}

interface KelengkapanAlat {
  id: string;
  area: string;
  nama: string;
  jumlah?: number;
  kondisi: string;
  deskripsi?: string;
}

interface KendaraanMasuk {
  id: string;
  nomor: string;
  tanggalMasuk: string;
  showroom: string;
  customerId: string;
  customer: Customer;
  kendaraanId: string;
  kendaraan: Kendaraan;
  pengerjaan: Pengerjaan[];
  kelengkapan: KelengkapanAlat[];
  createdAt: string;
}

const mockProjects: Project[] = [
  { id: "1", nomor: "SPK-2024-001", deskripsi: "Wing Box Hydraulic - 5 Unit" },
  { id: "2", nomor: "SPK-2024-002", deskripsi: "Box Besi Standart - 3 Unit" },
];

const pengerjaanOptions = [
  "Wing Box",
  "Wing Box + Topi Kabin Fiber",
  "Wing Box + Topi Kabin Fiber + Logo",
  "Wing Box + Topi Kabin Fiber + Logo + Repaint Kabin",
  "Wing Box + Logo",
  "Wing Box + Logo + Repaint Kabin",
  "Wing Box + Repaint Kabin",
  "Box Besi Standart",
  "Box Besi Pintu Samping (2 Daun)",
  "Box Besi Pintu Samping (4 Daun)",
  "Box Besi Pintu Samping (6 Daun)",
  "Box Besi Pintu Samping (8 Daun)",
  "Bak Besi",
  "Trailer Base 40 Feet",
  "Trailer Base 45 Feet",
  "Trailer Wing Box 40 Feet",
  "Trailer Wing Box 45 Feet",
  "Topi Kabin Fiber",
  "Logo",
  "Repaint Kabin",
  "Repaint Badan Kendaraan",
];

const kelengkapanTemplate = [
  // Area Kepala Truk
  { area: "Area Kepala Truk", nama: "Kaca Spion", jumlah: 2, kondisi: "baik" },
  {
    area: "Area Kepala Truk",
    nama: "Tutup Tangki Solar",
    jumlah: 1,
    kondisi: "baik",
  },
  { area: "Area Kepala Truk", nama: "Kaca Depan", jumlah: 1, kondisi: "baik" },
  { area: "Area Kepala Truk", nama: "Lampu Depan", jumlah: 2, kondisi: "baik" },
  { area: "Area Kepala Truk", nama: "Lampu Kabut", jumlah: 2, kondisi: "baik" },
  {
    area: "Area Kepala Truk",
    nama: "Pintu Kabin bagian Kiri",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Kepala Truk",
    nama: "Kaca Pintu Samping Kiri",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Kepala Truk",
    nama: "Lampu Sen bagian Kiri",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Kepala Truk",
    nama: "Pintu Kabin bagian Kanan",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Kepala Truk",
    nama: "Kaca Pintu Samping Kanan",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Kepala Truk",
    nama: "Lampu Sen Bagian Kanan",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Kepala Truk",
    nama: "Kunci Kontak",
    jumlah: 1,
    kondisi: "baik",
  },
  { area: "Area Kepala Truk", nama: "Sunvisor", jumlah: 1, kondisi: "baik" },
  { area: "Area Kepala Truk", nama: "Radio/Tape", jumlah: 1, kondisi: "baik" },
  {
    area: "Area Kepala Truk",
    nama: "Lighter/Korek Api",
    jumlah: 1,
    kondisi: "baik",
  },
  { area: "Area Kepala Truk", nama: "Karpet Roda", jumlah: 2, kondisi: "baik" },
  {
    area: "Area Kepala Truk",
    nama: "Karpet Dalam Kabin",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Kepala Truk",
    nama: "Segitiga Pengaman",
    jumlah: 1,
    kondisi: "baik",
  },
  { area: "Area Kepala Truk", nama: "Safety Belt", jumlah: 2, kondisi: "baik" },
  {
    area: "Area Kepala Truk",
    nama: "Kursi Supir dan Kenek",
    jumlah: 2,
    kondisi: "baik",
  },
  { area: "Area Kepala Truk", nama: "AC", jumlah: 1, kondisi: "baik" },
  // Area Badan Truck
  {
    area: "Area Badan Truck",
    nama: "Accu dan Tutupnya",
    jumlah: 1,
    kondisi: "baik",
  },
  {
    area: "Area Badan Truck",
    nama: "Kamera Parkir",
    jumlah: 1,
    kondisi: "baik",
  },
  { area: "Area Badan Truck", nama: "Ban Serep", jumlah: 1, kondisi: "baik" },
  {
    area: "Area Badan Truck",
    nama: "Roda dan Ban Bagian kiri-depan",
    jumlah: 2,
    kondisi: "baik",
  },
  {
    area: "Area Badan Truck",
    nama: "Roda dan Ban Bagian kiri-belakang",
    jumlah: 4,
    kondisi: "baik",
  },
  {
    area: "Area Badan Truck",
    nama: "Roda dan Ban Bagian kanan-depan",
    jumlah: 2,
    kondisi: "baik",
  },
  {
    area: "Area Badan Truck",
    nama: "Roda dan Ban Bagian kanan-belakang",
    jumlah: 4,
    kondisi: "baik",
  },
  {
    area: "Area Badan Truck",
    nama: "Lampu Stop Bagian Belakang",
    jumlah: 2,
    kondisi: "baik",
  },
  // Lainnya
  { area: "Lainnya", nama: "Stang Dongkrak", jumlah: 1, kondisi: "baik" },
  { area: "Lainnya", nama: "Dongkrak", jumlah: 1, kondisi: "baik" },
  { area: "Lainnya", nama: "Toolsheet lainnya", jumlah: 1, kondisi: "baik" },
  { area: "Lainnya", nama: "Buku Petunjuk", jumlah: 1, kondisi: "baik" },
  { area: "Lainnya", nama: "Buku Service", jumlah: 1, kondisi: "baik" },
];

export default function KendaraanMasukPage() {
  const [customerList] = useState<Customer[]>([
    { id: "1", kode: "CUS001", nama: "PT. Maju Bersama" },
    { id: "2", kode: "CUS002", nama: "CV. Jaya Transport" },
    { id: "3", kode: "CUS003", nama: "PT. Logistik Indonesia" },
  ]);

  const [kendaraanMasukList, setKendaraanMasukList] = useState<
    KendaraanMasuk[]
  >([
    {
      id: "1",
      nomor: "KM-2024-001",
      tanggalMasuk: "2024-01-15",
      showroom: "Showroom Utama",
      customerId: "1",
      customer: { id: "1", kode: "CUS001", nama: "PT. Maju Bersama" },
      kendaraanId: "1",
      kendaraan: {
        id: "1",
        nomorPolisi: "B 1234 ABC",
        merek: "Hino",
        tipe: "Ranger",
      },
      pengerjaan: [
        {
          id: "1",
          jenis: "Wing Box",
          deskripsi: "Ukuran standar dengan pintu samping",
        },
        { id: "2", jenis: "Logo", deskripsi: "Logo perusahaan di samping" },
      ],
      kelengkapan: kelengkapanTemplate.slice(0, 10).map((item, index) => ({
        ...item,
        id: `k1-${index}`,
        deskripsi: "",
      })),
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      nomor: "KM-2024-002",
      tanggalMasuk: "2024-01-16",
      showroom: "Showroom Cabang",
      customerId: "2",
      customer: { id: "2", kode: "CUS002", nama: "CV. Jaya Transport" },
      kendaraanId: "2",
      kendaraan: {
        id: "2",
        nomorPolisi: "B 5678 DEF",
        merek: "Isuzu",
        tipe: "Dutro",
      },
      pengerjaan: [
        {
          id: "3",
          jenis: "Box Besi Standart",
          deskripsi: "Box besi tanpa pintu samping",
        },
        {
          id: "4",
          jenis: "Repaint Kabin",
          deskripsi: "Cat ulang kabin warna biru",
        },
      ],
      kelengkapan: kelengkapanTemplate.slice(0, 15).map((item, index) => ({
        ...item,
        id: `k2-${index}`,
        deskripsi: "",
      })),
      createdAt: "2024-01-16",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingKendaraanMasuk, setEditingKendaraanMasuk] =
    useState<KendaraanMasuk | null>(null);
  const [viewingKendaraanMasuk, setViewingKendaraanMasuk] =
    useState<KendaraanMasuk | null>(null);
  const [formData, setFormData] = useState({
    tanggalMasuk: "",
    showroom: "",
    customerId: "",
    projectId: "",
    nomorPolisi: "",
    merek: "",
    tipe: "",
    selectedPengerjaan: [] as string[],
    kelengkapan: kelengkapanTemplate.map((item, index) => ({
      ...item,
      id: `temp-${index}`,
      deskripsi: "",
    })),
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tanggalMasuk: new Date().toISOString().split("T")[0],
      kelengkapan: kelengkapanTemplate.map((item) => ({
        ...item,
        id: Math.random().toString(),
        deskripsi: "",
      })),
    }));
  }, []);

  const filteredKendaraanMasuk = kendaraanMasukList.filter(
    (km) =>
      km.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      km.kendaraan.nomorPolisi
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      km.customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      km.showroom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCustomer = customerList.find(
      (c) => c.id === formData.customerId
    );
    if (!selectedCustomer) return;

    const newKendaraanMasuk: KendaraanMasuk = {
      id: Date.now().toString(),
      nomor: `KM-2024-${String(kendaraanMasukList.length + 1).padStart(
        3,
        "0"
      )}`,
      tanggalMasuk: formData.tanggalMasuk,
      showroom: formData.showroom,
      customerId: formData.customerId,
      customer: selectedCustomer,
      kendaraanId: Date.now().toString(),
      kendaraan: {
        id: Date.now().toString(),
        nomorPolisi: formData.nomorPolisi,
        merek: formData.merek,
        tipe: formData.tipe,
        projectId: formData.projectId,
        project: mockProjects.find((p) => p.id === formData.projectId),
      },
      pengerjaan: formData.selectedPengerjaan.map((jenis, index) => ({
        id: (index + 1).toString(),
        jenis,
        deskripsi: "",
      })),
      kelengkapan: formData.kelengkapan,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setKendaraanMasukList([...kendaraanMasukList, newKendaraanMasuk]);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      tanggalMasuk: new Date().toISOString().split("T")[0],
      showroom: "",
      customerId: "",
      projectId: "",
      nomorPolisi: "",
      merek: "",
      tipe: "",
      selectedPengerjaan: [],
      kelengkapan: kelengkapanTemplate.map((item) => ({
        ...item,
        id: Math.random().toString(),
        deskripsi: "",
      })),
    });
  };

  const handleView = (kendaraanMasuk: KendaraanMasuk) => {
    setViewingKendaraanMasuk(kendaraanMasuk);
    setIsDetailDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setKendaraanMasukList((prev) => prev.filter((km) => km.id !== id));
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const togglePengerjaan = (jenis: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedPengerjaan: prev.selectedPengerjaan.includes(jenis)
        ? prev.selectedPengerjaan.filter((p) => p !== jenis)
        : [...prev.selectedPengerjaan, jenis],
    }));
  };

  const updateKelengkapan = (index: number, field: string, value: any) => {
    const updatedKelengkapan = [...formData.kelengkapan];
    updatedKelengkapan[index] = {
      ...updatedKelengkapan[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, kelengkapan: updatedKelengkapan }));
  };

  const getKondisiBadge = (kondisi: string) => {
    const kondisiConfig = {
      baik: { color: "bg-green-100 text-green-800", label: "Baik" },
      rusak: { color: "bg-red-100 text-red-800", label: "Rusak" },
      tidak_ada: { color: "bg-gray-100 text-gray-800", label: "Tidak Ada" },
    };

    const config =
      kondisiConfig[kondisi as keyof typeof kondisiConfig] ||
      kondisiConfig.baik;
    return (
      <Badge variant="outline" className={cn("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Form Kendaraan Masuk
            </h1>
            <p className="text-sm text-slate-500">
              Pencatatan kendaraan yang masuk untuk perbaikan
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Kendaraan Masuk
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader className="border-b border-slate-100 pb-4">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Form Kendaraan Masuk
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Catat kendaraan yang masuk beserta kelengkapannya
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  {/* Informasi Umum */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
                      Informasi Umum
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid items-center gap-2">
                        <Label
                          htmlFor="tanggalMasuk"
                          className="text-slate-700 font-medium"
                        >
                          Tanggal Masuk
                        </Label>
                        <Input
                          id="tanggalMasuk"
                          type="date"
                          value={formData.tanggalMasuk}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tanggalMasuk: e.target.value,
                            }))
                          }
                          className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label
                          htmlFor="showroom"
                          className="text-slate-700 font-medium"
                        >
                          Nama Showroom
                        </Label>
                        <Input
                          id="showroom"
                          value={formData.showroom}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              showroom: e.target.value,
                            }))
                          }
                          placeholder="Contoh: Showroom Utama"
                          className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label
                          htmlFor="customerId"
                          className="text-slate-700 font-medium"
                        >
                          Nama Customer
                        </Label>
                        <Select
                          value={formData.customerId}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              customerId: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                            <SelectValue placeholder="Pilih customer" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            {customerList.map((customer) => (
                              <SelectItem
                                key={customer.id}
                                value={customer.id}
                                className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                              >
                                {customer.kode} - {customer.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid items-center gap-2">
                        <Label
                          htmlFor="projectId"
                          className="text-slate-700 font-medium"
                        >
                          Link Project (SPK)
                        </Label>
                        <Select
                          value={formData.projectId}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              projectId: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full rounded-xl border-slate-200">
                            <SelectValue placeholder="Pilih Project / SPK (Opsional)" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            {mockProjects.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nomor} - {p.deskripsi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid items-center gap-2">
                        <Label
                          htmlFor="nomorPolisi"
                          className="text-slate-700 font-medium"
                        >
                          Nomor Polisi
                        </Label>
                        <Input
                          id="nomorPolisi"
                          value={formData.nomorPolisi}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              nomorPolisi: e.target.value,
                            }))
                          }
                          placeholder="Contoh: B 1234 ABC"
                          className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label
                          htmlFor="merek"
                          className="text-slate-700 font-medium"
                        >
                          Merek
                        </Label>
                        <Input
                          id="merek"
                          value={formData.merek}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              merek: e.target.value,
                            }))
                          }
                          placeholder="Contoh: Hino, Isuzu"
                          className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label
                          htmlFor="tipe"
                          className="text-slate-700 font-medium"
                        >
                          Tipe Kendaraan
                        </Label>
                        <Input
                          id="tipe"
                          value={formData.tipe}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tipe: e.target.value,
                            }))
                          }
                          placeholder="Contoh: Ranger, Dutro"
                          className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pengerjaan */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
                      Pengerjaan
                    </h3>
                    <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                      {pengerjaanOptions.map((jenis) => (
                        <div
                          key={jenis}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={jenis}
                            checked={formData.selectedPengerjaan.includes(
                              jenis
                            )}
                            onCheckedChange={() => togglePengerjaan(jenis)}
                            className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
                          />
                          <Label
                            htmlFor={jenis}
                            className="text-sm text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {jenis}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kelengkapan Alat/Accesoris */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
                      Kelengkapan Alat/Accesoris
                    </h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                      {["Area Kepala Truk", "Area Badan Truck", "Lainnya"].map(
                        (area) => (
                          <div
                            key={area}
                            className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm"
                          >
                            <h4 className="font-semibold mb-3 text-slate-800 border-b border-slate-100 pb-2">
                              {area}
                            </h4>
                            <div className="space-y-3">
                              {formData.kelengkapan
                                .filter((item) => item.area === area)
                                .map((item, index) => (
                                  <div
                                    key={item.id}
                                    className="grid grid-cols-5 gap-3 items-center text-sm"
                                  >
                                    <span className="col-span-2 text-slate-600 font-medium">
                                      {item.nama}
                                    </span>
                                    {item.jumlah !== undefined && (
                                      <Input
                                        type="number"
                                        value={item.jumlah}
                                        onChange={(e) =>
                                          updateKelengkapan(
                                            formData.kelengkapan.indexOf(item),
                                            "jumlah",
                                            parseInt(e.target.value) || 0
                                          )
                                        }
                                        className="h-9 rounded-lg border-slate-200 focus-visible:ring-blue-600"
                                        min="0"
                                      />
                                    )}
                                    <select
                                      value={item.kondisi}
                                      onChange={(e) =>
                                        updateKelengkapan(
                                          formData.kelengkapan.indexOf(item),
                                          "kondisi",
                                          e.target.value
                                        )
                                      }
                                      className="h-9 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                      <option value="baik">Baik</option>
                                      <option value="rusak">Rusak</option>
                                      <option value="tidak_ada">
                                        Tidak Ada
                                      </option>
                                    </select>
                                    <Input
                                      placeholder="Deskripsi"
                                      value={item.deskripsi || ""}
                                      onChange={(e) =>
                                        updateKelengkapan(
                                          formData.kelengkapan.indexOf(item),
                                          "deskripsi",
                                          e.target.value
                                        )
                                      }
                                      className="h-9 rounded-lg border-slate-200 focus-visible:ring-blue-600"
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
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
                    Simpan Data
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Kendaraan Masuk
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {kendaraanMasukList.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Hari Ini</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {
                      kendaraanMasukList.filter(
                        (km) =>
                          km.tanggalMasuk ===
                          new Date().toISOString().split("T")[0]
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Pengerjaan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {kendaraanMasukList.reduce(
                      (total, km) => total + km.pengerjaan.length,
                      0
                    )}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <AlertTriangle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Kendaraan Masuk
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari kendaraan masuk..."
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
                    Nomor
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Tanggal
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Showroom
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kendaraan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Customer
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Pengerjaan
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKendaraanMasuk.length > 0 ? (
                  filteredKendaraanMasuk.map((kendaraanMasuk) => (
                    <TableRow
                      key={kendaraanMasuk.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50"
                        >
                          {kendaraanMasuk.nomor}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {kendaraanMasuk.tanggalMasuk}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {kendaraanMasuk.showroom}
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {kendaraanMasuk.kendaraan.nomorPolisi}
                          </p>
                          <p className="text-sm text-slate-500">
                            {kendaraanMasuk.kendaraan.merek}{" "}
                            {kendaraanMasuk.kendaraan.tipe}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {kendaraanMasuk.customer.nama}
                          </p>
                          <p className="text-sm text-slate-500">
                            {kendaraanMasuk.customer.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex flex-wrap gap-1">
                          {kendaraanMasuk.pengerjaan.slice(0, 2).map((p) => (
                            <Badge
                              key={p.id}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 text-xs font-normal"
                            >
                              {p.jenis}
                            </Badge>
                          ))}
                          {kendaraanMasuk.pengerjaan.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-slate-500 text-xs border-slate-200"
                            >
                              +{kendaraanMasuk.pengerjaan.length - 2} lagi
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(kendaraanMasuk)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(kendaraanMasuk.id)}
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

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Detail Kendaraan Masuk
              </DialogTitle>
            </DialogHeader>
            {viewingKendaraanMasuk && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nomor Registrasi
                    </Label>
                    <p className="font-bold text-lg text-slate-900">
                      {viewingKendaraanMasuk.nomor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tanggal Masuk
                    </Label>
                    <p className="font-semibold text-slate-700">
                      {viewingKendaraanMasuk.tanggalMasuk}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Showroom
                    </Label>
                    <p className="font-semibold text-slate-700">
                      {viewingKendaraanMasuk.showroom}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Customer
                    </Label>
                    <p className="font-semibold text-slate-900">
                      {viewingKendaraanMasuk.customer.nama}
                    </p>
                    <p className="text-sm text-slate-500">
                      {viewingKendaraanMasuk.customer.kode}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nomor Polisi
                    </Label>
                    <p className="font-semibold text-slate-900">
                      {viewingKendaraanMasuk.kendaraan.nomorPolisi}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Kendaraan
                    </Label>
                    <p className="font-semibold text-slate-700">
                      {viewingKendaraanMasuk.kendaraan.merek} -{" "}
                      {viewingKendaraanMasuk.kendaraan.tipe}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
                    Daftar Pengerjaan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {viewingKendaraanMasuk.pengerjaan.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <p className="font-medium text-slate-800">{p.jenis}</p>
                        {p.deskripsi && (
                          <p className="text-sm text-slate-500 mt-1">
                            {p.deskripsi}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
                    Kelengkapan Alat & Aksesoris
                  </h4>
                  <div className="space-y-4">
                    {["Area Kepala Truk", "Area Badan Truck", "Lainnya"].map(
                      (area) => (
                        <div
                          key={area}
                          className="border border-slate-200 rounded-xl overflow-hidden"
                        >
                          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                            <h5 className="font-medium text-slate-700 text-sm">
                              {area}
                            </h5>
                          </div>
                          <div className="p-4 space-y-3 bg-white">
                            {viewingKendaraanMasuk.kelengkapan
                              .filter((item) => item.area === area)
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-slate-700 text-sm">
                                        {item.nama}
                                      </span>
                                      {item.jumlah !== undefined && (
                                        <Badge
                                          variant="secondary"
                                          className="h-5 px-1.5 text-[10px] bg-slate-100 text-slate-600 border-slate-200"
                                        >
                                          Qty: {item.jumlah}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    {getKondisiBadge(item.kondisi)}
                                    {item.deskripsi && (
                                      <span
                                        className="text-slate-500 text-xs italic max-w-[150px] truncate"
                                        title={item.deskripsi}
                                      >
                                        "{item.deskripsi}"
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
