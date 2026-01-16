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
import { Plus, Edit, Trash2, Search, Package, Truck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface Barang {
  id: string
  kode: string
  nama: string
  satuan: string
}

interface Supplier {
  id: string
  kode: string
  nama: string
}

interface PurchaseOrder {
  id: string
  nomor: string
  supplierId: string
  supplier: Supplier
  status: string
  items: Array<{
    barangId: string
    barang: Barang
    jumlah: number
  }>
}

interface BarangMasuk {
  id: string
  nomor: string
  tanggal: string
  purchaseOrderId?: string
  purchaseOrder?: PurchaseOrder
  supplierId: string
  supplier: Supplier
  barangId: string
  barang: Barang
  jumlah: number
  kondisi: string
  createdAt: string
}

export default function BarangMasukPage() {
  const [barangList] = useState<Barang[]>([
    { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', satuan: 'Liter' },
    { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', satuan: 'Meter' },
    { id: '3', kode: 'BRG003', nama: 'Paku 10cm', satuan: 'Kg' },
    { id: '4', kode: 'BRG004', nama: 'Lampu LED', satuan: 'Unit' },
    { id: '5', kode: 'BRG005', nama: 'Triplek Melamin', satuan: 'Lembar' },
  ])

  const [supplierList] = useState<Supplier[]>([
    { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
    { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
    { id: '3', kode: 'SUP003', nama: 'Supplier Jaya' },
  ])

  const [purchaseOrderList] = useState<PurchaseOrder[]>([
    {
      id: '1',
      nomor: 'PO-2024-001',
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      status: 'DISETUJUI',
      items: [
        { barangId: '1', barang: { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', satuan: 'Liter' }, jumlah: 10 },
        { barangId: '2', barang: { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', satuan: 'Meter' }, jumlah: 20 },
      ]
    },
    {
      id: '2',
      nomor: 'PO-2024-002',
      supplierId: '2',
      supplier: { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
      status: 'DISETUJUI',
      items: [
        { barangId: '3', barang: { id: '3', kode: 'BRG003', nama: 'Paku 10cm', satuan: 'Kg' }, jumlah: 15 },
      ]
    },
  ])

  const [barangMasukList, setBarangMasukList] = useState<BarangMasuk[]>([
    {
      id: '1',
      nomor: 'BM-2024-001',
      tanggal: '2024-01-15',
      purchaseOrderId: '1',
      purchaseOrder: {
        id: '1',
        nomor: 'PO-2024-001',
        supplierId: '1',
        supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
        status: 'DISETUJUI',
        items: [
          { barangId: '1', barang: { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', satuan: 'Liter' }, jumlah: 10 },
        ]
      },
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      barangId: '1',
      barang: { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', satuan: 'Liter' },
      jumlah: 10,
      kondisi: 'Baik',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      nomor: 'BM-2024-002',
      tanggal: '2024-01-16',
      purchaseOrderId: '1',
      purchaseOrder: {
        id: '1',
        nomor: 'PO-2024-001',
        supplierId: '1',
        supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
        status: 'DISETUJUI',
        items: [
          { barangId: '2', barang: { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', satuan: 'Meter' }, jumlah: 20 },
        ]
      },
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      barangId: '2',
      barang: { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', satuan: 'Meter' },
      jumlah: 20,
      kondisi: 'Baik',
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      nomor: 'BM-2024-003',
      tanggal: '2024-01-17',
      supplierId: '2',
      supplier: { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
      barangId: '3',
      barang: { id: '3', kode: 'BRG003', nama: 'Paku 10cm', satuan: 'Kg' },
      jumlah: 15,
      kondisi: 'Ada yang rusak',
      createdAt: '2024-01-17'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBarangMasuk, setEditingBarangMasuk] = useState<BarangMasuk | null>(null)
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    purchaseOrderId: '',
    supplierId: '',
    barangId: '',
    jumlah: 0,
    kondisi: 'Baik'
  })

  const filteredBarangMasuk = barangMasukList.filter(bm =>
    bm.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bm.barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bm.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bm.kondisi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedSupplier = supplierList.find(s => s.id === formData.supplierId)
    const selectedBarang = barangList.find(b => b.id === formData.barangId)
    const selectedPO = formData.purchaseOrderId ? purchaseOrderList.find(po => po.id === formData.purchaseOrderId) : undefined
    
    if (!selectedSupplier || !selectedBarang) return

    const newBarangMasuk: BarangMasuk = {
      id: Date.now().toString(),
      nomor: `BM-2024-${String(barangMasukList.length + 1).padStart(3, '0')}`,
      tanggal: formData.tanggal,
      purchaseOrderId: formData.purchaseOrderId || undefined,
      purchaseOrder: selectedPO,
      supplierId: formData.supplierId,
      supplier: selectedSupplier,
      barangId: formData.barangId,
      barang: selectedBarang,
      jumlah: formData.jumlah,
      kondisi: formData.kondisi,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setBarangMasukList([...barangMasukList, newBarangMasuk])
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      purchaseOrderId: '',
      supplierId: '',
      barangId: '',
      jumlah: 0,
      kondisi: 'Baik'
    })
  }

  const handleEdit = (barangMasuk: BarangMasuk) => {
    setEditingBarangMasuk(barangMasuk)
    setFormData({
      tanggal: barangMasuk.tanggal,
      purchaseOrderId: barangMasuk.purchaseOrderId || '',
      supplierId: barangMasuk.supplierId,
      barangId: barangMasuk.barangId,
      jumlah: barangMasuk.jumlah,
      kondisi: barangMasuk.kondisi
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data barang masuk ini?')) {
      setBarangMasukList(prev => prev.filter(bm => bm.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingBarangMasuk(null)
    resetForm()
    setIsDialogOpen(true)
  }

  const getKondisiBadge = (kondisi: string) => {
    const kondisiConfig = {
      'Baik': { color: 'bg-green-100 text-green-800', label: 'Baik' },
      'Ada yang rusak': { color: 'bg-yellow-100 text-yellow-800', label: 'Ada yang rusak' },
      'Rusak semua': { color: 'bg-red-100 text-red-800', label: 'Rusak semua' },
    }
    
    const config = kondisiConfig[kondisi as keyof typeof kondisiConfig] || kondisiConfig['Baik']
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayItems = barangMasukList.filter(bm => bm.tanggal === today)
    
    return {
      total: todayItems.length,
      totalItems: todayItems.reduce((sum, bm) => sum + bm.jumlah, 0),
      goodCondition: todayItems.filter(bm => bm.kondisi === 'Baik').length,
      damaged: todayItems.filter(bm => bm.kondisi !== 'Baik').length
    }
  }

  const todayStats = getTodayStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Barang Masuk</h1>
            <p className="text-gray-600">Pencatatan barang yang diterima dari supplier</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Barang Masuk
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingBarangMasuk ? 'Edit Barang Masuk' : 'Catat Barang Masuk'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBarangMasuk 
                      ? 'Edit data barang masuk yang sudah ada.'
                      : 'Catat barang yang diterima dari supplier beserta kondisinya.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid items-center gap-2">
                      <Label htmlFor="tanggal">Tanggal</Label>
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="purchaseOrderId">Purchase Order (Opsional)</Label>
                      <Select
                        value={formData.purchaseOrderId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, purchaseOrderId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih PO (jika ada)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tanpa PO</SelectItem>
                          {purchaseOrderList.filter(po => po.status === 'DISETUJUI').map((po) => (
                            <SelectItem key={po.id} value={po.id}>
                              {po.nomor} - {po.supplier.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="supplierId">Supplier</Label>
                      <Select
                        value={formData.supplierId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {supplierList.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.kode} - {supplier.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="barangId">Barang</Label>
                      <Select
                        value={formData.barangId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, barangId: value }))}
                      >
                        <SelectTrigger>
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
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="jumlah">Jumlah</Label>
                      <Input
                        id="jumlah"
                        type="number"
                        value={formData.jumlah}
                        onChange={(e) => setFormData(prev => ({ ...prev, jumlah: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        min="1"
                        required
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="kondisi">Kondisi</Label>
                      <Select
                        value={formData.kondisi}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, kondisi: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kondisi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Baik">Baik</SelectItem>
                          <SelectItem value="Ada yang rusak">Ada yang rusak</SelectItem>
                          <SelectItem value="Rusak semua">Rusak semua</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingBarangMasuk ? 'Update' : 'Simpan'}
                  </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Barang Masuk</p>
                  <p className="text-2xl font-bold text-gray-900">{barangMasukList.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{todayStats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kondisi Baik</p>
                  <p className="text-2xl font-bold text-gray-900">{todayStats.goodCondition}</p>
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
                  <p className="text-sm font-medium text-gray-600">Ada Masalah</p>
                  <p className="text-2xl font-bold text-gray-900">{todayStats.damaged}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Riwayat Barang Masuk</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari barang masuk..."
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
                  <TableHead>Supplier</TableHead>
                  <TableHead>Barang</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>PO Reference</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBarangMasuk.map((barangMasuk) => (
                  <TableRow key={barangMasuk.id}>
                    <TableCell className="font-medium">{barangMasuk.nomor}</TableCell>
                    <TableCell>{barangMasuk.tanggal}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{barangMasuk.supplier.nama}</p>
                        <p className="text-sm text-gray-500">{barangMasuk.supplier.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{barangMasuk.barang.nama}</p>
                        <p className="text-sm text-gray-500">{barangMasuk.barang.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {barangMasuk.jumlah} {barangMasuk.barang.satuan}
                      </Badge>
                    </TableCell>
                    <TableCell>{getKondisiBadge(barangMasuk.kondisi)}</TableCell>
                    <TableCell>
                      {barangMasuk.purchaseOrder ? (
                        <Badge variant="secondary">{barangMasuk.purchaseOrder.nomor}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(barangMasuk)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(barangMasuk.id)}
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
      </div>
    </DashboardLayout>
  )
}