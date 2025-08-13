import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { images } from "@/constants";
import { ProfileFieldProps } from "@/type";
import { logout } from "@/lib/appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import FocusAwareStatusBar from "@/components/FocusAwareStatusBar";

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 50, // Add extra padding at the bottom to account for the tab bar
  },
});

const ProfileField = ({ label, value, icon }: ProfileFieldProps) => (
  <View className="flex-row items-center gap-2.5">
    <View className="flex items-center justify-center rounded-full size-12 bg-primary/5">
      <Image source={icon} className="size-5" resizeMode="contain" />
    </View>
    <View className="flex-1">
      <Text className="text-gray-500 body-medium !text-[12.25px]">{label}</Text>
      <Text className="mt-1 text-dark-100 base-semibold !text-[14.25px]">
        {value}
      </Text>
    </View>
  </View>
);

const Profile = () => {
  const { user, setUser, setIsAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const handleEditProfile = () => {
    // This function would navigate to edit profile screen
    // Since it's mentioned as "without any function" in requirements,
    // we'll just show an alert for now
    Alert.alert("Info", "Edit profile functionality not implemented yet");
  };

  if (!user) {
    return (
      <View className="items-center justify-center flex-1">
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white-100">
      <FocusAwareStatusBar
        style="dark"
        backgroundColor="#ffffff"
        translucent={true}
      />
      {/* Custom header with back arrow, Profile text in middle, search icon on right */}

      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={images.arrowBack}
            className="size-5"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="base-semibold text-dark-100">Profile</Text>

        <TouchableOpacity>
          <Image
            source={images.search}
            className="size-5"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Avatar */}
        <View className="items-center mb-8">
          <View className="relative">
            <Image
              source={user.avatar ? { uri: user.avatar } : images.avatar}
              className="rounded-full size-24"
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 p-2 rounded-full bg-primary"
              onPress={() => {
                // As mentioned in requirements, this edit icon doesn't have any function
                Alert.alert(
                  "Info",
                  "Avatar edit functionality not implemented yet"
                );
              }}
            >
              <Image
                source={images.pencil}
                className="size-4"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* User Details */}
        <View className="bg-white rounded-[20px] px-3.5 py-5 gap-[30px] mb-8">
          <ProfileField
            label="Full Name"
            value={user.name || "Not specified"}
            icon={images.user}
          />

          <ProfileField
            label="Email"
            value={user.email || "Not specified"}
            icon={images.envelope}
          />

          <ProfileField
            label="Phone Number"
            value="+91 00000 12345"
            icon={images.phone}
          />

          <ProfileField
            label="Address 1 - (Home)"
            value="12A, Connaught Place, New Delhi, Delhi 110001"
            icon={images.home}
          />

          <ProfileField
            label="Address 2 - (Work)"
            value="9B, Connaught Place, New Delhi, Delhi 110001"
            icon={images.location}
          />
        </View>

        {/* Action Buttons */}
        <View className="mb-20">
          <TouchableOpacity
            className="items-center mb-3 bg-primary/5 border border-primary py-3.5 px-4 rounded-[100px]"
            onPress={handleEditProfile}
          >
            <Text className="base-bold text-primary">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 py-3.5 px-4 bg-error/5 border border-error rounded-[100px]"
            onPress={handleLogout}
          >
            <Image
              source={images.logout}
              className="size-6"
              resizeMode="contain"
            />
            <Text className="text-error base-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
