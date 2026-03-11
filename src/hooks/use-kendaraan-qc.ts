import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/kendaraan/qc";

export interface KendaraanQCParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  layak?: boolean;
  pending?: boolean;
}

export interface KendaraanQCResponse {
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useKendaraanQC = (params?: KendaraanQCParams | string) => {
  const queryParams = new URLSearchParams();

  if (typeof params === "string") {
    if (params) queryParams.append("search", params);
  } else if (params) {
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
    if (typeof params.layak === "boolean")
      queryParams.append("layak", String(params.layak));
    if (typeof params.pending === "boolean")
      queryParams.append("pending", String(params.pending));
  }

  return useQuery({
    queryKey: ["kendaraan-qc", params],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
      return response.data as KendaraanQCResponse;
    },
  });
};

export const useCreateKendaraanQC = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan-qc"] });
      queryClient.invalidateQueries({ queryKey: ["kendaraan-masuk"] });
    },
  });
};

export const useUpdateKendaraanQC = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kendaraan-qc"] });
      queryClient.invalidateQueries({ queryKey: ["kendaraan-masuk"] });
    },
  });
};
