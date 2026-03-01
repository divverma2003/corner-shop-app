import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets(); // provides the distance from the edges of the screen to avoid UI elements being cut off or obscured by device features.

  if (!isLoaded) return null; // for avoiding flickering when app is loading and checking auth state

  // if user is not signed in, redirect to auth flow
  if (!isSignedIn) return <Redirect href={"/(auth)"} />;

  {
    /* SCREEN OPTIONS: defining the styles and options for the tab navigator -- override default native styles */
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#C9A84C",
        tabBarInactiveTintColor: "#A89F91",
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 32 + insets.bottom,
          paddingTop: 4,
          marginHorizontal: 100,
          marginBottom: insets.bottom,
          borderRadius: 24,
          overflow: "hidden",
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            // StyleSheet.absoluteFill is a helper that fills the parent component
            // Equal to: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
        headerShown: false,
      }}
    >
      {/* defining the screens for the tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
