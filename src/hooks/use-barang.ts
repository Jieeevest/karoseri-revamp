import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Barang {
  id: string;
  kode: string;
  nama: string;
  kategoriId: number;
  kategoriBarang: { id: number; nama: string };
  satuanId: string;
  satuanBarang: { id: string; nama: string };
  stok: number;
  stokMinimum: number;
  createdAt?: string;
}

export function useBarang(search?: string) {
  return useQuery({
    queryKey: ["barang", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(
        `/api/barang/data-barang?${params.toString()}`,
      );
      return data.data as Barang[];
    },
  });
}

export function useCreateBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBarang: Partial<Barang>) => {
      const { data } = await axios.post("/api/barang/data-barang", newBarang);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
}

export function useUpdateBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (barang: Partial<Barang>) => {
      const { data } = await axios.put("/api/barang/data-barang", barang);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
}

export function useDeleteBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/barang/data-barang?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
}
