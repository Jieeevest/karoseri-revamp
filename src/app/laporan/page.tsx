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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { 
  FileText, 
  Download, 
  Search, 
  Calendar,
  TrendingUp,
  Package,
  Car,
  Users,
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { useState } from 'react'

export default function LaporanPage() {
  const [selectedReport, setSelectedReport] = useState('')
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Sample data for reports
  const laporanStok = [
    { id: 1, nama: 'Cat Semprot Hitam', stokAwal: 20, masuk: 50, keluar: 35, stokAkhir: 35, satuan: 'Liter' },
    { id: 2, nama: 'Besi Hollow 4x4', stokAwal: 100, masuk: 200, keluar: 150, stokAkhir: 150, satuan: 'Meter' },
    { id: 3, nama: 'Paku 10cm', stokAwal: 50, masuk: 100, keluar: 80, stokAkhir: 70, satuan: 'Kg' },
    { id: 4, nama: 'Lampu LED', stokAwal: 30, masuk: 50, keluar: 25, stokAkhir: 55, satuan: 'Unit' },
  ]

  const laporanKendaraan = [
    { id: 1, nomorPolisi: 'B 1234 ABC', customer: 'PT. Maju Bersama', tanggalMasuk: '2024-01-15', tanggalKeluar: '2024-01-20', status: 'Selesai', pengerjaan: 'Wing Box + Logo' },
    { id: 2, nomorPolisi: 'B 5678 DEF', customer: 'CV. Jaya Transport', tanggalMasuk: '2024-01-16', tanggalKeluar: '-', status: 'Proses', pengerjaan: 'Box Besi Standart' },
    { id: 3, nomorPolisi: 'B 9012 GHI', customer: 'PT. Logistik Indonesia', tanggalMasuk: '2024-01-17', tanggalKeluar: '-', status: 'Proses', pengerjaan: 'Topi Kabin Fiber' },
  ]

  const laporanKeuangan = [
    { id: 1, jenis: 'Pemasukan', keterangan: 'Pembayaran Customer - PT. Maju Bersama', jumlah: 15000000, tanggal: '2024-01-20' },
    { id: 2, jenis: 'Pengeluaran', keterangan: 'Pembayaran Upah - Ahmad Fauzi', jumlah: 3500000, tanggal: '2024-01-18' },
    { id: 3, jenis: 'Pengeluaran', keterangan: 'Pembelian Barang - Supplier ABC', jumlah: 25000000, tanggal: '2024-01-15' },
    { id: 4, jenis: 'Pemasukan', keterangan: 'Pembayaran Customer - CV. Jaya Transport', jumlah: 12000000, tanggal: '2024-01-22' },
  ]

  const laporanKaryawan = [
    { id: 1, nama: 'Ahmad Fauzi', jabatan: 'Tukang Rakit', totalSpek: 5, totalUpah: 17500000, status: 'Aktif' },
    { id: 2, nama: 'Budi Santoso', jabatan: 'Tukang Cat', totalSpek: 3, totalUpah: 7500000, status: 'Aktif' },
    { id: 3, nama: 'Chandra Wijaya', jabatan: 'Tukang Aksesoris', totalSpek: 4, totalUpah: 6000000, status: 'Aktif' },
    { id: 4, nama: 'Dedi Kurniawan', jabatan: 'Tukang Rakit', totalSpek: 2, totalUpah: 7000000, status: 'Aktif' },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getJenisBadge = (jenis: string) => {
    const jenisConfig = {
      Pemasukan: { color: 'bg-green-100 text-green-800', label: 'Pemasukan' },
      Pengeluaran: { color: 'bg-red-100 text-red-800', label: 'Pengeluaran' },
    }
    
    const config = jenisConfig[jenis as keyof typeof jenisConfig] || jenisConfig.Pemasukan
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Selesai: { color: 'bg-green-100 text-green-800', label: 'Selesai' },
      Proses: { color: 'bg-yellow-100 text-yellow-800', label: 'Proses' },
      Aktif: { color: 'bg-blue-100 text-blue-800', label: 'Aktif' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Proses
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const exportReport = (type: string) => {
    // In a real application, this would generate and download the report
    alert(`Exporting ${type} report...`)
  }

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'stok':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Laporan Stok Barang</CardTitle>
                <Button onClick={() => exportReport('stok')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Stok Awal</TableHead>
                    <TableHead>Barang Masuk</TableHead>
                    <TableHead>Barang Keluar</TableHead>
                    <TableHead>Stok Akhir</TableHead>
                    <TableHead>Satuan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanStok.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>{item.stokAwal}</TableCell>
                      <TableCell className="text-green-600">+{item.masuk}</TableCell>
                      <TableCell className="text-red-600">-{item.keluar}</TableCell>
                      <TableCell className="font-bold">{item.stokAkhir}</TableCell>
                      <TableCell>{item.satuan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      
      case 'kendaraan':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Laporan Kendaraan</CardTitle>
                <Button onClick={() => exportReport('kendaraan')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor Polisi</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Tanggal Masuk</TableHead>
                    <TableHead>Tanggal Keluar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pengerjaan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanKendaraan.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nomorPolisi}</TableCell>
                      <TableCell>{item.customer}</TableCell>
                      <TableCell>{item.tanggalMasuk}</TableCell>
                      <TableCell>{item.tanggalKeluar}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.pengerjaan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      
      case 'keuangan':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Laporan Keuangan</CardTitle>
                <Button onClick={() => exportReport('keuangan')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanKeuangan.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.tanggal}</TableCell>
                      <TableCell>{getJenisBadge(item.jenis)}</TableCell>
                      <TableCell>{item.keterangan}</TableCell>
                      <TableCell className={`text-right font-medium ${item.jenis === 'Pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.jenis === 'Pemasukan' ? '+' : '-'}{formatCurrency(item.jumlah)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-gray-50">
                    <TableCell colSpan={3} className="text-right">Total:</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(
                        laporanKeuangan.reduce((total, item) => 
                          total + (item.jenis === 'Pemasukan' ? item.jumlah : -item.jumlah), 0
                        )
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      
      case 'karyawan':
        return (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Laporan Karyawan</CardTitle>
                <Button onClick={() => exportReport('karyawan')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Karyawan</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Total Spek Order</TableHead>
                    <TableHead>Total Upah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laporanKaryawan.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama}</TableCell>
                      <TableCell>{item.jabatan}</TableCell>
                      <TableCell>{item.totalSpek}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(item.totalUpah)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedReport('stok')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Package className="h-8 w-8 text-blue-600 mb-2" />
                    <h3 className="text-lg font-semibold">Laporan Stok</h3>
                    <p className="text-sm text-gray-600">Laporan pergerakan stok barang</p>
                  </div>
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedReport('kendaraan')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Car className="h-8 w-8 text-green-600 mb-2" />
                    <h3 className="text-lg font-semibold">Laporan Kendaraan</h3>
                    <p className="text-sm text-gray-600">Laporan kendaraan masuk & keluar</p>
                  </div>
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedReport('keuangan')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
                    <h3 className="text-lg font-semibold">Laporan Keuangan</h3>
                    <p className="text-sm text-gray-600">Laporan pemasukan & pengeluaran</p>
                  </div>
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedReport('karyawan')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Users className="h-8 w-8 text-orange-600 mb-2" />
                    <h3 className="text-lg font-semibold">Laporan Karyawan</h3>
                    <p className="text-sm text-gray-600">Laporan performa karyawan</p>
                  </div>
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan</h1>
            <p className="text-gray-600">Sistem laporan manajemen karoseri</p>
          </div>
          
          {selectedReport && (
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <div>
                  <Label htmlFor="start-date" className="text-sm">Dari</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-40"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-sm">Sampai</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-40"
                  />
                </div>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setSelectedReport('')}
              >
                Kembali
              </Button>
            </div>
          )}
        </div>

        {/* Summary Statistics */}
        {!selectedReport && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                    <p className="text-2xl font-bold text-gray-900">247</p>
                    <p className="text-xs text-green-600">+12% dari bulan lalu</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
                    <p className="text-2xl font-bold text-gray-900">Rp 45.2M</p>
                    <p className="text-xs text-green-600">+8% dari bulan lalu</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Kendaraan Selesai</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                    <p className="text-xs text-green-600">Bulan ini</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stok Menipis</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                    <p className="text-xs text-red-600">Perlu restock</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Report Content */}
        {renderReportContent()}
      </div>
    </DashboardLayout>
  )
}