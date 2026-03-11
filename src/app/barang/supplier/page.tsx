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
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Building,
  Phone,
  Mail,
  MapPin,
  ArrowUpDown,
  Landmark,
  PlusCircle,
  XCircle,
  Save,
} from "lucide-react";
import { useState } from "react";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useSession } from "next-auth/react";
import * as yup from "yup";

import { useToast } from "@/hooks/use-toast";
import { formatDateIndonesia } from "@/lib/date-format";
import {
  Supplier,
  SupplierBankAccount,
  useSupplier,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/hooks/use-supplier";

type SupplierFormBankAccount = Pick<
  SupplierBankAccount,
  "nomorRekening" | "atasNamaRekening" | "namaBank"
>;

const emptyBankAccount = (): SupplierFormBankAccount => ({
  nomorRekening: "",
  atasNamaRekening: "",
  namaBank: "",
});

const INDONESIAN_BANK_OPTIONS = [
  "BCA",
  "Bank Mandiri",
  "BRI",
  "BNI",
  "BTN",
  "CIMB Niaga",
  "Bank Danamon",
  "Permata Bank",
  "Bank Syariah Indonesia (BSI)",
  "Bank Mega",
  "Bank OCBC NISP",
  "Bank Panin",
  "Bank BTPN",
  "Bank Maybank Indonesia",
  "Bank DBS Indonesia",
  "Bank UOB Indonesia",
  "Bank Jago",
  "SeaBank Indonesia",
  "Bank Neo Commerce",
];

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 15);
  const chunks = [
    digits.slice(0, 4),
    digits.slice(4, 8),
    digits.slice(8, 12),
    digits.slice(12, 15),
  ].filter(Boolean);

  return chunks.join("-");
};

const supplierSchema = yup.object({
  nama: yup.string().trim().required("Nama supplier wajib diisi"),
  alamat: yup.string().trim().required("Alamat lengkap wajib diisi"),
  telepon: yup
    .string()
    .trim()
    .required("Telepon wajib diisi")
    .test(
      "valid-phone",
      "Nomor telepon harus 10-15 digit angka",
      (value) => {
        const digits = (value || "").replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 15;
      },
    ),
  email: yup
    .string()
    .trim()
    .required("Email wajib diisi")
    .email("Format email tidak valid")
    .defined(),
});

