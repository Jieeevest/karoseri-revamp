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
import {
  Plus,
  Edit,
  Search,
  TrendingUp,
  TrendingDown,
  History,
  DollarSign,
  Package,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";
import { useBarang, Barang } from "@/hooks/use-barang";
import { useSupplier } from "@/hooks/use-supplier";
import {
  HargaBarang,
  useHargaBarang,
  useCreateHargaBarang,
  useUpdateHargaBarang,
  useDeleteHargaBarang, // Keep for managing inside modal
} from "@/hooks/use-harga-barang";
// import { formatCurrency } from "@/lib/utils"; // Removed as it doesn't exist

export default function HargaBarangPage() {
  const { data: barangList = [], isLoading: isLoadingBarang } = useBarang();
  const { data: supplierList = [] } = useSupplier();

  // Fetch ALL prices to map to products
  // In a real large app, we would fetch prices per product or use a robust composed API.
  // For now, assuming reasonable size, fetching all is fine.
  const { data: hargaList = [], isLoading: isLoadingHarga } = useHargaBarang();

  const createHarga = useCreateHargaBarang();
  const updateHarga = useUpdateHargaBarang();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");

  // State for Manage Price Dialog
  const [selectedProduct, setSelectedProduct] = useState<Barang | null>(null);
  const [isManagePriceOpen, setIsManagePriceOpen] = useState(false);

  // State for Add/Edit Price Form inside the dialog
  const [editingHargaId, setEditingHargaId] = useState<string | null>(null);
  const [priceForm, setPriceForm] = useState({
    supplierId: "",
    harga: 0,
    adalahHargaTerbaik: false,
  });

  // Calculate Best Price for each Product
  const productPriceMap = useMemo(() => {
    const map = new Map<string, HargaBarang>();
    hargaList.forEach((harga) => {
      // Logic: Prefer 'adalahHargaTerbaik', otherwise maybe lowest?
      // For now, if multiple, the one marked as best wins.
      // If none marked best, we might want the lowest.
      const existing = map.get(harga.barangId);

      if (harga.adalahHargaTerbaik) {
        map.set(harga.barangId, harga);
      } else if (!existing) {
        map.set(harga.barangId, harga);
      } else if (!existing.adalahHargaTerbaik && harga.harga < existing.harga) {
        // If existing is NOT best, and new one is cheaper, take new one
        map.set(harga.barangId, harga);
      }
    });
    return map;
  }, [hargaList]);

  // Group Products by Category
  const groupedProducts = useMemo(() => {
    const filtered = barangList.filter(
      (b) =>
        b.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.kode.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const groups: { [category: string]: Barang[] } = {};

    filtered.forEach((b) => {
      const category = b.kategoriBarang?.nama || "Uncategorized";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(b);
    });

    return groups;
  }, [barangList, searchTerm]);

  const handleManagePrice = (product: Barang) => {
    setSelectedProduct(product);
    setPriceForm({ supplierId: "", harga: 0, adalahHargaTerbaik: true });
    setEditingHargaId(null);
    setIsManagePriceOpen(true);
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      if (editingHargaId) {
        await updateHarga.mutateAsync({
          id: editingHargaId,
          barangId: selectedProduct.id,
          supplierId: priceForm.supplierId,
          kategoriId: selectedProduct.kategoriId, // Maintain category consistency
          harga: priceForm.harga,
          adalahHargaTerbaik: priceForm.adalahHargaTerbaik,
        });
        toast({ title: "Berhasil", description: "Harga berhasil diperbarui" });
      } else {
        await createHarga.mutateAsync({
          barangId: selectedProduct.id,
          supplierId: priceForm.supplierId,
          kategoriId: selectedProduct.kategoriId,
          harga: priceForm.harga,
          adalahHargaTerbaik: priceForm.adalahHargaTerbaik,
        });
        toast({
          title: "Berhasil",
          description: "Harga baru berhasil ditambahkan",
        });
      }
      // Reset form
      setEditingHargaId(null);
      setPriceForm({ supplierId: "", harga: 0, adalahHargaTerbaik: true });
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menyimpan harga",
        variant: "destructive",
      });
    }
  };

  const startEditPrice = (harga: HargaBarang) => {
    setEditingHargaId(harga.id);
    setPriceForm({
      supplierId: harga.supplierId,
      harga: harga.harga,
      adalahHargaTerbaik: harga.adalahHargaTerbaik,
    });
  };

  // Helper currency formatter if not imported
  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Aplikasi Manajemen Stok Barang
          </h1>
          <p className="text-sm text-slate-500">
            Kelola stok dan pantau harga barang dengan mudah
          </p>
        </div>

        {/* Quick Stats / Navigation look-alike */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-100 p-3 rounded-xl flex items-center justify-center gap-2 text-slate-500 font-medium cursor-pointer hover:bg-slate-200 transition">
            <Package className="w-5 h-5" />
            Manajemen Stok
          </div>
          <div className="bg-white border border-slate-200 shadow-sm p-3 rounded-xl flex items-center justify-center gap-2 text-slate-900 font-bold cursor-default">
            <DollarSign className="w-5 h-5" />
            Harga Barang
          </div>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Harga Barang per Kategori
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Pantau harga tertinggi dan terendah per kategori
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" /> Harga
                  Tertinggi
                </span>
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-500" /> Harga
                  Terendah
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari produk atau SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-slate-200 focus-visible:ring-blue-500 bg-slate-50"
                />
              </div>
              <div className="w-full md:w-[200px]">
                {/* Placeholder for Category Filter if needed, currently we stick to list headers */}
                <div className="h-10 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-500 flex items-center justify-between">
                  Semua Kategori
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {isLoadingBarang ? (
              <div className="text-center py-10 text-slate-500">
                Memuat data barang...
              </div>
            ) : Object.keys(groupedProducts).length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                Tidak ada produk ditemukan.
              </div>
            ) : (
              Object.entries(groupedProducts).map(([category, products]) => (
                <div
                  key={category}
                  className="border border-slate-100 rounded-xl overflow-hidden"
                >
                  <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">{category}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-white text-slate-500 border-slate-200 hover:bg-white"
                    >
                      {products.length} produk
                    </Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[100px]">SKU</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead className="w-[100px]">Stok</TableHead>
                        <TableHead className="w-[200px]">Harga</TableHead>
                        <TableHead className="w-[100px] text-right">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const bestPrice = productPriceMap.get(product.id);
                        return (
                          <TableRow
                            key={product.id}
                            className="hover:bg-slate-50 border-slate-100"
                          >
                            <TableCell className="font-medium text-slate-700">
                              {product.kode}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-900">
                              {product.nama}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`${product.stok < (product.stokMinimum || 5) ? "text-red-600 font-bold" : "text-green-600 font-medium"}`}
                              >
                                {product.stok}
                              </span>
                            </TableCell>
                            <TableCell>
                              {bestPrice ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-900">
                                    {formatIDR(bestPrice.harga)}
                                  </span>
                                  {bestPrice.harga > 10000000 && (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                  )}
                                  {bestPrice.harga < 500000 && (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-sm">
                                  Belum ada harga
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                onClick={() => handleManagePrice(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Manage Price Dialog */}
      <Dialog open={isManagePriceOpen} onOpenChange={setIsManagePriceOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Kelola Harga Barang</DialogTitle>
            <DialogDescription>
              {selectedProduct?.nama} ({selectedProduct?.kode})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Form Add/Edit */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                {editingHargaId ? "Edit Harga" : "Tambah Harga Supplier"}
              </h4>
              <form onSubmit={handleSavePrice} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Combobox
                      value={priceForm.supplierId}
                      onChange={(val) =>
                        setPriceForm((prev) => ({ ...prev, supplierId: val }))
                      }
                      options={supplierList.map((s) => ({
                        value: s.id,
                        label: s.nama,
                      }))}
                      placeholder="Pilih Supplier"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Harga</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                        Rp
                      </span>
                      <Input
                        type="number"
                        className="pl-9"
                        value={priceForm.harga}
                        onChange={(e) =>
                          setPriceForm((prev) => ({
                            ...prev,
                            harga: parseFloat(e.target.value) || 0,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bestPrice"
                    checked={priceForm.adalahHargaTerbaik}
                    onChange={(e) =>
                      setPriceForm((prev) => ({
                        ...prev,
                        adalahHargaTerbaik: e.target.checked,
                      }))
                    }
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="bestPrice" className="cursor-pointer">
                    Set sebagai Harga Utama (Terbaik)
                  </Label>
                </div>
                <div className="flex justify-end gap-2">
                  {editingHargaId && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setEditingHargaId(null);
                        setPriceForm({
                          supplierId: "",
                          harga: 0,
                          adalahHargaTerbaik: true,
                        });
                      }}
                    >
                      Batal Edit
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Simpan
                  </Button>
                </div>
              </form>
            </div>

            {/* List Existing Prices */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">
                Daftar Harga Supplier
              </h4>
              <Table>
                <TableHeader>
                  <TableRow className="h-8">
                    <TableHead className="text-xs">Supplier</TableHead>
                    <TableHead className="text-xs">Harga</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hargaList
                    .filter((h) => h.barangId === selectedProduct?.id)
                    .map((harga) => (
                      <TableRow key={harga.id} className="h-10">
                        <TableCell className="py-2">
                          {harga.supplier.nama}
                        </TableCell>
                        <TableCell className="py-2 font-medium">
                          {formatIDR(harga.harga)}
                        </TableCell>
                        <TableCell className="py-2">
                          {harga.adalahHargaTerbaik && (
                            <Badge className="text-[10px] bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                              Utama
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => startEditPrice(harga)}
                          >
                            <Edit className="w-3 h-3 text-slate-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {hargaList.filter((h) => h.barangId === selectedProduct?.id)
                    .length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-xs text-slate-400 py-4"
                      >
                        Belum ada data harga.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsManagePriceOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
