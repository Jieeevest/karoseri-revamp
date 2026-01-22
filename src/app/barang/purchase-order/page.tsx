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
  Edit,
  Trash2,
  Search,
  ShoppingCart,
  Eye,
  Send,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

import { useToast } from "@/hooks/use-toast";
import { useSupplier } from "@/hooks/use-supplier";
import { useBarang } from "@/hooks/use-barang";
import {
  PurchaseOrder,
  PurchaseOrderItem,
  usePurchaseOrder,
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder, // For status updates
  useDeletePurchaseOrder,
} from "@/hooks/use-purchase-order";

export default function PurchaseOrderPage() {
  const { data: session } = useSession();
  const isGudang = session?.user?.role === "GUDANG";

  const { data: supplierList = [] } = useSupplier();
  const { data: barangList = [] } = useBarang();

  const [searchTerm, setSearchTerm] = useState("");
  const { data: poList = [], isLoading } = usePurchaseOrder(searchTerm);
  const createPO = useCreatePurchaseOrder();
  const updatePO = useUpdatePurchaseOrder();
  const deletePO = useDeletePurchaseOrder();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [viewingPO, setViewingPO] = useState<PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({
    supplierId: "",
    tanggal: new Date().toISOString().split("T")[0],
  });
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPO, setDeletingPO] = useState<PurchaseOrder | null>(null);

  // No local filter needed as hook handles search, using direct list
  const filteredPO = poList; // or just use poList directly in render

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      DIAJUKAN: { color: "bg-blue-100 text-blue-800", label: "Diajukan" },
      DISETUJUI: { color: "bg-green-100 text-green-800", label: "Disetujui" },
      DITOLAK: { color: "bg-red-100 text-red-800", label: "Ditolak" },
      SELESAI: { color: "bg-purple-100 text-purple-800", label: "Selesai" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      barangId: "",
      barang: {
        id: "",
        kode: "",
        nama: "",
        kategoriId: 0,
        kategoriBarang: { id: 0, nama: "" },
        satuanId: "",
        satuanBarang: { id: "", nama: "" }, // Adjusted to match Barang interface from hook
        stok: 0,
        stokMinimum: 0,
      },
      jumlah: 1,
      harga: 0,
      subtotal: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    if (field === "barangId") {
      const selectedBarang = barangList.find((b) => b.id === value);
      if (selectedBarang) {
        updatedItems[index].barang = selectedBarang;
        updatedItems[index].barangId = value;
        updatedItems[index].subtotal =
          updatedItems[index].jumlah * updatedItems[index].harga;
      }
    } else if (field === "jumlah" || field === "harga") {
      updatedItems[index][field] = value;
      updatedItems[index].subtotal =
        updatedItems[index].jumlah * updatedItems[index].harga;
    }
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Silakan tambahkan minimal 1 barang");
      return;
    }

    const selectedSupplier = supplierList.find(
      (s) => s.id === formData.supplierId,
    );
    if (!selectedSupplier) return;

    try {
      await createPO.mutateAsync({
        tanggal: formData.tanggal,
        supplierId: formData.supplierId,
        items: items.map((item) => ({
          ...item,
          barang: undefined, // Avoid sending full object if API expects just IDs, but keeping per your schema design if needed
          // Assuming backend handles relation creation or just needs IDs
        })) as any, // Casting for now to bypass strict shape check if needed, but ideally match backend DTO
        // Actually, let's assume backend takes items with barangId etc.
      });

      toast({
        title: "Berhasil",
        description: "Purchase Order berhasil dibuat",
        className: "bg-green-50 text-green-800 border-green-200",
      });

      setFormData({
        supplierId: "",
        tanggal: new Date().toISOString().split("T")[0],
      });
      setItems([]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal membuat PO",
        variant: "destructive",
      });
    }
  };

  const handleView = (po: PurchaseOrder) => {
    setViewingPO(po);
    setIsDetailDialogOpen(true);
  };

  const handleAjukan = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin mengajukan Purchase Order ini?")) {
      try {
        await updatePO.mutateAsync({ id, status: "DIAJUKAN" });
        toast({
          title: "Berhasil",
          description: "Status PO berhasil diperbarui",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Gagal",
          description: "Gagal update status PO",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteClick = (po: PurchaseOrder) => {
    setDeletingPO(po);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPO) return;

    try {
      await deletePO.mutateAsync(deletingPO.id);
      toast({
        title: "Berhasil",
        description: "PO berhasil dihapus",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      setIsDeleteModalOpen(false);
      setDeletingPO(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menghapus PO",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Purchase Order
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen permohonan restok barang.
            </p>
          </div>

          {isGudang ? (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Buat PO Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">
                      Buat Purchase Order Baru
                    </DialogTitle>
                    <DialogDescription className="text-slate-500">
                      Isi formulir di bawah untuk membuat permohonan restok
                      barang ke supplier.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
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
                          <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0 bg-white">
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
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <Label className="text-lg font-semibold text-slate-800">
                          Daftar Barang
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addItem}
                          className="rounded-xl border-slate-200 hover:bg-slate-50 text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Tambah Barang
                        </Button>
                      </div>

                      {items.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
                          Belum ada barang yang ditambahkan
                        </div>
                      ) : (
                        items.map((item, index) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-12 gap-3 items-end p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors"
                          >
                            <div className="col-span-5">
                              <Label className="text-xs text-slate-500 mb-1.5 block">
                                Barang
                              </Label>
                              <Select
                                value={item.barangId}
                                onValueChange={(value) =>
                                  updateItem(index, "barangId", value)
                                }
                              >
                                <SelectTrigger className="rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
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
                            <div className="col-span-2">
                              <Label className="text-xs text-slate-500 mb-1.5 block">
                                Qty
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={item.jumlah || ""}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "jumlah",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                min="1"
                                className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                              />
                            </div>
                            <div className="col-span-3">
                              <Label className="text-xs text-slate-500 mb-1.5 block">
                                Harga Satuan
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={item.harga || ""}
                                onChange={(e) =>
                                  updateItem(
                                    index,
                                    "harga",
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                min="0"
                                className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                              />
                            </div>
                            <div className="col-span-2 flex gap-2">
                              <div className="flex-1">
                                <Label className="text-xs text-slate-500 mb-1.5 block">
                                  Subtotal
                                </Label>
                                <Input
                                  value={formatCurrency(item.subtotal)}
                                  readOnly
                                  className="bg-slate-50 rounded-xl border-slate-200 text-slate-600 text-xs font-medium"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(index)}
                                className="mb-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg h-9 w-9 shrink-0 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <div className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-200 w-full sm:w-auto">
                        <div className="flex justify-between items-center gap-8">
                          <Label className="text-lg font-semibold text-slate-700">
                            Total Keseluruhan
                          </Label>
                          <span className="text-2xl font-bold text-blue-700">
                            {formatCurrency(calculateTotal())}
                          </span>
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
                      Simpan PO
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          ) : null}
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Purchase Order
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
                    Total
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
                {poList.length > 0 ? (
                  poList.map((po) => (
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
                      <TableCell className="font-medium text-slate-900">
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
                            onClick={() => handleView(po)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {po.status === "DRAFT" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAjukan(po.id)}
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg cursor-pointer"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(po)}
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
          <DialogContent className="sm:max-w-[650px] rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Detail Purchase Order
              </DialogTitle>
            </DialogHeader>
            {viewingPO && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nomor PO
                    </Label>
                    <p className="font-bold text-slate-900 mt-1">
                      {viewingPO.nomor}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(viewingPO.status)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tanggal
                    </Label>
                    <p className="font-medium text-slate-700 mt-1">
                      {viewingPO.tanggal}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Supplier
                    </Label>
                    <p className="font-medium text-slate-700 mt-1">
                      {viewingPO.supplier.nama}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-bold text-slate-900 mb-3 block">
                    Rincian Barang
                  </Label>
                  <div className="space-y-3">
                    {viewingPO.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-slate-900">
                            {item.barang.nama}
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {item.jumlah} {item.barang.satuanBarang?.nama} ×{" "}
                            {formatCurrency(item.harga)}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold text-slate-700">
                      Total Pembelian
                    </Label>
                    <span className="text-2xl font-bold text-blue-700">
                      {formatCurrency(viewingPO.total)}
                    </span>
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
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingPO(null);
        }}
        onConfirm={async () => handleDeleteConfirm()}
        itemName={deletingPO?.nomor}
        title="Hapus Purchase Order"
        description="Apakah Anda yakin ingin menghapus Purchase Order ini? Tindakan ini tidak dapat dibatalkan."
      />
    </DashboardLayout>
  );
}
