import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "/api/kendaraan/spek-order";
const PAYMENT_API_URL = "/api/kendaraan/spek-order/payment";

export const useSpekOrder = (search: string = "") => {
  return useQuery({
    queryKey: ["spek-order", search],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}?search=${search}`);
      return response.data.data;
    },
  });
};

export const useCreateSpekOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spek-order"] });
    },
  });
};
export const useUpdateSpekOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spek-order"] });
    },
  });
};

export const useDeleteSpekOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${API_URL}?id=${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spek-order"] });
    },
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(PAYMENT_API_URL, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spek-order"] });
    },
  });
};
