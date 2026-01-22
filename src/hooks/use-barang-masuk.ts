import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Supplier } from "./use-supplier";
import { Barang } from "./use-barang";
import { PurchaseOrder } from "./use-purchase-order";

export interface BarangMasuk {
  id: string;
  nomor: string;
  tanggal: string;
  purchaseOrderId?: string;
  purchaseOrder?: PurchaseOrder;
  supplierId: string;
  supplier: Supplier;
  barangId: string;
  barang: Barang;
  jumlah: number;
  kondisi: string;
  createdAt: string;
}

export function useBarangMasuk(search?: string) {
  return useQuery({
    queryKey: ["barang-masuk", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(
        `/api/barang/barang-masuk?${params.toString()}`,
      );
      return data.data as BarangMasuk[];
    },
  });
}

export function useCreateBarangMasuk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBM: Partial<BarangMasuk>) => {
      const { data } = await axios.post("/api/barang/barang-masuk", newBM);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-masuk"] });
      // Might also want to invalidate Barang queries as stok increases
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
}

export function useUpdateBarangMasuk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bm: Partial<BarangMasuk>) => {
      const { data } = await axios.put("/api/barang/barang-masuk", bm);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-masuk"] });
    },
  });
}

export function useDeleteBarangMasuk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/barang/barang-masuk?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-masuk"] });
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
}
