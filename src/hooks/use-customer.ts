import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Customer {
  id: string;
  kode: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  createdAt: string;
}

export function useCustomer(search?: string) {
  return useQuery({
    queryKey: ["customer", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      const { data } = await axios.get(`/api/customer?${params.toString()}`);
      return data.data as Customer[];
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCustomer: Partial<Customer>) => {
      const { data } = await axios.post("/api/customer", newCustomer);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customer: Partial<Customer>) => {
      const { data } = await axios.put("/api/customer", customer);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/customer?id=${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });
}
