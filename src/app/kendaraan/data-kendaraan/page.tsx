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
import { Plus, Edit, Trash2, Search, Car, Eye } from 'lucide-react'
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
}

interface Customer {
  id: string
  kode: string
  nama: string
}

interface Kendaraan {
  id: string
  nomorPolisi: string
  nomorChasis: string
  nomorMesin: string
  merekId: string
  merekKendaraan: MerekKendaraan
  tipeId: string
  tipeKendaraan: TipeKendaraan
  customerId: string
  customer: Customer
  status: 'MASUK' | 'TAHAP_PERAKITAN' | 'PROSES_PENGCATAN' | 'PROSES_PEMBUATAN_LOGO' | 'SELESAI' | 'KELUAR'
  createdAt: string
}

export default function DataKendaraanPage() {
  const [merekList] = useState<MerekKendaraan[]>([
    { id: '1', nama: 'Hino' },
    { id: '2', nama: 'Isuzu' },
    { id: '3', nama: 'Mitsubishi' },
  ])

  const [tipeList] = useState<TipeKendaraan[]>([
    { id: '1', nama: 'Ranger', merekId: '1', merekKendaraan: { id: '1', nama: 'Hino' } },
    { id: '2', nama: 'Dutro', merekId: '2', merekKendaraan: { id: '2', nama: 'Isuzu' } },
    { id: '3', nama: 'Elf', merekId: '2', merekKendaraan: { id: '2', nama: 'Isuzu' } },
  ])

  const [customerList] = useState<Customer[]>([
    { id: '1', kode: 'CUS001', nama: 'PT. Maju Bersama' },
    { id: '2', kode: 'CUS002', nama: 'CV. Jaya Transport' },
    { id: '3', kode: 'CUS003', nama: 'PT. Logistik Indonesia' },
  ])

  const [kendaraanList, setKendaraanList] = useState<Kendaraan[]>([
    {
      id: '1',
      nomorPolisi: 'B 1234 ABC',
      nomorChasis: 'MHK12345678901234',
      nomorMesin: '4D567890',
      merekId: '1',
      merekKendaraan: { id: '1', nama: 'Hino' },
      tipeId: '1',
      tipeKendaraan: { id: '1', nama: 'Ranger', merekId: '1', merekKendaraan: { id: '1', nama: 'Hino' } },
      customerId: '1',
      customer: { id: '1', kode: 'CUS001', nama: 'PT. Maju Bersama' },
      status: 'MASUK',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      nomorPolisi: 'B 5678 DEF',
      nomorChasis: 'MHK98765432109876',
      nomorMesin: '4D567891',
      merekId: '2',
      merekKendaraan: { id: '2', nama: 'Isuzu' },
      tipeId: '2',
      tipeKendaraan: { id: '2', nama: 'Dutro', merekId: '2', merekKendaraan: { id: '2', nama: 'Isuzu' } },
      customerId: '2',
      customer: { id: '2', kode: 'CUS002', nama: 'CV. Jaya Transport' },
      status: 'TAHAP_PERAKITAN',
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      nomorPolisi: 'B 9012 GHI',
      nomorChasis: 'MHK55555555555555',
      nomorMesin: '4D567892',
      merekId: '2',
      merekKendaraan: { id: '2', nama: 'Isuzu' },
      tipeId: '3',
      tipeKendaraan: { id: '3', nama: 'Elf', merekId: '2', merekKendaraan: { id: '2', nama: 'Isuzu' } },
      customerId: '3',
      customer: { id: '3', kode: 'CUS003', nama: 'PT. Logistik Indonesia' },
      status: 'PROSES_PENGCATAN',
      createdAt: '2024-01-17'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingKendaraan, setEditingKendaraan] = useState<Kendaraan | null>(null)
  const [viewingKendaraan, setViewingKendaraan] = useState<Kendaraan | null>(null)
  const [formData, setFormData] = useState({
    nomorPolisi: '',
    nomorChasis: '',
    nomorMesin: '',
    merekId: '',
    tipeId: '',
    customerId: ''
  })

  const filteredKendaraan = kendaraanList.filter(kendaraan =>
    kendaraan.nomorPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kendaraan.nomorChasis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kendaraan.merekKendaraan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kendaraan.tipeKendaraan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kendaraan.customer.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      MASUK: { color: 'bg-blue-100 text-blue-800', label: 'Masuk' },
      TAHAP_PERAKITAN: { color: 'bg-yellow-100 text-yellow-800', label: 'Tahap Perakitan' },
      PROSES_PENGCATAN: { color: 'bg-purple-100 text-purple-800', label: 'Proses Pengecatan' },
      PROSES_PEMBUATAN_LOGO: { color: 'bg-pink-100 text-pink-800', label: 'Proses Pembuatan Logo' },
      SELESAI: { color: 'bg-green-100 text-green-800', label: 'Selesai' },
      KELUAR: { color: 'bg-gray-100 text-gray-800', label: 'Keluar' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.MASUK
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedMerek = merekList.find(m => m.id === formData.merekId)
    const selectedTipe = tipeList.find(t => t.id === formData.tipeId)
    const selectedCustomer = customerList.find(c => c.id === formData.customerId)
    
    if (!selectedMerek || !selectedTipe || !selectedCustomer) return

    if (editingKendaraan) {
      setKendaraanList(prev => 
        prev.map(k => 
          k.id === editingKendaraan.id 
            ? { 
                ...k, 
                ...formData, 
                merekKendaraan: selectedMerek,
                tipeKendaraan: selectedTipe,
                customer: selectedCustomer
              }
            : k
        )
      )
    } else {
      const newKendaraan: Kendaraan = {
        id: Date.now().toString(),
        ...formData,
        merekKendaraan: selectedMerek,
        tipeKendaraan: selectedTipe,
        customer: selectedCustomer,
        status: 'MASUK',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setKendaraanList(prev => [...prev, newKendaraan])
    }

    setFormData({ nomorPolisi: '', nomorChasis: '', nomorMesin: '', merekId: '', tipeId: '', customerId: '' })
    setEditingKendaraan(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (kendaraan: Kendaraan) => {
    setEditingKendaraan(kendaraan)
    setFormData({
      nomorPolisi: kendaraan.nomorPolisi,
      nomorChasis: kendaraan.nomorChasis,
      nomorMesin: kendaraan.nomorMesin,
      merekId: kendaraan.merekId,
      tipeId: kendaraan.tipeId,
      customerId: kendaraan.customerId
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data kendaraan ini?')) {
      setKendaraanList(prev => prev.filter(k => k.id !== id))
    }
  }

  const handleView = (kendaraan: Kendaraan) => {
    setViewingKendaraan(kendaraan)
    setIsDetailDialogOpen(true)
  }

  const openAddDialog = () => {
    setEditingKendaraan(null)
    setFormData({ nomorPolisi: '', nomorChasis: '', nomorMesin: '', merekId: '', tipeId: '', customerId: '' })
    setIsDialogOpen(true)
  }

  const getStatsByStatus = () => {
    const stats: { [key: string]: number } = {}
    kendaraanList.forEach(k => {
      stats[k.status] = (stats[k.status] || 0) + 1
    })
    return stats
  }

  const statusStats = getStatsByStatus()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Kendaraan</h1>
            <p className="text-gray-600">Manajemen data kendaraan customer</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kendaraan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingKendaraan ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingKendaraan 
                      ? 'Edit data kendaraan yang sudah ada.'
                      : 'Tambah kendaraan baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nomorPolisi" className="text-right">
                      Nomor Polisi
                    </Label>
                    <Input
                      id="nomorPolisi"
                      value={formData.nomorPolisi}
                      onChange={(e) => setFormData(prev => ({ ...prev, nomorPolisi: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: B 1234 ABC"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nomorChasis" className="text-right">
                      Nomor Chasis
                    </Label>
                    <Input
                      id="nomorChasis"
                      value={formData.nomorChasis}
                      onChange={(e) => setFormData(prev => ({ ...prev, nomorChasis: e.target.value }))}
                      className="col-span-3"
                      placeholder="Nomor chasis kendaraan"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nomorMesin" className="text-right">
                      Nomor Mesin
                    </Label>
                    <Input
                      id="nomorMesin"
                      value={formData.nomorMesin}
                      onChange={(e) => setFormData(prev => ({ ...prev, nomorMesin: e.target.value }))}
                      className="col-span-3"
                      placeholder="Nomor mesin kendaraan"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customerId" className="text-right">
                      Customer
                    </Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerList.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.kode} - {customer.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="merekId" className="text-right">
                      Merek
                    </Label>
                    <Select
                      value={formData.merekId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, merekId: value, tipeId: '' }))}
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
                    <Label htmlFor="tipeId" className="text-right">
                      Tipe
                    </Label>
                    <Select
                      value={formData.tipeId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, tipeId: value }))}
                      disabled={!formData.merekId}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih tipe kendaraan" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipeList
                          .filter(tipe => tipe.merekId === formData.merekId)
                          .map((tipe) => (
                            <SelectItem key={tipe.id} value={tipe.id}>
                              {tipe.nama}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingKendaraan ? 'Update' : 'Simpan'}
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
                  <p className="text-sm font-medium text-gray-600">Total Kendaraan</p>
                  <p className="text-2xl font-bold text-gray-900">{kendaraanList.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {Object.entries(statusStats).slice(0, 3).map(([status, count]) => {
            const statusConfig = {
              MASUK: { color: 'bg-blue-50', icon: '🚛' },
              TAHAP_PERAKITAN: { color: 'bg-yellow-50', icon: '🔧' },
              PROSES_PENGCATAN: { color: 'bg-purple-50', icon: '🎨' },
              PROSES_PEMBUATAN_LOGO: { color: 'bg-pink-50', icon: '🖼️' },
              SELESAI: { color: 'bg-green-50', icon: '✅' },
              KELUAR: { color: 'bg-gray-50', icon: '🚗' },
            }
            
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.MASUK
            const statusLabel = status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
            
            return (
              <Card key={status}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{statusLabel}</p>
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${config.color} text-2xl`}>
                      {config.icon}
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
              <CardTitle>Daftar Kendaraan</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari kendaraan..."
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
                  <TableHead>Nomor Polisi</TableHead>
                  <TableHead>Merek & Tipe</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Nomor Chasis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKendaraan.map((kendaraan) => (
                  <TableRow key={kendaraan.id}>
                    <TableCell className="font-medium">{kendaraan.nomorPolisi}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{kendaraan.merekKendaraan.nama}</p>
                        <p className="text-sm text-gray-500">{kendaraan.tipeKendaraan.nama}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{kendaraan.customer.nama}</p>
                        <p className="text-sm text-gray-500">{kendaraan.customer.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{kendaraan.nomorChasis}</TableCell>
                    <TableCell>{getStatusBadge(kendaraan.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(kendaraan)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(kendaraan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(kendaraan.id)}
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
              <DialogTitle>Detail Kendaraan</DialogTitle>
            </DialogHeader>
            {viewingKendaraan && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nomor Polisi</Label>
                    <p className="font-semibold">{viewingKendaraan.nomorPolisi}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div>{getStatusBadge(viewingKendaraan.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Nomor Chasis</Label>
                    <p className="font-mono text-sm">{viewingKendaraan.nomorChasis}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Nomor Mesin</Label>
                    <p className="font-mono text-sm">{viewingKendaraan.nomorMesin}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Merek</Label>
                    <p>{viewingKendaraan.merekKendaraan.nama}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tipe</Label>
                    <p>{viewingKendaraan.tipeKendaraan.nama}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Customer</Label>
                    <p>{viewingKendaraan.customer.nama} ({viewingKendaraan.customer.kode})</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}