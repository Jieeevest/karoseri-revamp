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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  Car, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Eye,
  Download,
  Calendar,
  User,
  Building,
  ClipboardCheck
} from 'lucide-react'
import { useState } from 'react'

interface Customer {
  id: string
  kode: string
  nama: string
}

interface Kendaraan {
  id: string
  nomorPolisi: string
  merek: string
  tipe: string
  status: string
}

interface QCChecklist {
  id: string
  area: string
  item: string
  kondisi: 'BAIK' | 'RUSAK' | 'PERLU_PERBAIKAN'
  catatan: string
}

interface KendaraanKeluar {
  id: string
  nomor: string
  tanggalKeluar: string
  kendaraanId: string
  kendaraan: Kendaraan
  qcResult: string
  layakKeluar: boolean
  suratJalan: string
  createdAt: string
}

export default function KendaraanKeluarPage() {
  const [customerList] = useState<Customer[]>([
    { id: '1', kode: 'CUS001', nama: 'PT. Maju Bersama' },
    { id: '2', kode: 'CUS002', nama: 'CV. Jaya Transport' },
    { id: '3', kode: 'CUS003', nama: 'PT. Logistik Indonesia' },
  ])

  const [kendaraanList] = useState<Kendaraan[]>([
    { id: '1', nomorPolisi: 'B 1234 ABC', merek: 'Hino', tipe: 'Ranger', status: 'SELESAI' },
    { id: '2', nomorPolisi: 'B 5678 DEF', merek: 'Isuzu', tipe: 'Dutro', status: 'SELESAI' },
    { id: '3', nomorPolisi: 'B 9012 GHI', merek: 'Isuzu', tipe: 'Elf', status: 'SELESAI' },
    { id: '4', nomorPolisi: 'B 3456 JKL', merek: 'Mitsubishi', tipe: 'L300', status: 'PROSES_PENGCATAN' },
  ])

  const [kendaraanKeluarList, setKendaraanKeluarList] = useState<KendaraanKeluar[]>([
    {
      id: '1',
      nomor: 'KK-2024-001',
      tanggalKeluar: '2024-01-20',
      kendaraanId: '1',
      kendaraan: { id: '1', nomorPolisi: 'B 1234 ABC', merek: 'Hino', tipe: 'Ranger', status: 'SELESAI' },
      qcResult: 'Kendaraan dalam kondisi baik, semua fungsi normal, cat sesuai standar',
      layakKeluar: true,
      suratJalan: 'surat_jalan_001.pdf',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      nomor: 'KK-2024-002',
      tanggalKeluar: '2024-01-22',
      kendaraanId: '2',
      kendaraan: { id: '2', nomorPolisi: 'B 5678 DEF', merek: 'Isuzu', tipe: 'Dutro', status: 'SELESAI' },
      qcResult: 'Kendaraan siap digunakan, semua peralatan lengkap',
      layakKeluar: true,
      suratJalan: 'surat_jalan_002.pdf',
      createdAt: '2024-01-22'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isQCDialogOpen, setIsQCDialogOpen] = useState(false)
  const [isSuratDialogOpen, setIsSuratDialogOpen] = useState(false)
  const [selectedKendaraan, setSelectedKendaraan] = useState<KendaraanKeluar | null>(null)
  const [editingKendaraan, setEditingKendaraan] = useState<KendaraanKeluar | null>(null)
  const [formData, setFormData] = useState({
    tanggalKeluar: new Date().toISOString().split('T')[0],
    kendaraanId: '',
    qcResult: '',
    layakKeluar: false,
    suratJalan: ''
  })

  const [qcChecklist, setQcChecklist] = useState<QCChecklist[]>([
    // Eksterior
    { id: '1', area: 'Eksterior', item: 'Kondisi Cat Body', kondisi: 'BAIK', catatan: '' },
    { id: '2', area: 'Eksterior', item: 'Kaca Spion', kondisi: 'BAIK', catatan: '' },
    { id: '3', area: 'Eksterior', item: 'Lampu Depan', kondisi: 'BAIK', catatan: '' },
    { id: '4', area: 'Eksterior', item: 'Lampu Belakang', kondisi: 'BAIK', catatan: '' },
    { id: '5', area: 'Eksterior', item: 'Lampu Sen', kondisi: 'BAIK', catatan: '' },
    { id: '6', area: 'Eksterior', item: 'Ban', kondisi: 'BAIK', catatan: '' },
    // Interior
    { id: '7', area: 'Interior', item: 'Dashboard', kondisi: 'BAIK', catatan: '' },
    { id: '8', area: 'Interior', item: 'Jok Supir', kondisi: 'BAIK', catatan: '' },
    { id: '9', area: 'Interior', item: 'Jok Kenek', kondisi: 'BAIK', catatan: '' },
    { id: '10', area: 'Interior', item: 'AC', kondisi: 'BAIK', catatan: '' },
    // Pengerjaan
    { id: '11', area: 'Pengerjaan', item: 'Wing Box', kondisi: 'BAIK', catatan: '' },
    { id: '12', area: 'Pengerjaan', item: 'Pintu', kondisi: 'BAIK', catatan: '' },
    { id: '13', area: 'Pengerjaan', item: 'Kunci', kondisi: 'BAIK', catatan: '' },
    // Keamanan
    { id: '14', area: 'Keamanan', item: 'Segitiga Pengaman', kondisi: 'BAIK', catatan: '' },
    { id: '15', area: 'Keamanan', item: 'P3K', kondisi: 'BAIK', catatan: '' },
    { id: '16', area: 'Keamanan', item: 'APAR', kondisi: 'BAIK', catatan: '' },
  ])

  const filteredKendaraanKeluar = kendaraanKeluarList.filter(kk =>
    kk.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kk.kendaraan.nomorPolisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kk.kendaraan.merek.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      MASUK: { color: 'bg-blue-100 text-blue-800', label: 'Masuk' },
      TAHAP_PERAKITAN: { color: 'bg-yellow-100 text-yellow-800', label: 'Tahap Perakitan' },
      PROSES_PENGCATAN: { color: 'bg-purple-100 text-purple-800', label: 'Proses Pengecatan' },
      PROSES_PEMBUATAN_LOGO: { color: 'bg-pink-100 text-pink-800', label: 'Proses Logo' },
      SELESAI: { color: 'bg-green-100 text-green-800', label: 'Selesai' },
      KELUAR: { color: 'bg-gray-100 text-gray-800', label: 'Keluar' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.MASUK
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getKondisiBadge = (kondisi: string) => {
    const kondisiConfig = {
      BAIK: { color: 'bg-green-100 text-green-800', label: 'Baik' },
      RUSAK: { color: 'bg-red-100 text-red-800', label: 'Rusak' },
      PERLU_PERBAIKAN: { color: 'bg-yellow-100 text-yellow-800', label: 'Perlu Perbaikan' },
    }
    
    const config = kondisiConfig[kondisi as keyof typeof kondisiConfig] || kondisiConfig.BAIK
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedKendaraan = kendaraanList.find(k => k.id === formData.kendaraanId)
    if (!selectedKendaraan) return

    if (selectedKendaraan.status !== 'SELESAI') {
      alert('Kendaraan harus memiliki status "Selesai" sebelum dapat keluar!')
      return
    }

    const newKendaraanKeluar: KendaraanKeluar = {
      id: Date.now().toString(),
      nomor: `KK-2024-${String(kendaraanKeluarList.length + 1).padStart(3, '0')}`,
      tanggalKeluar: formData.tanggalKeluar,
      kendaraanId: formData.kendaraanId,
      kendaraan: selectedKendaraan,
      qcResult: formData.qcResult,
      layakKeluar: formData.layakKeluar,
      suratJalan: `surat_jalan_${Date.now()}.pdf`,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setKendaraanKeluarList([...kendaraanKeluarList, newKendaraanKeluar])
    resetForm()
    setIsDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      tanggalKeluar: new Date().toISOString().split('T')[0],
      kendaraanId: '',
      qcResult: '',
      layakKeluar: false,
      suratJalan: ''
    })
    setQcChecklist(qcChecklist.map(item => ({ ...item, kondisi: 'BAIK', catatan: '' })))
  }

  const handleQC = (kendaraanKeluar: KendaraanKeluar) => {
    setSelectedKendaraan(kendaraanKeluar)
    setIsQCDialogOpen(true)
  }

  const handleViewSurat = (kendaraanKeluar: KendaraanKeluar) => {
    setSelectedKendaraan(kendaraanKeluar)
    setIsSuratDialogOpen(true)
  }

  const updateQCChecklist = (id: string, field: string, value: any) => {
    setQcChecklist(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  const getQCSummary = () => {
    const baik = qcChecklist.filter(item => item.kondisi === 'BAIK').length
    const rusak = qcChecklist.filter(item => item.kondisi === 'RUSAK').length
    const perluPerbaikan = qcChecklist.filter(item => item.kondisi === 'PERLU_PERBAIKAN').length
    
    return { baik, rusak, perluPerbaikan }
  }

  const qcSummary = getQCSummary()

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayItems = kendaraanKeluarList.filter(kk => kk.tanggalKeluar === today)
    
    return {
      total: todayItems.length,
      layakKeluar: todayItems.filter(kk => kk.layakKeluar).length,
      tidakLayak: todayItems.filter(kk => !kk.layakKeluar).length
    }
  }

  const todayStats = getTodayStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kendaraan Keluar</h1>
            <p className="text-gray-600">Quality Control dan pencetakan surat jalan</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Car className="mr-2 h-4 w-4" />
                Kendaraan Keluar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Form Kendaraan Keluar</DialogTitle>
                  <DialogDescription>
                    Quality Control dan persetujuan kendaraan untuk keluar
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid items-center gap-2">
                      <Label htmlFor="tanggalKeluar">Tanggal Keluar</Label>
                      <Input
                        id="tanggalKeluar"
                        type="date"
                        value={formData.tanggalKeluar}
                        onChange={(e) => setFormData(prev => ({ ...prev, tanggalKeluar: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid items-center gap-2">
                      <Label htmlFor="kendaraanId">Kendaraan</Label>
                      <Select
                        value={formData.kendaraanId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, kendaraanId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kendaraan" />
                        </SelectTrigger>
                        <SelectContent>
                          {kendaraanList
                            .filter(k => k.status === 'SELESAI')
                            .map((kendaraan) => (
                              <SelectItem key={kendaraan.id} value={kendaraan.id}>
                                {kendaraan.nomorPolisi} - {kendaraan.merek} {kendaraan.tipe}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qcResult">Hasil QC</Label>
                    <Textarea
                      id="qcResult"
                      value={formData.qcResult}
                      onChange={(e) => setFormData(prev => ({ ...prev, qcResult: e.target.value }))}
                      placeholder="Deskripsikan hasil quality control kendaraan"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="layakKeluar"
                      checked={formData.layakKeluar}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, layakKeluar: checked as boolean }))}
                    />
                    <Label htmlFor="layakKeluar" className="font-medium">
                      Kendaraan layak keluar
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!formData.layakKeluar}>
                    Proses Kendaraan Keluar
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
                  <p className="text-sm font-medium text-gray-600">Total Keluar</p>
                  <p className="text-2xl font-bold text-gray-900">{kendaraanKeluarList.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{todayStats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Layak Keluar</p>
                  <p className="text-2xl font-bold text-green-600">{todayStats.layakKeluar}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tidak Layak</p>
                  <p className="text-2xl font-bold text-red-600">{todayStats.tidakLayak}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Riwayat Kendaraan Keluar</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari kendaraan keluar..."
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
                  <TableHead>Nomor</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead>Hasil QC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Surat Jalan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKendaraanKeluar.map((kendaraanKeluar) => (
                  <TableRow key={kendaraanKeluar.id}>
                    <TableCell className="font-medium">{kendaraanKeluar.nomor}</TableCell>
                    <TableCell>{kendaraanKeluar.tanggalKeluar}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{kendaraanKeluar.kendaraan.nomorPolisi}</p>
                        <p className="text-sm text-gray-500">
                          {kendaraanKeluar.kendaraan.merek} {kendaraanKeluar.kendaraan.tipe}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="text-sm line-clamp-2">{kendaraanKeluar.qcResult}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {kendaraanKeluar.layakKeluar ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Layak Keluar
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="mr-1 h-3 w-3" />
                          Tidak Layak
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {kendaraanKeluar.suratJalan ? (
                        <Badge variant="secondary">{kendaraanKeluar.suratJalan}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQC(kendaraanKeluar)}
                        >
                          <ClipboardCheck className="h-4 w-4" />
                        </Button>
                        {kendaraanKeluar.suratJalan && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewSurat(kendaraanKeluar)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* QC Dialog */}
        <Dialog open={isQCDialogOpen} onOpenChange={setIsQCDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quality Control Checklist</DialogTitle>
              <DialogDescription>
                Checklist QC untuk kendaraan {selectedKendaraan?.kendaraan.nomorPolisi}
              </DialogDescription>
            </DialogHeader>
            {selectedKendaraan && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">{qcSummary.baik}</p>
                    <p className="text-sm text-green-700">Baik</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">{qcSummary.rusak}</p>
                    <p className="text-sm text-red-700">Rusak</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-600">{qcSummary.perluPerbaikan}</p>
                    <p className="text-sm text-yellow-700">Perlu Perbaikan</p>
                  </div>
                </div>

                {['Eksterior', 'Interior', 'Pengerjaan', 'Keamanan'].map((area) => (
                  <div key={area} className="space-y-2">
                    <h4 className="font-semibold text-lg border-b pb-2">{area}</h4>
                    <div className="space-y-2">
                      {qcChecklist
                        .filter(item => item.area === area)
                        .map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <span className="font-medium w-48">{item.item}</span>
                              <Select
                                value={item.kondisi}
                                onValueChange={(value) => updateQCChecklist(item.id, 'kondisi', value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="BAIK">Baik</SelectItem>
                                  <SelectItem value="RUSAK">Rusak</SelectItem>
                                  <SelectItem value="PERLU_PERBAIKAN">Perlu Perbaikan</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2">
                              {getKondisiBadge(item.kondisi)}
                              <Input
                                placeholder="Catatan"
                                value={item.catatan}
                                onChange={(e) => updateQCChecklist(item.id, 'catatan', e.target.value)}
                                className="w-48 h-8"
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Surat Jalan Dialog */}
        <Dialog open={isSuratDialogOpen} onOpenChange={setIsSuratDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Surat Jalan</DialogTitle>
              <DialogDescription>
                Surat jalan untuk kendaraan {selectedKendaraan?.kendaraan.nomorPolisi}
              </DialogDescription>
            </DialogHeader>
            {selectedKendaraan && (
              <div className="space-y-4">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">SURAT JALAN</h2>
                    <div className="space-y-2 text-left">
                      <p><strong>Nomor:</strong> {selectedKendaraan.nomor}</p>
                      <p><strong>Tanggal:</strong> {selectedKendaraan.tanggalKeluar}</p>
                      <p><strong>Kendaraan:</strong> {selectedKendaraan.kendaraan.nomorPolisi}</p>
                      <p><strong>Merek/Tipe:</strong> {selectedKendaraan.kendaraan.merek} {selectedKendaraan.kendaraan.tipe}</p>
                      <p><strong>Status QC:</strong> {selectedKendaraan.layakKeluar ? 'LAYAK KELUAR' : 'TIDAK LAYAK KELUAR'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Tanda Tangan</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Perusahaan</p>
                      <div className="border-b-2 border-gray-400 pb-2">
                        <p className="font-semibold">PT. Karoseri Indonesia</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Security</p>
                      <div className="border-b-2 border-gray-400 pb-2">
                        <p className="font-semibold">_________________</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Penerima</p>
                      <div className="border-b-2 border-gray-400 pb-2">
                        <p className="font-semibold">_________________</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Cetak
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}