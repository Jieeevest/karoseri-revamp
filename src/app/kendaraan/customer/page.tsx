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
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Phone,
  Mail,
  MapPin,
  Building,
} from "lucide-react";
import { useState } from "react";

interface Customer {
  id: string;
  kode: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  createdAt: string;
}

export default function CustomerPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([
    {
      id: "1",
      kode: "CUS001",
      nama: "PT. Maju Bersama",
      alamat: "Jl. Industri Raya No. 100, Jakarta Utara",
      telepon: "021-5551234",
      email: "info@majubersama.com",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      kode: "CUS002",
      nama: "CV. Jaya Transport",
      alamat: "Jl. Pergudangan No. 50, Bekasi",
      telepon: "021-8856789",
      email: "contact@jayatransport.com",
      createdAt: "2024-01-16",
    },
    {
      id: "3",
      kode: "CUS003",
      nama: "PT. Logistik Indonesia",
      alamat: "Jl. Terminal Cargo No. 25, Tangerang",
      telepon: "021-5432109",
      email: "admin@logistikindonesia.co.id",
      createdAt: "2024-01-17",
    },
    {
      id: "4",
      kode: "CUS004",
      nama: "UD. Sentosa Abadi",
      alamat: "Jl. Raya Bogor No. 75, Depok",
      telepon: "021-9876543",
      email: "sentosaabadi@email.com",
      createdAt: "2024-01-18",
    },
    {
      id: "5",
      kode: "CUS005",
      nama: "PT. Express Delivery",
      alamat: "Jl. Bandara No. 200, Tangerang",
      telepon: "021-7654321",
      email: "support@expressdelivery.com",
      createdAt: "2024-01-19",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    alamat: "",
    telepon: "",
    email: "",
  });

  const filteredCustomer = customerList.filter(
    (customer) =>
      customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCustomer) {
      setCustomerList((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCustomerList((prev) => [...prev, newCustomer]);
    }

    setFormData({ kode: "", nama: "", alamat: "", telepon: "", email: "" });
    setEditingCustomer(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      kode: customer.kode,
      nama: customer.nama,
      alamat: customer.alamat || "",
      telepon: customer.telepon || "",
      email: customer.email || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data customer ini?")) {
      setCustomerList((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const openAddDialog = () => {
    setEditingCustomer(null);
    setFormData({ kode: "", nama: "", alamat: "", telepon: "", email: "" });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Data Customer
            </h1>
            <p className="text-sm text-slate-500">
              Manajemen data customer/pelanggan
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openAddDialog}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-xl border-slate-100 shadow-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-slate-900">
                    {editingCustomer ? "Edit Customer" : "Tambah Customer Baru"}
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    {editingCustomer
                      ? "Edit data customer yang sudah ada."
                      : "Isi form berikut untuk menambahkan customer baru."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="kode"
                      className="text-slate-700 font-medium"
                    >
                      Kode
                    </Label>
                    <Input
                      id="kode"
                      value={formData.kode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kode: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder="Contoh: CUS001"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="nama"
                      className="text-slate-700 font-medium"
                    >
                      Nama Customer
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          nama: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                      placeholder="Nama perusahaan atau individu"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="telepon"
                        className="text-slate-700 font-medium"
                      >
                        Telepon
                      </Label>
                      <Input
                        id="telepon"
                        value={formData.telepon}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            telepon: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        placeholder="Nomor telepon kantor"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-slate-700 font-medium"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0"
                        placeholder="Email customer"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="alamat"
                      className="text-slate-700 font-medium"
                    >
                      Alamat
                    </Label>
                    <Textarea
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          alamat: e.target.value,
                        }))
                      }
                      className="rounded-xl border-slate-200 focus-visible:ring-blue-600 focus-visible:ring-offset-0 resize-none"
                      placeholder="Alamat lengkap customer"
                      rows={3}
                    />
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
                    {editingCustomer ? "Simpan Perubahan" : "Simpan Customer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Customer
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {customerList.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Customer dengan Email
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {customerList.filter((c) => c.email).length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Customer dengan Telepon
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {customerList.filter((c) => c.telepon).length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Daftar Customer
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari customer..."
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
                    Kode
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Nama Customer
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Kontak
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Alamat
                  </TableHead>
                  <TableHead className="px-6 font-semibold text-slate-500">
                    Tanggal Dibuat
                  </TableHead>
                  <TableHead className="px-6 text-center font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomer.length > 0 ? (
                  filteredCustomer.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-blue-50/30 transition-colors border-slate-100 group cursor-default"
                    >
                      <TableCell className="px-6 font-medium text-slate-700">
                        <Badge
                          variant="outline"
                          className="border-slate-200 bg-slate-50"
                        >
                          {customer.kode}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
                            <Building className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {customer.nama}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="space-y-1">
                          {customer.telepon && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="h-3 w-3 text-slate-400" />
                              {customer.telepon}
                            </div>
                          )}
                          {customer.email && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Mail className="h-3 w-3 text-slate-400" />
                              <span className="text-blue-600 hover:underline cursor-pointer">
                                {customer.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        {customer.alamat ? (
                          <div className="flex items-start gap-2 text-sm max-w-xs text-slate-600">
                            <MapPin className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">
                              {customer.alamat}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-sm">
                            Tidak ada
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 text-sm text-slate-600">
                        {customer.createdAt}
                      </TableCell>
                      <TableCell className="px-6 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(customer)}
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(customer.id)}
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
      </div>
    </DashboardLayout>
  );
}
