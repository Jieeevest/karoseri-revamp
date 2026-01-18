import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/kendaraan/masuk";

export const useKendaraanMasuk = (search: string = "") => {
  return useQuery({
    queryKey: ["kendaraan-masuk", search],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}?search=${search}`);
      return response.data.data;
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
