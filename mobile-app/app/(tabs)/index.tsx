import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";

import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Button,
} from "react-native";

import * as Sentry from "@sentry/react-native";

// todo: in the payment section use sentry logs to track payment errors - workflow
const CATEGORIES = [
  {
    name: "All",
    icon: "grid-outline" as const,
  },
  { name: "Clothing", image: require("@/assets/images/fashion-icon.png") },
  {
    name: "Accessories",
    image: require("@/assets/images/accessories-icon.png"),
  },
  { name: "Home Decor", image: require("@/assets/images/home-decor-icon.png") },
  { name: "Hobbies", image: require("@/assets/images/hobbies-icon.png") },
];

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products, isLoading, isError } = useProducts();

  // useMemo to avoid unnecessary recalculations of the filtered products list on every render - it will only recalculate when products, selectedCategory, or searchQuery change
  // and it's done client side because we want the filtering to be instant and responsive to user input without needing to make a new API call
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;

    // filtering by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    // filtering by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  }, [products, selectedCategory, searchQuery]);
  return (
    <SafeScreen>
      {/* using ScrollView for the entire screen to allow scrolling when content exceeds screen height */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">
                Shop
              </Text>
              <Text className="text-text-secondary text-sm mt-1">
                Browse all products
              </Text>
            </View>

            {/* SETTINGS ICON */}
            <TouchableOpacity
              className="bg-surface/50 p-3 rounded-full"
              activeOpacity={0.7}
            >
              <Ionicons
                name="options-outline"
                size={22}
                color={"#F5F0E8"}
              ></Ionicons>
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="bg-surface flex-row items-center px-5 py-4 rounded-2xl">
            <Ionicons name="search" size={22} color={"#F5F0E8"} />
            <TextInput
              placeholder="Search for products..."
              placeholderTextColor={"#F5F0E8"}
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORY FILTER  -- horizontal scroll */}
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category.name;
              return (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => setSelectedCategory(category.name)}
                  className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${isSelected ? "bg-primary" : "bg-surface"}`}
                >
                  {category.icon ? (
                    <Ionicons
                      name={category.icon}
                      size={36}
                      color={isSelected ? "#111111" : "#F5F0E8"}
                    />
                  ) : (
                    <Image
                      source={category.image}
                      className="size-12 self-center"
                      resizeMode="contain"
                      style={{ tintColor: isSelected ? "#111111" : "#F5F0E8" }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* PRODUCTS SECTION */}
        <View className="px-6 mb-6">
          {/* SECTION HEADER */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">
              Products
            </Text>
            <Text className="text-text-secondary text-sm">
              {filteredProducts.length} items
            </Text>
          </View>

          {/* PRODUCTS GRID */}
          <ProductsGrid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};
export default ShopScreen;
