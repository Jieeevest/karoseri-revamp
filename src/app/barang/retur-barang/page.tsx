"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";
import { useBarangRetur } from "@/hooks/use-barang-retur";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { formatDateIndonesia } from "@/lib/date-format";

export default function ReturBarangPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: queryData } = useBarangRetur({
    page,
    limit,
    search: searchTerm,
    sortBy,
    sortOrder,
  });

  const returList = (queryData as any)?.data || [];
  const pagination = (queryData as any)?.pagination;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Retur Barang
          </h1>
          <p className="text-sm text-slate-500">
            Catatan barang retur yang dikembalikan ke supplier.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm rounded-lg bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-bold text-slate-900">
                Riwayat Retur Barang
              </CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cari retur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-lg border-slate-200 focus-visible:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-slate-50/50 border-slate-100">
                  <TableHead className="px-6">Nomor</TableHead>
                  <TableHead className="px-6">Tanggal</TableHead>
                  <TableHead className="px-6">Supplier</TableHead>
                  <TableHead className="px-6">Barang</TableHead>
                  <TableHead className="px-6">Jumlah</TableHead>
                  <TableHead className="px-6">PO</TableHead>
                  <TableHead className="px-6">Dibuat Oleh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 h-24 text-center text-slate-500">
                      Belum ada data retur.
                    </TableCell>
                  </TableRow>
                ) : (
                  returList.map((retur: any) => (
                    <TableRow key={retur.id} className="hover:bg-blue-50/30 border-slate-100">
                      <TableCell className="px-6 font-medium text-slate-900">
                        {retur.nomor}
                      </TableCell>
                      <TableCell className="px-6 text-slate-600">
                        {formatDateIndonesia(retur.tanggal)}
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="font-medium text-slate-900">
                          {retur.supplier?.nama}
                        </div>
                        <div className="text-xs text-slate-500">
                          {retur.supplier?.kode}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="font-medium text-slate-900">
                          {retur.barang?.nama}
                        </div>
                        <div className="text-xs text-slate-500">
                          {retur.barang?.kode}
                        </div>
                      </TableCell>
                      <TableCell className="px-6">{retur.jumlah}</TableCell>
                      <TableCell className="px-6">
                        {retur.purchaseOrder?.nomor || "-"}
                      </TableCell>
                      <TableCell className="px-6">
                        {retur.createdBy?.name ||
                          retur.createdBy?.username ||
                          "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          {pagination && (
            <div className="pb-4 border-t border-slate-100">
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalData={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
