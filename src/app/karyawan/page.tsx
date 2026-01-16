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
import { Plus, Edit, Trash2, Search, Users, Phone, MapPin, Briefcase } from 'lucide-react'
import { useState } from 'react'

interface Karyawan {
  id: string
  nik: string
  nama: string
  jabatan: string
  telepon?: string
  alamat?: string
  createdAt: string
}

export default function KaryawanPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([
    { 
      id: '1', 
      nik: '1234567890123456', 
      nama: 'Ahmad Fauzi', 
      jabatan: 'Tukang Rakit', 
      telepon: '0812-3456-7890', 
      alamat: 'Jl. Merdeka No. 123, Jakarta', 
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      nik: '2345678901234567', 
      nama: 'Budi Santoso', 
      jabatan: 'Tukang Cat', 
      telepon: '0813-5678-9012', 
      alamat: 'Jl. Sudirman No. 456, Jakarta', 
      createdAt: '2024-01-16'
    },
    { 
      id: '3', 
      nik: '3456789012345678', 
      nama: 'Chandra Wijaya', 
      jabatan: 'Tukang Aksesoris', 
      telepon: '0821-6789-0123', 
      alamat: 'Jl. Gatot Subroto No. 789, Jakarta', 
      createdAt: '2024-01-17'
    },
    { 
      id: '4', 
      nik: '4567890123456789', 
      nama: 'Dedi Kurniawan', 
      jabatan: 'Tukang Rakit', 
      telepon: '0822-7890-1234', 
      alamat: 'Jl. Thamrin No. 321, Jakarta', 
      createdAt: '2024-01-18'
    },
    { 
      id: '5', 
      nik: '5678901234567890', 
      nama: 'Eko Prasetyo', 
      jabatan: 'Supervisor', 
      telepon: '0812-8901-2345', 
      alamat: 'Jl. Rasuna Said No. 654, Jakarta', 
      createdAt: '2024-01-19'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingKaryawan, setEditingKaryawan] = useState<Karyawan | null>(null)
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    jabatan: '',
    telepon: '',
    alamat: ''
  })

  const jabatanOptions = [
    'Tukang Rakit',
    'Tukang Cat', 
    'Tukang Aksesoris',
    'Supervisor',
    'Admin',
    'Security',
    'Driver'
  ]

  const filteredKaryawan = karyawanList.filter(karyawan =>
    karyawan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    karyawan.nik.includes(searchTerm) ||
    karyawan.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    karyawan.telepon?.includes(searchTerm) ||
    karyawan.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingKaryawan) {
      setKaryawanList(prev => 
        prev.map(k => 
          k.id === editingKaryawan.id 
            ? { ...k, ...formData }
            : k
        )
      )
    } else {
      const newKaryawan: Karyawan = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setKaryawanList(prev => [...prev, newKaryawan])
    }

    setFormData({ nik: '', nama: '', jabatan: '', telepon: '', alamat: '' })
    setEditingKaryawan(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (karyawan: Karyawan) => {
    setEditingKaryawan(karyawan)
    setFormData({
      nik: karyawan.nik,
      nama: karyawan.nama,
      jabatan: karyawan.jabatan,
      telepon: karyawan.telepon || '',
      alamat: karyawan.alamat || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) {
      setKaryawanList(prev => prev.filter(k => k.id !== id))
    }
  }

  const openAddDialog = () => {
    setEditingKaryawan(null)
    setFormData({ nik: '', nama: '', jabatan: '', telepon: '', alamat: '' })
    setIsDialogOpen(true)
  }

  const getJabatanBadge = (jabatan: string) => {
    const jabatanConfig = {
      'Tukang Rakit': { color: 'bg-blue-100 text-blue-800' },
      'Tukang Cat': { color: 'bg-green-100 text-green-800' },
      'Tukang Aksesoris': { color: 'bg-purple-100 text-purple-800' },
      'Supervisor': { color: 'bg-orange-100 text-orange-800' },
      'Admin': { color: 'bg-gray-100 text-gray-800' },
      'Security': { color: 'bg-red-100 text-red-800' },
      'Driver': { color: 'bg-yellow-100 text-yellow-800' },
    }
    
    const config = jabatanConfig[jabatan as keyof typeof jabatanConfig] || jabatanConfig['Tukang Rakit']
    return <Badge className={config.color}>{jabatan}</Badge>
  }

  const getStatsByJabatan = () => {
    const stats: { [key: string]: number } = {}
    karyawanList.forEach(k => {
      stats[k.jabatan] = (stats[k.jabatan] || 0) + 1
    })
    return stats
  }

  const jabatanStats = getStatsByJabatan()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Karyawan</h1>
            <p className="text-gray-600">Data karyawan dan informasi kontak</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Karyawan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingKaryawan ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingKaryawan 
                      ? 'Edit data karyawan yang sudah ada.'
                      : 'Tambah karyawan baru ke dalam sistem.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nik" className="text-right">
                      NIK
                    </Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value }))}
                      className="col-span-3"
                      placeholder="Nomor Induk Kependudukan"
                      maxLength={16}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nama" className="text-right">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                      className="col-span-3"
                      placeholder="Nama lengkap karyawan"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="jabatan" className="text-right">
                      Jabatan
                    </Label>
                    <select
                      id="jabatan"
                      value={formData.jabatan}
                      onChange={(e) => setFormData(prev => ({ ...prev, jabatan: e.target.value }))}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Pilih jabatan</option>
                      {jabatanOptions.map(jabatan => (
                        <option key={jabatan} value={jabatan}>{jabatan}</option>
                      ))}
                    </select>
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
                      placeholder="Nomor telepon/HP"
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
                      placeholder="Alamat lengkap karyawan"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingKaryawan ? 'Update' : 'Simpan'}
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
                  <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
                  <p className="text-2xl font-bold text-gray-900">{karyawanList.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {Object.entries(jabatanStats).slice(0, 3).map(([jabatan, count]) => (
            <Card key={jabatan}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{jabatan}</p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <Briefcase className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Karyawan</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari karyawan..."
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
                  <TableHead>NIK</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKaryawan.map((karyawan) => (
                  <TableRow key={karyawan.id}>
                    <TableCell className="font-medium">{karyawan.nik}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {karyawan.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{karyawan.nama}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getJabatanBadge(karyawan.jabatan)}</TableCell>
                    <TableCell>
                      {karyawan.telepon && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          {karyawan.telepon}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {karyawan.alamat && (
                        <div className="flex items-start gap-1 text-sm max-w-xs">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{karyawan.alamat}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{karyawan.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(karyawan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(karyawan.id)}
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