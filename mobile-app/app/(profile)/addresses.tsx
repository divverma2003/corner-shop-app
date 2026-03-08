import SafeScreen from "@/components/SafeScreen";
import AddressesHeader from "@/components/AddressesHeader";
import AddressFormModal from "@/components/AddressFormModal";
import { useAddresses } from "@/hooks/useAddresses";
import { useAddressValidation } from "@/hooks/useAddressValidation";
import AddressCard from "@/components/AddressCard";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

const AddressesScreen = () => {
  const {
    addAddress,
    addresses,
    deleteAddress,
    isAddingAddress,
    isDeletingAddress,
    isError,
    isLoading,
    isUpdatingAddress,
    updateAddress,
  } = useAddresses();
  const [showAddressForm, setShowAddressForm] = useState(false);

  const {
    validateAddress,
    isValidatingAddress,
    validationAddressError,
    validatedAddress,
    isValidAddress,
    resetAddress,
  } = useAddressValidation();
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    setShowAddressForm(true);
    setEditingAddressId(null);
    setAddressForm({
      label: "",
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (address: Address) => {
    setShowAddressForm(true);
    setEditingAddressId(address._id);
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete "${label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddress(addressId),
        },
      ],
    );
  };

  const handleCloseAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    resetAddress();
  };

  const handleSaveAddress = async () => {
    if (
      !addressForm.label ||
      !addressForm.fullName ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.zipCode ||
      !addressForm.phoneNumber
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const validated = await validateAddress({
        userCity: addressForm.city,
        userState: addressForm.state,
        userStreetAddress: addressForm.streetAddress,
      });

      const finalAddress = {
        ...addressForm,
        city: validated.city,
        state: validated.state,
        streetAddress: validated.streetAddress,
        zipCode: validated.zipCode,
      };

      if (editingAddressId) {
        updateAddress(
          {
            addressId: editingAddressId,
            addressData: finalAddress,
          },
          {
            onSuccess: () => {
              setShowAddressForm(false);
              setEditingAddressId(null);
              resetAddress();
              Alert.alert("Success", "Address updated successfully!");
            },

            onError: (error: any) => {
              Alert.alert("Error", error.message || "Failed to update address");
            },
          },
        );
      } else {
        addAddress(finalAddress, {
          onSuccess: () => {
            setShowAddressForm(false);
            resetAddress();
            Alert.alert("Success", "Address added successfully!");
          },
          onError: (error: any) => {
            Alert.alert("Error", error.message || "Failed to add address");
          },
        });
      }
    } catch {
      Alert.alert(
        "Address Validation Failed",
        "The address you entered could not be verified. Please check the details and try again.",
      );
    }
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;

  return (
    <SafeScreen>
      <AddressesHeader />

      {addresses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={80} color="#00D9FF" />
          <Text className="text-text-primary font-semibold text-xl mt-4">
            No addresses found.
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add your first delivery address.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text className="text-background font-bold text-base">
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isUpdatingAddress={isUpdatingAddress}
                isDeletingAddress={isDeletingAddress}
              />
            ))}

            <TouchableOpacity
              className="bg-primary rounded-2xl py-4 items-center mt-2"
              activeOpacity={0.8}
              onPress={handleAddAddress}
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle" size={24} color="#2E7D32" />
                <Text className="text-background font-bold text-base ml-2">
                  Add New Address
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressForm={addressForm}
        isAddingAddress={isAddingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onClose={handleCloseAddressForm}
        onSave={handleSaveAddress}
        onFormChange={setAddressForm}
      />
    </SafeScreen>
  );
};

const ErrorUI = () => {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Failed to load addresses.
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          Please check your connection and try again.
        </Text>
      </View>
    </SafeScreen>
  );
};

const LoadingUI = () => {
  return (
    <SafeScreen>
      <AddressesHeader />
      <View className="flex-1 items-center justify-center px-6">
        <ActivityIndicator size="large" color="#00D9FF" />
        <Text className="mt-4 text-text-secondary">Loading addresses...</Text>
      </View>
    </SafeScreen>
  );
};

export default AddressesScreen;
