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
  const { isLoading, handleSocialAuth } = useSocialAuth();

  return (
    <View className="px-8 flex-1 justify-center items-center bg-white">
      {/* DEMO IMAGE */}
      <Image
        source={require("@/assets/images/auth-icon.png")}
        className="size-96"
        resizeMode="contain"
      />
      {/* Container that holds the buttons and text */}
      <View className="gap-2 mt-3">
        {/* GOOGLE SIGN IN BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-2"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2, // for android shadow
          }}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* APPLE SIGN IN BUTTON */}
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 py-3"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            elevation: 2, // for android shadow
          }}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"#4285f4"} />
          ) : (
            <View className="flex-row items-center justify-center">
              <Image
                source={require("@/assets/images/apple.png")}
                className="size-8 mr-3"
                resizeMode="contain"
              />
              <Text className="text-black font-medium text-base">
                Continue with Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
        By signing up, you agree to our
        <Text className="text-blue-500"> Terms</Text>
        {", "}
        <Text className="text-blue-500">Privacy Policy</Text>
        {", and "}
        <Text className="text-blue-500">Cookie Use</Text>
      </Text>
    </View>
  );
};

export default AuthScreen;
