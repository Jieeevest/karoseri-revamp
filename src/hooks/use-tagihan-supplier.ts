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

export interface TagihanSupplierParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export function useTagihanSupplier(params?: TagihanSupplierParams | string) {
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
    queryKey: ["tagihan-supplier", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/barang/tagihan-supplier?${queryParams.toString()}`,
      );
      return data;
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
