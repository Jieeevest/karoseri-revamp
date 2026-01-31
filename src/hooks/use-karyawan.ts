import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Karyawan {
  id: string;
  nik: string;
  nama: string;
  jabatan: string;
  telepon?: string;
  alamat?: string;

  // Data Pribadi Tambahan
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  agama?: string;
  statusPernikahan?: string;

  // Data Pendidikan
  pendidikanTerakhir?: string;
  jurusan?: string;
  tahunLulus?: string;

  // Data Kepegawaian
  tanggalBergabung?: string;
  statusKaryawan?: string;

  // Data Bank
  namaBank?: string;
  nomorRekening?: string;
  pemilikRekening?: string;

  // Kontak Darurat
  kontakDaruratNama?: string;
  kontakDaruratHubungan?: string;
  kontakDaruratTelepon?: string;

  createdAt: string;
  totalBarangKeluar?: number;
  totalSpekOrder?: number;
}

export interface KaryawanParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface KaryawanResponse {
  data: Karyawan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useKaryawan(params?: KaryawanParams) {
  return useQuery({
    queryKey: ["karyawan", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append("search", params.search);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      const { data } = await axios.get(
        `/api/karyawan?${searchParams.toString()}`,
      );
      return data as KaryawanResponse; // return the full response for pagination
    },
  });
}

export function useCreateKaryawan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newKaryawan: Partial<Karyawan>) => {
      const { data } = await axios.post("/api/karyawan", newKaryawan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useUpdateKaryawan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (karyawan: Partial<Karyawan>) => {
      const { data } = await axios.put("/api/karyawan", karyawan);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}

export function useDeleteKaryawan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/karyawan?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["karyawan"] });
    },
  });
}
