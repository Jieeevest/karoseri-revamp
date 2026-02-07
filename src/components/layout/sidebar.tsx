"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Settings,
  Package,
  Users,
  Car,
  FileText,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

// Define roles string constraints to match Prisma Enum
type Role =
  | "USER"
  | "ADMIN"
  | "GUDANG"
  | "PURCHASING"
  | "PRODUKSI"
  | "HR"
  | "SALES"
  | "OWNER";

interface MenuItem {
  title: string;
  icon: any;
  href?: string;
  roles?: Role[]; // Roles that can access this item
  submenus?: {
    title: string;
    href: string;
    roles?: Role[]; // Roles that can access this submenu
  }[];
}

const ROLES = {
  ADMIN: "ADMIN" as Role,
  GUDANG: "GUDANG" as Role,
  PURCHASING: "PURCHASING" as Role,
  PRODUKSI: "PRODUKSI" as Role,
  HR: "HR" as Role,
  SALES: "SALES" as Role,
  OWNER: "OWNER" as Role,
};

const menuItemsRaw: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    // All roles can access
  },
  {
    title: "Menu Master",
    icon: Settings,
    roles: [ROLES.ADMIN],
    submenus: [
      { title: "Kategori Barang", href: "/master/kategori-barang" },
      { title: "Satuan Barang", href: "/master/satuan-barang" },
      { title: "Merek Kendaraan", href: "/master/merek-kendaraan" },
      { title: "Tipe Kendaraan", href: "/master/tipe-kendaraan" },
    ],
  },
  {
    title: "Manajemen Barang",
    icon: Package,
    submenus: [
      {
        title: "Data Barang",
        href: "/barang/data-barang",
        roles: [ROLES.ADMIN, ROLES.GUDANG, ROLES.PURCHASING],
      },
      {
        title: "Harga Barang",
        href: "/barang/harga-barang",
        roles: [ROLES.ADMIN, ROLES.GUDANG, ROLES.PURCHASING],
      },
      {
        title: "Data Supplier",
        href: "/barang/supplier",
        roles: [ROLES.ADMIN, ROLES.PURCHASING],
      },
      {
        title: "Purchase Order",
        href: "/barang/purchase-order",
        roles: [ROLES.ADMIN, ROLES.PURCHASING],
      },
      {
        title: "Konfirmasi PO",
        href: "/barang/konfirmasi-po",
        roles: [ROLES.ADMIN, ROLES.PURCHASING],
      },
      {
        title: "Barang Masuk",
        href: "/barang/barang-masuk",
        roles: [ROLES.ADMIN, ROLES.GUDANG],
      },
      {
        title: "Barang Keluar",
        href: "/barang/barang-keluar",
        roles: [ROLES.ADMIN, ROLES.GUDANG, ROLES.PRODUKSI],
      },
      {
        title: "Tagihan Supplier",
        href: "/barang/tagihan-supplier",
        roles: [ROLES.ADMIN, ROLES.PURCHASING],
      },
    ],
  },
  {
    title: "Manajemen Karyawan",
    icon: Users,
    href: "/karyawan",
    roles: [ROLES.HR, ROLES.ADMIN],
  },
  {
    title: "Project / Penawaran",
    icon: FileText,
    href: "/project",
    roles: [ROLES.SALES, ROLES.ADMIN],
  },
  {
    title: "Manajemen Kendaraan",
    icon: Car,
    submenus: [
      {
        title: "Data Kendaraan",
        href: "/kendaraan/data-kendaraan",
        roles: [ROLES.ADMIN, ROLES.PRODUKSI],
      },
      {
        title: "Data Customer",
        href: "/kendaraan/customer",
        roles: [ROLES.ADMIN, ROLES.PRODUKSI],
      },
      {
        title: "Form Kendaraan Masuk",
        href: "/kendaraan/kendaraan-masuk",
        roles: [ROLES.ADMIN, ROLES.PRODUKSI],
      },
      {
        title: "Form Kendaraan Keluar",
        href: "/kendaraan/kendaraan-keluar",
        roles: [ROLES.ADMIN, ROLES.PRODUKSI],
      },
      {
        title: "Data Spek Order",
        href: "/kendaraan/spek-order",
        roles: [ROLES.ADMIN, ROLES.PRODUKSI],
      },
    ],
  },
  {
    title: "Laporan",
    icon: FileText,
    href: "/laporan",
    roles: [ROLES.ADMIN, ROLES.OWNER, ROLES.PURCHASING],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role as Role | undefined;

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Filter menu items based on user role
  const menuItems = useMemo(() => {
    if (!userRole) return []; // Or return empty, or default items for guests

    return menuItemsRaw
      .map((item) => {
        // If item has specific roles, check access
        if (item.roles && !item.roles.includes(userRole)) {
          return null;
        }

        // If item has submenus, filter them
        if (item.submenus) {
          const filteredSubmenus = item.submenus.filter((sub) => {
            if (sub.roles && !sub.roles.includes(userRole)) {
              return false;
            }
            return true;
          });

          // If no submenus remain visible, hide the parent item
          if (filteredSubmenus.length === 0) {
            return null;
          }

          return { ...item, submenus: filteredSubmenus };
        }

        return item;
      })
      .filter(Boolean) as MenuItem[];
  }, [userRole]);

  // Auto-expand menu based on active route
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenus) {
        const hasActiveChild = item.submenus.some(
          (sub) => pathname === sub.href,
        );
        if (hasActiveChild && !expandedMenus.includes(item.title)) {
          setExpandedMenus((prev) => [...prev, item.title]);
        }
      }
    });
  }, [pathname, menuItems]);

  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  const isActive = (href: string) => pathname === href;
  const isChildActive = (item: any) =>
    item.submenus?.some((sub: any) => pathname === sub.href);

  if (!session) return null; // Or a loading skeleton

  return (
    <div className="flex h-full w-72 flex-col bg-white text-slate-900 shadow-xl relative overflow-hidden font-sans border-r border-slate-200">
      {/* Header */}
      <div className="flex items-center px-6 h-20 border-b border-slate-100 relative z-10 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-500/20 ring-2 ring-blue-50">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              Karoseri<span className="text-blue-600">Sys</span>
            </h1>
            <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenus.includes(item.title);
          const hasSubmenu = item.submenus && item.submenus.length > 0;
          const active = item.href ? isActive(item.href) : isChildActive(item);

          return (
            <div key={item.title} className="mb-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "cursor-pointer group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out relative overflow-hidden",
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors shrink-0 relative z-10",
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-blue-600",
                    )}
                  />
                  <span className="relative z-10">{item.title}</span>

                  {active && (
                    <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-blue-500 opacity-100 z-0" />
                  )}
                </Link>
              ) : (
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "cursor-pointer group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out",
                    "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                    isExpanded && "bg-slate-50 text-slate-900",
                  )}
                >
                  <div className="flex items-center">
                    <Icon
                      className={cn(
                        "mr-3 h-5 w-5 transition-colors",
                        active || isExpanded
                          ? "text-blue-600"
                          : "text-slate-400 group-hover:text-blue-600",
                      )}
                    />
                    {item.title}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                  )}
                </button>
              )}

              {/* Submenu */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isExpanded && hasSubmenu
                    ? "max-h-[500px] opacity-100 mt-1"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="ml-4 pl-4 border-l border-slate-200 space-y-1 py-1">
                  {item.submenus?.map((submenu) => (
                    <Link
                      key={submenu.href}
                      href={submenu.href}
                      className={cn(
                        "cursor-pointer flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200",
                        isActive(submenu.href)
                          ? "text-blue-700 bg-blue-50 font-medium"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mr-3 transition-colors",
                          isActive(submenu.href)
                            ? "bg-blue-600"
                            : "bg-slate-300 group-hover:bg-slate-400",
                        )}
                      />
                      {submenu.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer / User Profile Snippet */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center px-2 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex-1 min-w-0 ml-1">
            <p className="text-xs font-medium text-slate-500 truncate">
              © 2026 Karoseri System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
