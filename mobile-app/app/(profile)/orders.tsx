import SafeScreen from "@/components/SafeScreen";
import RatingModal from "@/components/RatingModal";
import ScreenHeader from "@/components/ScreenHeader";
import { useOrders } from "@/hooks/useOrders";
import { useReviews } from "@/hooks/useReviews";
import { capitalizeFirstLetter, formatDate, getStatusColor } from "@/lib/utils";
import { Order } from "@/types";
import { router } from "expo-router";
import { Image } from "expo-image";
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
const OrdersScreen = () => {
  const { data: orders, isLoading, isError } = useOrders();
  const { createReviewAsync, isCreatingReview } = useReviews();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRatings, setProductRatings] = useState<{
    [key: string]: number;
  }>({});

  const handleOpenRatingModal = (order: Order) => {
    setShowRatingModal(true);
    setSelectedOrder(order);

    // Initialize ratings for each product in the order
    const initialRatings: { [key: string]: number } = {};
    order.orderItems.forEach((item) => {
      const productId = item.product._id;
      initialRatings[productId] = 0; // Default rating
    });
    setProductRatings(initialRatings);
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;

    // Validate that all products have a rating
    const allRated = Object.values(productRatings).every(
      (rating) => rating > 0,
    );
    if (!allRated) {
      Alert.alert("Error", "Please rate all products");
      return;
    }

    try {
      await Promise.all(
        selectedOrder.orderItems.map((item) => {
          createReviewAsync({
            productId: item.product._id,
            orderId: selectedOrder._id,
            rating: productRatings[item.product._id],
          });
        }),
      );

      Alert.alert("Success", "Thank you for your feedback!");
      setShowRatingModal(false);
      setSelectedOrder(null);
      setProductRatings({});
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit rating");
    }
  };

  return (
    <SafeScreen>
      {/* Header */}
      <ScreenHeader screenTitle="My Orders" />

      {/* Orders List */}
      {isLoading ? (
        <LoadingUI />
      ) : isError ? (
        <ErrorUI />
      ) : !orders || orders.length === 0 ? (
        <EmptyUI />
      ) : (
 <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {orders.map((order) => {
              const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
              const firstImage = order.orderItems[0]?.image || "";

              return (
                                <View key={order._id} className="bg-surface rounded-3xl p-5 mb-4">
<View className="flex-row mb-4">
                    <View className="relative">
 <Image
                        source={firstImage}
                        style={{ height: 80, width: 80, borderRadius: 8 }}
                        contentFit="cover"
                      />

                      {/* BADGE FOR MORE ITEMS */}
                      {order.orderItems.length > 1 && (
                        <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center">
                          <Text className="text-background text-xs font-bold">
                            +{order.orderItems.length - 1}
                          </Text>
                        </View>
                      )}
                    </View>

                                        <View className="flex-1 ml-4">
<Text className="text-text-primary font-bold text-base mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </Text>
                      <Text className="text-text-secondary text-sm mb-2">
                        {formatDate(order.createdAt)}
                      </Text>

                       <View
                        className="self-start px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: getStatusColor(order.status) + "20" }}
                      >
                        <Text
                          className="text-xs font-bold"
                          style={{ color: getStatusColor(order.status) }}
                        >
                          {capitalizeFirstLetter(order.status)}
                        </Text>
                        </View>

                    </View>
</View>

    {/* ORDER ITEMS SUMMARY */}
                  {order.orderItems.map((item, index) => (
                    <Text
                      key={item._id}
                      className="text-text-secondary text-sm flex-1"
                      numberOfLines={1}
                    >
                      {item.name} × {item.quantity}
                    </Text>
                  ))}

                               <View className="border-t border-background-lighter pt-3 flex-row justify-between items-center">
                    <View>
                      <Text className="text-text-secondary text-xs mb-1">{totalItems} items</Text>
                      <Text className="text-primary font-bold text-xl">
                        ${order.totalPrice.toFixed(2)}
                      </Text>
                    </View>
                    </View>    

              </View>
            );
          })}
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
};

export default OrdersScreen;

const LoadingUI = () => {
  return (
    <SafeScreen>
      <ScreenHeader screenTitle="My Orders" />

      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-text-secondary">Loading orders...</Text>
      </View>
    </SafeScreen>
  );
};

const EmptyUI = () => {
  return (
    <SafeScreen>
      <ScreenHeader screenTitle="My Orders" />

      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="bag-outline" size={64} color="#999" />
        <Text className="mt-4 text-text-primary text-xl font-semibold">
          No orders yet.
        </Text>
        <Text className="text-text-secondary text-center mt-2">
          You haven't placed any orders yet.
        </Text>
      </View>
    </SafeScreen>
  );
};

const ErrorUI = () => {
  return (
    <SafeScreen>
      <ScreenHeader screenTitle="My Orders" />

      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#FF0000" />
        <Text className="mt-4 text-text-primary text-xl font-semibold">
          Failed to load orders.
        </Text>

        <Text className="text-text-secondary text-center mt-2">
          There was an error fetching your orders. Please check your internet
          connection and try again.
        </Text>
      </View>
    </SafeScreen>
  );
};
