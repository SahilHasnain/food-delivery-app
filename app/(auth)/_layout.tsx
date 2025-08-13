import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import { Redirect, Slot } from "expo-router";
import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import FocusAwareStatusBar from "@/components/FocusAwareStatusBar";

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) return <Redirect href="/" />;

  return (
    
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FocusAwareStatusBar
          style="light"
          backgroundColor="#000000"
          translucent={true}
        />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === "ios" ? "interactive" : "interactive"
          }
          style={{ flex: 1, backgroundColor: "#fff" }}
        >
          <View
            className="relative w-full"
            style={{ height: Dimensions.get("screen").height / 2.25 }}
          >
            <ImageBackground
              source={images.loginGraphic}
              className="rounded-b-lg size-full"
              resizeMode="stretch"
            />
            <Image
              source={images.logo}
              className="absolute z-10 self-center size-48 -bottom-16"
            />
          </View>
          <Slot />
        </ScrollView>
      </KeyboardAvoidingView>
    
  );
}
