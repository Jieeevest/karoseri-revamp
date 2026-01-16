'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Settings, 
  Package, 
  Users, 
  Car, 
  FileText, 
  ChevronDown,
  ChevronRight,
  Building2,
  ShoppingCart,
  Truck,
  Wrench,
  Receipt,
  ClipboardList
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    title: 'Menu Master',
    icon: Settings,
    submenus: [
      { title: 'Kategori Barang', href: '/master/kategori-barang' },
      { title: 'Satuan Barang', href: '/master/satuan-barang' },
      { title: 'Merek Kendaraan', href: '/master/merek-kendaraan' },
      { title: 'Tipe Kendaraan', href: '/master/tipe-kendaraan' },
    ]
  },
  {
    title: 'Manajemen Barang',
    icon: Package,
    submenus: [
      { title: 'Data Barang', href: '/barang/data-barang' },
      { title: 'Harga Barang', href: '/barang/harga-barang' },
      { title: 'Data Supplier', href: '/barang/supplier' },
      { title: 'Purchase Order', href: '/barang/purchase-order' },
      { title: 'Konfirmasi PO', href: '/barang/konfirmasi-po' },
      { title: 'Barang Masuk', href: '/barang/barang-masuk' },
      { title: 'Barang Keluar', href: '/barang/barang-keluar' },
      { title: 'Tagihan Supplier', href: '/barang/tagihan-supplier' },
    ]
  },
  {
    title: 'Manajemen Karyawan',
    icon: Users,
    href: '/karyawan'
  },
  {
    title: 'Manajemen Kendaraan',
    icon: Car,
    submenus: [
      { title: 'Data Kendaraan', href: '/kendaraan/data-kendaraan' },
      { title: 'Data Customer', href: '/kendaraan/customer' },
      { title: 'Form Kendaraan Masuk', href: '/kendaraan/kendaraan-masuk' },
      { title: 'Form Kendaraan Keluar', href: '/kendaraan/kendaraan-keluar' },
      { title: 'Data Spek Order', href: '/kendaraan/spek-order' },
    ]
  },
  {
    title: 'Laporan',
    icon: FileText,
    href: '/laporan'
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  const toggleMenu = (title: string) => {
    setExpandedMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Karoseri</h1>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedMenus.includes(item.title)
          const hasSubmenu = item.submenus && item.submenus.length > 0
          
          return (
            <div key={item.title}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              ) : (
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    'flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 h-4 w-4" />
                    {item.title}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              )}
              
              {hasSubmenu && isExpanded && (
                <div className="mt-1 ml-6 space-y-1">
                  {item.submenus.map((submenu) => (
                    <Link
                      key={submenu.href}
                      href={submenu.href}
                      className={cn(
                        'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive(submenu.href)
                          ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      {submenu.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}