import { Stack } from "expo-router";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";

import { tokenCache } from "@clerk/clerk-expo/token-cache";
import Toast from "react-native-toast-message";
import * as Sentry from "@sentry/react-native";

import "../global.css";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // adds more context data to events (IP address, cookies, user, etc.)
  sendDefaultPii: true,
  enableLogs: true,
  // configure session replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      // global error handler for all query errors
      Sentry.captureException(error, {
        tags: {
          type: "react-query-mutation-error",
          queryKey: query.queryKey[0]?.toString() || "unknown",
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
          queryKey: query.queryKey,
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      // global error handler for all mutations
      Sentry.captureException(error, {
        tags: { type: "react-query-mutation-error" },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
        },
      });
    },
  }),
});

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <QueryClientProvider client={queryClient}>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </StripeProvider>
      </QueryClientProvider>
      <Toast position="top" />
    </ClerkProvider>
  );
});
