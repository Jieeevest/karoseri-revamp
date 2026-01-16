'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Edit, Trash2, Search, Car, Eye, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface Customer {
  id: string
  kode: string
  nama: string
}

interface Kendaraan {
  id: string
  nomorPolisi: string
  merek: string
  tipe: string
}

interface Pengerjaan {
  id: string
  jenis: string
  deskripsi?: string
}

interface KelengkapanAlat {
  id: string
  area: string
  nama: string
  jumlah?: number
  kondisi: string
  deskripsi?: string
}

interface KendaraanMasuk {
  id: string
  nomor: string
  tanggalMasuk: string
  showroom: string
  customerId: string
  customer: Customer
  kendaraanId: string
  kendaraan: Kendaraan
  pengerjaan: Pengerjaan[]
  kelengkapan: KelengkapanAlat[]
  createdAt: string
}

const pengerjaanOptions = [
  'Wing Box',
  'Wing Box + Topi Kabin Fiber',
  'Wing Box + Topi Kabin Fiber + Logo',
  'Wing Box + Topi Kabin Fiber + Logo + Repaint Kabin',
  'Wing Box + Logo',
  'Wing Box + Logo + Repaint Kabin',
  'Wing Box + Repaint Kabin',
  'Box Besi Standart',
  'Box Besi Pintu Samping (2 Daun)',
  'Box Besi Pintu Samping (4 Daun)',
  'Box Besi Pintu Samping (6 Daun)',
  'Box Besi Pintu Samping (8 Daun)',
  'Bak Besi',
  'Trailer Base 40 Feet',
  'Trailer Base 45 Feet',
  'Trailer Wing Box 40 Feet',
  'Trailer Wing Box 45 Feet',
  'Topi Kabin Fiber',
  'Logo',
  'Repaint Kabin',
  'Repaint Badan Kendaraan',
]

