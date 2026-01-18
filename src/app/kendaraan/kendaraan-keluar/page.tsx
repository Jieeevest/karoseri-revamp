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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Car,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Calendar,
  ClipboardCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useKendaraanKeluar,
  useCreateKendaraanKeluar,
  useDeleteKendaraanKeluar,
} from "@/hooks/use-kendaraan-keluar";
import { useKendaraan } from "@/hooks/use-kendaraan";

interface QCChecklist {
  id: string;
  area: string;
  item: string;
  kondisi: "BAIK" | "RUSAK" | "PERLU_PERBAIKAN";
  catatan: string;
}

export default function KendaraanKeluarPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQCDialogOpen, setIsQCDialogOpen] = useState(false);
  const [isSuratDialogOpen, setIsSuratDialogOpen] = useState(false);
  const [selectedKendaraan, setSelectedKendaraan] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    tanggalKeluar: new Date().toISOString().split("T")[0],
    kendaraanId: "",
    qcResult: "",
    layakKeluar: false,
    suratJalan: "",
  });

  const [qcChecklist, setQcChecklist] = useState<QCChecklist[]>([
    {
      id: "1",
      area: "Eksterior",
      item: "Kondisi Cat Body",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "2",
      area: "Eksterior",
      item: "Kaca Spion",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "3",
      area: "Eksterior",
      item: "Lampu Depan",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "4",
      area: "Eksterior",
      item: "Lampu Belakang",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "5",
      area: "Eksterior",
      item: "Lampu Sen",
      kondisi: "BAIK",
      catatan: "",
    },
    { id: "6", area: "Eksterior", item: "Ban", kondisi: "BAIK", catatan: "" },
    {
      id: "7",
      area: "Interior",
      item: "Dashboard",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "8",
      area: "Interior",
      item: "Jok Supir",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "9",
      area: "Interior",
      item: "Jok Kenek",
      kondisi: "BAIK",
      catatan: "",
    },
    { id: "10", area: "Interior", item: "AC", kondisi: "BAIK", catatan: "" },
    {
      id: "11",
      area: "Pengerjaan",
      item: "Wing Box",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "12",
      area: "Pengerjaan",
      item: "Pintu",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "13",
      area: "Pengerjaan",
      item: "Kunci",
      kondisi: "BAIK",
      catatan: "",
    },
    {
      id: "14",
      area: "Keamanan",
      item: "Segitiga Pengaman",
      kondisi: "BAIK",
      catatan: "",
    },
    { id: "15", area: "Keamanan", item: "P3K", kondisi: "BAIK", catatan: "" },
    { id: "16", area: "Keamanan", item: "APAR", kondisi: "BAIK", catatan: "" },
  ]);

  const { data: kendaraanKeluarList = [] } = useKendaraanKeluar(searchTerm);
  const { data: allKendaraanData } = useKendaraan();
  const kendaraanList = (allKendaraanData as any[]) || [];

  const createKendaraanKeluar = useCreateKendaraanKeluar();
  const deleteKendaraanKeluar = useDeleteKendaraanKeluar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedVeh = kendaraanList.find(
      (k: any) => k.id === formData.kendaraanId,
    );
    if (!selectedVeh) return;

    if (selectedVeh.status !== "SELESAI") {
      alert('Kendaraan harus memiliki status "Selesai" sebelum dapat keluar!');
      return;
    }

    try {
      await createKendaraanKeluar.mutateAsync({
        tanggalKeluar: formData.tanggalKeluar,
        kendaraanId: formData.kendaraanId,
        qcResult: formData.qcResult,
        layakKeluar: formData.layakKeluar,
        suratJalan: formData.layakKeluar ? `surat_jalan_${Date.now()}.pdf` : "",
      });
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create kendaraan keluar", error);
      alert("Gagal menyimpan data");
    }
  };

  const resetForm = () => {
    setFormData({
      tanggalKeluar: new Date().toISOString().split("T")[0],
      kendaraanId: "",
      qcResult: "",
      layakKeluar: false,
      suratJalan: "",
    });
    setQcChecklist(
      qcChecklist.map((item) => ({ ...item, kondisi: "BAIK", catatan: "" })),
    );
  };

  const handleQC = (kendaraanKeluar: any) => {
    setSelectedKendaraan(kendaraanKeluar);
    setIsQCDialogOpen(true);
  };

  const handleViewSurat = (kendaraanKeluar: any) => {
    setSelectedKendaraan(kendaraanKeluar);
    setIsSuratDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      await deleteKendaraanKeluar.mutateAsync(id);
    }
  };

  const updateQCChecklist = (id: string, field: string, value: any) => {
    setQcChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const getQCSummary = () => {
    const baik = qcChecklist.filter((item) => item.kondisi === "BAIK").length;
    const rusak = qcChecklist.filter((item) => item.kondisi === "RUSAK").length;
    const perluPerbaikan = qcChecklist.filter(
      (item) => item.kondisi === "PERLU_PERBAIKAN",
    ).length;

    return { baik, rusak, perluPerbaikan };
  };

  const qcSummary = getQCSummary();

  const getTodayStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayItems = kendaraanKeluarList.filter(
      (kk: any) => kk.tanggalKeluar && kk.tanggalKeluar.split("T")[0] === today,
    );

    return {
      total: todayItems.length,
      layakKeluar: todayItems.filter((kk: any) => kk.layakKeluar).length,
      tidakLayak: todayItems.filter((kk: any) => !kk.layakKeluar).length,
    };
  };

  const todayStats = getTodayStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Kendaraan Keluar
            </h1>
            <p className="text-sm text-slate-500">
              Quality Control dan pencetakan surat jalan
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Car className="mr-2 h-4 w-4" />
                Kendaraan Keluar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    Form Kendaraan Keluar
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Quality Control dan persetujuan kendaraan untuk keluar
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="tanggalKeluar"
                        className="text-slate-700 font-medium"
                      >
                        Tanggal Keluar
                      </Label>
                      <Input
                        id="tanggalKeluar"
                        type="date"
                        value={formData.tanggalKeluar}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tanggalKeluar: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        required
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label
                        htmlFor="kendaraanId"
                        className="text-slate-700 font-medium"
                      >
                        Kendaraan
                      </Label>
                      <Select
                        value={formData.kendaraanId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            kendaraanId: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-blue-600 focus:ring-offset-0">
                          <SelectValue placeholder="Pilih kendaraan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                          {kendaraanList
                            .filter((k: any) => k.status === "SELESAI")
                            .map((kendaraan: any) => (
                              <SelectItem
                                key={kendaraan.id}
                                value={kendaraan.id}
                                className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                              >
                                {kendaraan.nomorPolisi} -{" "}
                                {kendaraan.merekKendaraan?.nama ||
                                  kendaraan.merek}{" "}
                                {kendaraan.tipeKendaraan?.nama ||
                                  kendaraan.tipe}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="qcResult"
                      className="text-slate-700 font-medium"
                    >
                      Hasil QC
                    </Label>
                    <Textarea
                      id="qcResult"
                      value={formData.qcResult}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          qcResult: e.target.value,
                        }))
                      }
                      placeholder="Deskripsikan hasil quality control kendaraan"
                      rows={3}
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <Checkbox
                      id="layakKeluar"
                      checked={formData.layakKeluar}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          layakKeluar: checked as boolean,
                        }))
                      }
                      className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
                    />
                    <Label
                      htmlFor="layakKeluar"
                      className="font-medium text-slate-700 cursor-pointer"
                    >
                      Kendaraan layak keluar
                    </Label>
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
                    className="bg-blue-600 hover:bg-blue-700 distabled:opacity-50 text-white rounded-xl shadow-md shadow-blue-200 cursor-pointer"
                  >
                    Proses Kendaraan Keluar
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
                    Total Keluar
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {kendaraanKeluarList.length}
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
                    {todayStats.total}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Layak Keluar
                  </p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {todayStats.layakKeluar}
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
                    Tidak Layak
                  </p>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    {todayStats.tidakLayak}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Riwayat Kendaraan Keluar
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari kendaraan keluar..."
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
                    Kendaraan
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Hasil QC
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Surat Jalan
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kendaraanKeluarList.length > 0 ? (
                  kendaraanKeluarList.map((kendaraanKeluar: any) => (
                    <TableRow
                      key={kendaraanKeluar.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50"
                        >
                          {kendaraanKeluar.nomor}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {kendaraanKeluar.tanggalKeluar
                          ? new Date(
                              kendaraanKeluar.tanggalKeluar,
                            ).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="px-6">
                        <div>
                          <p className="font-medium text-slate-900">
                            {kendaraanKeluar.kendaraan?.nomorPolisi || "-"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {kendaraanKeluar.kendaraan?.merekKendaraan?.nama ||
                              kendaraanKeluar.kendaraan?.merek ||
                              ""}{" "}
                            {kendaraanKeluar.kendaraan?.tipeKendaraan?.nama ||
                              kendaraanKeluar.kendaraan?.tipe ||
                              ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="max-w-xs">
                          <p
                            className="text-sm text-slate-600 line-clamp-2"
                            title={kendaraanKeluar.qcResult}
                          >
                            {kendaraanKeluar.qcResult}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        {kendaraanKeluar.layakKeluar ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Layak Keluar
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                            <XCircle className="mr-1 h-3 w-3" />
                            Tidak Layak
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6">
                        {kendaraanKeluar.suratJalan ? (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                          >
                            <FileText className="mr-1 h-3 w-3 text-slate-500" />
                            Generated
                          </Badge>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQC(kendaraanKeluar)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            title="Cek Quality Control"
                          >
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                          {kendaraanKeluar.suratJalan && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewSurat(kendaraanKeluar)}
                              className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Lihat Surat Jalan"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(kendaraanKeluar.id)}
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

        {/* QC Dialog */}
        <Dialog open={isQCDialogOpen} onOpenChange={setIsQCDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Quality Control Checklist
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Checklist QC untuk kendaraan{" "}
                <span className="font-semibold text-slate-700">
                  {selectedKendaraan?.kendaraan?.nomorPolisi}
                </span>
              </DialogDescription>
            </DialogHeader>
            {selectedKendaraan && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {qcSummary.baik}
                    </p>
                    <p className="text-sm font-medium text-green-700">Baik</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-center">
                    <p className="text-3xl font-bold text-red-600">
                      {qcSummary.rusak}
                    </p>
                    <p className="text-sm font-medium text-red-700">Rusak</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-center">
                    <p className="text-3xl font-bold text-yellow-600">
                      {qcSummary.perluPerbaikan}
                    </p>
                    <p className="text-sm font-medium text-yellow-700">
                      Perlu Perbaikan
                    </p>
                  </div>
                </div>

                {["Eksterior", "Interior", "Pengerjaan", "Keamanan"].map(
                  (area) => (
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
                                    onValueChange={(
                                      value:
                                        | "BAIK"
                                        | "RUSAK"
                                        | "PERLU_PERBAIKAN",
                                    ) =>
                                      updateQCChecklist(
                                        item.id,
                                        "kondisi",
                                        value,
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      className={cn(
                                        "w-36 h-9 rounded-lg border-0 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                                        item.kondisi === "BAIK"
                                          ? "bg-green-50 ring-green-200 text-green-700"
                                          : item.kondisi === "RUSAK"
                                            ? "bg-red-50 ring-red-200 text-red-700"
                                            : "bg-yellow-50 ring-yellow-200 text-yellow-700",
                                      )}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem
                                        value="BAIK"
                                        className="text-green-700 focus:text-green-800 focus:bg-green-50"
                                      >
                                        Baik
                                      </SelectItem>
                                      <SelectItem
                                        value="RUSAK"
                                        className="text-red-700 focus:text-red-800 focus:bg-red-50"
                                      >
                                        Rusak
                                      </SelectItem>
                                      <SelectItem
                                        value="PERLU_PERBAIKAN"
                                        className="text-yellow-700 focus:text-yellow-800 focus:bg-yellow-50"
                                      >
                                        Perlu Perbaikan
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <Input
                                  placeholder="Catatan (opsional)"
                                  value={item.catatan}
                                  onChange={(e) =>
                                    updateQCChecklist(
                                      item.id,
                                      "catatan",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full sm:w-64 h-9 rounded-lg border-slate-200 focus-visible:ring-blue-600"
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Surat Jalan Dialog */}
        <Dialog open={isSuratDialogOpen} onOpenChange={setIsSuratDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-xl border-slate-100 shadow-2xl">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Preview Surat Jalan
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Surat jalan untuk kendaraan{" "}
                <span className="font-semibold text-slate-700">
                  {selectedKendaraan?.kendaraan?.nomorPolisi}
                </span>
              </DialogDescription>
            </DialogHeader>
            {selectedKendaraan && (
              <div className="space-y-6 py-4">
                <div className="p-8 bg-white border border-slate-200 shadow-sm rounded-xl print:shadow-none print:border-0">
                  <div className="text-center space-y-6">
                    <div className="border-b-2 border-slate-800 pb-6 mb-6">
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-wide">
                        SURAT JALAN
                      </h2>
                      <p className="text-slate-500 mt-2">
                        PT. KAROSERI INDONESIA MAJU
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-left">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          Nomor Surat
                        </p>
                        <p className="font-mono font-medium text-slate-900">
                          {selectedKendaraan.nomor}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          Tanggal
                        </p>
                        <p className="font-medium text-slate-900">
                          {selectedKendaraan.tanggalKeluar
                            ? new Date(
                                selectedKendaraan.tanggalKeluar,
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          Kendaraan
                        </p>
                        <p className="font-medium text-slate-900">
                          {selectedKendaraan.kendaraan?.nomorPolisi}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          Merek/Tipe
                        </p>
                        <p className="font-medium text-slate-900">
                          {selectedKendaraan.kendaraan?.merekKendaraan?.nama ||
                            selectedKendaraan.kendaraan?.merek}{" "}
                          {selectedKendaraan.kendaraan?.tipeKendaraan?.nama ||
                            selectedKendaraan.kendaraan?.tipe}
                        </p>
                      </div>
                      <div className="col-span-2 space-y-1 pt-2">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          Status QC
                        </p>
                        <div className="inline-block">
                          {selectedKendaraan.layakKeluar ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              LAYAK KELUAR
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-red-200">
                              TIDAK LAYAK KELUAR
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-16 pt-8 border-t border-slate-200">
                    <div className="grid grid-cols-3 gap-8">
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-12">
                          Disetujui Oleh
                        </p>
                        <div className="border-t border-slate-300 pt-2 w-24 mx-auto">
                          <p className="font-semibold text-sm text-slate-900">
                            Admin
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-12">
                          Security / Satpam
                        </p>
                        <div className="border-t border-slate-300 pt-2 w-24 mx-auto">
                          <p className="font-semibold text-sm text-slate-900">
                            ( Tanda Tangan )
                          </p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase font-semibold mb-12">
                          Penerima
                        </p>
                        <div className="border-t border-slate-300 pt-2 w-24 mx-auto">
                          <p className="font-semibold text-sm text-slate-900">
                            ( Tanda Tangan )
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <Button
                    variant="outline"
                    className="rounded-xl border-slate-200 shadow-sm hover:bg-slate-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    Cetak Surat Jalan
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
