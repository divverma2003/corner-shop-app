import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router";
import * as Sentry from "@sentry/react";

import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

import "./index.css";

// import Clerk publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// initialize sentry for error tracking and performance monitoring
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // setting this option to true will send default PII data to Sentry.
  // for example: auto IP address capture on events
  sendDefaultPii: true,
  enableLogs: true,
  integrations: [Sentry.replayIntegration()],
  replaysOnErrorSampleRate: 1.0,
});

// create a react query client for managing server state
// this will enable us to easily fetch, cache and update data from the server
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
        <Toaster position="top-middle" />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
);
