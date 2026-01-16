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
import { Plus, Edit, Trash2, Search, Building, Phone, Mail, MapPin } from 'lucide-react'
import { useState } from 'react'

interface Supplier {
  id: string
  kode: string
  nama: string
  alamat?: string
  telepon?: string
  email?: string
  createdAt: string
}

export default function SupplierPage() {
  const [supplierList, setSupplierList] = useState<Supplier[]>([
    { 
      id: '1', 
      kode: 'SUP001', 
      nama: 'Supplier ABC', 
      alamat: 'Jl. Industri No. 123, Jakarta', 
      telepon: '021-12345678', 
      email: 'info@supplierabc.com',
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      kode: 'SUP002', 
      nama: 'Supplier XYZ', 
      alamat: 'Jl. Pabrik No. 456, Surabaya', 
      telepon: '031-87654321', 
      email: 'contact@supplierxyz.com',
      createdAt: '2024-01-16'
    },
    { 
      id: '3', 
      kode: 'SUP003', 
      nama: 'Supplier Jaya', 
      alamat: 'Jl. Raya No. 789, Bandung', 
      telepon: '022-11223344', 
      email: 'sales@supplierjaya.com',
      createdAt: '2024-01-17'
    },
    { 
      id: '4', 
      kode: 'SUP004', 
      nama: 'Supplier Makmur', 
      alamat: 'Jl. Gatot Subroto No. 100, Semarang', 
      telepon: '024-55667788', 
      email: 'info@suppliermakmur.com',
      createdAt: '2024-01-18'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    alamat: '',
    telepon: '',
    email: ''
  })

  const filteredSupplier = supplierList.filter(supplier =>
    supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingSupplier) {
      setSupplierList(prev => 
        prev.map(s => 
          s.id === editingSupplier.id 
            ? { ...s, ...formData }
            : s
        )
      )
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setSupplierList(prev => [...prev, newSupplier])
    }

    setFormData({ kode: '', nama: '', alamat: '', telepon: '', email: '' })
    setEditingSupplier(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      kode: supplier.kode,
      nama: supplier.nama,
      alamat: supplier.alamat || '',
      telepon: supplier.telepon || '',
      email: supplier.email || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus supplier ini?')) {
      setSupplierList(prev => prev.filter(s => s.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingSupplier(null)
    setFormData({ kode: '', nama: '', alamat: '', telepon: '', email: '' })
    setIsDialogOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Supplier</h1>
            <p className="text-gray-600">Manajemen data supplier barang</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingSupplier ? 'Edit Supplier' : 'Tambah Supplier Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSupplier 
                      ? 'Edit data supplier yang sudah ada.'
                      : 'Tambah supplier baru ke dalam sistem.'
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
                      placeholder="Contoh: SUP001"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama Supplier
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: Supplier ABC"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="alamat" className="text-right">
                      Alamat
                    </Label>
                    <Textarea
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                      className="col-span-3"
                      placeholder="Alamat lengkap supplier"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="telepon" className="text-right">
                      Telepon
                    </Label>
                    <Input
                      id="telepon"
                      value={formData.telepon}
                      onChange={(e) => setFormData(prev => ({ ...prev, telepon: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: 021-12345678"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: info@supplier.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingSupplier ? 'Update' : 'Simpan'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Supplier</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari supplier..."
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
                  <TableHead>Nama Supplier</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplier.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{supplier.kode}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{supplier.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {supplier.telepon && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {supplier.telepon}
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-blue-600">{supplier.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {supplier.alamat && (
                        <div className="flex items-start gap-1 text-sm max-w-xs">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{supplier.alamat}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{supplier.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(supplier)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(supplier.id)}
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