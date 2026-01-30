import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Barang } from "./use-barang";
import { Supplier } from "./use-supplier";

export interface HargaBarang {
  id: string;
  barangId: string;
  barang: Barang;
  supplierId: string;
  supplier: Supplier;
  kategoriId: number;
  kategoriBarang: { id: number; nama: string };
  harga: number;
  adalahHargaTerbaik: boolean;
  createdAt: string;
}

export interface HargaBarangParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useHargaBarang(params?: HargaBarangParams | string) {
  const queryParams = new URLSearchParams();

  if (typeof params === "string") {
    if (params) queryParams.append("search", params);
  } else if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  }

  return useQuery({
    queryKey: ["harga-barang", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/barang/harga-barang?${queryParams.toString()}`,
      );
      return data;
    },
  });
}

export function useCreateHargaBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newHarga: Partial<HargaBarang>) => {
      const { data } = await axios.post("/api/barang/harga-barang", newHarga);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["harga-barang"] });
    },
  });
}

export function useUpdateHargaBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (harga: Partial<HargaBarang>) => {
      const { data } = await axios.put("/api/barang/harga-barang", harga);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["harga-barang"] });
    },
  });
}

export function useDeleteHargaBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/barang/harga-barang?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["harga-barang"] });
    },
  });
}
