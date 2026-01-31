import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/kendaraan/masuk";

export interface KendaraanMasukParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface KendaraanMasukResponse {
  data: any[]; // Replace 'any' with proper type if available, but for now matching existing usages
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useKendaraanMasuk = (params?: KendaraanMasukParams | string) => {
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
    queryKey: ["kendaraan-masuk", params],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
      return response.data as KendaraanMasukResponse;
    },
  });
};

export const useCreateKendaraanMasuk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan-masuk"] });
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] }); // Also invalidate main vehicle list
    },
  });
};

export const useDeleteKendaraanMasuk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${API_URL}?id=${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan-masuk"] });
      queryClient.invalidateQueries({ queryKey: ["kendaraan"] });
    },
  });
};
