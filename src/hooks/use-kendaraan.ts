import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MerekKendaraan, TipeKendaraan } from "./use-master";
import { Customer } from "./use-customer";

export interface Kendaraan {
  id: string;
  nomorPolisi: string;
  nomorChasis: string;
  nomorMesin: string;
  merekId: string;
  merekKendaraan: MerekKendaraan;
  tipeId: string;
  tipeKendaraan: TipeKendaraan;
  customerId: string;
  customer: Customer;
  status:
    | "MASUK"
    | "TAHAP_PERAKITAN"
    | "PROSES_PENGCATAN"
    | "PROSES_PEMBUATAN_LOGO"
    | "SELESAI"
    | "KELUAR";
  createdAt: string;
}

export function useKendaraan(search?: string) {
  return useQuery({
    queryKey: ["kendaraan", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(`/api/kendaraan?${params.toString()}`);
      return data.data as Kendaraan[];
    },
  });
}

export function useCreateKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newVehicle: Partial<Kendaraan>) => {
      const { data } = await axios.post("/api/kendaraan", newVehicle);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
    },
  });
}

export function useUpdateKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vehicle: Partial<Kendaraan>) => {
      const { data } = await axios.put("/api/kendaraan", vehicle);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
    },
  });
}

export function useDeleteKendaraan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/kendaraan?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
    },
  });
}
