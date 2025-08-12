import React from "react";
import { Text, TouchableOpacity, Linking } from "react-native";

type DeveloperCreditProps = {
  className?: string;
};

const DeveloperCredit: React.FC<DeveloperCreditProps> = ({ className }) => {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL("https://sahilhasnain.tech")}
      activeOpacity={0.7}
      className={`mt-5 items-center ${className ?? ""}`}
    >
      <Text className="text-xs text-center text-gray-500/50">
        Developed by Sahil Hasnain
      </Text>
    </TouchableOpacity>
  );
};

export default DeveloperCredit;
