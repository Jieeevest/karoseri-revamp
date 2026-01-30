import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Supplier {
  id: string;
  kode: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  createdAt: string;
}

export interface SupplierParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useSupplier(params?: SupplierParams | string) {
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
    queryKey: ["supplier", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/barang/supplier?${queryParams.toString()}`,
      );
      return data;
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSupplier: Partial<Supplier>) => {
      const { data } = await axios.post("/api/barang/supplier", newSupplier);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (supplier: Partial<Supplier>) => {
      const { data } = await axios.put("/api/barang/supplier", supplier);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/barang/supplier?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier"] });
    },
  });
}
