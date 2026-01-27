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

export function useRiwayatHarga(search?: string) {
  return useQuery({
    queryKey: ["riwayat-harga", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(
        `/api/barang/riwayat-harga?${params.toString()}`,
      );
      return data.data as RiwayatHarga[];
    },
  });
}
