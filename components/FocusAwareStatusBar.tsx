import React from "react";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  style?: "auto" | "inverted" | "light" | "dark";
  backgroundColor?: string;
  translucent?: boolean;
};

export default function FocusAwareStatusBar({
  style = "dark",
  backgroundColor = "#ffffff",
  translucent = false,
}: Props) {
  const isFocused = useIsFocused();
  if (!isFocused) return null;
  return (
    <StatusBar
      style={style}
      backgroundColor={backgroundColor}
      translucent={translucent}
    />
  );
}
