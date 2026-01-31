"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Car,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useBarang } from "@/hooks/use-barang";
import { useKendaraan } from "@/hooks/use-kendaraan";
import { useKaryawan } from "@/hooks/use-karyawan";
import { usePurchaseOrder } from "@/hooks/use-purchase-order";

export default function Home() {
  const router = useRouter();

  const { data: barangQuery } = useBarang({ limit: 100 }); // Fetch more for dashboard
  const { data: kendaraanList = [] } = useKendaraan();
  const { data: karyawanList = [] } = useKaryawan();
  const { data: poQuery } = usePurchaseOrder({ limit: 20 });

  const barangList = (barangQuery as any)?.data || [];
  const totalBarang = (barangQuery as any)?.pagination?.total || 0;
  const poList = (poQuery as any)?.data || [];

  const stats = [
    {
      title: "Total Barang",
      value: totalBarang.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Kendaraan Aktif",
      value: (kendaraanList as any[])
        .filter((k: any) => k.status !== "KELUAR" && k.status !== "SELESAI")
        .length.toLocaleString(),
      icon: Car,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Karyawan",
      value: karyawanList.length.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "PO Pending",
      value: poList
        .filter((p: any) => p.status === "DIAJUKAN" || p.status === "DRAFT")
        .length.toLocaleString(),
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // Filter low stock items (stok <= stokMinimum)
  const lowStockItems = barangList
    .filter((item: any) => item.stok <= (item.stokMinimum || 10))
    .slice(0, 5);

  // Recent Activities (Mocked for now as we need better backend support for aggregated feed)
  // Ideally, this should fetch from a dedicated /api/dashboard/activities endpoint
  const recentActivities = [
    ...poList.slice(0, 2).map((po: any) => ({
      id: `po-${po.id}`,
      type: "purchase_order",
      description: `Purchase Order ${po.nomor} ${po.status.toLowerCase()}`,
      time: new Date(po.createdAt).toLocaleDateString(),
      icon: ShoppingCart,
      status: po.status === "SELESAI" ? "success" : "warning",
    })),
    ...(kendaraanList as any[]).slice(0, 2).map((k: any) => ({
      id: `k-${k.id}`,
      type: "kendaraan",
      description: `Kendaraan ${k.nomorPolisi} status ${k.status.replace(/_/g, " ")}`,
      time: new Date(k.createdAt).toLocaleDateString(),
      icon: Car,
      status: "info",
    })),
  ]
    .sort(() => Math.random() - 0.5)
    .slice(0, 5); // Simple shuffle for variety if exact date sort isn't perfect

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

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
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
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
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gray-50">
                            <Icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                        {getStatusIcon(activity.status)}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Belum ada aktivitas tercatat.
                  </p>
                )}
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
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border border-yellow-200 bg-yellow-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.nama}
                          </p>
                          <p className="text-xs text-gray-600">
                            Stok:{" "}
                            <span className="font-bold text-red-600">
                              {item.stok}
                            </span>{" "}
                            / {item.stokMinimum || 0}
                          </p>
                        </div>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-green-600 text-center py-4">
                    Semua stok aman.
                  </p>
                )}
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
              <button
                onClick={() => handleNavigation("/kendaraan/kendaraan-masuk")}
                className="p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer text-left md:text-center flex flex-col items-start md:items-center"
              >
                <Car className="h-6 w-6 text-blue-600 mb-2" />
                <p className="text-sm font-medium">Kendaraan Masuk</p>
              </button>
              <button
                onClick={() => handleNavigation("/barang/purchase-order")}
                className="p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer text-left md:text-center flex flex-col items-start md:items-center"
              >
                <ShoppingCart className="h-6 w-6 text-green-600 mb-2" />
                <p className="text-sm font-medium">Purchase Order</p>
              </button>
              <button
                onClick={() => handleNavigation("/barang/barang-masuk")}
                className="p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer text-left md:text-center flex flex-col items-start md:items-center"
              >
                <Package className="h-6 w-6 text-purple-600 mb-2" />
                <p className="text-sm font-medium">Barang Masuk</p>
              </button>
              <button
                onClick={() => handleNavigation("/laporan")}
                className="p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer text-left md:text-center flex flex-col items-start md:items-center"
              >
                <FileText className="h-6 w-6 text-orange-600 mb-2" />
                <p className="text-sm font-medium">Laporan</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
