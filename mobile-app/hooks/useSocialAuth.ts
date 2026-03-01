import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";

// Custom hook to handle social authentication logic
const useSocialAuth = () => {
  // State to manage loading state during authentication
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  // Function to handle social authentication based on the selected strategy (Google or Apple)
  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);

    try {
      // Start the Single Sign-On (SSO) flow with the selected strategy and handle the session creation
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      // If a session is created successfully, set it as the active session
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId }); // Set the newly created session as active
      }
    } catch (error) {
      console.log("Error during social auth: ", error);

      const provider = strategy === "oauth_google" ? "Google" : "Apple";

      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`,
      );
    } finally {
      setLoadingStrategy(null);
    }
  };
  return { loadingStrategy, handleSocialAuth };
};

export default useSocialAuth;
