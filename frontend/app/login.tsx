import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StatusBar, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login as authLogin } from "@/services/apiAuth"; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Silakan masukkan email dan password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const credentials = { email: email.trim(), password: password.trim() };
      await authLogin(credentials); 
      router.replace("/(tabs)/home");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login gagal';
      setError(errorMessage);
      Alert.alert('Error Login', errorMessage); 
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <View className="bg-white h-full w-full justify-center items-center relative">
      <StatusBar barStyle="light-content" />
      <Image 
        source={require("../assets/images/login_bottom_side.png")} 
        className="absolute -bottom-36" 
        style={{ maxWidth: "100%", maxHeight: "100%" }} 
        resizeMode="contain" 
      />
      <Image 
        source={require("../assets/images/login_top_side.png")} 
        className="absolute -top-56" 
        style={{ maxWidth: "100%", maxHeight: "100%" }} 
        resizeMode="contain" 
      />
      <Image 
        source={require("../assets/images/main_logo_with_text.png")} 
        className="absolute top-16 w-[220] h-[220]" 
        resizeMode="contain" 
      />
      <SafeAreaView className="flex justify-center items-center w-full h-full relative">
        <View className="flex w-full justify-center items-center absolute top-20 -bottom-10">
          <View className="flex w-full justify-center items-center py-3 px-6">
            <Text className="text-2xl font-mulish_extra_bold text-black mb-[10] w-full">
              Halo!
              {"\n"}Selamat Datang Kembali!
            </Text>
            {error && (
              <View className="w-full bg-red-100 border border-red-400 rounded-lg p-3 mb-4">
                <Text className="text-red-700 text-center font-mulish_regular">{error}</Text>
              </View>
            )}
            <View className="flex flex-col gap-3 mb-8 w-full">
              <View>
                <Text className="text-md font-mulish_medium text-black mb-2">Email</Text>
                <TextInput
                  className="w-full text-lg py-3 px-3 bg-[#EAEAEA] border border-gray-200 rounded-lg font-mulish_regular text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  placeholder="example@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    clearError();
                  }}
                />
              </View>

              <View>
                <Text className="text-md font-mulish_medium text-black mb-2">Password</Text>
                <TextInput
                  className="w-full text-lg py-3 px-3 bg-[#EAEAEA] border border-gray-200 rounded-lg font-mulish_regular text-gray-800"
                  placeholder="********"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearError();
                  }}
                />
              </View>
            </View>

            <TouchableOpacity 
              onPress={handleLogin} 
              disabled={loading}
              className="w-full h-12 bg-[#7898FA] rounded-lg items-center justify-center mb-3"
            >
              <Text className="text-white font-mulish_bold text-base">
                {loading ? 'Sedang Masuk...' : 'Masuk'}
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-center items-center gap-2">
              <View className="flex-1 h-[1px] bg-gray-300"></View>
              <Text className="text-md font-mulish_regular text-gray-500">Atau</Text>
              <View className="flex-1 h-[1px] bg-gray-300"></View>
            </View>
          </View>
        </View>

        <View className="flex w-full justify-center items-center absolute bottom-16">
          <View className="flex w-full justify-center items-center py-3 px-6 gap-2">
            <View className="flex flex-row w-full justify-center items-center gap-6">
              <TouchableOpacity className="w-[50] h-[50] bg-gray-200 rounded-lg items-center justify-center">
                <Image source={require("../assets/images/google_icon.png")} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity className="w-[50] h-[50] bg-gray-200 rounded-lg items-center justify-center">
                <Image source={require("../assets/images/facebook_icon.png")} className="w-10 h-10" resizeMode="contain" />
              </TouchableOpacity>
            </View>
            <View className="flex-row w-full justify-center items-center">
              <Text className="text-md font-mulish_regular text-black text-center">Belum memiliki akun? </Text>
              <TouchableOpacity onPress={() => router.push("/create_account")}>
                <Text className="text-md font-mulish_regular text-[#FF9900] text-center">Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Login;