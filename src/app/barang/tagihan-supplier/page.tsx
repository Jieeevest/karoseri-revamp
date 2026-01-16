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
import { 
  Search, 
  Receipt, 
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  CreditCard
} from 'lucide-react'
import { useState } from 'react'

interface Supplier {
  id: string
  kode: string
  nama: string
}

interface PurchaseOrder {
  id: string
  nomor: string
  supplierId: string
  supplier: Supplier
  total: number
}

interface TagihanSupplier {
  id: string
  nomor: string
  purchaseOrderId: string
  purchaseOrder: PurchaseOrder
  supplierId: string
  supplier: Supplier
  jumlah: number
  tempo: string
  status: 'BELUM_DIBAYAR' | 'SUDAH_DIBAYAR'
  metodePembayaran?: 'TRANSFER' | 'CASH' | 'GIRO'
  buktiPembayaran?: string
  createdAt: string
}

export default function TagihanSupplierPage() {
  const [supplierList] = useState<Supplier[]>([
    { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
    { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
    { id: '3', kode: 'SUP003', nama: 'Supplier Jaya' },
  ])

  const [tagihanList, setTagihanList] = useState<TagihanSupplier[]>([
    {
      id: '1',
      nomor: 'TAG-2024-001',
      purchaseOrderId: '1',
      purchaseOrder: {
        id: '1',
        nomor: 'PO-2024-001',
        supplierId: '1',
        supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
        total: 650000
      },
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      jumlah: 650000,
      tempo: '2024-02-15',
      status: 'BELUM_DIBAYAR',
      createdAt: '2024-01-20'
    },
    {
      id: '2',
      nomor: 'TAG-2024-002',
      purchaseOrderId: '2',
      purchaseOrder: {
        id: '2',
        nomor: 'PO-2024-002',
        supplierId: '2',
        supplier: { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
        total: 480000
      },
      supplierId: '2',
      supplier: { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
      jumlah: 480000,
      tempo: '2024-02-10',
      status: 'SUDAH_DIBAYAR',
      metodePembayaran: 'TRANSFER',
      buktiPembayaran: 'bukti_transfer_001.jpg',
      createdAt: '2024-01-18'
    },
    {
      id: '3',
      nomor: 'TAG-2024-003',
      purchaseOrderId: '3',
      purchaseOrder: {
        id: '3',
        nomor: 'PO-2024-003',
        supplierId: '3',
        supplier: { id: '3', kode: 'SUP003', nama: 'Supplier Jaya' },
        total: 1200000
      },
      supplierId: '3',
      supplier: { id: '3', kode: 'SUP003', nama: 'Supplier Jaya' },
      jumlah: 1200000,
      tempo: '2024-02-20',
      status: 'BELUM_DIBAYAR',
      createdAt: '2024-01-22'
    },
    {
      id: '4',
      nomor: 'TAG-2024-004',
      purchaseOrderId: '4',
      purchaseOrder: {
        id: '4',
        nomor: 'PO-2024-004',
        supplierId: '1',
        supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
        total: 890000
      },
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      jumlah: 890000,
      tempo: '2024-01-25',
      status: 'SUDAH_DIBAYAR',
      metodePembayaran: 'CASH',
      buktiPembayaran: 'kwitansi_002.jpg',
      createdAt: '2024-01-19'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanSupplier | null>(null)
  const [paymentFormData, setPaymentFormData] = useState({
    metode: 'TRANSFER' as 'TRANSFER' | 'CASH' | 'GIRO',
    buktiPembayaran: ''
  })

  const filteredTagihan = tagihanList.filter(tagihan =>
    tagihan.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tagihan.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tagihan.purchaseOrder.nomor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      BELUM_DIBAYAR: { color: 'bg-yellow-100 text-yellow-800', label: 'Belum Dibayar', icon: Clock },
      SUDAH_DIBAYAR: { color: 'bg-green-100 text-green-800', label: 'Sudah Dibayar', icon: CheckCircle },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.BELUM_DIBAYAR
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getMetodeBadge = (metode?: string) => {
    if (!metode) return null
    
    const metodeConfig = {
      TRANSFER: { color: 'bg-blue-100 text-blue-800', label: 'Transfer' },
      CASH: { color: 'bg-green-100 text-green-800', label: 'Cash' },
      GIRO: { color: 'bg-orange-100 text-orange-800', label: 'Giro' },
    }
    
    const config = metodeConfig[metode as keyof typeof metodeConfig] || metodeConfig.TRANSFER
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getTempoStatus = (tempo: string) => {
    const today = new Date()
    const tempoDate = new Date(tempo)
    const diffDays = Math.ceil((tempoDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { color: 'text-red-600', label: 'Terlambat', days: Math.abs(diffDays) }
    } else if (diffDays <= 7) {
      return { color: 'text-yellow-600', label: 'Mendekati Jatuh Tempo', days: diffDays }
    } else {
      return { color: 'text-green-600', label: 'Aman', days: diffDays }
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handlePayment = (tagihan: TagihanSupplier) => {
    setSelectedTagihan(tagihan)
    setPaymentFormData({
      metode: 'TRANSFER',
      buktiPembayaran: ''
    })
    setIsPaymentDialogOpen(true)
  }

  const confirmPayment = () => {
    if (!selectedTagihan) return

    setTagihanList(prev => 
      prev.map(t => 
        t.id === selectedTagihan.id 
          ? { 
              ...t, 
              status: 'SUDAH_DIBAYAR' as const,
              metodePembayaran: paymentFormData.metode,
              buktiPembayaran: paymentFormData.buktiPembayaran || undefined
            }
          : t
      )
    )

    setIsPaymentDialogOpen(false)
    setSelectedTagihan(null)
    setPaymentFormData({ metode: 'TRANSFER', buktiPembayaran: '' })
  }

  const getStats = () => {
    const unpaid = tagihanList.filter(t => t.status === 'BELUM_DIBAYAR')
    const paid = tagihanList.filter(t => t.status === 'SUDAH_DIBAYAR')
    const overdue = unpaid.filter(t => {
      const tempoDate = new Date(t.tempo)
      return tempoDate < new Date()
    })
    
    return {
      total: tagihanList.length,
      unpaid: unpaid.length,
      paid: paid.length,
      overdue: overdue.length,
      totalUnpaid: unpaid.reduce((sum, t) => sum + t.jumlah, 0),
      totalPaid: paid.reduce((sum, t) => sum + t.jumlah, 0)
    }
  }

  const stats = getStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tagihan Supplier</h1>
            <p className="text-gray-600">Manajemen tagihan supplier dan pembayaran</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tagihan</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Receipt className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Belum Dibayar</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.unpaid}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terlambat</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Belum Dibayar</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalUnpaid)}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Tagihan Supplier</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari tagihan..."
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
                  <TableHead>Nomor Tagihan</TableHead>
                  <TableHead>PO Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTagihan.map((tagihan) => {
                  const tempoStatus = getTempoStatus(tagihan.tempo)
                  return (
                    <TableRow key={tagihan.id}>
                      <TableCell className="font-medium">{tagihan.nomor}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tagihan.purchaseOrder.nomor}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{tagihan.supplier.nama}</p>
                          <p className="text-sm text-gray-500">{tagihan.supplier.kode}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(tagihan.jumlah)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{tagihan.tempo}</p>
                          <p className={`text-xs font-medium ${tempoStatus.color}`}>
                            {tempoStatus.label} ({tempoStatus.days} hari)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(tagihan.status)}</TableCell>
                      <TableCell>
                        {tagihan.metodePembayaran ? getMetodeBadge(tagihan.metodePembayaran) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {tagihan.buktiPembayaran && (
                            <Button
                              variant="outline"
                              size="sm"
                              title="Lihat Bukti Pembayaran"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          )}
                          {tagihan.status === 'BELUM_DIBAYAR' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePayment(tagihan)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Bayar Tagihan Supplier</DialogTitle>
              <DialogDescription>
                Catat pembayaran untuk tagihan {selectedTagihan?.nomor}
              </DialogDescription>
            </DialogHeader>
            {selectedTagihan && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nomor Tagihan</Label>
                      <p className="font-semibold">{selectedTagihan.nomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Supplier</Label>
                      <p>{selectedTagihan.supplier.nama}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Jumlah</Label>
                      <p className="font-bold text-lg">{formatCurrency(selectedTagihan.jumlah)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Jatuh Tempo</Label>
                      <p>{selectedTagihan.tempo}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid items-center gap-2">
                  <Label htmlFor="metode">Metode Pembayaran</Label>
                  <Select
                    value={paymentFormData.metode}
                    onValueChange={(value) => setPaymentFormData(prev => ({ ...prev, metode: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRANSFER">Transfer</SelectItem>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="GIRO">Giro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid items-center gap-2">
                  <Label htmlFor="buktiPembayaran">Bukti Pembayaran</Label>
                  <div className="flex gap-2">
                    <Input
                      id="buktiPembayaran"
                      value={paymentFormData.buktiPembayaran}
                      onChange={(e) => setPaymentFormData(prev => ({ ...prev, buktiPembayaran: e.target.value }))}
                      placeholder="Nama file bukti pembayaran"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={confirmPayment}>
                Bayar Sekarang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}