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

export interface KendaraanParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface KendaraanResponse {
  data: Kendaraan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useKendaraan(params?: KendaraanParams | string) {
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
    queryKey: ["kendaraan", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/kendaraan?${queryParams.toString()}`,
      );
      return data as KendaraanResponse;
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
