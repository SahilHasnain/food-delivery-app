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

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 150, // Add extra padding at the bottom to account for the tab bar
  },
});

const ProfileField = ({ label, value, icon }: ProfileFieldProps) => (
  <View className="flex-row items-center gap-4 p-4 mb-3 bg-white rounded-lg">
    <Image source={icon} className="size-6" resizeMode="contain" />
    <View className="flex-1">
      <Text className="text-xs text-gray-500">{label}</Text>
      <Text className="mt-1 text-dark-100 base-medium">{value}</Text>
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
    <View className="flex-1 bg-gray-50">
      {/* Custom header with back arrow, Profile text in middle, search icon on right */}
      <View className="flex-row items-center justify-between px-4 pt-10 pb-4">
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
                  "Avatar edit functionality not implemented as per requirements"
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
        <View className="mb-6">
          <ProfileField
            label="Full Name"
            value={user.name || "Not specified"}
            icon={images.person}
          />

          <ProfileField
            label="Email"
            value={user.email || "Not specified"}
            icon={images.envelope}
          />

          <ProfileField
            label="Phone Number"
            value="+1 (555) 123-4567"
            icon={images.phone}
          />

          <ProfileField
            label="Address 1 - (Home)"
            value="123 Main Street, Apt 4B, New York, NY 10001"
            icon={images.home}
          />

          <ProfileField
            label="Address 2 - (Work)"
            value="456 Business Ave, Suite 200, New York, NY 10002"
            icon={images.location}
          />
        </View>

        {/* Action Buttons */}
        <View className="mb-20">
          <TouchableOpacity
            className="items-center py-4 mb-3 bg-white rounded-lg"
            onPress={handleEditProfile}
          >
            <Text className="base-semibold text-primary">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 py-4 bg-white rounded-lg"
            onPress={handleLogout}
          >
            <Image
              source={images.logout}
              className="size-5"
              resizeMode="contain"
            />
            <Text className="text-red-500 base-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
