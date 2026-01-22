import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Supplier } from "./use-supplier";
import { PurchaseOrder } from "./use-purchase-order";

export interface TagihanSupplier {
  id: string;
  nomor: string;
  purchaseOrderId: string;
  purchaseOrder: PurchaseOrder;
  supplierId: string;
  supplier: Supplier;
  jumlah: number;
  tempo: string;
  status: "BELUM_DIBAYAR" | "SUDAH_DIBAYAR";
  metodePembayaran?: "TRANSFER" | "CASH" | "GIRO";
  buktiPembayaran?: string;
  createdAt: string;
}

export function useTagihanSupplier(search?: string) {
  return useQuery({
    queryKey: ["tagihan-supplier", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(
        `/api/barang/tagihan-supplier?${params.toString()}`,
      );
      return data.data as TagihanSupplier[];
    },
  });
}

export function useCreateTagihanSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTagihan: Partial<TagihanSupplier>) => {
      const { data } = await axios.post(
        "/api/barang/tagihan-supplier",
        newTagihan,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan-supplier"] });
    },
  });
}

export function useUpdateTagihanSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tagihan: Partial<TagihanSupplier>) => {
      const { data } = await axios.put("/api/barang/tagihan-supplier", tagihan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan-supplier"] });
    },
  });
}

export function useDeleteTagihanSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(
        `/api/barang/tagihan-supplier?id=${id}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tagihan-supplier"] });
    },
  });
}
