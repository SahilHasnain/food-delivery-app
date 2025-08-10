const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Obtain Expo's default Metro configuration and wrap it with NativeWind
const defaultConfig = getDefaultConfig(__dirname);
module.exports = withNativeWind(defaultConfig, { input: "./app/globals.css" });
