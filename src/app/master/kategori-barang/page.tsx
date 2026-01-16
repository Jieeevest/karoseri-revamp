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
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { useState } from 'react'

interface KategoriBarang {
  id: number
  nama: string
  deskripsi?: string
  createdAt: string
}

export default function KategoriBarangPage() {
  const [kategoriList, setKategoriList] = useState<KategoriBarang[]>([
    { id: 1, nama: 'Cat', deskripsi: 'Berbagai jenis cat untuk kendaraan', createdAt: '2024-01-15' },
    { id: 2, nama: 'Besi', deskripsi: 'Material besi untuk rangka kendaraan', createdAt: '2024-01-16' },
    { id: 3, nama: 'Aksesoris', deskripsi: 'Aksesoris tambahan kendaraan', createdAt: '2024-01-17' },
    { id: 4, nama: 'Paku & Sekrup', deskripsi: 'Material pengikat', createdAt: '2024-01-18' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingKategori, setEditingKategori] = useState<KategoriBarang | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: ''
  })

  const filteredKategori = kategoriList.filter(kategori =>
    kategori.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kategori.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingKategori) {
      setKategoriList(prev => 
        prev.map(k => 
          k.id === editingKategori.id 
            ? { ...k, ...formData }
            : k
        )
      )
    } else {
      const newKategori: KategoriBarang = {
        id: Math.max(...kategoriList.map(k => k.id)) + 1,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setKategoriList(prev => [...prev, newKategori])
    }

    setFormData({ nama: '', deskripsi: '' })
    setEditingKategori(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (kategori: KategoriBarang) => {
    setEditingKategori(kategori)
    setFormData({
      nama: kategori.nama,
      deskripsi: kategori.deskripsi || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      setKategoriList(prev => prev.filter(k => k.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingKategori(null)
    setFormData({ nama: '', deskripsi: '' })
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategori Barang</h1>
            <p className="text-gray-600">Master data kategori barang</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingKategori ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingKategori 
                      ? 'Edit data kategori barang yang sudah ada.'
                      : 'Tambah kategori barang baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="deskripsi" className="text-right">
                      Deskripsi
                    </Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => setFormData(prev => ({ ...prev, deskripsi: e.target.value }))}
                      className="col-span-3"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingKategori ? 'Update' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Kategori Barang</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari kategori..."
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
                  <TableHead>No</TableHead>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKategori.map((kategori, index) => (
                  <TableRow key={kategori.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="secondary">{kategori.nama}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {kategori.deskripsi || '-'}
                    </TableCell>
                    <TableCell>{kategori.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(kategori)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(kategori.id)}
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