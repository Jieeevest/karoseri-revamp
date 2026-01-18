import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface MerekKendaraan {
  id: string;
  nama: string;
}

export interface TipeKendaraan {
  id: string;
  nama: string;
  merekId: string;
  merekKendaraan?: MerekKendaraan;
}

export function useMerekKendaraan() {
  return useQuery({
    queryKey: ["merek-kendaraan"],
    queryFn: async () => {
      const { data } = await axios.get("/api/master/merek-kendaraan");
      return data.data as MerekKendaraan[];
    },
  });
}

export function useTipeKendaraan(merekId?: string) {
  return useQuery({
    queryKey: ["tipe-kendaraan", merekId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (merekId) params.append("merekId", merekId);
      const { data } = await axios.get(
        `/api/master/tipe-kendaraan?${params.toString()}`,
      );
      return data.data as TipeKendaraan[];
    },
    // If we only want to fetch when merekId is present, we can enable it specifically.
    // But sometimes we might want all types. For form selection, usually it depends on merekId.
    // Let's keep it flexible, but usually UI won't call this without context unless fetching all.
  });
}

// ... Create/Delete hooks if needed for Master Pages, but for now we focus on usage in Kendaraan page.
