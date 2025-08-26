import { router } from "expo-router";
import React from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const get_started = () => {
  return (
    <View className="bg-white h-full w-full justify-center items-center relative">
      <StatusBar barStyle="dark-content" />
      <Image source={require("../assets/images/get_started_below.png")} className="w-full absolute top-0" resizeMode="contain" />
      <Image source={require("../assets/images/doctor_help_patient.png")} className="w-[350] h-[350] absolute top-16" resizeMode="contain" />
      <SafeAreaView className="flex justify-center items-center w-full h-full relative">
        <View className="flex-1 w-full"></View>
        <View className="flex-1 w-full justify-center items-center p-4">
          <Text className="text-3xl font-mulish_extra_bold text-white mb-[10]">Selamat Datang!</Text>
          <Text className="text-md font-mulish_regular text-white text-center mb-[40]">Ayo Cek Kesehatan Lututmu dengan Arthro Track</Text>
          <View className="flex gap-2 w-full justify-between items-center mb-[40] px-5">
            <TouchableOpacity onPress={() => router.push("/create_account")} className="bg-white rounded-lg py-5 w-full">
              <Text className="text-xl font-mulish_extra_bold text-black text-center">Daftar Akun</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-white rounded-lg py-5 w-full">
              <Text className="text-xl font-mulish_extra_bold text-white text-center">Daftar dengan Google</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row w-full justify-center items-center">
            <Text className="text-md font-mulish_regular text-white text-center">Sudah memiliki akun,</Text>
            <TouchableOpacity onPress={() => router.push("/login")} className="text-md font-mulish_regular text-white text-center">
              <Text className="text-md font-mulish_regular text-[#FF9900] text-center"> Login?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default get_started;