const kelengkapanTemplate = [
  // Area Kepala Truk
  { area: 'Area Kepala Truk', nama: 'Kaca Spion', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Tutup Tangki Solar', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Kaca Depan', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Lampu Depan', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Lampu Kabut', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Pintu Kabin bagian Kiri', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Kaca Pintu Samping Kiri', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Lampu Sen bagian Kiri', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Pintu Kabin bagian Kanan', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Kaca Pintu Samping Kanan', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Lampu Sen Bagian Kanan', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Kunci Kontak', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Sunvisor', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Radio/Tape', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Lighter/Korek Api', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Karpet Roda', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Karpet Dalam Kabin', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Segitiga Pengaman', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Safety Belt', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'Kursi Supir dan Kenek', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Kepala Truk', nama: 'AC', jumlah: 1, kondisi: 'baik' },
  // Area Badan Truck
  { area: 'Area Badan Truck', nama: 'Accu dan Tutupnya', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Badan Truck', nama: 'Kamera Parkir', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Badan Truck', nama: 'Ban Serep', jumlah: 1, kondisi: 'baik' },
  { area: 'Area Badan Truck', nama: 'Roda dan Ban Bagian kiri-depan', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Badan Truck', nama: 'Roda dan Ban Bagian kiri-belakang', jumlah: 4, kondisi: 'baik' },
  { area: 'Area Badan Truck', nama: 'Roda dan Ban Bagian kanan-depan', jumlah: 2, kondisi: 'baik' },
  { area: 'Area Badan Truck', nama: 'Roda dan Ban Bagian kanan-belakang', jumlah: 4, kondisi: 'baik' },
  { area: 'Area Badan Truck', nama: 'Lampu Stop Bagian Belakang', jumlah: 2, kondisi: 'baik' },
  // Lainnya
  { area: 'Lainnya', nama: 'Stang Dongkrak', jumlah: 1, kondisi: 'baik' },
  { area: 'Lainnya', nama: 'Dongkrak', jumlah: 1, kondisi: 'baik' },
  { area: 'Lainnya', nama: 'Toolsheet lainnya', jumlah: 1, kondisi: 'baik' },
  { area: 'Lainnya', nama: 'Buku Petunjuk', jumlah: 1, kondisi: 'baik' },
  { area: 'Lainnya', nama: 'Buku Service', jumlah: 1, kondisi: 'baik' },
]

export default function KendaraanMasukPage() {
  const [customerList] = useState<Customer[]>([
    { id: '1', kode: 'CUS001', nama: 'PT. Maju Bersama' },
    { id: '2', kode: 'CUS002', nama: 'CV. Jaya Transport' },
    { id: '3', kode: 'CUS003', nama: 'PT. Logistik Indonesia' },
  ])

  const [kendaraanMasukList, setKendaraanMasukList] = useState<KendaraanMasuk[]>([
    {
      id: '1',
      nomor: 'KM-2024-001',
      tanggalMasuk: '2024-01-15',
      showroom: 'Showroom Utama',
      customerId: '1',
      customer: { id: '1', kode: 'CUS001', nama: 'PT. Maju Bersama' },
      kendaraanId: '1',
      kendaraan: { id: '1', nomorPolisi: 'B 1234 ABC', merek: 'Hino', tipe: 'Ranger' },
      pengerjaan: [
        { id: '1', jenis: 'Wing Box', deskripsi: 'Ukuran standar dengan pintu samping' },
        { id: '2', jenis: 'Logo', deskripsi: 'Logo perusahaan di samping' }
      ],
      kelengkapan: kelengkapanTemplate.slice(0, 10),
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      nomor: 'KM-2024-002',
      tanggalMasuk: '2024-01-16',
      showroom: 'Showroom Cabang',
      customerId: '2',
      customer: { id: '2', kode: 'CUS002', nama: 'CV. Jaya Transport' },
      kendaraanId: '2',
      kendaraan: { id: '2', nomorPolisi: 'B 5678 DEF', merek: 'Isuzu', tipe: 'Dutro' },
      pengerjaan: [
        { id: '3', jenis: 'Box Besi Standart', deskripsi: 'Box besi tanpa pintu samping' },
        { id: '4', jenis: 'Repaint Kabin', deskripsi: 'Cat ulang kabin warna biru' }
      ],
      kelengkapan: kelengkapanTemplate.slice(0, 15),
      createdAt: '2024-01-16'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingKendaraanMasuk, setEditingKendaraanMasuk] = useState<KendaraanMasuk | null>(null)
  const [viewingKendaraanMasuk, setViewingKendaraanMasuk] = useState<KendaraanMasuk | null>(null)
  const [formData, setFormData] = useState({
    tanggalMasuk: new Date().toISOString().split('T')[0],
    showroom: '',
    customerId: '',
    nomorPolisi: '',
    merek: '',
    tipe: '',
    selectedPengerjaan: [] as string[],
    kelengkapan: kelengkapanTemplate.map(item => ({ ...item, id: Math.random().toString() }))
  })

  const filteredKendaraanMasuk = kendaraanMasukList.filter(km =>
    km.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    km.kendaraan.nomorPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    km.customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    km.showroom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedCustomer = customerList.find(c => c.id === formData.customerId)
    if (!selectedCustomer) return

    const newKendaraanMasuk: KendaraanMasuk = {
      id: Date.now().toString(),
      nomor: `KM-2024-${String(kendaraanMasukList.length + 1).padStart(3, '0')}`,
      tanggalMasuk: formData.tanggalMasuk,
      showroom: formData.showroom,
      customerId: formData.customerId,
      customer: selectedCustomer,
      kendaraanId: Date.now().toString(),
      kendaraan: {
        id: Date.now().toString(),
        nomorPolisi: formData.nomorPolisi,
        merek: formData.merek,
        tipe: formData.tipe
      },
      pengerjaan: formData.selectedPengerjaan.map((jenis, index) => ({
        id: (index + 1).toString(),
        jenis,
        deskripsi: ''
      })),
      kelengkapan: formData.kelengkapan,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setKendaraanMasukList([...kendaraanMasukList, newKendaraanMasuk])
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      tanggalMasuk: new Date().toISOString().split('T')[0],
      showroom: '',
      customerId: '',
      nomorPolisi: '',
      merek: '',
      tipe: '',
      selectedPengerjaan: [],
      kelengkapan: kelengkapanTemplate.map(item => ({ ...item, id: Math.random().toString() }))
    })
  }

  const handleView = (kendaraanMasuk: KendaraanMasuk) => {
    setViewingKendaraanMasuk(kendaraanMasuk)
    setIsDetailDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setKendaraanMasukList(prev => prev.filter(km => km.id !== id))
    }
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const togglePengerjaan = (jenis: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPengerjaan: prev.selectedPengerjaan.includes(jenis)
        ? prev.selectedPengerjaan.filter(p => p !== jenis)
        : [...prev.selectedPengerjaan, jenis]
    }))
  }

  const updateKelengkapan = (index: number, field: string, value: any) => {
    const updatedKelengkapan = [...formData.kelengkapan]
    updatedKelengkapan[index] = { ...updatedKelengkapan[index], [field]: value }
    setFormData(prev => ({ ...prev, kelengkapan: updatedKelengkapan }))
  }

  const getKondisiBadge = (kondisi: string) => {
    const kondisiConfig = {
      baik: { color: 'bg-green-100 text-green-800', label: 'Baik' },
      rusak: { color: 'bg-red-100 text-red-800', label: 'Rusak' },
      tidak_ada: { color: 'bg-gray-100 text-gray-800', label: 'Tidak Ada' },
    }
    
    const config = kondisiConfig[kondisi as keyof typeof kondisiConfig] || kondisiConfig.baik
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Kendaraan Masuk</h1>
            <p className="text-gray-600">Pencatatan kendaraan yang masuk untuk perbaikan</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Kendaraan Masuk
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Form Kendaraan Masuk</DialogTitle>
                  <DialogDescription>
                    Catat kendaraan yang masuk beserta kelengkapannya
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Informasi Umum */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informasi Umum</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid items-center gap-2">
                        <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
                        <Input
                          id="tanggalMasuk"
                          type="date"
                          value={formData.tanggalMasuk}
                          onChange={(e) => setFormData(prev => ({ ...prev, tanggalMasuk: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label htmlFor="showroom">Nama Showroom</Label>
                        <Input
                          id="showroom"
                          value={formData.showroom}
                          onChange={(e) => setFormData(prev => ({ ...prev, showroom: e.target.value }))}
                          placeholder="Contoh: Showroom Utama"
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label htmlFor="customerId">Nama Customer</Label>
                        <Select
                          value={formData.customerId}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customerList.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.kode} - {customer.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid items-center gap-2">
                        <Label htmlFor="nomorPolisi">Nomor Polisi</Label>
                        <Input
                          id="nomorPolisi"
                          value={formData.nomorPolisi}
                          onChange={(e) => setFormData(prev => ({ ...prev, nomorPolisi: e.target.value }))}
                          placeholder="Contoh: B 1234 ABC"
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label htmlFor="merek">Merek</Label>
                        <Input
                          id="merek"
                          value={formData.merek}
                          onChange={(e) => setFormData(prev => ({ ...prev, merek: e.target.value }))}
                          placeholder="Contoh: Hino, Isuzu"
                          required
                        />
                      </div>
                      <div className="grid items-center gap-2">
                        <Label htmlFor="tipe">Tipe Kendaraan</Label>
                        <Input
                          id="tipe"
                          value={formData.tipe}
                          onChange={(e) => setFormData(prev => ({ ...prev, tipe: e.target.value }))}
                          placeholder="Contoh: Ranger, Dutro"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pengerjaan */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pengerjaan</h3>
                    <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto p-2 border rounded">
                      {pengerjaanOptions.map((jenis) => (
                        <div key={jenis} className="flex items-center space-x-2">
                          <Checkbox
                            id={jenis}
                            checked={formData.selectedPengerjaan.includes(jenis)}
                            onCheckedChange={() => togglePengerjaan(jenis)}
                          />
                          <Label htmlFor={jenis} className="text-sm">
                            {jenis}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kelengkapan Alat/Accesoris */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Kelengkapan Alat/Accesoris</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {['Area Kepala Truk', 'Area Badan Truck', 'Lainnya'].map((area) => (
                        <div key={area} className="border rounded p-3">
                          <h4 className="font-medium mb-2">{area}</h4>
                          <div className="space-y-2">
                            {formData.kelengkapan
                              .filter(item => item.area === area)
                              .map((item, index) => (
                                <div key={item.id} className="grid grid-cols-5 gap-2 items-center text-sm">
                                  <span className="col-span-2">{item.nama}</span>
                                  {item.jumlah !== undefined && (
                                    <Input
                                      type="number"
                                      value={item.jumlah}
                                      onChange={(e) => updateKelengkapan(
                                        formData.kelengkapan.indexOf(item),
                                        'jumlah',
                                        parseInt(e.target.value) || 0
                                      )}
                                      className="h-8"
                                      min="0"
                                    />
                                  )}
                                  <select
                                    value={item.kondisi}
                                    onChange={(e) => updateKelengkapan(
                                      formData.kelengkapan.indexOf(item),
                                      'kondisi',
                                      e.target.value
                                    )}
                                    className="h-8 rounded border border-input bg-background text-sm"
                                  >
                                    <option value="baik">Baik</option>
                                    <option value="rusak">Rusak</option>
                                    <option value="tidak_ada">Tidak Ada</option>
                                  </select>
                                  <Input
                                    placeholder="Deskripsi"
                                    value={item.deskripsi || ''}
                                    onChange={(e) => updateKelengkapan(
                                      formData.kelengkapan.indexOf(item),
                                      'deskripsi',
                                      e.target.value
                                    )}
                                    className="h-8"
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Kendaraan Masuk</p>
                  <p className="text-2xl font-bold text-gray-900">{kendaraanMasukList.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kendaraanMasukList.filter(km => km.tanggalMasuk === new Date().toISOString().split('T')[0]).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Pengerjaan</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kendaraanMasukList.reduce((total, km) => total + km.pengerjaan.length, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <AlertTriangle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Kendaraan Masuk</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari kendaraan masuk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Showroom</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pengerjaan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKendaraanMasuk.map((kendaraanMasuk) => (
                  <TableRow key={kendaraanMasuk.id}>
                    <TableCell className="font-medium">{kendaraanMasuk.nomor}</TableCell>
                    <TableCell>{kendaraanMasuk.tanggalMasuk}</TableCell>
                    <TableCell>{kendaraanMasuk.showroom}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{kendaraanMasuk.kendaraan.nomorPolisi}</p>
                        <p className="text-sm text-gray-500">
                          {kendaraanMasuk.kendaraan.merek} {kendaraanMasuk.kendaraan.tipe}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{kendaraanMasuk.customer.nama}</p>
                        <p className="text-sm text-gray-500">{kendaraanMasuk.customer.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {kendaraanMasuk.pengerjaan.slice(0, 2).map((p) => (
                          <Badge key={p.id} variant="outline" className="text-xs">
                            {p.jenis}
                          </Badge>
                        ))}
                        {kendaraanMasuk.pengerjaan.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{kendaraanMasuk.pengerjaan.length - 2} lagi
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(kendaraanMasuk)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(kendaraanMasuk.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Kendaraan Masuk</DialogTitle>
            </DialogHeader>
            {viewingKendaraanMasuk && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nomor</Label>
                    <p className="font-semibold">{viewingKendaraanMasuk.nomor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tanggal Masuk</Label>
                    <p>{viewingKendaraanMasuk.tanggalMasuk}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Showroom</Label>
                    <p>{viewingKendaraanMasuk.showroom}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Customer</Label>
                    <p>{viewingKendaraanMasuk.customer.nama} ({viewingKendaraanMasuk.customer.kode})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Nomor Polisi</Label>
                    <p className="font-semibold">{viewingKendaraanMasuk.kendaraan.nomorPolisi}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Merek & Tipe</Label>
                    <p>{viewingKendaraanMasuk.kendaraan.merek} {viewingKendaraanMasuk.kendaraan.tipe}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Pengerjaan</Label>
                  <div className="mt-2 space-y-2">
                    {viewingKendaraanMasuk.pengerjaan.map((p) => (
                      <div key={p.id} className="p-2 border rounded">
                        <p className="font-medium">{p.jenis}</p>
                        {p.deskripsi && <p className="text-sm text-gray-600">{p.deskripsi}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Kelengkapan Alat/Accesoris</Label>
                  <div className="mt-2 space-y-4">
                    {['Area Kepala Truk', 'Area Badan Truck', 'Lainnya'].map((area) => (
                      <div key={area} className="border rounded p-3">
                        <h4 className="font-medium mb-2">{area}</h4>
                        <div className="space-y-2">
                          {viewingKendaraanMasuk.kelengkapan
                            .filter(item => item.area === area)
                            .map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex-1">
                                  <span className="font-medium">{item.nama}</span>
                                  {item.jumlah !== undefined && (
                                    <span className="ml-2 text-gray-600">({item.jumlah})</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {getKondisiBadge(item.kondisi)}
                                  {item.deskripsi && (
                                    <span className="text-gray-600 text-xs">{item.deskripsi}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}