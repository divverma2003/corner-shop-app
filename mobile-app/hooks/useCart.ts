import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Cart } from "@/types/index";
import { showErrorToast } from "@/lib/toast";

// todo: complete this hook later
const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();
  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const { data } = await api.post<{ data: Cart }>(`/cart`, {
        productId,
        quantity,
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => {
      // show A TOAST if adding to cart fails
      showErrorToast("Failed to add to cart. Please try again.");
    },
  });
  return {
    addToCart: addToCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
};

export default useCart;
