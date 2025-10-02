import React, { useState, useEffect } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { getSensorData, SensorData } from "@/services/apiLogSensor";

const Home = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSensorData();
        setSensorData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Failed to fetch sensor data:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, []);

  // Get the latest sensor data (first item in array, assuming sorted by recency)
  const latest = sensorData.length > 0 ? sensorData[0] : null;

  // Fallback values if no data
  const score = latest?.oa_score || "90";
  const riskCategory = latest?.oa_risk_category || "Sedang";

  // Helper function to get dynamic color based on risk category
  const getRiskColor = (category: string) => {
    if (category.includes("Tinggi")) return "bg-red-500";
    if (category.includes("Sedang")) return "bg-yellow-500";
    return "bg-green-500"; // For "Rendah" or fallback
  };

  return (
    <View className="bg-white h-full w-full justify-center items-center relative">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex justify-center items-center w-full h-full">
        <View className="flex-1 w-full px-6 pt-6">
          <View className="flex-row items-center mb-8">
            <View className="w-14 h-14 bg-orange-100 rounded-full mr-4 items-center justify-center">
              <Text className="text-3xl">👤</Text>
            </View>
            <View>
              <Text className="text-lg text-gray-800 mb-1 font-mulish_bold">Halo!</Text>
              <Text className="text-xl font-bold text-black font-mulish_regular">Jane Doe</Text>
            </View>
          </View>

          <View className="flex flex-col rounded-lg border border-gray-300">
            <View className="flex flex-col justify-between items-center w-full ">
              <View className="flex flex-row">
                <View className="flex flex-1 flex-col justify-center items-center border-b border-gray-400 p-3">
                  <Text className="text-sm text-black mb-1 font-mulish_bold">
                    {loading ? "Loading..." : "Skor Terakhir"}
                  </Text>
                  {loading ? (
                    <Text className="text-xl text-black font-mulish_bold">Loading...</Text>
                  ) : error ? (
                    <Text className="text-xl text-red-500 font-mulish_bold">Error</Text>
                  ) : (
                    <Text className="text-xl text-black font-mulish_bold">{score}</Text>
                  )}
                </View>
                <View className="w-[1px] h-full bg-gray-400"></View>
                <View className="flex flex-1 flex-col justify-center items-center border-b border-gray-400 p-3">
                  <Text className="text-sm text-black mb-1 font-mulish_bold">
                    {loading ? "Loading..." : "Resiko terakhir"}
                  </Text>
                  <View className="flex flex-row items-center justify-center">
                    {/* Dynamic color based on risk category */}
                    <View className={`w-5 h-5 ${getRiskColor(riskCategory || '')} rounded-full mr-2`}></View>
                    {loading ? (
                      <Text className="text-md text-black font-mulish_bold">Loading...</Text>
                    ) : error ? (
                      <Text className="text-md text-red-500 font-mulish_bold">Error</Text>
                    ) : (
                      <Text className="text-md text-black font-mulish_bold">{riskCategory}</Text>
                    )}
                  </View>
                </View>
              </View>
              <View className="flex flex-col p-3 w-full">
                <Text className="text-sm text-black mb-3 font-mulish_bold text-left">Grafik Progress Bulan Ini</Text>
                <View className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Text className="text-gray-500 font-mulish_regular">[ Grafik akan ditampilkan di sini ]</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex flex-row justify-evenly items-center w-full mt-6 gap-4">
            <TouchableOpacity onPress={() => router.push("/home/info")} className="flex flex-col flex-1 justify-center items-center border border-gray-300 rounded-lg p-2">
              <Image source={require("../../assets/images/qa_icon.png")} className="w-16 h-16 mb-2" />
              <Text className="text-lg text-black mb-1 font-mulish_bold">Info OA</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/home/panduan")} className="flex flex-col flex-1 justify-center items-center border border-gray-300 rounded-lg p-2">
              <Image source={require("../../assets/images/guide_icon.png")} className="w-16 h-16 mb-2" />
              <Text className="text-lg text-black mb-1 font-mulish_bold">Panduan</Text>
            </TouchableOpacity>
          </View>
          <View className="flex flex-row justify-evenly items-center w-full mt-6 gap-4">
            <TouchableOpacity onPress={() => router.push("/home/hasil")} className="flex flex-col flex-1 justify-center items-center border border-gray-300 rounded-lg p-2">
              <Image source={require("../../assets/images/result_icon.png")} className="w-16 h-16 mb-2" />
              <Text className="text-lg text-black mb-1 font-mulish_bold">Hasil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/home/riwayat_hasil")} className="flex flex-col flex-1 justify-center items-center border border-gray-300 rounded-lg p-2">
              <Image source={require("../../assets/images/result_history.png")} className="w-16 h-16 mb-2" />
              <Text className="text-lg text-black mb-1 font-mulish_bold">Riwayat Hasil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;