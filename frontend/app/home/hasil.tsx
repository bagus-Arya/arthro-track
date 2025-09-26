import { View, StatusBar, ScrollView, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

// Sample data
const resultData = {
  date: "28/04/2025",
  lastScore: 90,
  lastRisk: "Sedang",
  riskColor: "#FF9500", // Orange color for medium risk
  examinationDetails: [
    "Pemeriksaan dilakukan dengan alat pengukuran standar",
    "Hasil pengukuran menunjukkan nilai 90 pada skala 0-100",
    "Kondisi sendi lutut dalam kategori sedang",
    "Tidak ada tanda-tanda inflamasi akut",
    "Rentang gerak sendi masih dalam batas normal",
  ],
  exerciseRecommendations: [
    "Latihan peregangan otot paha depan (quadriceps) 3x sehari",
    "Latihan penguatan otot paha belakang (hamstring) 2x sehari",
    "Berjalan kaki ringan 30 menit setiap hari",
    "Hindari aktivitas yang memberikan beban berlebihan pada lutut",
    "Konsultasi dengan fisioterapis untuk program latihan khusus",
  ],
};

const Hasil = () => {
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [isExerciseExpanded, setIsExerciseExpanded] = useState(false);

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
        <Text className="text-lg font-bold text-black">Hasil</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-6 bg-white">
        {/* Score Card */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6">
          {/* Date */}
          <Text className="text-center text-gray-600 text-sm mb-4">{resultData.date}</Text>

          {/* Score and Risk Row */}
          <View className="flex-row items-center">
            {/* Left Section - Last Score */}
            <View className="flex-1 items-center pr-4">
              <Text className="text-gray-600 text-sm mb-2">Skor Terakhir</Text>
              <Text className="text-4xl font-bold text-gray-900">{resultData.lastScore}</Text>
            </View>

            {/* Vertical Divider */}
            <View className="w-px h-16 bg-gray-200" />

            {/* Right Section - Last Risk */}
            <View className="flex-1 items-center pl-4">
              <Text className="text-gray-600 text-sm mb-2">Risiko Terakhir</Text>
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: resultData.riskColor }} />
                <Text className="text-lg font-semibold text-gray-900">{resultData.lastRisk}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Collapsible Sections */}
        <View className="space-y-4">
          {/* Detail Pemeriksaan */}
          <View className="bg-white rounded-lg border border-gray-100">
            <TouchableOpacity onPress={() => setIsDetailExpanded(!isDetailExpanded)} className="flex-row items-center justify-between p-4">
              <Text className="text-lg font-semibold text-gray-900">Detail Pemeriksaan</Text>
              <Ionicons name={isDetailExpanded ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
            </TouchableOpacity>

            {isDetailExpanded && (
              <View className="px-4 pb-4">
                <View className="border-t border-gray-100 pt-4">
                  {resultData.examinationDetails.map((detail, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <View className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" />
                      <Text className="text-gray-700 text-sm flex-1">{detail}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Rekomendasi Latihan */}
          <View className="bg-white rounded-lg border border-gray-100">
            <TouchableOpacity onPress={() => setIsExerciseExpanded(!isExerciseExpanded)} className="flex-row items-center justify-between p-4">
              <Text className="text-lg font-semibold text-gray-900">Rekomendasi Latihan</Text>
              <Ionicons name={isExerciseExpanded ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
            </TouchableOpacity>

            {isExerciseExpanded && (
              <View className="px-4 pb-4">
                <View className="border-t border-gray-100 pt-4">
                  {resultData.exerciseRecommendations.map((exercise, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <View className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" />
                      <Text className="text-gray-700 text-sm flex-1">{exercise}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Hasil;
