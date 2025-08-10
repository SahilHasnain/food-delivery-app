import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";

import "./globals.css";

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/images/login-graphic.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
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
