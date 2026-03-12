import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import ScreenHeader from "@/components/ScreenHeader";
import { View, ScrollView, Switch, Text, TouchableOpacity } from "react-native";

// The object that defines the structure of each security and privacy option in the settings screen
type SecurityOption = {
  id: string;
  icon: string;
  title: string;
  description: string;
  type: "navigation" | "toggle";
  value?: boolean;
};

const PrivacyAndSecurityScreen = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareData, setShareData] = useState(false);

  const securitySettings: SecurityOption[] = [
    {
      id: "password",
      icon: "lock-closed",
      title: "Change Password",
      description: "Update your account password regularly",
      type: "navigation",
    },
    {
      id: "two-factor",
      icon: "shield-checkmark-outline",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      type: "toggle",
      value: twoFactorEnabled,
    },
    {
      id: "biometric",
      icon: "finger-print-outline",
      title: "Biometric Login",
      description: "Use Face ID or Touch ID",
      type: "toggle",
      value: biometricEnabled,
    },
  ];

  const privacySettings: SecurityOption[] = [
    {
      id: "push",
      icon: "notifications-outline",
      title: "Push Notifications",
      description: "Receive notifications on your device",
      type: "toggle",
      value: pushNotifications,
    },
    {
      id: "email",
      icon: "mail-outline",
      title: "Email Notifications",
      description: "Receive updates and offers via email",
      type: "toggle",
      value: emailNotifications,
    },
    {
      id: "marketing",
      icon: "megaphone-outline",
      title: "Marketing Emails",
      description: "Receive promotional emails and offers",
      type: "toggle",
      value: marketingEmails,
    },
    {
      id: "share",
      icon: "analytics-outline",
      title: "Share Usage Data",
      description: "Help us improve the app",
      type: "toggle",
      value: shareData,
    },
  ];

  const accountSettings = [
    {
      id: "activity",
      icon: "time-outline",
      title: "Login Activity",
      description: "View recent login sessions and devices",
    },
    {
      id: "devices",
      icon: "phone-portrait-outline",
      title: "Connected Devices",
      description: "Manage devices with access",
    },
    {
      id: "data-download",
      icon: "download-outline",
      title: "Download Your Data",
      description: "Get a copy of your data",
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case "two-factor":
        setTwoFactorEnabled(value);
        break;
      case "biometric":
        setBiometricEnabled(value);
        break;
      case "push":
        setPushNotifications(value);
        break;
      case "email":
        setEmailNotifications(value);
        break;
      case "marketing":
        setMarketingEmails(value);
        break;
      case "data":
        setShareData(value);
        break;
    }
  };

  return (
    <SafeScreen>
      {/* HEADER */}
      <ScreenHeader screenTitle="Privacy & Security" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* SECURITY SETTINGS */}
        <View className="px-6 pt-6">
          <Text className="text-text-primary text-lg font-bold mb-4">
            Security
          </Text>
          {securitySettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface rounded-2xl p-4 mb-3"
              activeOpacity={setting.type === "toggle" ? 1 : 0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons
                    name={setting.icon as any}
                    size={24}
                    color="#A68A3E"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    {setting.description}
                  </Text>
                </View>

                {setting.type === "toggle" ? (
                  <Switch
                    value={setting.value} // true or false
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    thumbColor="#FFFFFF"
                    trackColor={{ false: "#2A2A2A", true: "#1DB954" }}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#A89F91" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* PRIVACY SETTINGS */}

        <View className="px-6 pt-4">
          <Text className="text-text-primary text-lg font-bold mb-4">
            Privacy
          </Text>

          {privacySettings.map((setting) => (
            <View key={setting.id}>
              <View className="bg-surface rounded-2xl p-4 mb-3">
                <View className="flex-row items-center">
                  <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                    <Ionicons
                      name={setting.icon as any}
                      size={24}
                      color="#A68A3E"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-bold text-base mb-1">
                      {setting.title}
                    </Text>
                    <Text className="text-text-secondary text-sm">
                      {setting.description}
                    </Text>
                  </View>
                  <Switch
                    value={setting.value}
                    onValueChange={(value) => handleToggle(setting.id, value)}
                    trackColor={{ false: "#2A2A2A", true: "#1DB954" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ACCOUNT SETTINGS */}

        <View className="px-6 pt-4">
          <Text className="text-text-primary text-lg font-bold mb-4">
            Account
          </Text>

          {accountSettings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              className="bg-surface rounded-2xl p-4 mb-3"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <View className="bg-primary/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                  <Ionicons
                    name={setting.icon as any}
                    size={24}
                    color="#A68A3E"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-bold text-base mb-1">
                    {setting.title}
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    {setting.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#A89F91" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* DELETE ACCOUNT */}

        <View className="px-6 pt-4">
          <TouchableOpacity
            className="bg-surface rounded-2xl p-5 flex-row items-center justify-between border-2 border-red-500/20"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="bg-red-500/20 rounded-full w-12 h-12 items-center justify-center mr-4">
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </View>
              <View>
                <Text className="text-red-500 font-bold text-base mb-1">
                  Delete Account
                </Text>
                <Text className="text-text-secondary text-sm">
                  Permanently delete your account
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default PrivacyAndSecurityScreen;
