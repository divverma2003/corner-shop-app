import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Product } from "@/types/index";
import { showErrorToast } from "@/lib/toast";

const useWishList = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get<{ data: { wishlist: Product[] } }>(
        `/users/wishlist`,
      );
      return data.data.wishlist;
    },
  });
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post<{ data: Product[] }>(`/users/wishlist`, {
        productId,
      });
      return data.data;
    },
    onSuccess: () => {
      // Invalidate the wishlist query to refetch the updated wishlist data after adding a product
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      showErrorToast("Failed to add to wishlist. Please try again.");
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ data: Product[] }>(
        `/users/wishlist/${productId}`,
      );
      return data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
    onError: (error) => {
      showErrorToast("Failed to remove from wishlist. Please try again.");
    },
  });
  // helper function to check if a product is in the wishlist, this will be useful for rendering the wishlist icon state in the UI
  const isInWishlist = (productId: string) => {
    return wishlist?.some((product) => product._id === productId) ?? false;
  };

  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  return {
    wishlist: wishlist || [],
    isLoading,
    isError,
    wishlistCount: wishlist?.length || 0,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
  };
};

export default useWishList;
