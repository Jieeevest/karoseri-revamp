import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Karyawan {
  id: string;
  nik: string;
  nama: string;
  jabatan: string;
  telepon?: string;
  alamat?: string;
  createdAt: string;
  totalBarangKeluar?: number;
  totalSpekOrder?: number;
}

export function useKaryawan(search?: string) {
  return useQuery({
    queryKey: ["karyawan", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(`/api/karyawan?${params.toString()}`);
      return data.data as Karyawan[];
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
