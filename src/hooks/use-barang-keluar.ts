import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Barang } from "./use-barang";

export type JenisPengeluaran = "PRODUKSI" | "OPERASIONAL";

export interface Karyawan {
  id: string;
  nama: string;
  jabatan: string;
}

export interface Kendaraan {
  id: string;
  nomorPolisi: string;
  merek: string;
  tipe: string;
}

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

// Temporary mocks for Karyawan and Kendaraan hooks until their modules are ready
export function useKaryawan() {
  // Replace with real hook later
  return {
    data: [
      { id: "1", nama: "Ahmad Fauzi", jabatan: "Tukang Rakit" },
      { id: "2", nama: "Budi Santoso", jabatan: "Tukang Cat" },
      { id: "3", nama: "Chandra Wijaya", jabatan: "Tukang Aksesoris" },
      { id: "4", nama: "Dedi Kurniawan", jabatan: "Tukang Rakit" },
      { id: "5", nama: "Eko Prasetyo", jabatan: "Supervisor" },
    ] as Karyawan[],
    isLoading: false,
  };
}

export function useKendaraan() {
  // Replace with real hook later
  return {
    data: [
      { id: "1", nomorPolisi: "B 1234 ABC", merek: "Hino", tipe: "Ranger" },
      { id: "2", nomorPolisi: "B 5678 DEF", merek: "Isuzu", tipe: "Dutro" },
      { id: "3", nomorPolisi: "B 9012 GHI", merek: "Isuzu", tipe: "Elf" },
      { id: "4", nomorPolisi: "B 3456 JKL", merek: "Mitsubishi", tipe: "L300" },
    ] as Kendaraan[],
    isLoading: false,
  };
}

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
