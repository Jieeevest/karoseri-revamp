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
import { Plus, Edit, Trash2, Search, Wrench, Eye, Receipt, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface Karyawan {
  id: string
  nik: string
  nama: string
  jabatan: string
}

interface Kendaraan {
  id: string
  nomorPolisi: string
  merek: string
  tipe: string
}

interface PembayaranSpek {
  id: string
  jumlah: number
  metode: 'TRANSFER' | 'CASH' | 'GIRO'
  bukti?: string
  createdAt: string
}

interface SpekOrder {
  id: string
  nomor: string
  kendaraanId: string
  kendaraan: Kendaraan
  karyawanId: string
  karyawan: Karyawan
  jenis: 'TUKANG_RAKIT' | 'TUKANG_CAT' | 'TUKANG_AKSESORIS'
  deskripsi: string
  upah: number
  status: 'BELUM_DIBAYAR' | 'SUDAH_DIBAYAR'
  createdAt: string
  pembayaran: PembayaranSpek[]
}

export default function SpekOrderPage() {
  const [karyawanList] = useState<Karyawan[]>([
    { id: '1', nik: '1234567890123456', nama: 'Ahmad Fauzi', jabatan: 'Tukang Rakit' },
    { id: '2', nik: '2345678901234567', nama: 'Budi Santoso', jabatan: 'Tukang Cat' },
    { id: '3', nik: '3456789012345678', nama: 'Chandra Wijaya', jabatan: 'Tukang Aksesoris' },
    { id: '4', nik: '4567890123456789', nama: 'Dedi Kurniawan', jabatan: 'Tukang Rakit' },
  ])

  const [kendaraanList] = useState<Kendaraan[]>([
    { id: '1', nomorPolisi: 'B 1234 ABC', merek: 'Hino', tipe: 'Ranger' },
    { id: '2', nomorPolisi: 'B 5678 DEF', merek: 'Isuzu', tipe: 'Dutro' },
    { id: '3', nomorPolisi: 'B 9012 GHI', merek: 'Isuzu', tipe: 'Elf' },
  ])

  const [spekOrderList, setSpekOrderList] = useState<SpekOrder[]>([
    {
      id: '1',
      nomor: 'SO-2024-001',
      kendaraanId: '1',
      kendaraan: { id: '1', nomorPolisi: 'B 1234 ABC', merek: 'Hino', tipe: 'Ranger' },
      karyawanId: '1',
      karyawan: { id: '1', nik: '1234567890123456', nama: 'Ahmad Fauzi', jabatan: 'Tukang Rakit' },
      jenis: 'TUKANG_RAKIT',
      deskripsi: 'Pembuatan wing box ukuran standar dengan pintu samping hidrolik',
      upah: 3500000,
      status: 'BELUM_DIBAYAR',
      createdAt: '2024-01-15',
      pembayaran: []
    },
    {
      id: '2',
      nomor: 'SO-2024-002',
      kendaraanId: '2',
      kendaraan: { id: '2', nomorPolisi: 'B 5678 DEF', merek: 'Isuzu', tipe: 'Dutro' },
      karyawanId: '2',
      karyawan: { id: '2', nik: '2345678901234567', nama: 'Budi Santoso', jabatan: 'Tukang Cat' },
      jenis: 'TUKANG_CAT',
      deskripsi: 'Cat ulang kabin dan pembuatan logo perusahaan',
      upah: 2500000,
      status: 'SUDAH_DIBAYAR',
      createdAt: '2024-01-16',
      pembayaran: [
        {
          id: '1',
          jumlah: 2500000,
          metode: 'TRANSFER',
          bukti: 'bukti_transfer_001.jpg',
          createdAt: '2024-01-17'
        }
      ]
    },
    {
      id: '3',
      nomor: 'SO-2024-003',
      kendaraanId: '3',
      kendaraan: { id: '3', nomorPolisi: 'B 9012 GHI', merek: 'Isuzu', tipe: 'Elf' },
      karyawanId: '3',
      karyawan: { id: '3', nik: '3456789012345678', nama: 'Chandra Wijaya', jabatan: 'Tukang Aksesoris' },
      jenis: 'TUKANG_AKSESORIS',
      deskripsi: 'Pemasangan topi kabin fiber dan aksesoris interior',
      upah: 1500000,
      status: 'BELUM_DIBAYAR',
      createdAt: '2024-01-18',
      pembayaran: []
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [editingSpekOrder, setEditingSpekOrder] = useState<SpekOrder | null>(null)
  const [viewingSpekOrder, setViewingSpekOrder] = useState<SpekOrder | null>(null)
  const [payingSpekOrder, setPayingSpekOrder] = useState<SpekOrder | null>(null)
  const [formData, setFormData] = useState({
    kendaraanId: '',
    karyawanId: '',
    jenis: '' as 'TUKANG_RAKIT' | 'TUKANG_CAT' | 'TUKANG_AKSESORIS' | '',
    deskripsi: '',
    upah: 0
  })
  const [paymentFormData, setPaymentFormData] = useState({
    jumlah: 0,
    metode: 'TRANSFER' as 'TRANSFER' | 'CASH' | 'GIRO',
    bukti: ''
  })

  const filteredSpekOrder = spekOrderList.filter(spek =>
    spek.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spek.kendaraan.nomorPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spek.karyawan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spek.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getJenisSpekBadge = (jenis: string) => {
    const jenisConfig = {
      TUKANG_RAKIT: { color: 'bg-blue-100 text-blue-800', label: 'Tukang Rakit' },
      TUKANG_CAT: { color: 'bg-green-100 text-green-800', label: 'Tukang Cat' },
      TUKANG_AKSESORIS: { color: 'bg-purple-100 text-purple-800', label: 'Tukang Aksesoris' },
    }
    
    const config = jenisConfig[jenis as keyof typeof jenisConfig] || jenisConfig.TUKANG_RAKIT
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      BELUM_DIBAYAR: { color: 'bg-yellow-100 text-yellow-800', label: 'Belum Dibayar' },
      SUDAH_DIBAYAR: { color: 'bg-green-100 text-green-800', label: 'Sudah Dibayar' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.BELUM_DIBAYAR
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getMetodeBadge = (metode: string) => {
    const metodeConfig = {
      TRANSFER: { color: 'bg-blue-100 text-blue-800', label: 'Transfer' },
      CASH: { color: 'bg-green-100 text-green-800', label: 'Cash' },
      GIRO: { color: 'bg-orange-100 text-orange-800', label: 'Giro' },
    }
    
    const config = metodeConfig[metode as keyof typeof metodeConfig] || metodeConfig.TRANSFER
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedKaryawan = karyawanList.find(k => k.id === formData.karyawanId)
    const selectedKendaraan = kendaraanList.find(k => k.id === formData.kendaraanId)
    
    if (!selectedKaryawan || !selectedKendaraan) return

    const newSpekOrder: SpekOrder = {
      id: Date.now().toString(),
      nomor: `SO-2024-${String(spekOrderList.length + 1).padStart(3, '0')}`,
      kendaraanId: formData.kendaraanId,
      kendaraan: selectedKendaraan,
      karyawanId: formData.karyawanId,
      karyawan: selectedKaryawan,
      jenis: formData.jenis,
      deskripsi: formData.deskripsi,
      upah: formData.upah,
      status: 'BELUM_DIBAYAR',
      createdAt: new Date().toISOString().split('T')[0],
      pembayaran: []
    }

    setSpekOrderList([...spekOrderList, newSpekOrder])
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      kendaraanId: '',
      karyawanId: '',
      jenis: '',
      deskripsi: '',
      upah: 0
    })
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!payingSpekOrder) return

    const newPembayaran: PembayaranSpek = {
      id: Date.now().toString(),
      jumlah: paymentFormData.jumlah,
      metode: paymentFormData.metode,
      bukti: paymentFormData.bukti,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setSpekOrderList(prev => 
      prev.map(spek => 
        spek.id === payingSpekOrder.id 
          ? { 
              ...spek, 
              status: 'SUDAH_DIBAYAR' as const,
              pembayaran: [...spek.pembayaran, newPembayaran]
            }
          : spek
      )
    )

    setPaymentFormData({ jumlah: 0, metode: 'TRANSFER', bukti: '' })
    setPayingSpekOrder(null)
    setIsPaymentDialogOpen(false)
  }

  const handleView = (spekOrder: SpekOrder) => {
    setViewingSpekOrder(spekOrder)
    setIsDetailDialogOpen(true)
  }

  const handlePaymentDialog = (spekOrder: SpekOrder) => {
    setPayingSpekOrder(spekOrder)
    setPaymentFormData({
      jumlah: spekOrder.upah,
      metode: 'TRANSFER',
      bukti: ''
    })
    setIsPaymentDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus spek order ini?')) {
      setSpekOrderList(prev => prev.filter(s => s.id !== id))
    }
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const getKaryawanByJenis = (jenis: string) => {
    const jabatanMap = {
      TUKANG_RAKIT: 'Tukang Rakit',
      TUKANG_CAT: 'Tukang Cat',
      TUKANG_AKSESORIS: 'Tukang Aksesoris'
    }
    
    const jabatan = jabatanMap[jenis as keyof typeof jabatanMap]
    return karyawanList.filter(k => k.jabatan === jabatan)
  }

  const getStatsByJenis = () => {
    const stats: { [key: string]: number } = {}
    spekOrderList.forEach(s => {
      stats[s.jenis] = (stats[s.jenis] || 0) + 1
    })
    return stats
  }

  const jenisStats = getStatsByJenis()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Spek Order</h1>
            <p className="text-gray-600">Manajemen spek order dan pembayaran upah karyawan</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Spek Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Buat Spek Order Baru</DialogTitle>
                  <DialogDescription>
                    Buat spek order untuk pengerjaan kendaraan
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid items-center gap-2">
                      <Label htmlFor="kendaraanId">Kendaraan</Label>
                      <Select
                        value={formData.kendaraanId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, kendaraanId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kendaraan" />
                        </SelectTrigger>
                        <SelectContent>
                          {kendaraanList.map((kendaraan) => (
                            <SelectItem key={kendaraan.id} value={kendaraan.id}>
                              {kendaraan.nomorPolisi} - {kendaraan.merek} {kendaraan.tipe}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="jenis">Jenis Pekerjaan</Label>
                      <Select
                        value={formData.jenis}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, jenis: value as any, karyawanId: '' }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis pekerjaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TUKANG_RAKIT">Tukang Rakit</SelectItem>
                          <SelectItem value="TUKANG_CAT">Tukang Cat</SelectItem>
                          <SelectItem value="TUKANG_AKSESORIS">Tukang Aksesoris</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid items-center gap-2">
                    <Label htmlFor="karyawanId">Karyawan</Label>
                    <Select
                      value={formData.karyawanId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, karyawanId: value }))}
                      disabled={!formData.jenis}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih karyawan" />
                      </SelectTrigger>
                      <SelectContent>
                        {getKaryawanByJenis(formData.jenis).map((karyawan) => (
                          <SelectItem key={karyawan.id} value={karyawan.id}>
                            {karyawan.nama} ({karyawan.jabatan})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid items-center gap-2">
                    <Label htmlFor="deskripsi">Deskripsi Pekerjaan</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                      placeholder="Deskripsi detail pekerjaan yang akan dilakukan"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid items-center gap-2">
                    <Label htmlFor="upah">Upah (Rp)</Label>
                    <Input
                      id="upah"
                      type="number"
                      value={formData.upah}
                      onChange={(e) => setFormData(prev => ({ ...prev, upah: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan Spek Order</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spek Order</p>
                  <p className="text-2xl font-bold text-gray-900">{spekOrderList.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {Object.entries(jenisStats).map(([jenis, count]) => {
            const jenisConfig = {
              TUKANG_RAKIT: { color: 'bg-blue-50', label: 'Tukang Rakit' },
              TUKANG_CAT: { color: 'bg-green-50', label: 'Tukang Cat' },
              TUKANG_AKSESORIS: { color: 'bg-purple-50', label: 'Tukang Aksesoris' },
            }
            
            const config = jenisConfig[jenis as keyof typeof jenisConfig] || jenisConfig.TUKANG_RAKIT
            
            return (
              <Card key={jenis}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{config.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${config.color}`}>
                      <Wrench className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Spek Order</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari spek order..."
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
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Karyawan</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Upah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpekOrder.map((spekOrder) => (
                  <TableRow key={spekOrder.id}>
                    <TableCell className="font-medium">{spekOrder.nomor}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{spekOrder.kendaraan.nomorPolisi}</p>
                        <p className="text-sm text-gray-500">
                          {spekOrder.kendaraan.merek} {spekOrder.kendaraan.tipe}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{spekOrder.karyawan.nama}</p>
                        <p className="text-sm text-gray-500">{spekOrder.karyawan.jabatan}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getJenisSpekBadge(spekOrder.jenis)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(spekOrder.upah)}</TableCell>
                    <TableCell>{getStatusBadge(spekOrder.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(spekOrder)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {spekOrder.status === 'BELUM_DIBAYAR' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePaymentDialog(spekOrder)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(spekOrder.id)}
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detail Spek Order</DialogTitle>
            </DialogHeader>
            {viewingSpekOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nomor</Label>
                    <p className="font-semibold">{viewingSpekOrder.nomor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div>{getStatusBadge(viewingSpekOrder.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Kendaraan</Label>
                    <p>{viewingSpekOrder.kendaraan.nomorPolisi} - {viewingSpekOrder.kendaraan.merek} {viewingSpekOrder.kendaraan.tipe}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Karyawan</Label>
                    <p>{viewingSpekOrder.karyawan.nama} ({viewingSpekOrder.karyawan.jabatan})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Jenis Pekerjaan</Label>
                    <div>{getJenisSpekBadge(viewingSpekOrder.jenis)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Upah</Label>
                    <p className="font-bold text-lg">{formatCurrency(viewingSpekOrder.upah)}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Deskripsi</Label>
                    <p className="text-sm">{viewingSpekOrder.deskripsi}</p>
                  </div>
                </div>

                {viewingSpekOrder.pembayaran.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Riwayat Pembayaran</Label>
                    <div className="mt-2 space-y-2">
                      {viewingSpekOrder.pembayaran.map((pembayaran) => (
                        <div key={pembayaran.id} className="p-3 border rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{formatCurrency(pembayaran.jumlah)}</p>
                              <p className="text-sm text-gray-600">{getMetodeBadge(pembayaran.metode)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{pembayaran.createdAt}</p>
                              {pembayaran.bukti && (
                                <p className="text-xs text-blue-600">Bukti ada</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handlePayment}>
              <DialogHeader>
                <DialogTitle>Pembayaran Upah</DialogTitle>
                <DialogDescription>
                  Catat pembayaran upah untuk spek order
                </DialogDescription>
              </DialogHeader>
              {payingSpekOrder && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{payingSpekOrder.nomor}</p>
                    <p className="text-sm text-gray-600">{payingSpekOrder.karyawan.nama}</p>
                    <p className="text-lg font-bold">{formatCurrency(payingSpekOrder.upah)}</p>
                  </div>
                  
                  <div className="grid items-center gap-2">
                    <Label htmlFor="jumlah">Jumlah Pembayaran</Label>
                    <Input
                      id="jumlah"
                      type="number"
                      value={paymentFormData.jumlah}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 0 }))}
                      min="0"
                      max={payingSpekOrder.upah}
                      required
                    />
                  </div>
                  
                  <div className="grid items-center gap-2">
                    <Label htmlFor="metode">Metode Pembayaran</Label>
                    <Select
                      value={paymentFormData.metode}
                      onValueChange={(value) => setPaymentFormData(prev => ({ ...prev, metode: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRANSFER">Transfer</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="GIRO">Giro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid items-center gap-2">
                    <Label htmlFor="bukti">Bukti Pembayaran</Label>
                    <Input
                      id="bukti"
                      value={paymentFormData.bukti}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, bukti: e.target.value }))}
                      placeholder="Nama file bukti pembayaran"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button type="submit">Bayar Sekarang</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}