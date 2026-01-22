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
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

interface Barang {
  id: string;
  kode: string;
  nama: string;
  satuan: string;
}

interface Supplier {
  id: string;
  kode: string;
  nama: string;
}

interface PurchaseOrder {
  id: string;
  nomor: string;
  supplierId: string;
  supplier: Supplier;
  status: string;
  items: Array<{
    barangId: string;
    barang: Barang;
    jumlah: number;
  }>;
}

interface BarangMasuk {
  id: string;
  nomor: string;
  tanggal: string;
  purchaseOrderId?: string;
  purchaseOrder?: PurchaseOrder;
  supplierId: string;
  supplier: Supplier;
  barangId: string;
  barang: Barang;
  jumlah: number;
  kondisi: string;
  createdAt: string;
}

export default function BarangMasukPage() {
  const { data: session } = useSession();
  const isGudang = session?.user?.role === "GUDANG";
  const [barangList] = useState<Barang[]>([
    { id: "1", kode: "BRG001", nama: "Cat Semprot Hitam", satuan: "Liter" },
    { id: "2", kode: "BRG002", nama: "Besi Hollow 4x4", satuan: "Meter" },
    { id: "3", kode: "BRG003", nama: "Paku 10cm", satuan: "Kg" },
    { id: "4", kode: "BRG004", nama: "Lampu LED", satuan: "Unit" },
    { id: "5", kode: "BRG005", nama: "Triplek Melamin", satuan: "Lembar" },
  ]);

  const [supplierList] = useState<Supplier[]>([
    { id: "1", kode: "SUP001", nama: "Supplier ABC" },
    { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
    { id: "3", kode: "SUP003", nama: "Supplier Jaya" },
  ]);

  const [purchaseOrderList] = useState<PurchaseOrder[]>([
    {
      id: "1",
      nomor: "PO-2024-001",
      supplierId: "1",
      supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
      status: "DISETUJUI",
      items: [
        {
          barangId: "1",
          barang: {
            id: "1",
            kode: "BRG001",
            nama: "Cat Semprot Hitam",
            satuan: "Liter",
          },
          jumlah: 10,
        },
        {
          barangId: "2",
          barang: {
            id: "2",
            kode: "BRG002",
            nama: "Besi Hollow 4x4",
            satuan: "Meter",
          },
          jumlah: 20,
        },
      ],
    },
    {
      id: "2",
      nomor: "PO-2024-002",
      supplierId: "2",
      supplier: { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
      status: "DISETUJUI",
      items: [
        {
          barangId: "3",
          barang: { id: "3", kode: "BRG003", nama: "Paku 10cm", satuan: "Kg" },
          jumlah: 15,
        },
      ],
    },
  ]);

  const [barangMasukList, setBarangMasukList] = useState<BarangMasuk[]>([
    {
      id: "1",
      nomor: "BM-2024-001",
      tanggal: "2024-01-15",
      purchaseOrderId: "1",
      purchaseOrder: {
        id: "1",
        nomor: "PO-2024-001",
        supplierId: "1",
        supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
        status: "DISETUJUI",
        items: [
          {
            barangId: "1",
            barang: {
              id: "1",
              kode: "BRG001",
              nama: "Cat Semprot Hitam",
              satuan: "Liter",
            },
            jumlah: 10,
          },
        ],
      },
      supplierId: "1",
      supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
      barangId: "1",
      barang: {
        id: "1",
        kode: "BRG001",
        nama: "Cat Semprot Hitam",
        satuan: "Liter",
      },
      jumlah: 10,
      kondisi: "Baik",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      nomor: "BM-2024-002",
      tanggal: "2024-01-16",
      purchaseOrderId: "1",
      purchaseOrder: {
        id: "1",
        nomor: "PO-2024-001",
        supplierId: "1",
        supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
        status: "DISETUJUI",
        items: [
          {
            barangId: "2",
            barang: {
              id: "2",
              kode: "BRG002",
              nama: "Besi Hollow 4x4",
              satuan: "Meter",
            },
            jumlah: 20,
          },
        ],
      },
      supplierId: "1",
      supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
      barangId: "2",
      barang: {
        id: "2",
        kode: "BRG002",
        nama: "Besi Hollow 4x4",
        satuan: "Meter",
      },
      jumlah: 20,
      kondisi: "Baik",
      createdAt: "2024-01-16",
    },
    {
      id: "3",
      nomor: "BM-2024-003",
      tanggal: "2024-01-17",
      supplierId: "2",
      supplier: { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
      barangId: "3",
      barang: { id: "3", kode: "BRG003", nama: "Paku 10cm", satuan: "Kg" },
      jumlah: 15,
      kondisi: "Ada yang rusak",
      createdAt: "2024-01-17",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarangMasuk, setEditingBarangMasuk] =
    useState<BarangMasuk | null>(null);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    purchaseOrderId: "",
    supplierId: "",
    barangId: "",
    jumlah: 0,
    kondisi: "Baik",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBarangMasuk, setDeletingBarangMasuk] =
    useState<BarangMasuk | null>(null);

  const filteredBarangMasuk = barangMasukList.filter(
    (bm) =>
      bm.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bm.barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bm.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bm.kondisi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSupplier = supplierList.find(
      (s) => s.id === formData.supplierId,
    );
    const selectedBarang = barangList.find((b) => b.id === formData.barangId);
    const selectedPO = formData.purchaseOrderId
      ? purchaseOrderList.find((po) => po.id === formData.purchaseOrderId)
      : undefined;

    if (!selectedSupplier || !selectedBarang) return;

    const newBarangMasuk: BarangMasuk = {
      id: Date.now().toString(),
      nomor: `BM-2024-${String(barangMasukList.length + 1).padStart(3, "0")}`,
      tanggal: formData.tanggal,
      purchaseOrderId: formData.purchaseOrderId || undefined,
      purchaseOrder: selectedPO,
      supplierId: formData.supplierId,
      supplier: selectedSupplier,
      barangId: formData.barangId,
      barang: selectedBarang,
      jumlah: formData.jumlah,
      kondisi: formData.kondisi,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setBarangMasukList([...barangMasukList, newBarangMasuk]);
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split("T")[0],
      purchaseOrderId: "",
      supplierId: "",
      barangId: "",
      jumlah: 0,
      kondisi: "Baik",
    });
  };

  const handleEdit = (barangMasuk: BarangMasuk) => {
    setEditingBarangMasuk(barangMasuk);
    setFormData({
      tanggal: barangMasuk.tanggal,
      purchaseOrderId: barangMasuk.purchaseOrderId || "",
      supplierId: barangMasuk.supplierId,
      barangId: barangMasuk.barangId,
      jumlah: barangMasuk.jumlah,
      kondisi: barangMasuk.kondisi,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (barangMasuk: BarangMasuk) => {
    setDeletingBarangMasuk(barangMasuk);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBarangMasuk) return;

    setBarangMasukList((prev) =>
      prev.filter((bm) => bm.id !== deletingBarangMasuk.id),
    );
    setIsDeleteModalOpen(false);
    setDeletingBarangMasuk(null);
  };

  const openAddDialog = () => {
    setEditingBarangMasuk(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const getKondisiBadge = (kondisi: string) => {
    const kondisiConfig = {
      Baik: { color: "bg-green-100 text-green-800", label: "Baik" },
      "Ada yang rusak": {
        color: "bg-yellow-100 text-yellow-800",
        label: "Ada yang rusak",
      },
      "Rusak semua": { color: "bg-red-100 text-red-800", label: "Rusak semua" },
    };

    const config =
      kondisiConfig[kondisi as keyof typeof kondisiConfig] ||
      kondisiConfig["Baik"];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayItems = barangMasukList.filter((bm) => bm.tanggal === today);

    return {
      total: todayItems.length,
      totalItems: todayItems.reduce((sum, bm) => sum + bm.jumlah, 0),
      goodCondition: todayItems.filter((bm) => bm.kondisi === "Baik").length,
      damaged: todayItems.filter((bm) => bm.kondisi !== "Baik").length,
    };
  };

  const todayStats = getTodayStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Barang Masuk
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Pencatatan barang yang diterima dari supplier.
            </p>
          </div>

          {isGudang ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={openAddDialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Catat Barang Masuk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] rounded-xl border-slate-100 shadow-2xl">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                      {editingBarangMasuk
                        ? "Edit Barang Masuk"
                        : "Catat Barang Masuk"}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                      {editingBarangMasuk
                        ? "Update informasi barang yang diterima."
                        : "Isi formulir untuk mencatat penerimaan barang dari supplier."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="tanggal"
                          className="text-slate-700 font-medium"
                        >
                          Tanggal
                        </Label>
                        <Input
                          id="tanggal"
                          type="date"
                          value={formData.tanggal}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              tanggal: e.target.value,
                            }))
                          }
                          className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 bg-white"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="purchaseOrderId"
                          className="text-slate-700 font-medium"
                        >
                          Purchase Order (Opsional)
                        </Label>
                        <Select
                          value={formData.purchaseOrderId}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              purchaseOrderId: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0 bg-white">
                            <SelectValue placeholder="Pilih PO (jika ada)" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem
                              value=""
                              className="cursor-pointer focus:bg-slate-50"
                            >
                              Tanpa PO
                            </SelectItem>
                            {purchaseOrderList
                              .filter((po) => po.status === "DISETUJUI")
                              .map((po) => (
                                <SelectItem
                                  key={po.id}
                                  value={po.id}
                                  className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                                >
                                  {po.nomor} - {po.supplier.nama}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label
                            htmlFor="supplierId"
                            className="text-slate-700 font-medium"
                          >
                            Supplier
                          </Label>
                          <Select
                            value={formData.supplierId}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                supplierId: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                              <SelectValue placeholder="Pilih supplier" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                              {supplierList.map((supplier) => (
                                <SelectItem
                                  key={supplier.id}
                                  value={supplier.id}
                                  className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                                >
                                  {supplier.kode} - {supplier.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label
                            htmlFor="kondisi"
                            className="text-slate-700 font-medium"
                          >
                            Kondisi Barang
                          </Label>
                          <Select
                            value={formData.kondisi}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                kondisi: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                              <SelectValue placeholder="Pilih kondisi" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                              <SelectItem
                                value="Baik"
                                className="text-green-600 cursor-pointer focus:bg-green-50"
                              >
                                Baik
                              </SelectItem>
                              <SelectItem
                                value="Ada yang rusak"
                                className="text-yellow-600 cursor-pointer focus:bg-yellow-50"
                              >
                                Ada yang rusak
                              </SelectItem>
                              <SelectItem
                                value="Rusak semua"
                                className="text-red-600 cursor-pointer focus:bg-red-50"
                              >
                                Rusak semua
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-8 grid gap-2">
                          <Label
                            htmlFor="barangId"
                            className="text-slate-700 font-medium"
                          >
                            Barang
                          </Label>
                          <Select
                            value={formData.barangId}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                barangId: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                              <SelectValue placeholder="Pilih barang" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                              {barangList.map((barang) => (
                                <SelectItem
                                  key={barang.id}
                                  value={barang.id}
                                  className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                                >
                                  {barang.kode} - {barang.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-4 grid gap-2">
                          <Label
                            htmlFor="jumlah"
                            className="text-slate-700 font-medium"
                          >
                            Jumlah
                          </Label>
                          <Input
                            id="jumlah"
                            type="number"
                            value={formData.jumlah}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                jumlah: parseInt(e.target.value) || 0,
                              }))
                            }
                            placeholder="0"
                            min="1"
                            className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                            required
                          />
                        </div>
                      </div>
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
                      {editingBarangMasuk ? "Simpan Perubahan" : "Catat Barang"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Barang Masuk
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {barangMasukList.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Package className="h-6 w-6 text-blue-600" />
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
                    {todayStats.total}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Kondisi Baik
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {todayStats.goodCondition}
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
                    Ada Masalah
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {todayStats.damaged}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Riwayat Barang Masuk
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari barang masuk..."
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
                    Supplier
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Barang
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Jumlah
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kondisi
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    PO Reference
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBarangMasuk.length > 0 ? (
                  filteredBarangMasuk.map((barangMasuk) => (
                    <TableRow
                      key={barangMasuk.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-900">
                        {barangMasuk.nomor}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {barangMasuk.tanggal}
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {barangMasuk.supplier.nama}
                          </p>
                          <p className="text-xs text-slate-500">
                            {barangMasuk.supplier.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {barangMasuk.barang.nama}
                          </p>
                          <p className="text-xs text-slate-500">
                            {barangMasuk.barang.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant="outline"
                          className="border-slate-200 text-slate-600 font-normal"
                        >
                          {barangMasuk.jumlah} {barangMasuk.barang.satuan}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        {getKondisiBadge(barangMasuk.kondisi)}
                      </TableCell>
                      <TableCell className="px-6">
                        {barangMasuk.purchaseOrder ? (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                          >
                            {barangMasuk.purchaseOrder.nomor}
                          </Badge>
                        ) : (
                          <span className="text-slate-400 italic">No PO</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(barangMasuk)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(barangMasuk)}
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
                      colSpan={8}
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
          setDeletingBarangMasuk(null);
        }}
        onConfirm={async () => handleDeleteConfirm()}
        itemName={deletingBarangMasuk?.nomor}
        title="Hapus Barang Masuk"
        description="Apakah Anda yakin ingin menghapus data barang masuk ini?"
      />
    </DashboardLayout>
  );
}
