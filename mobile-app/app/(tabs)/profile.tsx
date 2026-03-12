import SafeScreen from "@/components/SafeScreen";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const MENU_OPTIONS = [
  {
    id: 1,
    icon: "person-outline",
    title: "Edit Profile",
    color: "#3B82F6",
    action: "/edit-profile",
  },
  {
    id: 2,
    icon: "list-outline",
    title: "My Orders",
    color: "#10B981",
    action: "/orders",
  },
  {
    id: 3,
    icon: "heart-outline",
    title: "Wishlist",
    color: "#EF4444",
    action: "/wishlist",
  },
  {
    id: 4,
    icon: "location-outline",
    title: "Address Book",
    color: "#F59E0B",
    action: "/addresses",
  },
];
const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleMenuPress = (action: (typeof MENU_OPTIONS)[number]["action"]) => {
    if (action === "/profile") return; // already on profile screen, do nothing
    router.push(action as any);
  };

  return (
    <SafeScreen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* HEADER */}
        <View className="px-6 pb-8">
          <View className="bg-surface rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200}
                />

                <View className="absolute -bottom-1 -right-1 bg-primary rounded-full size-7 items-center justify-center border-2 border-surface">
                  <Ionicons name="checkmark" size={16} color="#111111" />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-text-primary text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>

                <Text className="text-text-secondary text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* MENU OPTIONS */}
        <View
          className="flex-row flex-wrap justify-between mx-6 mb-3"
          style={{ rowGap: 8 }}
        >
          {MENU_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              className="bg-surface rounded-2xl p-6 items-center justify-center"
              style={{ width: "48%" }}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(option.action)}
            >
              <View
                className="rounded-full w-16 h-16 items-center justify-center mb-4"
                style={{ backgroundColor: option.color + "20" }} // adding transparency to the color
              >
                <Ionicons
                  name={option.icon as any}
                  size={28}
                  color={option.color}
                />
              </View>
              <Text className="text-text-primary font-bold text-base">
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NOTIFICATIONS */}
        <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={22}
                color={"#F5F0E8"}
              />
              <Text className="text-text-primary font-semibold ml-3">
                Notifications
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={"#F5F0E8"} />
          </TouchableOpacity>
        </View>

        {/* PRIVACY AND SECURITY LINK */}
        <View className="mb-3 mx-6 bg-surface rounded-2xl p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/privacy-security")}
          >
            <View className="flex-row items-center">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#F5F0E8"
              />
              <Text className="text-text-primary font-semibold ml-3">
                Privacy & Security
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F5F0E8" />
          </TouchableOpacity>
        </View>

        {/* SIGNOUT */}
        <TouchableOpacity
          className="mx-6 mb-3 bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-red-500/20"
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text className="text-red-500 font-bold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>

        <Text className="mx-6 mb-3 text-center text-text-secondary text-xs">
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeScreen>
  );
};

export default ProfileScreen;
