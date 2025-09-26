import { View, StatusBar, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Sample data for examination history
const examinationHistory = [
  { id: "1", date: "25 April 2025", score: 120, risk: "Tinggi" },
  { id: "2", date: "20 April 2025", score: 120, risk: "Tinggi" },
  { id: "3", date: "15 April 2025", score: 120, risk: "Tinggi" },
  { id: "4", date: "10 April 2025", score: 120, risk: "Tinggi" },
  { id: "5", date: "5 April 2025", score: 115, risk: "Tinggi" },
  { id: "6", date: "1 April 2025", score: 110, risk: "Sedang" },
];

const RiwayatHasil = () => {
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
              <Text className="text-gray-500 text-xs mt-1">Data: 1 Apr, 5 Apr, 10 Apr, 20 Apr, 25 Apr</Text>
            </View>
          </View>
        </View>

        {/* Examination History Section */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 mb-2">
          <Text className="text-lg font-bold text-gray-900 p-4 pb-2">Riwayat Pemeriksaan</Text>

          {/* Fixed height scrollable container */}

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {examinationHistory.map((item, index) => (
              <View key={item.id} className="flex-row items-center px-4 py-3 border-b border-gray-100 last:border-b-0">
                {/* Calendar Icon */}
                <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Ionicons name="calendar" size={16} color="#3B82F6" />
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text className="text-gray-900 font-medium">{item.date}</Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-600 text-sm">Skor: {item.score}</Text>
                    <Text className="text-gray-600 text-sm ml-4">Risiko: {item.risk}</Text>
                  </View>
                </View>

                {/* Risk Indicator */}
                <View
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.risk === "Tinggi" ? "#EF4444" : "#F59E0B",
                  }}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RiwayatHasil;
