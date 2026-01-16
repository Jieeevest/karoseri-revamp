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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit, Trash2, Search, Star, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface KategoriBarang {
  id: number
  nama: string
}

interface Barang {
  id: string
  kode: string
  nama: string
  kategoriId: number
  kategoriBarang: KategoriBarang
}

interface Supplier {
  id: string
  kode: string
  nama: string
}

interface HargaBarang {
  id: string
  barangId: string
  barang: Barang
  supplierId: string
  supplier: Supplier
  kategoriId: number
  kategoriBarang: KategoriBarang
  harga: number
  adalahHargaTerbaik: boolean
  createdAt: string
}

export default function HargaBarangPage() {
  const [kategoriList] = useState<KategoriBarang[]>([
    { id: 1, nama: 'Cat' },
    { id: 2, nama: 'Besi' },
    { id: 3, nama: 'Aksesoris' },
    { id: 4, nama: 'Paku & Sekrup' },
  ])

  const [barangList] = useState<Barang[]>([
    { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', kategoriId: 1, kategoriBarang: { id: 1, nama: 'Cat' } },
    { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', kategoriId: 2, kategoriBarang: { id: 2, nama: 'Besi' } },
    { id: '3', kode: 'BRG003', nama: 'Paku 10cm', kategoriId: 4, kategoriBarang: { id: 4, nama: 'Paku & Sekrup' } },
    { id: '4', kode: 'BRG004', nama: 'Lampu LED', kategoriId: 3, kategoriBarang: { id: 3, nama: 'Aksesoris' } },
  ])

  const [supplierList] = useState<Supplier[]>([
    { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
    { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
    { id: '3', kode: 'SUP003', nama: 'Supplier Jaya' },
  ])

  const [hargaList, setHargaList] = useState<HargaBarang[]>([
    { 
      id: '1', 
      barangId: '1', 
      barang: { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', kategoriId: 1, kategoriBarang: { id: 1, nama: 'Cat' } },
      supplierId: '1', 
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      kategoriId: 1,
      kategoriBarang: { id: 1, nama: 'Cat' },
      harga: 150000,
      adalahHargaTerbaik: true,
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      barangId: '1', 
      barang: { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', kategoriId: 1, kategoriBarang: { id: 1, nama: 'Cat' } },
      supplierId: '2', 
      supplier: { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
      kategoriId: 1,
      kategoriBarang: { id: 1, nama: 'Cat' },
      harga: 165000,
      adalahHargaTerbaik: false,
      createdAt: '2024-01-16'
    },
    { 
      id: '3', 
      barangId: '2', 
      barang: { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', kategoriId: 2, kategoriBarang: { id: 2, nama: 'Besi' } },
      supplierId: '1', 
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      kategoriId: 2,
      kategoriBarang: { id: 2, nama: 'Besi' },
      harga: 75000,
      adalahHargaTerbaik: true,
      createdAt: '2024-01-17'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingHarga, setEditingHarga] = useState<HargaBarang | null>(null)
  const [formData, setFormData] = useState({
    barangId: '',
    supplierId: '',
    harga: 0,
    adalahHargaTerbaik: false
  })

  const filteredHarga = hargaList.filter(harga =>
    harga.barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    harga.barang.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    harga.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    harga.kategoriBarang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedBarang = barangList.find(b => b.id === formData.barangId)
    const selectedSupplier = supplierList.find(s => s.id === formData.supplierId)
    
    if (!selectedBarang || !selectedSupplier) return

    if (editingHarga) {
      setHargaList(prev => 
        prev.map(h => 
          h.id === editingHarga.id 
            ? { 
                ...h, 
                ...formData, 
                barang: selectedBarang,
                supplier: selectedSupplier,
                kategoriId: selectedBarang.kategoriId,
                kategoriBarang: selectedBarang.kategoriBarang
              }
            : h
        )
      )
    } else {
      const newHarga: HargaBarang = {
        id: Date.now().toString(),
        ...formData,
        barang: selectedBarang,
        supplier: selectedSupplier,
        kategoriId: selectedBarang.kategoriId,
        kategoriBarang: selectedBarang.kategoriBarang,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setHargaList(prev => [...prev, newHarga])
    }

    setFormData({ barangId: '', supplierId: '', harga: 0, adalahHargaTerbaik: false })
    setEditingHarga(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (harga: HargaBarang) => {
    setEditingHarga(harga)
    setFormData({
      barangId: harga.barangId,
      supplierId: harga.supplierId,
      harga: harga.harga,
      adalahHargaTerbaik: harga.adalahHargaTerbaik
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus harga ini?')) {
      setHargaList(prev => prev.filter(h => h.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingHarga(null)
    setFormData({ barangId: '', supplierId: '', harga: 0, adalahHargaTerbaik: false })
    setIsDialogOpen(true)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getBestPricesByCategory = () => {
    const bestPrices: { [key: number]: HargaBarang } = {}
    
    hargaList.forEach(harga => {
      if (!bestPrices[harga.kategoriId] || harga.harga < bestPrices[harga.kategoriId].harga) {
        bestPrices[harga.kategoriId] = harga
      }
    })
    
    return Object.values(bestPrices)
  }

  const bestPrices = getBestPricesByCategory()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Harga Barang</h1>
            <p className="text-gray-600">Manajemen harga barang dan supplier</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Harga
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingHarga ? 'Edit Harga' : 'Tambah Harga Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingHarga 
                      ? 'Edit data harga barang yang sudah ada.'
                      : 'Tambah harga barang baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="barangId" className="text-right">
                      Barang
                    </Label>
                    <Select
                      value={formData.barangId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, barangId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="supplierId" className="text-right">
                      Supplier
                    </Label>
                    <Select
                      value={formData.supplierId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="harga" className="text-right">
                      Harga
                    </Label>
                    <Input
                      id="harga"
                      type="number"
                      value={formData.harga}
                      onChange={(e) => setFormData(prev => ({ ...prev, harga: parseInt(e.target.value) || 0 }))}
                      className="col-span-3"
                      min="0"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingHarga ? 'Update' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Harga Terbaik per Kategori */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Harga Terbaik per Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestPrices.map((harga) => (
                <div key={harga.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{harga.kategoriBarang.nama}</Badge>
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="font-medium text-sm">{harga.barang.nama}</p>
                  <p className="text-xs text-gray-600 mb-2">{harga.supplier.nama}</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(harga.harga)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daftar Harga */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Semua Harga Barang</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari harga barang..."
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
                  <TableHead>Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHarga.map((harga) => (
                  <TableRow key={harga.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{harga.barang.nama}</p>
                        <p className="text-xs text-gray-500">{harga.barang.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{harga.kategoriBarang.nama}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{harga.supplier.nama}</p>
                        <p className="text-xs text-gray-500">{harga.supplier.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(harga.harga)}
                    </TableCell>
                    <TableCell>
                      {harga.adalahHargaTerbaik && (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Star className="mr-1 h-3 w-3" />
                          Terbaik
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(harga)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(harga.id)}
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