export default function SupplierPage() {
  const { data: session } = useSession();
  const isGudang = session?.user?.role === "GUDANG";

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
    bankAccounts: [emptyBankAccount()],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(
    null,
  );

  const { data: queryData, isLoading } = useSupplier({
    search: searchTerm,
    page,
    limit,
    sortBy,
    sortOrder,
  });

  const supplierList = (queryData as any)?.data || [];
  const pagination = (queryData as any)?.pagination;

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();
  const { toast } = useToast();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: Record<string, string> = {};

    try {
      await supplierSchema.validate(formData, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        error.inner.forEach((issue) => {
          if (issue.path && !validationErrors[issue.path]) {
            validationErrors[issue.path] = issue.message;
          }
        });
      }
    }

    formData.bankAccounts.forEach((item, index) => {
      const nomorRekening = item.nomorRekening.trim();
      const atasNamaRekening = item.atasNamaRekening.trim();
      const namaBank = item.namaBank.trim();
      const hasAnyValue = nomorRekening || atasNamaRekening || namaBank;

      if (!hasAnyValue) {
        return;
      }

      if (!nomorRekening) {
        validationErrors[`bankAccounts.${index}.nomorRekening`] =
          "Nomor rekening wajib diisi";
      }

      if (!atasNamaRekening) {
        validationErrors[`bankAccounts.${index}.atasNamaRekening`] =
          "Atas nama rekening wajib diisi";
      }

      if (!namaBank) {
        validationErrors[`bankAccounts.${index}.namaBank`] =
          "Nama bank wajib diisi";
      }
    });

    const hasCompleteBankAccount = formData.bankAccounts.some((item) => {
      const nomorRekening = item.nomorRekening.trim();
      const atasNamaRekening = item.atasNamaRekening.trim();
      const namaBank = item.namaBank.trim();
      return Boolean(nomorRekening && atasNamaRekening && namaBank);
    });

    if (!hasCompleteBankAccount) {
      validationErrors.bankAccounts =
        "Minimal 1 rekening bank wajib diisi lengkap";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});

    const cleanedBankAccounts = formData.bankAccounts
      .map((item) => ({
        nomorRekening: item.nomorRekening.trim(),
        atasNamaRekening: item.atasNamaRekening.trim(),
        namaBank: item.namaBank.trim(),
      }))
      .filter(
        (item) => item.nomorRekening || item.atasNamaRekening || item.namaBank,
      );

    try {
      if (editingSupplier) {
        await updateSupplier.mutateAsync({
          id: editingSupplier.id,
          ...formData,
          bankAccounts: cleanedBankAccounts,
        });
        toast({
          title: "Berhasil",
          description: "Data supplier berhasil diperbarui",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      } else {
        await createSupplier.mutateAsync({
          nama: formData.nama,
          alamat: formData.alamat,
          telepon: formData.telepon,
          email: formData.email,
          bankAccounts: cleanedBankAccounts,
        });
        toast({
          title: "Berhasil",
          description: "Supplier berhasil ditambahkan",
          className: "bg-green-50 text-green-800 border-green-200",
        });
      }

      setFormData({
        kode: "",
        nama: "",
        alamat: "",
        telepon: "",
        email: "",
        bankAccounts: [emptyBankAccount()],
      });
      setFormErrors({});
      setEditingSupplier(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setFormErrors({});
    setEditingSupplier(supplier);
    setFormData({
      kode: supplier.kode,
      nama: supplier.nama,
      alamat: supplier.alamat || "",
      telepon: supplier.telepon || "",
      email: supplier.email || "",
      bankAccounts:
        supplier.bankAccounts && supplier.bankAccounts.length > 0
          ? supplier.bankAccounts.map((account) => ({
              nomorRekening: account.nomorRekening || "",
              atasNamaRekening: account.atasNamaRekening || "",
              namaBank: account.namaBank || "",
            }))
          : [emptyBankAccount()],
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setDeletingSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSupplier) return;

    try {
      await deleteSupplier.mutateAsync(deletingSupplier.id);
      toast({
        title: "Berhasil",
        description: "Supplier berhasil dihapus",
        className: "bg-green-50 text-green-800 border-green-200",
      });
      setIsDeleteModalOpen(false);
      setDeletingSupplier(null);
    } catch (error) {
      console.error(error);
      toast({
        title: "Gagal",
        description: "Gagal menghapus supplier",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingSupplier(null);
    setFormErrors({});
    setFormData({
      kode: "",
      nama: "",
      alamat: "",
      telepon: "",
      email: "",
      bankAccounts: [emptyBankAccount()],
    });
    setIsDialogOpen(true);
  };

  const handleBankAccountChange = (
    index: number,
    field: keyof SupplierFormBankAccount,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[`bankAccounts.${index}.${field}`];
      delete next.bankAccounts;
      return next;
    });
  };

  const addBankAccountRow = () => {
    setFormData((prev) => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, emptyBankAccount()],
    }));
  };

  const removeBankAccountRow = (index: number) => {
    setFormData((prev) => {
      if (prev.bankAccounts.length === 1) {
        return {
          ...prev,
          bankAccounts: [emptyBankAccount()],
        };
      }

      return {
        ...prev,
        bankAccounts: prev.bankAccounts.filter((_, i) => i !== index),
      };
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Data Supplier
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manajemen data supplier barang dan kontak.
            </p>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) {
                setFormErrors({});
              }
            }}
          >
            {!isGudang && (
              <DialogTrigger asChild>
                <Button
                  onClick={openAddDialog}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Supplier
                </Button>
              </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[820px] rounded-lg border-slate-100 shadow-2xl [&>button]:cursor-pointer">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingSupplier ? "Edit Supplier" : "Tambah Supplier Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingSupplier
                      ? "Perbarui informasi supplier di sini."
                      : "Isi form berikut untuk menambahkan supplier baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="kode"
                      className="text-slate-700 font-medium"
                    >
                      Kode Supplier
                    </Label>
                    <Input
                      id="kode"
                      value={formData.kode}
                      readOnly
                      disabled={!editingSupplier}
                      className="rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder={
                        editingSupplier
                          ? "Kode supplier"
                          : "Otomatis saat supplier dibuat"
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Supplier <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) =>
                        {
                          setFormData((prev) => ({
                            ...prev,
                            nama: e.target.value,
                          }));
                          setFormErrors((prev) => {
                            const next = { ...prev };
                            delete next.nama;
                            return next;
                          });
                        }
                      }
                      className={`rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 ${
                        formErrors.nama ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      placeholder="Contoh: Supplier ABC"
                    />
                    {formErrors.nama && (
                      <p className="text-xs text-red-500">{formErrors.nama}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="alamat"
                      className="text-slate-700 font-medium"
                    >
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) =>
                        {
                          setFormData((prev) => ({
                            ...prev,
                            alamat: e.target.value,
                          }));
                          setFormErrors((prev) => {
                            const next = { ...prev };
                            delete next.alamat;
                            return next;
                          });
                        }
                      }
                      className={`rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 ${
                        formErrors.alamat
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      placeholder="Alamat lengkap supplier"
                      rows={3}
                    />
                    {formErrors.alamat && (
                      <p className="text-xs text-red-500">{formErrors.alamat}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="telepon"
                        className="text-slate-700 font-medium"
                      >
                        Telepon <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="telepon"
                        value={formData.telepon}
                        onChange={(e) =>
                          {
                            setFormData((prev) => ({
                              ...prev,
                              telepon: formatPhoneNumber(e.target.value),
                            }));
                            setFormErrors((prev) => {
                              const next = { ...prev };
                              delete next.telepon;
                              return next;
                            });
                          }
                        }
                        className={`rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 ${
                          formErrors.telepon
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        placeholder="Contoh: 021-12345678"
                      />
                      <div className="mt-1 space-y-0.5">
                        {formErrors.telepon && (
                          <p className="text-xs text-red-500">{formErrors.telepon}</p>
                        )}
                        <p className="text-[11px] text-slate-500">
                          Contoh: 0812-3456-XXXX
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-slate-700 font-medium"
                      >
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          {
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                            setFormErrors((prev) => {
                              const next = { ...prev };
                              delete next.email;
                              return next;
                            });
                          }
                        }
                        className={`rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 ${
                          formErrors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        placeholder="Contoh: info@supplier.com"
                      />
                      <p
                        className={`min-h-4 text-xs ${
                          formErrors.email ? "text-red-500" : "text-transparent"
                        }`}
                      >
                        {formErrors.email || "."}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-slate-700 font-medium">
                        Rekening Bank (Transfer)
                        <span className="text-red-500"> *</span>
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addBankAccountRow}
                        className="rounded-lg"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Tambah Rekening
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.bankAccounts.map((account, index) => (
                        <div
                          key={`bank-account-${index}`}
                          className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Input
                              value={account.nomorRekening}
                              onChange={(e) =>
                                handleBankAccountChange(
                                  index,
                                  "nomorRekening",
                                  e.target.value,
                                )
                              }
                              className={`rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 ${
                                formErrors[`bankAccounts.${index}.nomorRekening`]
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }`}
                              placeholder="Nomor Rekening"
                            />
                            <Input
                              value={account.atasNamaRekening}
                              onChange={(e) =>
                                handleBankAccountChange(
                                  index,
                                  "atasNamaRekening",
                                  e.target.value,
                                )
                              }
                              className={`rounded-lg border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 ${
                                formErrors[`bankAccounts.${index}.atasNamaRekening`]
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }`}
                              placeholder="Atas Nama Rekening"
                            />
                            <div className="flex gap-2">
                              <Select
                                value={account.namaBank}
                                onValueChange={(value) =>
                                  handleBankAccountChange(index, "namaBank", value)
                                }
                              >
                                <SelectTrigger
                                  className={`w-full rounded-lg border-slate-200 focus:ring-blue-600 focus:ring-offset-0 ${
                                    formErrors[`bankAccounts.${index}.namaBank`]
                                      ? "border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                >
                                  <SelectValue placeholder="Pilih Bank" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-slate-100 shadow-xl">
                                  {INDONESIAN_BANK_OPTIONS.map((bank) => (
                                    <SelectItem
                                      key={bank}
                                      value={bank}
                                      className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                                    >
                                      {bank}
                                    </SelectItem>
                                  ))}
                                  {account.namaBank &&
                                    !INDONESIAN_BANK_OPTIONS.includes(
                                      account.namaBank,
                                    ) && (
                                      <SelectItem
                                        value={account.namaBank}
                                        className="cursor-pointer focus:bg-blue-50 focus:text-blue-700"
                                      >
                                        {account.namaBank}
                                      </SelectItem>
                                    )}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBankAccountRow(index)}
                                className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {(formErrors[`bankAccounts.${index}.nomorRekening`] ||
                            formErrors[`bankAccounts.${index}.atasNamaRekening`] ||
                            formErrors[`bankAccounts.${index}.namaBank`]) && (
                            <p className="text-xs text-red-500">
                              {formErrors[`bankAccounts.${index}.nomorRekening`] ||
                                formErrors[`bankAccounts.${index}.atasNamaRekening`] ||
                                formErrors[`bankAccounts.${index}.namaBank`]}
                            </p>
                          )}
                        </div>
                      ))}
                      {formErrors.bankAccounts && (
                        <p className="text-xs text-red-500">
                          {formErrors.bankAccounts}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setFormErrors({});
                    }}
                    className="rounded-lg cursor-pointer"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md shadow-blue-200 cursor-pointer"
                  >
                    {editingSupplier ? (
                      <Save className="mr-2 h-4 w-4" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {editingSupplier ? "Simpan Perubahan" : "Buat Supplier"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Supplier
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari supplier..."
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
            <div className="w-full overflow-x-auto">
              <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100">
                  <TableHead
                    className="w-[120px] px-4 sm:px-6 font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("kode")}
                  >
                    <div className="flex items-center gap-2">
                      Kode
                      {sortBy === "kode" && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-[240px] px-4 sm:px-6 font-semibold text-slate-500 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort("nama")}
                  >
                    <div className="flex items-center gap-2">
                      Nama Supplier
                      {sortBy === "nama" && <ArrowUpDown className="w-3 h-3" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-[220px] px-4 sm:px-6 font-semibold text-slate-500">
                    Kontak
                  </TableHead>
                  <TableHead className="w-[260px] px-4 sm:px-6 font-semibold text-slate-500">
                    Alamat
                  </TableHead>
                  <TableHead className="w-[250px] px-4 sm:px-6 font-semibold text-slate-500">
                    Rekening
                  </TableHead>
                  <TableHead className="w-[170px] px-4 sm:px-6 text-center font-semibold text-slate-500">
                    Tanggal Dibuat
                  </TableHead>
                  {!isGudang && (
                    <TableHead className="w-[110px] px-4 sm:px-6 text-center font-semibold text-slate-500">
                      Aksi
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierList.length > 0 ? (
                  supplierList.map((supplier) => (
                    <TableRow
                      key={supplier.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-4 py-4 sm:px-6 align-top font-medium">
                        <Badge
                          variant="outline"
                          className="border-slate-200 text-slate-600 font-normal"
                        >
                          {supplier.kode}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4 sm:px-6 align-top">
                        <div className="flex items-start gap-2">
                          <Building className="h-4 w-4 mt-0.5 text-blue-600 shrink-0" />
                          <span className="font-medium text-slate-900 leading-5 break-words">
                            {supplier.nama}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 sm:px-6 align-top">
                        <div className="space-y-1 min-h-5">
                          {supplier.telepon && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {supplier.telepon}
                            </div>
                          )}
                          {supplier.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-slate-400" />
                              <span className="text-blue-600 hover:underline cursor-pointer">
                                {supplier.email}
                              </span>
                            </div>
                          )}
                          {!supplier.telepon && !supplier.email && (
                            <span className="text-sm text-slate-400">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 sm:px-6 align-top">
                        {supplier.alamat && (
                          <div className="flex items-start gap-2 text-sm max-w-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {supplier.alamat}
                            </span>
                          </div>
                        )}
                        {!supplier.alamat && (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 sm:px-6 align-top">
                        {supplier.bankAccounts &&
                        supplier.bankAccounts.length > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Landmark className="h-3 w-3 text-slate-400" />
                              <span className="leading-5 break-words">
                                {supplier.bankAccounts[0].namaBank} -{" "}
                                {supplier.bankAccounts[0].nomorRekening}
                              </span>
                            </div>
                            {supplier.bankAccounts.length > 1 && (
                              <div className="text-xs text-slate-500">
                                +{supplier.bankAccounts.length - 1} rekening
                                lainnya
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-4 sm:px-6 align-top text-center text-slate-600 whitespace-nowrap">
                        {formatDateIndonesia(supplier.createdAt)}
                      </TableCell>
                      {!isGudang && (
                        <TableCell className="px-4 py-4 sm:px-6 align-top text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(supplier)}
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(supplier)}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 px-4 sm:px-6 text-center text-slate-500"
                    >
                      Data tidak ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              </Table>
            </div>
            {/* Pagination Controls */}
            {pagination && (
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalData={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSupplier(null);
        }}
        onConfirm={async () => handleDeleteConfirm()}
        itemName={deletingSupplier?.nama}
      />
    </DashboardLayout>
  );
}
