import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const create_account = () => {
  return (
    <View className="bg-white h-full w-full justify-center items-center relative">
      <SafeAreaView className="flex justify-center items-center w-full h-full relative">
        <ScrollView className="flex-1  w-full">
          <View className="px-6 pt-12 pb-8">
            {/* Header */}
            <View className="flex-row items-center mb-8">
              <TouchableOpacity className="mr-4" onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {/* Title Section */}
            <View className="mb-8">
              <Text className="text-3xl font-mulish_bold text-blue-900 mb-2">Buat Akun</Text>
              <Text className="text-base font-mulish_regular text-gray-800">Daftar untuk melanjutkan</Text>
            </View>

            {/* Form Fields */}
            <View className="flex flex-col gap-3 mb-8">
              {/* Full Name Input */}
              <View>
                <Text className="text-md font-mulish_medium text-black mb-2">Nama Lengkap</Text>
                <TextInput className="w-full text-lg py-3 px-3 bg-[#EAEAEA] border border-gray-200 rounded-lg font-mulish_regular text-gray-800" placeholder="Jane Doe" placeholderTextColor="#9CA3AF" />
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-md font-mulish_medium text-black mb-2">Email</Text>
                <TextInput
                  className="w-full text-lg py-3 px-3 bg-[#EAEAEA] border border-gray-200 rounded-lg font-mulish_regular text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  placeholder="example@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-md font-mulish_medium text-black mb-2">Password</Text>
                <TextInput className="w-full text-lg py-3 px-3 bg-[#EAEAEA] border border-gray-200 rounded-lg font-mulish_regular text-gray-800" placeholder="********" placeholderTextColor="#9CA3AF" secureTextEntry />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity className="w-full h-12 bg-red-500 rounded-lg items-center justify-center mb-6">
              <Text className="text-white font-mulish_bold text-base">Daftar akun</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center mb-8">
              <Text className="text-gray-600 font-mulish_regular">Sudah punya akun, </Text>
              <TouchableOpacity>
                <Text className="text-orange-500 font-mulish_medium">Daftar?</Text>
              </TouchableOpacity>
            </View>

            {/* Social Login Buttons */}
            <View className="flex flex-col gap-3">
              {/* Google Button */}
              <TouchableOpacity className="w-full h-12 bg-white border border-gray-300 rounded-lg flex-row items-center justify-center">
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text className="text-gray-800 font-mulish_medium ml-3">Masuk dengan Google</Text>
              </TouchableOpacity>

              {/* Facebook Button */}
              <TouchableOpacity className="w-full h-12 bg-white border border-gray-300 rounded-lg flex-row items-center justify-center">
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text className="text-gray-800 font-mulish_medium ml-3">Masuk dengan Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default create_account;
