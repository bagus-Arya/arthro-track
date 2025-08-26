import React from "react";
import { StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const profile = () => {
  return (
    <View className="bg-white h-full w-full justify-center items-center relative">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={["top", "left", "right"]} className="flex justify-center items-center w-full h-full relative">
        <View className="flex-1 w-full">
          <Text>Profile</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default profile;
