import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Supplier } from "./use-supplier";
import { Barang } from "./use-barang";

export interface PurchaseOrderItem {
  id: string;
  barangId: string;
  barang: Barang;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  nomor: string;
  tanggal: string;
  supplierId: string;
  supplier: Supplier;
  status: "DRAFT" | "DIAJUKAN" | "DISETUJUI" | "DITOLAK" | "SELESAI";
  total: number;
  items: PurchaseOrderItem[];
  createdAt: string;
}

export interface PurchaseOrderParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export function usePurchaseOrder(params?: PurchaseOrderParams | string) {
  const queryParams = new URLSearchParams();

  if (typeof params === "string") {
    if (params) queryParams.append("search", params);
  } else if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (params.status) queryParams.append("status", params.status);
  }

  return useQuery({
    queryKey: ["purchase-order", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/barang/purchase-order?${queryParams.toString()}`,
      );
      return data;
    },
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPO: Partial<PurchaseOrder>) => {
      const { data } = await axios.post("/api/barang/purchase-order", newPO);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (po: Partial<PurchaseOrder>) => {
      const { data } = await axios.put("/api/barang/purchase-order", po);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] });
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(
        `/api/barang/purchase-order?id=${id}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-order"] });
    },
  });
}
