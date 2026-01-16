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
import { Plus, Edit, Trash2, Search, Car } from 'lucide-react'
import { useState } from 'react'

interface MerekKendaraan {
  id: string
  nama: string
}

interface TipeKendaraan {
  id: string
  nama: string
  merekId: string
  merekKendaraan: MerekKendaraan
  createdAt: string
}

export default function TipeKendaraanPage() {
  const [merekList] = useState<MerekKendaraan[]>([
    { id: '1', nama: 'Hino' },
    { id: '2', nama: 'Isuzu' },
    { id: '3', nama: 'Mitsubishi' },
    { id: '4', nama: 'Toyota' },
    { id: '5', nama: 'Suzuki' },
  ])

  const [tipeList, setTipeList] = useState<TipeKendaraan[]>([
    { id: '1', nama: 'Ranger', merekId: '1', merekKendaraan: { id: '1', nama: 'Hino' }, createdAt: '2024-01-15' },
    { id: '2', nama: 'Dutro', merekId: '2', merekKendaraan: { id: '2', nama: 'Isuzu' }, createdAt: '2024-01-16' },
    { id: '3', nama: 'Elf', merekId: '2', merekKendaraan: { id: '2', nama: 'Isuzu' }, createdAt: '2024-01-17' },
    { id: '4', nama: 'L300', merekId: '4', merekKendaraan: { id: '4', nama: 'Mitsubishi' }, createdAt: '2024-01-18' },
    { id: '5', nama: 'Colt Diesel', merekId: '4', merekKendaraan: { id: '4', nama: 'Mitsubishi' }, createdAt: '2024-01-19' },
    { id: '6', nama: 'Great Dyna', merekId: '4', merekKendaraan: { id: '4', nama: 'Toyota' }, createdAt: '2024-01-20' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTipe, setEditingTipe] = useState<TipeKendaraan | null>(null)
  const [formData, setFormData] = useState({
    nama: '',
    merekId: ''
  })

  const filteredTipe = tipeList.filter(tipe =>
    tipe.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tipe.merekKendaraan.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTipe) {
      setTipeList(prev => 
        prev.map(t => 
          t.id === editingTipe.id 
            ? { 
                ...t, 
                ...formData, 
                merekKendaraan: merekList.find(m => m.id === formData.merekId) || t.merekKendaraan
              }
            : t
        )
      )
    } else {
      const newTipe: TipeKendaraan = {
        id: Date.now().toString(),
        ...formData,
        merekKendaraan: merekList.find(m => m.id === formData.merekId) || { id: '', nama: '' },
        createdAt: new Date().toISOString().split('T')[0]
      }
      setTipeList(prev => [...prev, newTipe])
    }

    setFormData({ nama: '', merekId: '' })
    setEditingTipe(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (tipe: TipeKendaraan) => {
    setEditingTipe(tipe)
    setFormData({
      nama: tipe.nama,
      merekId: tipe.merekId
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tipe kendaraan ini?')) {
      setTipeList(prev => prev.filter(t => t.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingTipe(null)
    setFormData({ nama: '', merekId: '' })
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tipe Kendaraan</h1>
            <p className="text-gray-600">Master data tipe kendaraan</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Tipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingTipe ? 'Edit Tipe Kendaraan' : 'Tambah Tipe Kendaraan Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTipe 
                      ? 'Edit data tipe kendaraan yang sudah ada.'
                      : 'Tambah tipe kendaraan baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="merekId" className="text-right">
                      Merek
                    </Label>
                    <Select
                      value={formData.merekId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, merekId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih merek kendaraan" />
                      </SelectTrigger>
                      <SelectContent>
                        {merekList.map((merek) => (
                          <SelectItem key={merek.id} value={merek.id}>
                            {merek.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama Tipe
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: Ranger, Dutro, Elf"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingTipe ? 'Update' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Tipe Kendaraan</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari tipe kendaraan..."
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
                  <TableHead>Merek</TableHead>
                  <TableHead>Tipe Kendaraan</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTipe.map((tipe, index) => (
                  <TableRow key={tipe.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tipe.merekKendaraan.nama}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        {tipe.nama}
                      </div>
                    </TableCell>
                    <TableCell>{tipe.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(tipe)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(tipe.id)}
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