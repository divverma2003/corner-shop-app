import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo";

import "../global.css";

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        tokenCache={tokenCache}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ClerkProvider>
    </QueryClientProvider>
  );
}
