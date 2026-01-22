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

export function usePurchaseOrder(search?: string) {
  return useQuery({
    queryKey: ["purchase-order", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(
        `/api/barang/purchase-order?${params.toString()}`,
      );
      return data.data as PurchaseOrder[];
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
