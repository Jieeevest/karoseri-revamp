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
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  ShoppingCart, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  AlertTriangle,
  DollarSign
} from 'lucide-react'
import { useState } from 'react'

interface Supplier {
  id: string
  kode: string
  nama: string
}

interface Barang {
  id: string
  kode: string
  nama: string
  satuan: string
}

interface PurchaseOrderItem {
  id: string
  barangId: string
  barang: Barang
  jumlah: number
  harga: number
  subtotal: number
}

interface PurchaseOrder {
  id: string
  nomor: string
  tanggal: string
  supplierId: string
  supplier: Supplier
  status: 'DRAFT' | 'DIAJUKAN' | 'DISETUJUI' | 'DITOLAK' | 'SELESAI'
  total: number
  items: PurchaseOrderItem[]
  createdAt: string
}

export default function KonfirmasiPOPage() {
  const [purchaseOrderList, setPurchaseOrderList] = useState<PurchaseOrder[]>([
    {
      id: '1',
      nomor: 'PO-2024-001',
      tanggal: '2024-01-15',
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      status: 'DIAJUKAN',
      total: 650000,
      items: [
        {
          id: '1',
          barangId: '1',
          barang: { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', satuan: 'Liter' },
          jumlah: 2,
          harga: 150000,
          subtotal: 300000
        },
        {
          id: '2',
          barangId: '2',
          barang: { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', satuan: 'Meter' },
          jumlah: 5,
          harga: 70000,
          subtotal: 350000
        }
      ],
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      nomor: 'PO-2024-002',
      tanggal: '2024-01-16',
      supplierId: '2',
      supplier: { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
      status: 'DIAJUKAN',
      total: 480000,
      items: [
        {
          id: '3',
          barangId: '3',
          barang: { id: '3', kode: 'BRG003', nama: 'Paku 10cm', satuan: 'Kg' },
          jumlah: 10,
          harga: 48000,
          subtotal: 480000
        }
      ],
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      nomor: 'PO-2024-003',
      tanggal: '2024-01-17',
      supplierId: '3',
      supplier: { id: '3', kode: 'SUP003', nama: 'Supplier Jaya' },
      status: 'DIAJUKAN',
      total: 1200000,
      items: [
        {
          id: '4',
          barangId: '4',
          barang: { id: '4', kode: 'BRG004', nama: 'Lampu LED', satuan: 'Unit' },
          jumlah: 20,
          harga: 60000,
          subtotal: 1200000
        }
      ],
      createdAt: '2024-01-17'
    },
    {
      id: '4',
      nomor: 'PO-2024-004',
      tanggal: '2024-01-18',
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      status: 'DIAJUKAN',
      total: 890000,
      items: [
        {
          id: '5',
          barangId: '5',
          barang: { id: '5', kode: 'BRG005', nama: 'Triplek Melamin', satuan: 'Lembar' },
          jumlah: 50,
          harga: 17800,
          subtotal: 890000
        }
      ],
      createdAt: '2024-01-18'
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const filteredPO = purchaseOrderList.filter(po =>
    po.status === 'DIAJUKAN' &&
    (po.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', label: 'Draft', icon: Clock },
      DIAJUKAN: { color: 'bg-blue-100 text-blue-800', label: 'Diajukan', icon: Clock },
      DISETUJUI: { color: 'bg-green-100 text-green-800', label: 'Disetujui', icon: CheckCircle },
      DITOLAK: { color: 'bg-red-100 text-red-800', label: 'Ditolak', icon: XCircle },
      SELESAI: { color: 'bg-purple-100 text-purple-800', label: 'Selesai', icon: CheckCircle },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleApprove = (po: PurchaseOrder) => {
    if (confirm(`Apakah Anda yakin ingin menyetujui PO ${po.nomor} dari ${po.supplier.nama}?`)) {
      setPurchaseOrderList(prev => 
        prev.map(p => 
          p.id === po.id 
            ? { ...p, status: 'DISETUJUI' as const }
            : p
        )
      )
    }
  }

  const handleReject = (po: PurchaseOrder) => {
    setSelectedPO(po)
    setRejectReason('')
    setIsRejectDialogOpen(true)
  }

  const confirmReject = () => {
    if (!selectedPO || !rejectReason.trim()) {
      alert('Alasan penolakan harus diisi!')
      return
    }

    setPurchaseOrderList(prev => 
      prev.map(p => 
        p.id === selectedPO.id 
          ? { ...p, status: 'DITOLAK' as const }
          : p
      )
    )

    setIsRejectDialogOpen(false)
    setSelectedPO(null)
    setRejectReason('')
  }

  const handleViewDetail = (po: PurchaseOrder) => {
    setSelectedPO(po)
    setIsDetailDialogOpen(true)
  }

  const getStats = () => {
    const submittedPO = purchaseOrderList.filter(po => po.status === 'DIAJUKAN')
    const approvedPO = purchaseOrderList.filter(po => po.status === 'DISETUJUI')
    const rejectedPO = purchaseOrderList.filter(po => po.status === 'DITOLAK')
    
    return {
      submitted: submittedPO.length,
      approved: approvedPO.length,
      rejected: rejectedPO.length,
      totalValue: submittedPO.reduce((sum, po) => sum + po.total, 0)
    }
  }

  const stats = getStats()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Konfirmasi Purchase Order</h1>
            <p className="text-gray-600">Menyetujui atau menolak permohonan purchase order</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menunggu Konfirmasi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Disetujui</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
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
                  <p className="text-sm font-medium text-gray-600">Ditolak</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Nilai</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
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
              <CardTitle>PO Menunggu Konfirmasi</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Cari PO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPO.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Tidak ada PO yang menunggu konfirmasi</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor PO</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Total Item</TableHead>
                    <TableHead>Total Nilai</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPO.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.nomor}</TableCell>
                      <TableCell>{po.tanggal}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{po.supplier.nama}</p>
                          <p className="text-sm text-gray-500">{po.supplier.kode}</p>
                        </div>
                      </TableCell>
                      <TableCell>{po.items.length} item</TableCell>
                      <TableCell className="font-medium">{formatCurrency(po.total)}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(po)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(po)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(po)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Purchase Order</DialogTitle>
            </DialogHeader>
            {selectedPO && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nomor PO</Label>
                    <p className="font-semibold">{selectedPO.nomor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tanggal</Label>
                    <p>{selectedPO.tanggal}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Supplier</Label>
                    <p>{selectedPO.supplier.nama} ({selectedPO.supplier.kode})</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div>{getStatusBadge(selectedPO.status)}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Detail Barang</Label>
                  <div className="mt-2 border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode</TableHead>
                          <TableHead>Nama Barang</TableHead>
                          <TableHead>Jumlah</TableHead>
                          <TableHead>Harga</TableHead>
                          <TableHead>Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPO.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.barang.kode}</TableCell>
                            <TableCell>{item.barang.nama}</TableCell>
                            <TableCell>{item.jumlah} {item.barang.satuan}</TableCell>
                            <TableCell>{formatCurrency(item.harga)}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(item.subtotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">Total</Label>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(selectedPO.total)}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tolak Purchase Order</DialogTitle>
              <DialogDescription>
                Berikan alasan penolakan untuk PO {selectedPO?.nomor}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="rejectReason">Alasan Penolakan</Label>
                <Textarea
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Masukkan alasan penolakan..."
                  rows={4}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmReject}>
                Tolak PO
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}