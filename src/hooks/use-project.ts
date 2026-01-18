import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Customer {
  id: string;
  kode: string;
  nama: string;
}

export interface Project {
  id: string;
  nomor: string;
  tanggal: string;
  customerId: string;
  customer: Customer;
  deskripsi: string;
  quantity: number;
  hargaPerUnit: number;
  totalHarga: number;
  status: "OFFER" | "DEAL" | "ON_PROGRESS" | "DONE" | "CANCELLED";
  specs?: {
    panjang: number;
    lebar: number;
    tinggi: number;
    pintuSamping: number;
  };
}

export function useProject(search?: string) {
  return useQuery({
    queryKey: ["project", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(`/api/project?${params.toString()}`);
      return data.data as Project[];
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProject: Partial<Project>) => {
      const { data } = await axios.post("/api/project", newProject);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
}
