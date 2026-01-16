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
import { Plus, Edit, Trash2, Search, Package, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

interface KategoriBarang {
  id: number
  nama: string
}

interface SatuanBarang {
  id: string
  nama: string
}

interface Barang {
  id: string
  kode: string
  nama: string
  kategoriId: number
  kategoriBarang: KategoriBarang
  satuanId: string
  satuanBarang: SatuanBarang
  stok: number
  stokMinimum: number
  createdAt: string
}

export default function DataBarangPage() {
  const [kategoriList] = useState<KategoriBarang[]>([
    { id: 1, nama: 'Cat' },
    { id: 2, nama: 'Besi' },
    { id: 3, nama: 'Aksesoris' },
    { id: 4, nama: 'Paku & Sekrup' },
  ])

  const [satuanList] = useState<SatuanBarang[]>([
    { id: '1', nama: 'Unit' },
    { id: '2', nama: 'Kg' },
    { id: '3', nama: 'Liter' },
    { id: '4', nama: 'Meter' },
    { id: '5', nama: 'Dus' },
  ])

  const [barangList, setBarangList] = useState<Barang[]>([
    { 
      id: '1', 
      kode: 'BRG001', 
      nama: 'Cat Semprot Hitam', 
      kategoriId: 1, 
      kategoriBarang: { id: 1, nama: 'Cat' },
      satuanId: '3',
      satuanBarang: { id: '3', nama: 'Liter' },
      stok: 15,
      stokMinimum: 10,
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      kode: 'BRG002', 
      nama: 'Besi Hollow 4x4', 
      kategoriId: 2, 
      kategoriBarang: { id: 2, nama: 'Besi' },
      satuanId: '4',
      satuanBarang: { id: '4', nama: 'Meter' },
      stok: 50,
      stokMinimum: 20,
      createdAt: '2024-01-16'
    },
    { 
      id: '3', 
      kode: 'BRG003', 
      nama: 'Paku 10cm', 
      kategoriId: 4, 
      kategoriBarang: { id: 4, nama: 'Paku & Sekrup' },
      satuanId: '2',
      satuanBarang: { id: '2', nama: 'Kg' },
      stok: 8,
      stokMinimum: 15,
      createdAt: '2024-01-17'
    },
    { 
      id: '4', 
      kode: 'BRG004', 
      nama: 'Lampu LED', 
      kategoriId: 3, 
      kategoriBarang: { id: 3, nama: 'Aksesoris' },
      satuanId: '1',
      satuanBarang: { id: '1', nama: 'Unit' },
      stok: 25,
      stokMinimum: 10,
      createdAt: '2024-01-18'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBarang, setEditingBarang] = useState<Barang | null>(null)
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    kategoriId: '',
    satuanId: '',
    stok: 0,
    stokMinimum: 0
  })

  const filteredBarang = barangList.filter(barang =>
    barang.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barang.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    barang.kategoriBarang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBarang) {
      setBarangList(prev => 
        prev.map(b => 
          b.id === editingBarang.id 
            ? { 
                ...b, 
                ...formData, 
                kategoriId: parseInt(formData.kategoriId),
                kategoriBarang: kategoriList.find(k => k.id === parseInt(formData.kategoriId)) || b.kategoriBarang,
                satuanBarang: satuanList.find(s => s.id === formData.satuanId) || b.satuanBarang
              }
            : b
        )
      )
    } else {
      const newBarang: Barang = {
        id: Date.now().toString(),
        ...formData,
        kategoriId: parseInt(formData.kategoriId),
        kategoriBarang: kategoriList.find(k => k.id === parseInt(formData.kategoriId)) || { id: 0, nama: '' },
        satuanBarang: satuanList.find(s => s.id === formData.satuanId) || { id: '', nama: '' },
        createdAt: new Date().toISOString().split('T')[0]
      }
      setBarangList(prev => [...prev, newBarang])
    }

    setFormData({ kode: '', nama: '', kategoriId: '', satuanId: '', stok: 0, stokMinimum: 0 })
    setEditingBarang(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (barang: Barang) => {
    setEditingBarang(barang)
    setFormData({
      kode: barang.kode,
      nama: barang.nama,
      kategoriId: barang.kategoriId.toString(),
      satuanId: barang.satuanId,
      stok: barang.stok,
      stokMinimum: barang.stokMinimum
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      setBarangList(prev => prev.filter(b => b.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingBarang(null)
    setFormData({ kode: '', nama: '', kategoriId: '', satuanId: '', stok: 0, stokMinimum: 0 })
    setIsDialogOpen(true)
  }

  const getStockStatus = (stok: number, stokMinimum: number) => {
    if (stok <= stokMinimum) {
      return { color: 'text-red-600 bg-red-50', label: 'Stok Menipis', icon: AlertTriangle }
    }
    return { color: 'text-green-600 bg-green-50', label: 'Stok Aman', icon: Package }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Barang</h1>
            <p className="text-gray-600">Manajemen data barang dan stok</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Barang
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingBarang ? 'Edit Barang' : 'Tambah Barang Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingBarang 
                      ? 'Edit data barang yang sudah ada.'
                      : 'Tambah barang baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kode" className="text-right">
                      Kode
                    </Label>
                    <Input
                      id="kode"
                      value={formData.kode}
                      onChange={(e) => setFormData(prev => ({ ...prev, kode: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: BRG001"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama Barang
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: Cat Semprot Hitam"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="kategoriId" className="text-right">
                      Kategori
                    </Label>
                    <Select
                      value={formData.kategoriId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, kategoriId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {kategoriList.map((kategori) => (
                          <SelectItem key={kategori.id} value={kategori.id.toString()}>
                            {kategori.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="satuanId" className="text-right">
                      Satuan
                    </Label>
                    <Select
                      value={formData.satuanId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, satuanId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                      <SelectContent>
                        {satuanList.map((satuan) => (
                          <SelectItem key={satuan.id} value={satuan.id}>
                            {satuan.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stok" className="text-right">
                      Stok
                    </Label>
                    <Input
                      id="stok"
                      type="number"
                      value={formData.stok}
                      onChange={(e) => setFormData(prev => ({ ...prev, stok: parseInt(e.target.value) || 0 }))}
                      className="col-span-3"
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stokMinimum" className="text-right">
                      Stok Minimum
                    </Label>
                    <Input
                      id="stokMinimum"
                      type="number"
                      value={formData.stokMinimum}
                      onChange={(e) => setFormData(prev => ({ ...prev, stokMinimum: parseInt(e.target.value) || 0 }))}
                      className="col-span-3"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingBarang ? 'Update' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Barang</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari barang..."
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
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBarang.map((barang) => {
                  const stockStatus = getStockStatus(barang.stok, barang.stokMinimum)
                  const StatusIcon = stockStatus.icon
                  
                  return (
                    <TableRow key={barang.id}>
                      <TableCell className="font-medium">{barang.kode}</TableCell>
                      <TableCell>{barang.nama}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{barang.kategoriBarang.nama}</Badge>
                      </TableCell>
                      <TableCell>{barang.satuanBarang.nama}</TableCell>
                      <TableCell>
                        <span className={barang.stok <= barang.stokMinimum ? 'text-red-600 font-bold' : ''}>
                          {barang.stok}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(barang)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(barang.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}