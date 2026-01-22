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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { useToast } from "@/hooks/use-toast";
import {
  PurchaseOrder,
  usePurchaseOrder,
  useUpdatePurchaseOrder, // For status updates (approve/reject)
} from "@/hooks/use-purchase-order";

export default function KonfirmasiPOPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [searchTerm, setSearchTerm] = useState("");
  const { data: purchaseOrderList = [] } = usePurchaseOrder(searchTerm);
  const updatePO = useUpdatePurchaseOrder();
  const { toast } = useToast();

  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const filteredPO = purchaseOrderList.filter(
    (po) =>
      po.status === "DIAJUKAN" &&
      (po.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      DRAFT: {
        color: "bg-gray-100 text-gray-800",
        label: "Draft",
        icon: Clock,
      },
      DIAJUKAN: {
        color: "bg-blue-100 text-blue-800",
        label: "Diajukan",
        icon: Clock,
      },
      DISETUJUI: {
        color: "bg-green-100 text-green-800",
        label: "Disetujui",
        icon: CheckCircle,
      },
      DITOLAK: {
        color: "bg-red-100 text-red-800",
        label: "Ditolak",
        icon: XCircle,
      },
      SELESAI: {
        color: "bg-purple-100 text-purple-800",
        label: "Selesai",
        icon: CheckCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.DRAFT;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleApprove = async (po: PurchaseOrder) => {
    if (
      confirm(
        `Apakah Anda yakin ingin menyetujui PO ${po.nomor} dari ${po.supplier.nama}?`,
      )
    ) {
      try {
        await updatePO.mutateAsync({ id: po.id, status: "DISETUJUI" });
        toast({
          title: "Berhasil",
          description: "PO berhasil disetujui",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Gagal",
          description: "Gagal menyetujui PO",
          variant: "destructive",
        });
      }
    }
  };

  const handleReject = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setRejectReason("");
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedPO || !rejectReason.trim()) {
      alert("Alasan penolakan harus diisi!");
      return;
    }

    try {
      await updatePO.mutateAsync({
        id: selectedPO.id,
        status: "DITOLAK",
      });
      toast({
        title: "Berhasil",
        description: "PO berhasil ditolak",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      setIsRejectDialogOpen(false);
      setSelectedPO(null);
      setRejectReason("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menolak PO",
        variant: "destructive",
      });
    }
  };

  const handleViewDetail = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsDetailDialogOpen(true);
  };

  const getStats = () => {
    if (!purchaseOrderList)
      return { submitted: 0, approved: 0, rejected: 0, totalValue: 0 };

    const submittedPO = purchaseOrderList.filter(
      (po) => po.status === "DIAJUKAN",
    );
    const approvedPO = purchaseOrderList.filter(
      (po) => po.status === "DISETUJUI",
    );
    const rejectedPO = purchaseOrderList.filter(
      (po) => po.status === "DITOLAK",
    );

    return {
      submitted: submittedPO.length,
      approved: approvedPO.length,
      rejected: rejectedPO.length,
      totalValue: submittedPO.reduce((sum, po) => sum + po.total, 0),
    };
  };

  const stats = getStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Konfirmasi Purchase Order
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review dan setujui permohonan purchase order dari staff.
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
                    Menunggu Konfirmasi
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.submitted}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Disetujui
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.approved}
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
                  <p className="text-sm font-medium text-slate-500">Ditolak</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {stats.rejected}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Nilai Menunggu
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {formatCurrency(stats.totalValue)}
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
                PO Menunggu Konfirmasi
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari PO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredPO.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-slate-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">
                  Tidak ada data
                </h3>
                <p className="text-slate-500 mt-1">
                  Tidak ada PO yang menunggu konfirmasi saat ini.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-50/50 border-slate-100">
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Nomor PO
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Tanggal
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Supplier
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Total Item
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Total Nilai
                    </TableHead>
                    <TableHead className="px-6 font-semibold text-slate-500">
                      Status
                    </TableHead>
                    <TableHead className="px-6 text-center font-semibold text-slate-500">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPO.map((po) => (
                    <TableRow
                      key={po.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-900">
                        {po.nomor}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {po.tanggal}
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {po.supplier.nama}
                          </p>
                          <p className="text-xs text-slate-500">
                            {po.supplier.kode}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {po.items.length} item
                      </TableCell>
                      <TableCell className="px-6 font-medium text-slate-900">
                        {formatCurrency(po.total)}
                      </TableCell>
                      <TableCell className="px-6">
                        {getStatusBadge(po.status)}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(po)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleApprove(po)}
                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg cursor-pointer"
                                title="Setujui"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleReject(po)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Tolak"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Detail Purchase Order
              </DialogTitle>
            </DialogHeader>
            {selectedPO && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nomor PO
                    </Label>
                    <p className="font-bold text-slate-900 mt-1">
                      {selectedPO.nomor}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(selectedPO.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tanggal
                    </Label>
                    <p className="font-medium text-slate-700 mt-1">
                      {selectedPO.tanggal}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Supplier
                    </Label>
                    <p className="font-medium text-slate-700 mt-1">
                      {selectedPO.supplier.nama}{" "}
                      <span className="text-slate-400 font-normal">
                        ({selectedPO.supplier.kode})
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold text-slate-900 mb-3 block">
                    Detail Barang
                  </Label>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-200">
                          <TableHead className="font-semibold text-slate-500">
                            Kode
                          </TableHead>
                          <TableHead className="font-semibold text-slate-500">
                            Nama Barang
                          </TableHead>
                          <TableHead className="font-semibold text-slate-500">
                            Jumlah
                          </TableHead>
                          <TableHead className="font-semibold text-slate-500">
                            Harga
                          </TableHead>
                          <TableHead className="font-semibold text-slate-500">
                            Subtotal
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPO.items.map((item) => (
                          <TableRow
                            key={item.id}
                            className="hover:bg-slate-50/50 border-slate-100"
                          >
                            <TableCell className="font-medium text-slate-700">
                              {item.barang.kode}
                            </TableCell>
                            <TableCell className="text-slate-900">
                              {item.barang.nama}
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {item.jumlah}{" "}
                              {item.barang.satuanBarang?.nama || "Unit"}
                            </TableCell>
                            <TableCell className="text-slate-600">
                              {formatCurrency(item.harga)}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                              {formatCurrency(item.subtotal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold text-slate-700">
                      Total Nilai PO
                    </Label>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedPO.total)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button
                onClick={() => setIsDetailDialogOpen(false)}
                variant="outline"
                className="w-full rounded-xl cursor-pointer"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Tolak Purchase Order
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Berikan alasan penolakan untuk PO{" "}
                <span className="font-semibold text-slate-900">
                  {selectedPO?.nomor}
                </span>
                . Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="rejectReason"
                  className="text-slate-700 font-medium"
                >
                  Alasan Penolakan
                </Label>
                <Textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Stok barang sudah mencukupi, atau harga terlalu tinggi..."
                  rows={4}
                  className="rounded-xl border-slate-200 focus-visible:ring-red-500 focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                className="rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={confirmReject}
                className="bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-100 cursor-pointer"
              >
                Tolak PO
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
