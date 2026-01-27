import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface MerekKendaraan {
  id: string;
  nama: string;
  createdAt?: string;
}

export interface TipeKendaraan {
  id: string;
  nama: string;
  merekId: string;
  merekKendaraan?: MerekKendaraan;
  createdAt?: string;
}

export interface KategoriBarang {
  id: number;
  nama: string;
  deskripsi?: string;
  createdAt: string;
}

export function useMerekKendaraan(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: ["merek-kendaraan", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const { data } = await axios.get(
        `/api/master/merek-kendaraan?${queryParams.toString()}`,
      );
      return data as {
        success: boolean;
        data: MerekKendaraan[];
        pagination: PaginationMeta;
      };
    },
  });
}

export function useCreateMerekKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { nama: string }) => {
      const { data } = await axios.post("/api/master/merek-kendaraan", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merek-kendaraan"] });
    },
  });
}

export function useUpdateMerekKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; nama: string }) => {
      const { data } = await axios.put("/api/master/merek-kendaraan", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merek-kendaraan"] });
    },
  });
}

export function useDeleteMerekKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/master/merek-kendaraan?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merek-kendaraan"] });
    },
  });
}

export function useTipeKendaraan(params?: {
  merekId?: string; // Keep for existing usage if needed, or integrate into params
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: ["tipe-kendaraan", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.merekId) queryParams.append("merekId", params.merekId);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const { data } = await axios.get(
        `/api/master/tipe-kendaraan?${queryParams.toString()}`,
      );
      return data as {
        success: boolean;
        data: TipeKendaraan[];
        pagination: PaginationMeta;
      };
    },
  });
}

export function useCreateTipeKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { nama: string; merekId: string }) => {
      const { data } = await axios.post("/api/master/tipe-kendaraan", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipe-kendaraan"] });
    },
  });
}

export function useUpdateTipeKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: string;
      nama: string;
      merekId: string;
    }) => {
      const { data } = await axios.put("/api/master/tipe-kendaraan", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipe-kendaraan"] });
    },
  });
}

export function useDeleteTipeKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/master/tipe-kendaraan?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tipe-kendaraan"] });
    },
  });
}

// Kategori Barang Hooks

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export function useKategoriBarang(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: ["kategori-barang", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const { data } = await axios.get(
        `/api/master/kategori-barang?${queryParams.toString()}`,
      );
      return data as {
        success: boolean;
        data: KategoriBarang[];
        pagination: PaginationMeta;
      };
    },
  });
}

export function useCreateKategoriBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { nama: string; deskripsi?: string }) => {
      const { data } = await axios.post("/api/master/kategori-barang", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-barang"] });
    },
  });
}

export function useUpdateKategoriBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: number;
      nama: string;
      deskripsi?: string;
    }) => {
      const { data } = await axios.put("/api/master/kategori-barang", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-barang"] });
    },
  });
}

export function useDeleteKategoriBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/master/kategori-barang?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategori-barang"] });
    },
  });
}
// Satuan Barang Hooks

export interface SatuanBarang {
  id: string;
  nama: string;
  createdAt: string;
}

export function useSatuanBarang(params?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: ["satuan-barang", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const { data } = await axios.get(
        `/api/master/satuan-barang?${queryParams.toString()}`,
      );
      return data as {
        success: boolean;
        data: SatuanBarang[];
        pagination: PaginationMeta;
      };
    },
  });
}

export function useCreateSatuanBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { nama: string }) => {
      const { data } = await axios.post("/api/master/satuan-barang", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuan-barang"] });
    },
  });
}

export function useUpdateSatuanBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string; nama: string }) => {
      const { data } = await axios.put("/api/master/satuan-barang", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuan-barang"] });
    },
  });
}

export function useDeleteSatuanBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/master/satuan-barang?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["satuan-barang"] });
    },
  });
}
