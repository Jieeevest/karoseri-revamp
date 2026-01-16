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
import { Plus, Edit, Trash2, Search, ShoppingCart, Eye, Send, Check, X } from 'lucide-react'
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

export default function PurchaseOrderPage() {
  const [supplierList] = useState<Supplier[]>([
    { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
    { id: '2', kode: 'SUP002', nama: 'Supplier XYZ' },
    { id: '3', kode: 'SUP003', nama: 'Supplier Jaya' },
  ])

  const [barangList] = useState<Barang[]>([
    { id: '1', kode: 'BRG001', nama: 'Cat Semprot Hitam', satuan: 'Liter' },
    { id: '2', kode: 'BRG002', nama: 'Besi Hollow 4x4', satuan: 'Meter' },
    { id: '3', kode: 'BRG003', nama: 'Paku 10cm', satuan: 'Kg' },
    { id: '4', kode: 'BRG004', nama: 'Lampu LED', satuan: 'Unit' },
  ])

  const [poList, setPoList] = useState<PurchaseOrder[]>([
    {
      id: '1',
      nomor: 'PO-2024-001',
      tanggal: '2024-01-15',
      supplierId: '1',
      supplier: { id: '1', kode: 'SUP001', nama: 'Supplier ABC' },
      status: 'DRAFT',
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
      status: 'DISETUJUI',
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
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null)
  const [viewingPO, setViewingPO] = useState<PurchaseOrder | null>(null)
  const [formData, setFormData] = useState({
    supplierId: '',
    tanggal: new Date().toISOString().split('T')[0]
  })
  const [items, setItems] = useState<PurchaseOrderItem[]>([])

  const filteredPO = poList.filter(po =>
    po.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.supplier.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      DIAJUKAN: { color: 'bg-blue-100 text-blue-800', label: 'Diajukan' },
      DISETUJUI: { color: 'bg-green-100 text-green-800', label: 'Disetujui' },
      DITOLAK: { color: 'bg-red-100 text-red-800', label: 'Ditolak' },
      SELESAI: { color: 'bg-purple-100 text-purple-800', label: 'Selesai' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      barangId: '',
      barang: { id: '', kode: '', nama: '', satuan: '' },
      jumlah: 1,
      harga: 0,
      subtotal: 0
    }
    setItems([...items, newItem])
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items]
    if (field === 'barangId') {
      const selectedBarang = barangList.find(b => b.id === value)
      if (selectedBarang) {
        updatedItems[index].barang = selectedBarang
        updatedItems[index].barangId = value
        updatedItems[index].subtotal = updatedItems[index].jumlah * updatedItems[index].harga
      }
    } else if (field === 'jumlah' || field === 'harga') {
      updatedItems[index][field] = value
      updatedItems[index].subtotal = updatedItems[index].jumlah * updatedItems[index].harga
    }
    setItems(updatedItems)
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.subtotal, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      alert('Silakan tambahkan minimal 1 barang')
      return
    }

    const selectedSupplier = supplierList.find(s => s.id === formData.supplierId)
    if (!selectedSupplier) return

    const newPO: PurchaseOrder = {
      id: Date.now().toString(),
      nomor: `PO-2024-${String(poList.length + 1).padStart(3, '0')}`,
      tanggal: formData.tanggal,
      supplierId: formData.supplierId,
      supplier: selectedSupplier,
      status: 'DRAFT',
      total: calculateTotal(),
      items: items,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setPoList([...poList, newPO])
    setFormData({ supplierId: '', tanggal: new Date().toISOString().split('T')[0] })
    setItems([])
    setIsDialogOpen(false)
  }

  const handleView = (po: PurchaseOrder) => {
    setViewingPO(po)
    setIsDetailDialogOpen(true)
  }

  const handleAjukan = (id: string) => {
    if (confirm('Apakah Anda yakin ingin mengajukan Purchase Order ini?')) {
      setPoList(prev => 
        prev.map(po => 
          po.id === id ? { ...po, status: 'DIAJUKAN' } : po
        )
      )
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus PO ini?')) {
      setPoList(prev => prev.filter(po => po.id !== id))
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Purchase Order</h1>
            <p className="text-gray-600">Manajemen permohonan restok barang</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat PO Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Buat Purchase Order Baru</DialogTitle>
                  <DialogDescription>
                    Buat permohonan restok barang ke supplier
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid items-center gap-4">
                      <Label htmlFor="supplierId">Supplier</Label>
                      <Select
                        value={formData.supplierId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          {supplierList.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.kode} - {supplier.nama}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid items-center gap-4">
                      <Label htmlFor="tanggal">Tanggal</Label>
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => setFormData(prev => ({ ...prev, tanggal: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Barang</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Barang
                      </Button>
                    </div>
                    
                    {items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Select
                            value={item.barangId}
                            onValueChange={(value) => updateItem(index, 'barangId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih barang" />
                            </SelectTrigger>
                            <SelectContent>
                              {barangList.map((barang) => (
                                <SelectItem key={barang.id} value={barang.id}>
                                  {barang.kode} - {barang.nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            placeholder="Jumlah"
                            value={item.jumlah || ''}
                            onChange={(e) => updateItem(index, 'jumlah', parseInt(e.target.value) || 0)}
                            min="1"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            placeholder="Harga"
                            value={item.harga || ''}
                            onChange={(e) => updateItem(index, 'harga', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div className="col-span-1">
                          <Input
                            value={formatCurrency(item.subtotal)}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">Total</Label>
                      <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Simpan PO</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Purchase Order</CardTitle>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor PO</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Total</TableHead>
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
                        <p className="text-xs text-gray-500">{po.supplier.kode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(po.total)}</TableCell>
                    <TableCell>{getStatusBadge(po.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(po)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {po.status === 'DRAFT' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAjukan(po.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(po.id)}
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
              <DialogTitle>Detail Purchase Order</DialogTitle>
            </DialogHeader>
            {viewingPO && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nomor PO</Label>
                    <p className="font-semibold">{viewingPO.nomor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Tanggal</Label>
                    <p>{viewingPO.tanggal}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Supplier</Label>
                    <p>{viewingPO.supplier.nama}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div>{getStatusBadge(viewingPO.status)}</div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Barang</Label>
                  <div className="mt-2 space-y-2">
                    {viewingPO.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-medium">{item.barang.nama}</p>
                          <p className="text-sm text-gray-500">
                            {item.jumlah} {item.barang.satuan} × {formatCurrency(item.harga)}
                          </p>
                        </div>
                        <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">Total</Label>
                    <span className="text-lg font-bold">{formatCurrency(viewingPO.total)}</span>
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