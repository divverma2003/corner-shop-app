import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Cart } from "@/types";
import { showErrorToast } from "@/lib/toast";

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Cart }>(`/cart`);
      return data.data;
    },
  });

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

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: String;
      quantity: number;
    }) => {
      const { data } = await api.put<{ data: Cart }>(`/cart/${productId}`, {
        quantity,
      });
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => {
      // show A TOAST if updating cart fails
      showErrorToast("Failed to update cart. Please try again.");
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ data: Cart }>(`/cart/${productId}`);
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => {
      // show A TOAST if updating cart fails
      showErrorToast("Failed to update cart. Please try again.");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ data: Cart }>("/cart");
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: () => {
      // show A TOAST if clearing cart fails
      showErrorToast("Failed to clear cart. Please try again.");
    },
  });

  const cartTotal =
    cart?.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ) ?? 0;

  const cartItemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};

export default useCart;
