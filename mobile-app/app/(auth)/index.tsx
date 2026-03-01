import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import useSocialAuth from "@/hooks/useSocialAuth.ts";
const AuthScreen = () => {
  // in react - flex is by default row, in react native - column is by default flex
  // justify center - align items in the center of the screen vertically (react native)
  // align items center - align items in the center of the screen horizontally (react native)
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();

  return (
    <View className="px-8 flex-1 justify-center items-center bg-background">
      {/* DEMO IMAGE */}
      <Image
        source={require("@/assets/images/auth-icon.png")}
        className="size-96"
        resizeMode="contain"
      />
      {/* Container that holds the buttons and text */}
      <View className="gap-3 mt-3 w-full">
        {/* GOOGLE SIGN IN BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-surface border border-surface-border rounded-full px-6 py-3"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={loadingStrategy !== null}
          style={{
            shadowColor: "#C9A84C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            elevation: 3,
          }}
        >
          {loadingStrategy === "oauth_google" ? (
            <ActivityIndicator size={"small"} color={"#C9A84C"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-text-primary font-medium text-base">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* APPLE SIGN IN BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-surface border border-surface-border rounded-full px-6 py-3"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={loadingStrategy !== null}
          style={{
            shadowColor: "#C9A84C",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            elevation: 3,
          }}
        >
          {loadingStrategy === "oauth_apple" ? (
            <ActivityIndicator size={"small"} color={"#C9A84C"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/apple.png")}
                className="size-8 mr-3"
                resizeMode="contain"
              />
              <Text className="text-text-primary font-medium text-base">
                Continue with Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-center text-text-secondary text-xs leading-4 mt-6 px-2">
        By signing up, you agree to our
        <Text className="text-primary"> Terms</Text>
        {", "}
        <Text className="text-primary">Privacy Policy</Text>
        {", and "}
        <Text className="text-primary">Cookie Use</Text>
      </Text>
    </View>
  );
};

export default AuthScreen;
