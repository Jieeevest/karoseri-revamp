import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Barang } from "./use-barang";

export type JenisPengeluaran = "PRODUKSI" | "OPERASIONAL";

import { Karyawan } from "./use-karyawan";
import { Kendaraan } from "./use-kendaraan";

export interface BarangKeluar {
  id: string;
  nomor: string;
  tanggal: string;
  jenis: JenisPengeluaran;
  barangId: string;
  barang: Barang;
  jumlah: number;
  karyawanId: string;
  karyawan: Karyawan;
  kendaraanId?: string;
  kendaraan?: Kendaraan;
  deskripsi: string;
  createdAt: string;
}

import { useKaryawan } from "./use-karyawan";
import { useKendaraan } from "./use-kendaraan";

export { useKaryawan, useKendaraan };

export function useBarangKeluar(search?: string) {
  return useQuery({
    queryKey: ["barang-keluar", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(
        `/api/barang/barang-keluar?${params.toString()}`,
      );
      return data.data as BarangKeluar[];
    },
  });
}

export function useCreateBarangKeluar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBK: Partial<BarangKeluar>) => {
      const { data } = await axios.post("/api/barang/barang-keluar", newBK);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-keluar"] });
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
}

export function useUpdateBarangKeluar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bk: Partial<BarangKeluar>) => {
      const { data } = await axios.put("/api/barang/barang-keluar", bk);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-keluar"] });
    },
  });
}

export function useDeleteBarangKeluar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/barang/barang-keluar?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barang-keluar"] });
      queryClient.invalidateQueries({ queryKey: ["barang"] });
    },
  });
}
