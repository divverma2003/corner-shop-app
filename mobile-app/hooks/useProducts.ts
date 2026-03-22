import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const api = useApi();
  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product[] }>(`/products`);
      return data.data;
    },
  });

  return result;
};

export default useProducts;
