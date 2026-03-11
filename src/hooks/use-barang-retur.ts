import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface BarangReturParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useBarangRetur(params?: BarangReturParams | string) {
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
    queryKey: ["barang-retur", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/barang/retur?${queryParams.toString()}`,
      );
      return data;
    },
  });
}
