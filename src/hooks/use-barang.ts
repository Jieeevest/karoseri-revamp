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

export interface BarangParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useBarang(params?: BarangParams | string) {
  const queryParams = new URLSearchParams();

  // Backward compatibility for when params is just a search string
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
    queryKey: ["barang", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/barang/data-barang?${queryParams.toString()}`,
      );
      // Handle both paginated and non-paginated responses structure if API varies
      // But we standardized API to return { data, pagination }
      // For backward compat with existing code expecting array, we might need adjustments in components
      // The API now returns { success, data, pagination }.
      return data;
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
