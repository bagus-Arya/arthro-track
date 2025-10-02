import { View, StatusBar, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { getSensorData, SensorData } from "@/services/apiLogSensor";

const { width } = Dimensions.get("window");

const RiwayatHasil = () => {
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

  // Helper function to format ISO date to "DD MMMM YYYY" (e.g., "2 October 2025")
  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Helper function to get dynamic color based on risk category (same as Home)
  const getRiskColor = (category: string) => {
    if (category.includes("Tinggi")) return "#EF4444"; // Red
    if (category.includes("Sedang")) return "#F59E0B"; // Yellow/Orange
    return "#10B981"; // Green for "Rendah" or fallback
  };

  // Get first 5 dates for graph placeholder (formatted shortly as "DD MMM")
  const getGraphDates = () => {
    if (sensorData.length === 0) return "No data available";
    const shortDates = sensorData.slice(0, 5).map((item) => {
      const date = new Date(item.created_at);
      return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    });
    return shortDates.join(", ");
  };

  useFocusEffect(
    useCallback(() => {
      const applyNavBar = async () => {
        await NavigationBar.setButtonStyleAsync("dark"); // dark buttons/icons
      };
      applyNavBar();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Riwayat Hasil</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6 bg-white">
        {/* Progress Graph Section */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Grafik Progres Bulan Ini</Text>

          {/* Graph Placeholder */}
          <View className="bg-gray-50 rounded-lg p-4 h-48 items-center justify-center">
            <View className="items-center">
              <Ionicons name="bar-chart" size={48} color="#3B82F6" />
              <Text className="text-gray-600 text-sm mt-2">Grafik akan ditampilkan di sini</Text>
              <Text className="text-gray-500 text-xs mt-1">Data: {getGraphDates()}</Text>
            </View>
          </View>
        </View>

        {/* Examination History Section */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 mb-2">
          <Text className="text-lg font-bold text-gray-900 p-4 pb-2">Riwayat Pemeriksaan</Text>

          {/* Fixed height scrollable container */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {loading ? (
              <View className="px-4 py-6 items-center">
                <Text className="text-gray-600 text-center">Loading history...</Text>
              </View>
            ) : error ? (
              <View className="px-4 py-6 items-center">
                <Text className="text-red-500 text-center">Error: {error}</Text>
              </View>
            ) : sensorData.length === 0 ? (
              <View className="px-4 py-6 items-center">
                <Text className="text-gray-600 text-center">No history available</Text>
              </View>
            ) : (
              sensorData.map((item) => (
                <View key={item.id} className="flex-row items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
                  {/* Calendar Icon */}
                  <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="calendar" size={16} color="#3B82F6" />
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    <Text className="text-gray-900 font-medium">{formatDate(item.created_at)}</Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-gray-600 text-sm">Skor: {item.oa_score}</Text>
                      <Text className="text-gray-600 text-sm ml-4">Risiko: {item.oa_risk_category}</Text>
                    </View>
                  </View>

                  {/* Risk Indicator */}
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getRiskColor(item.oa_risk_category),
                    }}
                  />
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RiwayatHasil;