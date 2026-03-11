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
import { Plus, Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useKendaraanQC, useCreateKendaraanQC } from "@/hooks/use-kendaraan-qc";
import { useKendaraanMasuk } from "@/hooks/use-kendaraan-masuk";

interface QCChecklistItem {
  id: string;
  area: string;
  item: string;
  kondisi: "BAIK" | "RUSAK" | "PERLU_PERBAIKAN";
  catatan: string;
}

const qcTemplate: QCChecklistItem[] = [
  { id: "1", area: "Eksterior", item: "Kondisi Cat Body", kondisi: "BAIK", catatan: "" },
  { id: "2", area: "Eksterior", item: "Kaca Spion", kondisi: "BAIK", catatan: "" },
  { id: "3", area: "Eksterior", item: "Lampu Depan", kondisi: "BAIK", catatan: "" },
  { id: "4", area: "Eksterior", item: "Lampu Belakang", kondisi: "BAIK", catatan: "" },
  { id: "5", area: "Eksterior", item: "Lampu Sen", kondisi: "BAIK", catatan: "" },
  { id: "6", area: "Eksterior", item: "Ban", kondisi: "BAIK", catatan: "" },
  { id: "7", area: "Interior", item: "Dashboard", kondisi: "BAIK", catatan: "" },
  { id: "8", area: "Interior", item: "Jok Supir", kondisi: "BAIK", catatan: "" },
  { id: "9", area: "Interior", item: "Jok Kenek", kondisi: "BAIK", catatan: "" },
  { id: "10", area: "Interior", item: "AC", kondisi: "BAIK", catatan: "" },
  { id: "11", area: "Pengerjaan", item: "Wing Box", kondisi: "BAIK", catatan: "" },
  { id: "12", area: "Pengerjaan", item: "Pintu", kondisi: "BAIK", catatan: "" },
  { id: "13", area: "Pengerjaan", item: "Kunci", kondisi: "BAIK", catatan: "" },
  { id: "14", area: "Keamanan", item: "Segitiga Pengaman", kondisi: "BAIK", catatan: "" },
  { id: "15", area: "Keamanan", item: "P3K", kondisi: "BAIK", catatan: "" },
  { id: "16", area: "Keamanan", item: "APAR", kondisi: "BAIK", catatan: "" },
];

