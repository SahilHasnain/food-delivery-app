/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import useAuthStore from "@/store/auth.store";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";

import "./globals.css";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });
  const { isLoading, fetchAuthenticatedUser, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  // Ensure system bars are opaque and content doesn't draw under nav bar on Android
  useEffect(() => {
    if (Platform.OS === "android") {
      (async () => {
        try {
          await NavigationBar.setBackgroundColorAsync("#000000");
          await NavigationBar.setButtonStyleAsync("light");
          await NavigationBar.setVisibilityAsync("visible");
        } catch {}
      })();
    }
  }, []);

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      if (isAuthenticated) {
        router.replace("/");
      } else {
        router.replace("/sign-in");
      }
    }
  }, [isAuthenticated, isLoading, fontsLoaded]);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/splash-v1.png")}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" translucent={false} backgroundColor="#000000" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
  },
});
