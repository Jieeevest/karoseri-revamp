import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/kendaraan/keluar";

export interface KendaraanKeluarParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface KendaraanKeluarResponse {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useKendaraanKeluar = (params?: KendaraanKeluarParams | string) => {
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
    queryKey: ["kendaraan-keluar", params],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
      return response.data as KendaraanKeluarResponse;
    },
  });
};

export const useCreateKendaraanKeluar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan-keluar"] });
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
    },
  });
};
export const useUpdateKendaraanKeluar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan-keluar"] });
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
    },
  });
};

export const useDeleteKendaraanKeluar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${API_URL}?id=${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan-keluar"] });
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
    },
  });
};
