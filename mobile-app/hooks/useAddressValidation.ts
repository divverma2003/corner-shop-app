import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Address } from "@/types";

interface UserAddress {
  userCity: string;
  userStreetAddress: string;
  userState: string;
}

export const useAddressValidation = () => {
  const api = useApi();

  const validateAddressMutation = useMutation({
    mutationFn: async (userAddress: UserAddress) => {
      const { data } = await api.post<{
        data: Pick<Address, "city" | "state" | "streetAddress" | "zipCode">;
      }>(`/external/validate-address`, { userAddress });
      return data.data;
    },
  });

  return {
    validateAddress: validateAddressMutation.mutateAsync,
    isValidatingAddress: validateAddressMutation.isPending,
    validationAddressError: validateAddressMutation.error,
    validatedAddress: validateAddressMutation.data,
    isValidAddress: validateAddressMutation.isSuccess,
    resetAddress: validateAddressMutation.reset,
  };
};
