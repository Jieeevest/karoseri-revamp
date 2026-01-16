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
import { Plus, Edit, Trash2, Search, Users, Phone, Mail, MapPin, Building } from 'lucide-react'
import { useState } from 'react'

interface Customer {
  id: string
  kode: string
  nama: string
  alamat?: string
  telepon?: string
  email?: string
  createdAt: string
}

export default function CustomerPage() {
  const [customerList, setCustomerList] = useState<Customer[]>([
    { 
      id: '1', 
      kode: 'CUS001', 
      nama: 'PT. Maju Bersama', 
      alamat: 'Jl. Industri Raya No. 100, Jakarta Utara', 
      telepon: '021-5551234', 
      email: 'info@majubersama.com',
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      kode: 'CUS002', 
      nama: 'CV. Jaya Transport', 
      alamat: 'Jl. Pergudangan No. 50, Bekasi', 
      telepon: '021-8856789', 
      email: 'contact@jayatransport.com',
      createdAt: '2024-01-16'
    },
    { 
      id: '3', 
      kode: 'CUS003', 
      nama: 'PT. Logistik Indonesia', 
      alamat: 'Jl. Terminal Cargo No. 25, Tangerang', 
      telepon: '021-5432109', 
      email: 'admin@logistikindonesia.co.id',
      createdAt: '2024-01-17'
    },
    { 
      id: '4', 
      kode: 'CUS004', 
      nama: 'UD. Sentosa Abadi', 
      alamat: 'Jl. Raya Bogor No. 75, Depok', 
      telepon: '021-9876543', 
      email: 'sentosaabadi@email.com',
      createdAt: '2024-01-18'
    },
    { 
      id: '5', 
      kode: 'CUS005', 
      nama: 'PT. Express Delivery', 
      alamat: 'Jl. Bandara No. 200, Tangerang', 
      telepon: '021-7654321', 
      email: 'support@expressdelivery.com',
      createdAt: '2024-01-19'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    alamat: '',
    telepon: '',
    email: ''
  })

  const filteredCustomer = customerList.filter(customer =>
    customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCustomer) {
      setCustomerList(prev => 
        prev.map(c => 
          c.id === editingCustomer.id 
            ? { ...c, ...formData }
            : c
        )
      )
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setCustomerList(prev => [...prev, newCustomer])
    }

    setFormData({ kode: '', nama: '', alamat: '', telepon: '', email: '' })
    setEditingCustomer(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      kode: customer.kode,
      nama: customer.nama,
      alamat: customer.alamat || '',
      telepon: customer.telepon || '',
      email: customer.email || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data customer ini?')) {
      setCustomerList(prev => prev.filter(c => c.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingCustomer(null)
    setFormData({ kode: '', nama: '', alamat: '', telepon: '', email: '' })
    setIsDialogOpen(true)
  }

  const generateCustomerCode = () => {
    const nextNumber = customerList.length + 1
    return `CUS${String(nextNumber).padStart(3, '0')}`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Customer</h1>
            <p className="text-gray-600">Manajemen data customer/pelanggan</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingCustomer ? 'Edit Customer' : 'Tambah Customer Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCustomer 
                      ? 'Edit data customer yang sudah ada.'
                      : 'Tambah customer baru ke dalam sistem.'
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
                      placeholder="Contoh: CUS001"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama Customer
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      placeholder="Nama perusahaan atau individu"
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
                      placeholder="Alamat lengkap customer"
                      rows={3}
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
                      placeholder="Nomor telepon kantor"
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
                      placeholder="Email customer"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingCustomer ? 'Update' : 'Simpan'}
                  </Button>
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
                  <p className="text-sm font-medium text-gray-600">Total Customer</p>
                  <p className="text-2xl font-bold text-gray-900">{customerList.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer dengan Email</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerList.filter(c => c.email).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer dengan Telepon</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customerList.filter(c => c.telepon).length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Customer</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari customer..."
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
                  <TableHead>Nama Customer</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomer.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{customer.kode}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Building className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">{customer.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {customer.telepon && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {customer.telepon}
                          </div>
                        )}
                        {customer.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-blue-600">{customer.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.alamat && (
                        <div className="flex items-start gap-1 text-sm max-w-xs">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{customer.alamat}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{customer.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(customer.id)}
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