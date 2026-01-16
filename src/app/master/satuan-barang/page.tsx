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
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { useState } from 'react'

interface SatuanBarang {
  id: string
  nama: string
  createdAt: string
}

export default function SatuanBarangPage() {
  const [satuanList, setSatuanList] = useState<SatuanBarang[]>([
    { id: '1', nama: 'Unit', createdAt: '2024-01-15' },
    { id: '2', nama: 'Kg', createdAt: '2024-01-16' },
    { id: '3', nama: 'Liter', createdAt: '2024-01-17' },
    { id: '4', nama: 'Meter', createdAt: '2024-01-18' },
    { id: '5', nama: 'Dus', createdAt: '2024-01-19' },
    { id: '6', nama: 'Roll', createdAt: '2024-01-20' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSatuan, setEditingSatuan] = useState<SatuanBarang | null>(null)
  const [formData, setFormData] = useState({
    nama: ''
  })

  const filteredSatuan = satuanList.filter(satuan =>
    satuan.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingSatuan) {
      setSatuanList(prev => 
        prev.map(s => 
          s.id === editingSatuan.id 
            ? { ...s, ...formData }
            : s
        )
      )
    } else {
      const newSatuan: SatuanBarang = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setSatuanList(prev => [...prev, newSatuan])
    }

    setFormData({ nama: '' })
    setEditingSatuan(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (satuan: SatuanBarang) => {
    setEditingSatuan(satuan)
    setFormData({
      nama: satuan.nama
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus satuan ini?')) {
      setSatuanList(prev => prev.filter(s => s.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingSatuan(null)
    setFormData({ nama: '' })
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Satuan Barang</h1>
            <p className="text-gray-600">Master data satuan barang</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Satuan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingSatuan ? 'Edit Satuan' : 'Tambah Satuan Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSatuan 
                      ? 'Edit data satuan barang yang sudah ada.'
                      : 'Tambah satuan barang baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama Satuan
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: Kg, Liter, Unit"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingSatuan ? 'Update' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Satuan Barang</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari satuan..."
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
                  <TableHead>Nama Satuan</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSatuan.map((satuan, index) => (
                  <TableRow key={satuan.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{satuan.nama}</Badge>
                    </TableCell>
                    <TableCell>{satuan.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(satuan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(satuan.id)}
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