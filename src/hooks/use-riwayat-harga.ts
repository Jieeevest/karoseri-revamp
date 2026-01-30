import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Barang } from "./use-barang";
import { Supplier } from "./use-supplier";

export interface RiwayatHarga {
  id: string;
  barangId: string;
  barang: Barang;
  supplierId: string;
  supplier: Supplier;
  hargaLama: number;
  hargaBaru: number;
  tanggal: string;
  keterangan: string | null;
}

export interface RiwayatHargaParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useRiwayatHarga(params?: RiwayatHargaParams | string) {
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
    queryKey: ["riwayat-harga", params],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/barang/riwayat-harga?${queryParams.toString()}`,
      );
      return data;
    },
  });
}
