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

export function useHargaBarang(search?: string) {
  return useQuery({
    queryKey: ["harga-barang", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(
        `/api/barang/harga-barang?${params.toString()}`,
      );
      return data.data as HargaBarang[];
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
