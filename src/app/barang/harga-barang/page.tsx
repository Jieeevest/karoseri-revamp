"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  History,
  ArrowUpDown,
} from "lucide-react";
import { useState } from "react";
import { useRiwayatHarga } from "@/hooks/use-riwayat-harga";
import {
  useHargaBarang,
  useCreateHargaBarang,
  useUpdateHargaBarang,
  useDeleteHargaBarang,
} from "@/hooks/use-harga-barang";
import { useBarang } from "@/hooks/use-barang";
import { useSupplier } from "@/hooks/use-supplier";
import { useKategoriBarang } from "@/hooks/use-master";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { formatDateIndonesia } from "@/lib/date-format";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";
// import { formatCurrency } from "@/lib/utils"; // Removed as it doesn't exist

export default function PriceMonitoringPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [hargaSearch, setHargaSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("__ALL__");
  const [supplierFilter, setSupplierFilter] = useState("__ALL__");
  const [hargaPage, setHargaPage] = useState(1);
  const [hargaLimit, setHargaLimit] = useState(10);
  const [hargaSortBy, setHargaSortBy] = useState("createdAt");
  const [hargaSortOrder, setHargaSortOrder] = useState<"asc" | "desc">("desc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHarga, setEditingHarga] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingHarga, setDeletingHarga] = useState<any | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [viewingHarga, setViewingHarga] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    barangId: "",
    supplierId: "",
    kategoriId: "",
    harga: "",
    adalahHargaTerbaik: false,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { toast } = useToast();

  const { data: hargaData } = useHargaBarang({
    search: hargaSearch,
    page: hargaPage,
    limit: hargaLimit,
    sortBy: hargaSortBy,
    sortOrder: hargaSortOrder,
    kategoriId: kategoriFilter === "__ALL__" ? undefined : kategoriFilter,
    supplierId: supplierFilter === "__ALL__" ? undefined : supplierFilter,
  });
  const hargaList = (hargaData as any)?.data || [];
  const hargaPagination = (hargaData as any)?.pagination;

  const { data: queryData, isLoading } = useRiwayatHarga({
    search: searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
  });
  const { data: detailRiwayatData, isLoading: isDetailLoading } =
    useRiwayatHarga(
      viewingHarga
        ? {
            page: 1,
            limit: 50,
            sortBy: "tanggal",
            sortOrder: "desc",
            barangId: viewingHarga.barangId,
            supplierId: viewingHarga.supplierId,
          }
        : undefined,
      { enabled: !!viewingHarga },
    );

  const { data: barangData } = useBarang({ limit: 200 });
  const barangList = (barangData as any)?.data || [];
  const { data: supplierData } = useSupplier({ limit: 200 });
  const supplierList = (supplierData as any)?.data || [];
  const { data: kategoriData } = useKategoriBarang({ limit: 200 });
  const kategoriList = kategoriData?.data || [];

  const createHarga = useCreateHargaBarang();
  const updateHarga = useUpdateHargaBarang();
  const deleteHarga = useDeleteHargaBarang();

  const riwayatList = (queryData as any)?.data || [];
  const pagination = (queryData as any)?.pagination;
  const detailRiwayatList = (detailRiwayatData as any)?.data || [];

  // Helper currency formatter if not imported or different
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentageChange = (oldPrice: number, newPrice: number) => {
    if (oldPrice === 0) return 100; // New price established
    return ((newPrice - oldPrice) / oldPrice) * 100;
  };

  const handleHargaSort = (field: string) => {
    if (hargaSortBy === field) {
      setHargaSortOrder(hargaSortOrder === "asc" ? "desc" : "asc");
    } else {
      setHargaSortBy(field);
      setHargaSortOrder("asc");
    }
  };

  const openAddDialog = () => {
    setEditingHarga(null);
    setFormData({
      barangId: "",
      supplierId: "",
      kategoriId: "",
      harga: "",
      adalahHargaTerbaik: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (harga: any) => {
    setEditingHarga(harga);
    setFormData({
      barangId: harga.barangId,
      supplierId: harga.supplierId,
      kategoriId: String(harga.kategoriId),
      harga: String(harga.harga),
      adalahHargaTerbaik: harga.adalahHargaTerbaik,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (harga: any) => {
    setDeletingHarga(harga);
    setIsDeleteModalOpen(true);
  };

  const handleViewHistory = (harga: any) => {
    setViewingHarga(harga);
    setIsHistoryOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHarga) return;
    try {
      await deleteHarga.mutateAsync(deletingHarga.id);
      setIsDeleteModalOpen(false);
      setDeletingHarga(null);
      toast({
        title: "Harga dihapus",
        description: "Data harga berhasil dihapus.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    } catch (error) {
      console.error("Failed to delete harga", error);
      toast({
        title: "Gagal menghapus",
        description: "Terjadi kesalahan saat menghapus harga.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        ...formData,
        harga: parseFloat(formData.harga),
      };
      delete payload.adalahHargaTerbaik;
      if (!payload.kategoriId) {
        delete payload.kategoriId;
      }
      if (editingHarga) {
        await updateHarga.mutateAsync({ id: editingHarga.id, ...payload });
        toast({
          title: "Harga diperbarui",
          description: "Data harga berhasil diperbarui.",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        await createHarga.mutateAsync(payload);
        toast({
          title: "Harga ditambahkan",
          description: "Data harga berhasil ditambahkan.",
          className: "bg-green-50 border-green-200 text-green-800",
        });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to save harga", error);
      toast({
        title: "Gagal menyimpan",
        description:
          error?.response?.data?.error ||
          "Terjadi kesalahan saat menyimpan harga.",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Monitoring Harga Barang
          </h1>
          <p className="text-sm text-slate-500">
            Pantau pergerakan dan riwayat perubahan harga barang dari supplier
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-lg bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  Daftar Harga Barang
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Data harga per kategori dan supplier
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Cari barang atau supplier..."
                    value={hargaSearch}
                    onChange={(e) => {
                      setHargaSearch(e.target.value);
                      setHargaPage(1);
                    }}
                    className="pl-10 rounded-lg border-slate-200 focus-visible:ring-blue-500 bg-white"
                  />
                </div>
                <Select
                  value={kategoriFilter}
                  onValueChange={(value) => {
                    setKategoriFilter(value);
                    setHargaPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-48 rounded-lg border-slate-200">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__">Semua Kategori</SelectItem>
                    {kategoriList.map((k) => (
                      <SelectItem key={k.id} value={String(k.id)}>
                        {k.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={supplierFilter}
                  onValueChange={(value) => {
                    setSupplierFilter(value);
                    setHargaPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-48 rounded-lg border-slate-200">
                    <SelectValue placeholder="Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__ALL__">Semua Supplier</SelectItem>
                    {supplierList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={openAddDialog}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
                    >
                      Tambah Harga
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] rounded-xl border-slate-100 shadow-2xl">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                          {editingHarga ? "Edit Harga" : "Tambah Harga"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500">
                          {editingHarga
                            ? "Perbarui data harga barang."
                            : "Tambahkan harga barang untuk supplier."}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="barangId">Barang</Label>
                          <Combobox
                            value={formData.barangId}
                            onChange={(value) => {
                              const selected = barangList.find(
                                (b: any) => b.id === value,
                              );
                              setFormData((prev) => ({
                                ...prev,
                                barangId: value,
                                kategoriId: selected
                                  ? String(selected.kategoriId)
                                  : prev.kategoriId,
                              }));
                            }}
                            options={barangList.map((b: any) => ({
                              value: b.id,
                              label: `${b.kode} - ${b.nama}`,
                            }))}
                            placeholder="Pilih barang"
                            searchPlaceholder="Cari barang..."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="supplierId">Supplier</Label>
                          <Combobox
                            value={formData.supplierId}
                            onChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                supplierId: value,
                              }))
                            }
                            options={supplierList.map((s: any) => ({
                              value: s.id,
                              label: s.nama,
                            }))}
                            placeholder="Pilih supplier"
                            searchPlaceholder="Cari supplier..."
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="kategoriId">Kategori</Label>
                          <Input
                            value={
                              kategoriList.find(
                                (k) => String(k.id) === formData.kategoriId,
                              )?.nama || "Kategori otomatis"
                            }
                            readOnly
                            className="rounded-lg border-slate-200 bg-slate-50"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="harga">Harga</Label>
                          <Input
                            id="harga"
                            type="number"
                            value={formData.harga}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                harga: e.target.value,
                              }))
                            }
                            placeholder="Masukkan harga"
                            className="rounded-lg border-slate-200"
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            id="adalahHargaTerbaik"
                            type="checkbox"
                            checked={formData.adalahHargaTerbaik}
                            onChange={() => {}}
                            disabled
                            className="h-4 w-4 rounded border-slate-300 text-blue-600"
                          />
                          <Label htmlFor="adalahHargaTerbaik">
                            Harga terbaik otomatis (termurah per kategori)
                          </Label>
                        </div>
                      </div>
                      <DialogFooter className="gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          Batal
                        </Button>
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {editingHarga ? "Simpan Perubahan" : "Simpan"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100">
                  <TableHead
                    className="px-6 font-semibold text-slate-500 cursor-pointer"
                    onClick={() => handleHargaSort("barang.nama")}
                  >
                    Barang
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kategori
                  </TableHead>
                  <TableHead
                    className="px-6 font-semibold text-slate-500 cursor-pointer"
                    onClick={() => handleHargaSort("supplier.nama")}
                  >
                    Supplier
                  </TableHead>
                  <TableHead
                    className="px-6 text-right font-semibold text-slate-500 cursor-pointer"
                    onClick={() => handleHargaSort("harga")}
                  >
                    Harga
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hargaList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-6 h-24 text-center text-slate-500"
                    >
                      Data harga belum tersedia.
                    </TableCell>
                  </TableRow>
                ) : (
                  hargaList.map((harga: any) => (
                    <TableRow
                      key={harga.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100"
                    >
                      <TableCell className="px-6">
                        <div className="font-medium text-slate-900">
                          {harga.barang?.nama}
                        </div>
                        <div className="text-xs text-slate-500">
                          {harga.barang?.kode}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {harga.kategoriBarang?.nama ||
                          harga.barang?.kategoriBarang?.nama ||
                          "-"}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {harga.supplier?.nama}
                      </TableCell>
                      <TableCell className="px-6 text-right font-medium text-slate-900">
                        {formatIDR(harga.harga)}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        {harga.adalahHargaTerbaik ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            Terbaik
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-slate-50 text-slate-500 border-slate-200"
                          >
                            Normal
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewHistory(harga)}
                            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(harga)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(harga)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          {hargaPagination && (
            <div className="pb-4 border-t border-slate-100">
              <PaginationControls
                currentPage={hargaPagination.page}
                totalPages={hargaPagination.totalPages}
                totalData={hargaPagination.total}
                limit={hargaPagination.limit}
                onPageChange={setHargaPage}
                onLimitChange={setHargaLimit}
              />
            </div>
          )}
        </Card>

        <Card className="border-slate-200 shadow-sm rounded-lg bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  Riwayat Perubahan Harga
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Daftar kronologis update harga
                </p>
              </div>

              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari produk, SKU, atau supplier..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
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
                    className="px-6 w-[150px] font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Tanggal
                      {sortBy === "createdAt" && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="px-6 font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("barang.nama")}
                  >
                    <div className="flex items-center gap-2">
                      Produk
                      {sortBy === "barang.nama" && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead
                    className="px-6 font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("supplier.nama")}
                  >
                    <div className="flex items-center gap-2">
                      Supplier
                      {sortBy === "supplier.nama" && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="px-6 text-right font-semibold text-slate-500">
                    Harga Lama
                  </TableHead>
                  <TableHead
                    className="px-6 text-right font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("hargaBaru")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Harga Baru
                      {sortBy === "hargaBaru" && (
                        <ArrowUpDown className="w-3 h-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="px-6 text-right font-semibold text-slate-500">
                    Selisih
                  </TableHead>
                  <TableHead className="px-6 text-center w-[100px] font-semibold text-slate-500">
                    Trend
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-slate-500"
                    >
                      Memuat data riwayat...
                    </TableCell>
                  </TableRow>
                ) : riwayatList.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-6 h-24 text-center text-slate-500"
                    >
                      Tidak ada riwayat perubahan harga.
                    </TableCell>
                  </TableRow>
                ) : (
                  riwayatList.map((log) => {
                    const diff = log.hargaBaru - log.hargaLama;
                    const percent = getPercentageChange(
                      log.hargaLama,
                      log.hargaBaru,
                    );
                    const isIncrease = diff > 0;
                    const isNew = log.hargaLama === 0;

                    return (
                      <TableRow
                        key={log.id}
                        className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                      >
                        <TableCell className="px-6 text-slate-500 text-sm">
                          {formatDateIndonesia(log.tanggal)}
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="font-medium text-slate-900">
                            {log.barang.nama}
                          </div>
                          <div className="text-xs text-slate-500">
                            {log.barang.kode}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-slate-600">
                          {log.supplier.nama}
                        </TableCell>
                        <TableCell className="px-6 text-right text-slate-500">
                          {isNew ? "-" : formatIDR(log.hargaLama)}
                        </TableCell>
                        <TableCell className="px-6 text-right font-medium text-slate-900">
                          {formatIDR(log.hargaBaru)}
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <span
                            className={
                              isIncrease
                                ? "text-red-600"
                                : isNew
                                  ? "text-blue-600"
                                  : "text-green-600"
                            }
                          >
                            {isIncrease ? "+" : ""}
                            {formatIDR(diff)}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {isNew ? "Baru" : `${percent.toFixed(1)}%`}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-center">
                          {isNew ? (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-600 border-blue-200"
                            >
                              New
                            </Badge>
                          ) : isIncrease ? (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-600 border-red-200 flex items-center justify-center gap-1 w-full"
                            >
                              <TrendingUp className="w-3 h-3" /> Naik
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-600 border-green-200 flex items-center justify-center gap-1 w-full"
                            >
                              <TrendingDown className="w-3 h-3" /> Turun
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
          {pagination && (
            <div className="pb-4 border-t border-slate-100">
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalData={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            </div>
          )}
        </Card>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingHarga(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingHarga?.barang?.nama}
        title="Hapus Harga Barang"
        description="Apakah Anda yakin ingin menghapus data harga ini?"
      />

      <Dialog
        open={isHistoryOpen}
        onOpenChange={(open) => {
          setIsHistoryOpen(open);
          if (!open) setViewingHarga(null);
        }}
      >
        <DialogContent className="sm:max-w-[720px] rounded-xl border-slate-100 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Riwayat Harga Barang
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {viewingHarga
                ? `${viewingHarga.barang?.nama} • ${viewingHarga.supplier?.nama}`
                : "Detail perubahan harga"}
            </DialogDescription>
          </DialogHeader>
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-[140px]">Tanggal</TableHead>
                  <TableHead className="text-right">Harga Lama</TableHead>
                  <TableHead className="text-right">Harga Baru</TableHead>
                  <TableHead className="text-right">Selisih</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDetailLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-20 text-center">
                      Memuat riwayat...
                    </TableCell>
                  </TableRow>
                ) : detailRiwayatList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-20 text-center">
                      Belum ada riwayat perubahan.
                    </TableCell>
                  </TableRow>
                ) : (
                  detailRiwayatList.map((log: any) => {
                    const diff = log.hargaBaru - log.hargaLama;
                    return (
                      <TableRow key={log.id}>
                        <TableCell className="text-slate-600">
                          {formatDateIndonesia(log.tanggal)}
                        </TableCell>
                        <TableCell className="text-right text-slate-500">
                          {log.hargaLama ? formatIDR(log.hargaLama) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-900">
                          {formatIDR(log.hargaBaru)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              diff > 0 ? "text-red-600" : "text-green-600"
                            }
                          >
                            {diff > 0 ? "+" : ""}
                            {formatIDR(diff)}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsHistoryOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
