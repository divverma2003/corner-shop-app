import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types";

export const useProduct = (productId: string) => {
  const api = useApi();

  const result = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product }>(
        `/products/${productId}`,
      );
      return data.data;
    },
    enabled: !!productId, // only run this query if productId is truthy
  });
  return result;
};