export default function KendaraanQCPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedQc, setSelectedQc] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    tanggalQC: new Date().toISOString().split("T")[0],
    kendaraanMasukId: "",
    hasil: "",
    layakKeluar: true,
  });
  const [qcChecklist, setQcChecklist] = useState<QCChecklistItem[]>(
    qcTemplate.map((item) => ({ ...item })),
  );

  const { toast } = useToast();

  const { data: qcData } = useKendaraanQC({
    page,
    limit,
    search: searchTerm,
    sortBy,
    sortOrder,
  });
  const qcList = qcData?.data || [];
  const pagination = qcData?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  };

  const { data: kendaraanMasukData } = useKendaraanMasuk({
    page: 1,
    limit: 100,
    search: "",
  });
  const kendaraanMasukList = kendaraanMasukData?.data || [];
  const pendingMasuk = kendaraanMasukList.filter(
    (km: any) => !km.kendaraanQC && km.kendaraan?.status === "SELESAI",
  );

  const createQC = useCreateKendaraanQC();

  const resetForm = () => {
    setFormData({
      tanggalQC: new Date().toISOString().split("T")[0],
      kendaraanMasukId: "",
      hasil: "",
      layakKeluar: true,
    });
    setQcChecklist(qcTemplate.map((item) => ({ ...item })));
  };

  const updateChecklist = (id: string, field: string, value: any) => {
    setQcChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createQC.mutateAsync({
        kendaraanMasukId: formData.kendaraanMasukId,
        tanggalQC: formData.tanggalQC,
        hasil: formData.hasil,
        layakKeluar: formData.layakKeluar,
        checklist: qcChecklist,
      });

      toast({
        title: "QC Disimpan",
        description: "Data quality control berhasil disimpan.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save QC", error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan QC.",
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

  const openDetail = (qc: any) => {
    setSelectedQc(qc);
    setIsDetailOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Form QC
            </h1>
            <p className="text-sm text-slate-500">
              Pengecekan kondisi kendaraan sebelum keluar
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                QC Kendaraan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader className="border-b border-slate-100 pb-4">
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Form QC Kendaraan
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Pastikan kendaraan lulus QC sebelum keluar
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid items-center gap-2">
                      <Label htmlFor="tanggalQC" className="text-slate-700 font-medium">
                        Tanggal QC
                      </Label>
                      <Input
                        id="tanggalQC"
                        type="date"
                        value={formData.tanggalQC}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggalQC: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="kendaraanMasukId" className="text-slate-700 font-medium">
                        Kendaraan Masuk
                      </Label>
                      <Select
                        value={formData.kendaraanMasukId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            kendaraanMasukId: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih kendaraan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {pendingMasuk.map((km: any) => (
                            <SelectItem
                              key={km.id}
                              value={km.id}
                              className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                            >
                              {km.kendaraan?.nomorPolisi || "-"} - {km.kendaraan?.merekKendaraan?.nama || ""} {km.kendaraan?.tipeKendaraan?.nama || ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hasil" className="text-slate-700 font-medium">
                      Hasil QC
                    </Label>
                    <Textarea
                      id="hasil"
                      value={formData.hasil}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hasil: e.target.value,
                        }))
                      }
                      placeholder="Deskripsikan hasil QC kendaraan"
                      rows={3}
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <input
                      id="layakKeluar"
                      type="checkbox"
                      checked={formData.layakKeluar}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          layakKeluar: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="layakKeluar" className="font-medium text-slate-700 cursor-pointer">
                      Kendaraan layak keluar
                    </Label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-1 h-6 bg-blue-600 rounded-full inline-block"></span>
                      Checklist QC
                    </h3>
                    {["Eksterior", "Interior", "Pengerjaan", "Keamanan"].map((area) => (
                      <div
                        key={area}
                        className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                      >
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                          <h4 className="font-semibold text-slate-800">{area}</h4>
                        </div>
                        <div className="p-4 space-y-3 bg-white">
                          {qcChecklist
                            .filter((item) => item.area === area)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border border-slate-100 rounded-lg hover:border-blue-200 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <span className="font-medium text-slate-700 w-full sm:w-48">
                                      {item.item}
                                    </span>
                                    <Select
                                      value={item.kondisi}
                                      onValueChange={(value) =>
                                        updateChecklist(item.id, "kondisi", value)
                                      }
                                    >
                                      <SelectTrigger className="w-36 h-9 rounded-lg border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="BAIK">Baik</SelectItem>
                                        <SelectItem value="RUSAK">Rusak</SelectItem>
                                        <SelectItem value="PERLU_PERBAIKAN">Perlu Perbaikan</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <Input
                                    placeholder="Catatan (opsional)"
                                    value={item.catatan}
                                    onChange={(e) =>
                                      updateChecklist(item.id, "catatan", e.target.value)
                                    }
                                    className="w-full sm:w-64 h-9 rounded-lg border-slate-200 focus-visible:ring-blue-600"
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
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
                    Simpan QC
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Riwayat QC
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari kendaraan..."
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
                  <TableHead className="px-6 font-semibold text-slate-500">Nomor Polisi</TableHead>
                  <TableHead
                    className="px-6 font-semibold text-slate-500 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleSort("tanggalQC")}
                  >
                    Tanggal QC
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">Hasil</TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">Status</TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500 text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qcList.length > 0 ? (
                  qcList.map((qc: any) => (
                    <TableRow
                      key={qc.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        {qc.kendaraan?.nomorPolisi || "-"}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {qc.tanggalQC ? new Date(qc.tanggalQC).toLocaleDateString("id-ID") : "-"}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="max-w-xs">
                          <p className="text-sm text-slate-600 line-clamp-2" title={qc.hasil}>
                            {qc.hasil}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        {qc.layakKeluar ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Lulus QC
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                            <XCircle className="mr-1 h-3 w-3" />
                            Tidak Lulus
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetail(qc)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          title="Lihat Detail QC"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="px-6 h-24 text-center text-slate-500">
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {pagination && (
            <div className="pb-4 px-4 border-t border-slate-100">
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

        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Detail QC
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {selectedQc?.kendaraan?.nomorPolisi || "-"} -{" "}
                {selectedQc?.kendaraan?.merekKendaraan?.nama || ""}{" "}
                {selectedQc?.kendaraan?.tipeKendaraan?.nama || ""}
              </DialogDescription>
            </DialogHeader>
            {selectedQc && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      Tanggal QC
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {selectedQc.tanggalQC
                        ? new Date(selectedQc.tanggalQC).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      Status
                    </p>
                    {selectedQc.layakKeluar ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Lulus QC
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        Tidak Lulus
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Hasil QC
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedQc.hasil || "-"}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                    Checklist
                  </p>
                  {["Eksterior", "Interior", "Pengerjaan", "Keamanan"].map(
                    (area) => (
                      <div
                        key={area}
                        className="border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                      >
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                          <h4 className="font-semibold text-slate-800">
                            {area}
                          </h4>
                        </div>
                        <div className="p-4 space-y-2 bg-white">
                          {(selectedQc.checklist || [])
                            .filter((item: any) => item.area === area)
                            .map((item: any) => (
                              <div
                                key={item.id}
                                className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm"
                              >
                                <div>
                                  <p className="font-medium text-slate-700">
                                    {item.item}
                                  </p>
                                  {item.catatan && (
                                    <p className="text-xs text-slate-500 mt-1">
                                      {item.catatan}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs capitalize"
                                >
                                  {item.kondisi.toLowerCase().replace("_", " ")}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
