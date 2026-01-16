'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  Car, 
  Users, 
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react'

export default function Home() {
  const stats = [
    {
      title: 'Total Barang',
      value: '1,234',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Kendaraan Aktif',
      value: '45',
      icon: Car,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Karyawan',
      value: '28',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'PO Pending',
      value: '12',
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'barang_masuk',
      description: 'Barang masuk dari Supplier ABC',
      time: '2 jam yang lalu',
      icon: Package,
      status: 'success'
    },
    {
      id: 2,
      type: 'kendaraan_masuk',
      description: 'Kendaraan B 1234 CD masuk untuk perbaikan',
      time: '3 jam yang lalu',
      icon: Car,
      status: 'info'
    },
    {
      id: 3,
      type: 'purchase_order',
      description: 'Purchase Order #PO-001 diajukan',
      time: '5 jam yang lalu',
      icon: ShoppingCart,
      status: 'warning'
    },
    {
      id: 4,
      type: 'kendaraan_keluar',
      description: 'Kendaraan B 5678 EF selesai diperbaiki',
      time: '1 hari yang lalu',
      icon: Car,
      status: 'success'
    }
  ]

  const lowStockItems = [
    { name: 'Cat Semprot Hitam', stock: 5, minStock: 10 },
    { name: 'Paku 10cm', stock: 2, minStock: 20 },
    { name: 'Kawat Las', stock: 8, minStock: 15 },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Sistem Manajemen Karoseri</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Aktivitas Terkini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-50">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                      {getStatusIcon(activity.status)}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Stok Menipis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          Stok: <span className="font-bold text-red-600">{item.stock}</span> / {item.minStock}
                        </p>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Car className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium">Kendaraan Masuk</p>
              </button>
              <button className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <ShoppingCart className="h-6 w-6 text-green-600 mb-2" />
                <p className="text-sm font-medium">Purchase Order</p>
              </button>
              <button className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <Package className="h-6 w-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium">Barang Masuk</p>
              </button>
              <button className="p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                <FileText className="h-6 w-6 text-orange-600 mb-2" />
                <p className="text-sm font-medium">Laporan</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}