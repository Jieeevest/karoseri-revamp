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
  Plus,
  Search,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast"; // Make sure to use toast for feedback

import { useSupplier } from "@/hooks/use-supplier";
import { useBarang } from "@/hooks/use-barang";
import { usePurchaseOrder } from "@/hooks/use-purchase-order";
import { formatDateIndonesia } from "@/lib/date-format";
import {
  BarangMasuk,
  useBarangMasuk,
  useCreateBarangMasuk,
  useDeleteBarangMasuk,
} from "@/hooks/use-barang-masuk";

export default function BarangMasukPage() {
  const { data: session } = useSession();
  const canManageBarangMasuk =
    session?.user?.role === "GUDANG" || session?.user?.role === "SUPERADMIN";

  const { data: barangQuery } = useBarang();
  const barangList = (barangQuery as any)?.data || [];

  const { data: supplierQuery } = useSupplier();
  const supplierList = (supplierQuery as any)?.data || [];
  // Fetch POs to link with Incoming Goods, filtering for approved ones ideally
  const { data: poQueryData } = usePurchaseOrder();
  const purchaseOrderListRaw = (poQueryData as any)?.data || [];
  const purchaseOrderList = purchaseOrderListRaw.filter(
    (po: any) => po.status === "DISETUJUI",
  );
  const selectedPO = useMemo(
    () => purchaseOrderList.find((po: any) => po.id === formData.purchaseOrderId),
    [purchaseOrderList, formData.purchaseOrderId],
  );

  const { data: poBarangMasukData } = useBarangMasuk(
    formData.purchaseOrderId
      ? { purchaseOrderId: formData.purchaseOrderId }
      : undefined,
  );
  const poBarangMasukList = (poBarangMasukData as any)?.data || [];

  const receivedByBarangId = useMemo(() => {
    const map = new Map<string, number>();
    poBarangMasukList.forEach((bm: any) => {
      map.set(bm.barangId, (map.get(bm.barangId) || 0) + bm.jumlah);
    });
    return map;
  }, [poBarangMasukList]);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: queryData, isLoading } = useBarangMasuk({
    page,
    limit,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const barangMasukList: BarangMasuk[] = (queryData as any)?.data || [];
  const pagination = (queryData as any)?.pagination;

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field)
      return <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />
    );
  };
  const createBarangMasuk = useCreateBarangMasuk();
  const deleteBarangMasuk = useDeleteBarangMasuk();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarangMasuk, setEditingBarangMasuk] =
    useState<BarangMasuk | null>(null);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split("T")[0],
    mode: "PO",
    purchaseOrderId: "",
    supplierId: "",
    nomorSuratJalan: "",
    keterangan: "",
  });
  const [poItemsInput, setPoItemsInput] = useState<
    {
      barangId: string;
      nama: string;
      kode: string;
      qtyPO: number;
      qtyDiterima: number;
      qtyRetur: number;
      kondisi: string;
      alasanRetur: string;
      hargaSatuan: number;
    }[]
  >([]);
  const [manualItems, setManualItems] = useState<
    {
      barangId: string;
      qty: number;
      hargaSatuan: number;
      kondisi: string;
      qtyRetur: number;
      alasanRetur: string;
    }[]
  >([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBarangMasuk, setDeletingBarangMasuk] =
    useState<BarangMasuk | null>(null);

  const filteredBarangMasuk = barangMasukList; // Filtering is now done on backend via searchTerm

  useEffect(() => {
    if (formData.mode !== "PO") return;
    if (!selectedPO) {
      setPoItemsInput([]);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      supplierId: selectedPO.supplierId,
    }));
    const nextItems = selectedPO.items.map((item: any) => {
      const receivedQty = receivedByBarangId.get(item.barangId) || 0;
      const remaining = Math.max(item.jumlah - receivedQty, 0);
      return {
        barangId: item.barangId,
        nama: item.barang.nama,
        kode: item.barang.kode,
        qtyPO: item.jumlah,
        qtyDiterima: remaining,
        qtyRetur: 0,
        kondisi: "BAIK",
        alasanRetur: "",
        hargaSatuan: item.harga,
      };
    });
    setPoItemsInput(nextItems);
  }, [selectedPO, receivedByBarangId, formData.mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSupplier = supplierList.find(
      (s) => s.id === formData.supplierId,
    );
    if (!selectedSupplier) return;

    try {
      if (editingBarangMasuk) {
        toast({
          title: "Edit dibatasi",
          description:
            "Barang masuk dicatat per transaksi. Silakan hapus dan catat ulang jika diperlukan.",
          variant: "destructive",
        });
        return;
      }

      const itemsPayload =
        formData.mode === "PO"
          ? poItemsInput.map((item) => ({
              barangId: item.barangId,
              jumlahDiterima: item.qtyDiterima,
              jumlahRetur: item.qtyRetur,
              kondisi: item.kondisi,
              alasanRetur: item.alasanRetur,
              hargaSatuan: item.hargaSatuan,
            }))
          : manualItems.map((item) => ({
              barangId: item.barangId,
              jumlahDiterima: item.qty,
              jumlahRetur: item.qtyRetur,
              kondisi: item.kondisi,
              alasanRetur: item.alasanRetur,
              hargaSatuan: item.hargaSatuan,
            }));

      await createBarangMasuk.mutateAsync({
        tanggal: formData.tanggal,
        supplierId: formData.supplierId,
        purchaseOrderId:
          formData.mode === "PO" ? formData.purchaseOrderId : undefined,
        nomorSuratJalan: formData.nomorSuratJalan,
        keterangan: formData.keterangan,
        items: itemsPayload,
      });

      toast({
        title: "Berhasil",
        description: "Data barang masuk berhasil dicatat",
        className: "bg-green-50 text-green-800 border-green-200",
      });

      resetForm();
      setIsDialogOpen(false);
      setEditingBarangMasuk(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menyimpan data barang masuk",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split("T")[0],
      mode: "PO",
      purchaseOrderId: "",
      supplierId: "",
      nomorSuratJalan: "",
      keterangan: "",
    });
    setPoItemsInput([]);
    setManualItems([]);
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

    try {
      await deleteBarangMasuk.mutateAsync(deletingBarangMasuk.id);
      toast({
        title: "Berhasil",
        description: "Data barang masuk berhasil dihapus",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      setDeletingBarangMasuk(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menghapus data barang masuk",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingBarangMasuk(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const getKondisiBadge = (kondisi: string) => {
    const kondisiConfig: any = {
      BAIK: { color: "bg-green-100 text-green-800", label: "Baik" },
      RUSAK: { color: "bg-yellow-100 text-yellow-800", label: "Ada yang rusak" },
      RETUR: { color: "bg-red-100 text-red-800", label: "Retur" },
    };

    const key = String(kondisi || "").toUpperCase();
    const config = kondisiConfig[key] || kondisiConfig.BAIK;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayItems = barangMasukList.filter((bm) => bm.tanggal === today); // Note: pagination limits accuracy

    return {
      total: todayItems.length,
      totalItems: todayItems.reduce((sum, bm) => sum + bm.jumlah, 0),
      goodCondition: todayItems.filter((bm) => bm.kondisi === "BAIK").length,
      damaged: todayItems.filter((bm) => bm.kondisi !== "BAIK").length,
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

          {canManageBarangMasuk ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={openAddDialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Catat Barang Masuk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] rounded-lg border-slate-100 shadow-2xl">
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
                    <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                      <div className="grid gap-2">
                        <Label htmlFor="tanggal" className="text-slate-700 font-medium">
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
                          className="rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 bg-white"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="mode" className="text-slate-700 font-medium">
                          Jenis Penerimaan
                        </Label>
                        <Select
                          value={formData.mode}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              mode: value,
                              purchaseOrderId: "",
                            }))
                          }
                        >
                          <SelectTrigger className="w-full rounded-lg border-slate-200 focus:ring-blue-600 focus:ring-offset-0 bg-white">
                            <SelectValue placeholder="Pilih jenis" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                            <SelectItem value="PO">Berdasarkan PO</SelectItem>
                            <SelectItem value="MANUAL">Tanpa PO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="supplierId" className="text-slate-700 font-medium">
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
                          disabled={formData.mode === "PO"}
                        >
                          <SelectTrigger className="w-full rounded-lg border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                            <SelectValue placeholder="Pilih supplier" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border-slate-100 shadow-xl">
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
                      {formData.mode === "PO" ? (
                        <div className="grid gap-2">
                          <Label htmlFor="purchaseOrderId" className="text-slate-700 font-medium">
                            Nomor PO
                          </Label>
                          <Select
                            value={formData.purchaseOrderId}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                purchaseOrderId: value,
                                supplierId:
                                  purchaseOrderList.find((po: any) => po.id === value)?.supplierId || prev.supplierId,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full rounded-lg border-slate-200 focus:ring-blue-600 focus:ring-offset-0 bg-white">
                              <SelectValue placeholder="Pilih PO" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                              {purchaseOrderList.map((po) => (
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
                      ) : (
                        <div className="grid gap-2">
                          <Label htmlFor="nomorSuratJalan" className="text-slate-700 font-medium">
                            Nomor Surat Jalan (Opsional)
                          </Label>
                          <Input
                            id="nomorSuratJalan"
                            value={formData.nomorSuratJalan}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                nomorSuratJalan: e.target.value,
                              }))
                            }
                            className="rounded-lg border-slate-200"
                            placeholder="No. SJ"
                          />
                        </div>
                      )}
                    </div>

                    {formData.mode === "PO" ? (
                      <div className="space-y-4">
                        <div className="text-sm text-slate-500">
                          Barang berdasarkan PO akan tampil di bawah. Pastikan jumlah sesuai dan kondisi barang bagus. Jika ada kerusakan, isikan jumlah retur dan alasan.
                        </div>
                        <div className="border border-slate-100 rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Barang</TableHead>
                                <TableHead className="text-right">Qty PO</TableHead>
                                <TableHead className="text-right">Diterima</TableHead>
                                <TableHead className="text-right">Retur</TableHead>
                                <TableHead>Kondisi</TableHead>
                                <TableHead>Alasan Retur</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {poItemsInput.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center text-slate-500">
                                    Pilih PO untuk melihat item.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                poItemsInput.map((item, idx) => (
                                  <TableRow key={item.barangId}>
                                    <TableCell>
                                      <div className="font-medium text-slate-900">{item.nama}</div>
                                      <div className="text-xs text-slate-500">{item.kode}</div>
                                    </TableCell>
                                    <TableCell className="text-right">{item.qtyPO}</TableCell>
                                    <TableCell className="text-right">
                                      <Input
                                        type="number"
                                        min={0}
                                        value={item.qtyDiterima}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value) || 0;
                                          setPoItemsInput((prev) =>
                                            prev.map((p, i) =>
                                              i === idx ? { ...p, qtyDiterima: value } : p,
                                            ),
                                          );
                                        }}
                                        className="h-8 w-20 text-right"
                                      />
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Input
                                        type="number"
                                        min={0}
                                        value={item.qtyRetur}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value) || 0;
                                          setPoItemsInput((prev) =>
                                            prev.map((p, i) =>
                                              i === idx ? { ...p, qtyRetur: value } : p,
                                            ),
                                          );
                                        }}
                                        className="h-8 w-20 text-right"
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={item.kondisi}
                                        onValueChange={(value) =>
                                          setPoItemsInput((prev) =>
                                            prev.map((p, i) =>
                                              i === idx ? { ...p, kondisi: value } : p,
                                            ),
                                          )
                                        }
                                      >
                                        <SelectTrigger className="h-8 w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="BAIK">Baik</SelectItem>
                                          <SelectItem value="RUSAK">Rusak</SelectItem>
                                          <SelectItem value="RETUR">Retur</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell>
                                      <Input
                                        value={item.alasanRetur}
                                        onChange={(e) =>
                                          setPoItemsInput((prev) =>
                                            prev.map((p, i) =>
                                              i === idx ? { ...p, alasanRetur: e.target.value } : p,
                                            ),
                                          )
                                        }
                                        className="h-8"
                                        placeholder="Alasan"
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-slate-500">
                            Barang masuk tanpa PO. Isi detail barang seperti pada form PO.
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setManualItems((prev) => [
                                ...prev,
                                {
                                  barangId: "",
                                  qty: 1,
                                  hargaSatuan: 0,
                                  kondisi: "BAIK",
                                  qtyRetur: 0,
                                  alasanRetur: "",
                                },
                              ])
                            }
                          >
                            Tambah Item
                          </Button>
                        </div>
                        <div className="border border-slate-100 rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Barang</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Harga Satuan</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Retur</TableHead>
                                <TableHead>Kondisi</TableHead>
                                <TableHead>Alasan Retur</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {manualItems.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={7} className="text-center text-slate-500">
                                    Tambahkan item barang.
                                  </TableCell>
                                </TableRow>
                              ) : (
                                manualItems.map((item, idx) => {
                                  const selectedBarang = barangList.find(
                                    (b) => b.id === item.barangId,
                                  );
                                  const total = item.qty * item.hargaSatuan;
                                  return (
                                    <TableRow key={`manual-${idx}`}>
                                      <TableCell>
                                        <Select
                                          value={item.barangId}
                                          onValueChange={(value) =>
                                            setManualItems((prev) =>
                                              prev.map((p, i) =>
                                                i === idx ? { ...p, barangId: value } : p,
                                              ),
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-8 w-full">
                                            <SelectValue placeholder="Pilih barang" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {barangList.map((barang) => (
                                              <SelectItem key={barang.id} value={barang.id}>
                                                {barang.kode} - {barang.nama}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        {selectedBarang && (
                                          <div className="text-xs text-slate-500 mt-1">
                                            {selectedBarang.kategoriBarang?.nama || "-"} •{" "}
                                            {selectedBarang.satuanBarang?.nama || "Unit"}
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Input
                                          type="number"
                                          min={1}
                                          value={item.qty}
                                          onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setManualItems((prev) =>
                                              prev.map((p, i) =>
                                                i === idx ? { ...p, qty: value } : p,
                                              ),
                                            );
                                          }}
                                          className="h-8 w-20 text-right"
                                        />
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Input
                                          type="number"
                                          min={0}
                                          value={item.hargaSatuan}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            setManualItems((prev) =>
                                              prev.map((p, i) =>
                                                i === idx ? { ...p, hargaSatuan: value } : p,
                                              ),
                                            );
                                          }}
                                          className="h-8 w-24 text-right"
                                        />
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {new Intl.NumberFormat("id-ID", {
                                          style: "currency",
                                          currency: "IDR",
                                          maximumFractionDigits: 0,
                                        }).format(total)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Input
                                          type="number"
                                          min={0}
                                          value={item.qtyRetur}
                                          onChange={(e) => {
                                            const value = parseInt(e.target.value) || 0;
                                            setManualItems((prev) =>
                                              prev.map((p, i) =>
                                                i === idx ? { ...p, qtyRetur: value } : p,
                                              ),
                                            );
                                          }}
                                          className="h-8 w-20 text-right"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Select
                                          value={item.kondisi}
                                          onValueChange={(value) =>
                                            setManualItems((prev) =>
                                              prev.map((p, i) =>
                                                i === idx ? { ...p, kondisi: value } : p,
                                              ),
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-8 w-28">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="BAIK">Baik</SelectItem>
                                            <SelectItem value="RUSAK">Rusak</SelectItem>
                                            <SelectItem value="RETUR">Retur</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </TableCell>
                                      <TableCell>
                                        <Input
                                          value={item.alasanRetur}
                                          onChange={(e) =>
                                            setManualItems((prev) =>
                                              prev.map((p, i) =>
                                                i === idx ? { ...p, alasanRetur: e.target.value } : p,
                                              ),
                                            )
                                          }
                                          className="h-8"
                                          placeholder="Alasan"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nomorSuratJalan" className="text-slate-700 font-medium">
                          Nomor Surat Jalan (Opsional)
                        </Label>
                        <Input
                          id="nomorSuratJalan"
                          value={formData.nomorSuratJalan}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              nomorSuratJalan: e.target.value,
                            }))
                          }
                          className="rounded-lg border-slate-200"
                          placeholder="No. SJ"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="keterangan" className="text-slate-700 font-medium">
                          Keterangan (Opsional)
                        </Label>
                        <Input
                          id="keterangan"
                          value={formData.keterangan}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              keterangan: e.target.value,
                            }))
                          }
                          className="rounded-lg border-slate-200"
                          placeholder="Catatan penerimaan"
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      Diterima oleh: {session?.user?.name || session?.user?.username || "Pengguna"} ({session?.user?.role || "USER"})
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-lg cursor-pointer"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-200 cursor-pointer"
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
          <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Hari Ini</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {todayStats.total}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow">
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
                <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm">
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
                  className="pl-10 rounded-lg border-slate-200 focus-visible:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100">
                  <TableHead
                    className="px-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort("nomor")}
                  >
                    <div className="flex items-center">
                      Nomor
                      {renderSortIcon("nomor")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="px-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort("tanggal")}
                  >
                    <div className="flex items-center">
                      Tanggal
                      {renderSortIcon("tanggal")}
                    </div>
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Supplier
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Barang
                  </TableHead>
                  <TableHead
                    className="px-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort("jumlah")}
                  >
                    <div className="flex items-center">
                      Jumlah
                      {renderSortIcon("jumlah")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="px-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort("kondisi")}
                  >
                    <div className="flex items-center">
                      Kondisi
                      {renderSortIcon("kondisi")}
                    </div>
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    PO Reference
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Diterima Oleh
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
                        {formatDateIndonesia(barangMasuk.tanggal)}
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
                          {barangMasuk.jumlah}{" "}
                          {barangMasuk.barang.satuanBarang?.nama || "Unit"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        {getKondisiBadge(barangMasuk.kondisi)}
                      </TableCell>
                      <TableCell className="px-6 text-slate-500 text-sm">
                        {barangMasuk.purchaseOrder ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {barangMasuk.purchaseOrder.nomor}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-slate-500 text-sm">
                        {barangMasuk.receivedBy?.name ||
                          barangMasuk.receivedBy?.username ||
                          "-"}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        {/* Only add edit/delete if role is GUDANG? Assuming yes based on top check */}
                        {canManageBarangMasuk && (
                          <div className="flex justify-center gap-2">
                            {/* Logic to allow edit/delete only if recent or other rules? For now allow all */}
                            {/* Actually Edit icon was imported as Edit but not used in map, check original code... 
                                Original code didn't have Edit in map? 
                                Ah, mocked data didn't show edit buttons in original snippet? 
                                Let's add them for consistency with other pages */}
                            {/* Wait, original mock table didn't have actions column fully populated? 
                                 Ah, viewing previous file content... it ends at TableCell. 
                                 Let's add basic Edit/Delete actions */}
                            {/* No wait, let's keep it simple. Usually stock mutations shouldn't be edited easily. 
                                But requirement implies CRUD. */}
                            {/* ... actually I'll just put the delete button which was there in other pages */}
                          </div>
                        )}
                        {/* Re-checking original file... it was cut off. 
                             Let's assume we need at least delete. */}
                        <div className="flex justify-center gap-2">
                          {/* Edit button */}
                          {/* Delete button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(barangMasuk)}
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
                      colSpan={9}
                      className="px-6 h-24 text-center text-slate-500"
                    >
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <div className="border-t border-slate-100">
            <PaginationControls
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              totalData={pagination?.total || 0}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        </Card>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBarangMasuk(null);
        }}
        onConfirm={async () => handleDeleteConfirm()}
        itemName={deletingBarangMasuk?.nomor}
        title="Hapus Data Barang Masuk"
        description="Apakah Anda yakin ingin menghapus data barang masuk ini? Stok barang akan dikembalikan (dikurangi)."
      />
    </DashboardLayout>
  );
}
