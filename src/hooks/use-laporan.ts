import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useLaporan(
  type: string,
  dateRange: { start: string; end: string },
) {
  return useQuery({
    queryKey: ["laporan", type, dateRange],
    queryFn: async () => {
      if (!type) return [];
      const params = new URLSearchParams();
      params.append("type", type);
      if (dateRange.start) params.append("start", dateRange.start);
      if (dateRange.end) params.append("end", dateRange.end);

      const { data } = await axios.get(`/api/laporan?${params.toString()}`);
      return data.data;
    },
    enabled: !!type,
  });
}
