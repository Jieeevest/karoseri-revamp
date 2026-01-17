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
import {
  Search,
  Receipt,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

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
  total: number;
}

interface TagihanSupplier {
  id: string;
  nomor: string;
  purchaseOrderId: string;
  purchaseOrder: PurchaseOrder;
  supplierId: string;
  supplier: Supplier;
  jumlah: number;
  tempo: string;
  status: "BELUM_DIBAYAR" | "SUDAH_DIBAYAR";
  metodePembayaran?: "TRANSFER" | "CASH" | "GIRO";
  buktiPembayaran?: string;
  createdAt: string;
}

export default function TagihanSupplierPage() {
  const [supplierList] = useState<Supplier[]>([
    { id: "1", kode: "SUP001", nama: "Supplier ABC" },
    { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
    { id: "3", kode: "SUP003", nama: "Supplier Jaya" },
  ]);

  const [tagihanList, setTagihanList] = useState<TagihanSupplier[]>([
    {
      id: "1",
      nomor: "TAG-2024-001",
      purchaseOrderId: "1",
      purchaseOrder: {
        id: "1",
        nomor: "PO-2024-001",
        supplierId: "1",
        supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
        total: 650000,
      },
      supplierId: "1",
      supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
      jumlah: 650000,
      tempo: "2024-02-15",
      status: "BELUM_DIBAYAR",
      createdAt: "2024-01-20",
    },
    {
      id: "2",
      nomor: "TAG-2024-002",
      purchaseOrderId: "2",
      purchaseOrder: {
        id: "2",
        nomor: "PO-2024-002",
        supplierId: "2",
        supplier: { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
        total: 480000,
      },
      supplierId: "2",
      supplier: { id: "2", kode: "SUP002", nama: "Supplier XYZ" },
      jumlah: 480000,
      tempo: "2024-02-10",
      status: "SUDAH_DIBAYAR",
      metodePembayaran: "TRANSFER",
      buktiPembayaran: "bukti_transfer_001.jpg",
      createdAt: "2024-01-18",
    },
    {
      id: "3",
      nomor: "TAG-2024-003",
      purchaseOrderId: "3",
      purchaseOrder: {
        id: "3",
        nomor: "PO-2024-003",
        supplierId: "3",
        supplier: { id: "3", kode: "SUP003", nama: "Supplier Jaya" },
        total: 1200000,
      },
      supplierId: "3",
      supplier: { id: "3", kode: "SUP003", nama: "Supplier Jaya" },
      jumlah: 1200000,
      tempo: "2024-02-20",
      status: "BELUM_DIBAYAR",
      createdAt: "2024-01-22",
    },
    {
      id: "4",
      nomor: "TAG-2024-004",
      purchaseOrderId: "4",
      purchaseOrder: {
        id: "4",
        nomor: "PO-2024-004",
        supplierId: "1",
        supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
        total: 890000,
      },
      supplierId: "1",
      supplier: { id: "1", kode: "SUP001", nama: "Supplier ABC" },
      jumlah: 890000,
      tempo: "2024-01-25",
      status: "SUDAH_DIBAYAR",
      metodePembayaran: "CASH",
      buktiPembayaran: "kwitansi_002.jpg",
      createdAt: "2024-01-19",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedTagihan, setSelectedTagihan] =
    useState<TagihanSupplier | null>(null);
  const [paymentFormData, setPaymentFormData] = useState({
    metode: "TRANSFER" as "TRANSFER" | "CASH" | "GIRO",
    buktiPembayaran: "",
  });

  const filteredTagihan = tagihanList.filter(
    (tagihan) =>
      tagihan.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagihan.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagihan.purchaseOrder.nomor
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      BELUM_DIBAYAR: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Belum Dibayar",
        icon: Clock,
      },
      SUDAH_DIBAYAR: {
        color: "bg-green-100 text-green-800",
        label: "Sudah Dibayar",
        icon: CheckCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.BELUM_DIBAYAR;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getMetodeBadge = (metode?: string) => {
    if (!metode) return null;

    const metodeConfig = {
      TRANSFER: { color: "bg-blue-100 text-blue-800", label: "Transfer" },
      CASH: { color: "bg-green-100 text-green-800", label: "Cash" },
      GIRO: { color: "bg-orange-100 text-orange-800", label: "Giro" },
    };

    const config =
      metodeConfig[metode as keyof typeof metodeConfig] ||
      metodeConfig.TRANSFER;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTempoStatus = (tempo: string) => {
    const today = new Date();
    const tempoDate = new Date(tempo);
    const diffDays = Math.ceil(
      (tempoDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        color: "text-red-600",
        label: "Terlambat",
        days: Math.abs(diffDays),
      };
    } else if (diffDays <= 7) {
      return {
        color: "text-yellow-600",
        label: "Mendekati Jatuh Tempo",
        days: diffDays,
      };
    } else {
      return { color: "text-green-600", label: "Aman", days: diffDays };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePayment = (tagihan: TagihanSupplier) => {
    setSelectedTagihan(tagihan);
    setPaymentFormData({
      metode: "TRANSFER",
      buktiPembayaran: "",
    });
    setIsPaymentDialogOpen(true);
  };

  const confirmPayment = () => {
    if (!selectedTagihan) return;

    setTagihanList((prev) =>
      prev.map((t) =>
        t.id === selectedTagihan.id
          ? {
              ...t,
              status: "SUDAH_DIBAYAR" as const,
              metodePembayaran: paymentFormData.metode,
              buktiPembayaran: paymentFormData.buktiPembayaran || undefined,
            }
          : t
      )
    );

    setIsPaymentDialogOpen(false);
    setSelectedTagihan(null);
    setPaymentFormData({ metode: "TRANSFER", buktiPembayaran: "" });
  };

  const getStats = () => {
    const unpaid = tagihanList.filter((t) => t.status === "BELUM_DIBAYAR");
    const paid = tagihanList.filter((t) => t.status === "SUDAH_DIBAYAR");
    const overdue = unpaid.filter((t) => {
      const tempoDate = new Date(t.tempo);
      return tempoDate < new Date();
    });

    return {
      total: tagihanList.length,
      unpaid: unpaid.length,
      paid: paid.length,
      overdue: overdue.length,
      totalUnpaid: unpaid.reduce((sum, t) => sum + t.jumlah, 0),
      totalPaid: paid.reduce((sum, t) => sum + t.jumlah, 0),
    };
  };

  const stats = getStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tagihan Supplier
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen tagihan supplier dan status pembayaran.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Tagihan
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.total}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Belum Dibayar
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.unpaid}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Terlambat
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {stats.overdue}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Belum Dibayar
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCurrency(stats.totalUnpaid)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Tagihan Supplier
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari tagihan..."
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
                    Nomor Tagihan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    PO Reference
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Supplier
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Jumlah
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Jatuh Tempo
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Metode
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTagihan.length > 0 ? (
                  filteredTagihan.map((tagihan) => {
                    const tempoStatus = getTempoStatus(tagihan.tempo);
                    return (
                      <TableRow
                        key={tagihan.id}
                        className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                      >
                        <TableCell className="px-6 font-medium text-slate-900">
                          {tagihan.nomor}
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                          >
                            {tagihan.purchaseOrder.nomor}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6">
                          <div>
                            <p className="font-medium text-slate-900">
                              {tagihan.supplier.nama}
                            </p>
                            <p className="text-xs text-slate-500">
                              {tagihan.supplier.kode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 font-medium text-slate-900">
                          {formatCurrency(tagihan.jumlah)}
                        </TableCell>
                        <TableCell className="px-6">
                          <div>
                            <p className="text-sm text-slate-900">
                              {tagihan.tempo}
                            </p>
                            <p
                              className={`text-xs font-medium ${tempoStatus.color}`}
                            >
                              {tempoStatus.label} ({tempoStatus.days} hari)
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          {getStatusBadge(tagihan.status)}
                        </TableCell>
                        <TableCell className="px-6">
                          {tagihan.metodePembayaran ? (
                            getMetodeBadge(tagihan.metodePembayaran)
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="px-6 text-center">
                          <div className="flex justify-center gap-2">
                            {tagihan.buktiPembayaran && (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Lihat Bukti Pembayaran"
                                className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            )}
                            {tagihan.status === "BELUM_DIBAYAR" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handlePayment(tagihan)}
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg cursor-pointer"
                                title="Bayar Tagihan"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
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

        {/* Payment Dialog */}
        <Dialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px] rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Bayar Tagihan Supplier
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Catat pembayaran untuk tagihan{" "}
                <span className="font-medium text-slate-900">
                  {selectedTagihan?.nomor}
                </span>
              </DialogDescription>
            </DialogHeader>
            {selectedTagihan && (
              <div className="space-y-6 py-4">
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                      <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Nomor Tagihan
                      </Label>
                      <p className="font-semibold text-slate-900">
                        {selectedTagihan.nomor}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Supplier
                      </Label>
                      <p className="font-medium text-slate-900">
                        {selectedTagihan.supplier.nama}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Jumlah
                      </Label>
                      <p className="font-bold text-lg text-blue-600">
                        {formatCurrency(selectedTagihan.jumlah)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Jatuh Tempo
                      </Label>
                      <p className="font-medium text-slate-700">
                        {selectedTagihan.tempo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid items-center gap-2">
                  <Label
                    htmlFor="metode"
                    className="text-slate-700 font-medium"
                  >
                    Metode Pembayaran
                  </Label>
                  <Select
                    value={paymentFormData.metode}
                    onValueChange={(value) =>
                      setPaymentFormData((prev) => ({
                        ...prev,
                        metode: value as any,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                      <SelectItem
                        value="TRANSFER"
                        className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                      >
                        Transfer
                      </SelectItem>
                      <SelectItem
                        value="CASH"
                        className="cursor-pointer focus:bg-green-50 focus:text-green-700"
                      >
                        Cash
                      </SelectItem>
                      <SelectItem
                        value="GIRO"
                        className="cursor-pointer focus:bg-orange-50 focus:text-orange-700"
                      >
                        Giro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid items-center gap-2">
                  <Label
                    htmlFor="buktiPembayaran"
                    className="text-slate-700 font-medium"
                  >
                    Bukti Pembayaran
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="buktiPembayaran"
                      value={paymentFormData.buktiPembayaran}
                      onChange={(e) =>
                        setPaymentFormData((prev) => ({
                          ...prev,
                          buktiPembayaran: e.target.value,
                        }))
                      }
                      placeholder="Nama file bukti pembayaran"
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-xl shrink-0 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={confirmPayment}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md shadow-green-200 cursor-pointer"
              >
                Bayar Sekarang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
