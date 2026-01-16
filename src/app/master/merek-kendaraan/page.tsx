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
import { Plus, Edit, Trash2, Search, Car } from 'lucide-react'
import { useState } from 'react'

interface MerekKendaraan {
  id: string
  nama: string
  createdAt: string
}

export default function MerekKendaraanPage() {
  const [merekList, setMerekList] = useState<MerekKendaraan[]>([
    { id: '1', nama: 'Hino', createdAt: '2024-01-15' },
    { id: '2', nama: 'Isuzu', createdAt: '2024-01-16' },
    { id: '3', nama: 'Mitsubishi', createdAt: '2024-01-17' },
    { id: '4', nama: 'Toyota', createdAt: '2024-01-18' },
    { id: '5', nama: 'Suzuki', createdAt: '2024-01-19' },
    { id: '6', nama: 'Daihatsu', createdAt: '2024-01-20' },
    { id: '7', nama: 'Mercedes-Benz', createdAt: '2024-01-21' },
    { id: '8', nama: 'Volvo', createdAt: '2024-01-22' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMerek, setEditingMerek] = useState<MerekKendaraan | null>(null)
  const [formData, setFormData] = useState({
    nama: ''
  })

  const filteredMerek = merekList.filter(merek =>
    merek.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingMerek) {
      setMerekList(prev => 
        prev.map(m => 
          m.id === editingMerek.id 
            ? { ...m, ...formData }
            : m
        )
      )
    } else {
      const newMerek: MerekKendaraan = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setMerekList(prev => [...prev, newMerek])
    }

    setFormData({ nama: '' })
    setEditingMerek(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (merek: MerekKendaraan) => {
    setEditingMerek(merek)
    setFormData({
      nama: merek.nama
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus merek ini?')) {
      setMerekList(prev => prev.filter(m => m.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingMerek(null)
    setFormData({ nama: '' })
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Merek Kendaraan</h1>
            <p className="text-gray-600">Master data merek kendaraan</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Merek
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingMerek ? 'Edit Merek' : 'Tambah Merek Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMerek 
                      ? 'Edit data merek kendaraan yang sudah ada.'
                      : 'Tambah merek kendaraan baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama Merek
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: Hino, Isuzu, Mitsubishi"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingMerek ? 'Update' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Merek Kendaraan</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari merek..."
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
                  <TableHead>Nama Merek</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerek.map((merek, index) => (
                  <TableRow key={merek.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        <Badge variant="secondary">{merek.nama}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{merek.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(merek)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(merek.id)}
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