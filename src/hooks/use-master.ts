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

export function useMerekKendaraan() {
  return useQuery({
    queryKey: ["merek-kendaraan"],
    queryFn: async () => {
      const { data } = await axios.get("/api/master/merek-kendaraan");
      return data.data as MerekKendaraan[];
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

export function useTipeKendaraan(merekId?: string) {
  return useQuery({
    queryKey: ["tipe-kendaraan", merekId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (merekId) params.append("merekId", merekId);
      const { data } = await axios.get(
        `/api/master/tipe-kendaraan?${params.toString()}`,
      );
      return data.data as TipeKendaraan[];
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

export function useKategoriBarang() {
  return useQuery({
    queryKey: ["kategori-barang"],
    queryFn: async () => {
      const { data } = await axios.get("/api/master/kategori-barang");
      return data.data as KategoriBarang[];
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

export function useSatuanBarang() {
  return useQuery({
    queryKey: ["satuan-barang"],
    queryFn: async () => {
      const { data } = await axios.get("/api/master/satuan-barang");
      return data.data as SatuanBarang[];
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
