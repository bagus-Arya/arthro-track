import { View, StatusBar, ScrollView, Text, TouchableOpacity, Dimensions, ActivityIndicator, Modal } from "react-native"; // Added Modal
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { WebView } from "react-native-webview"; // Added for video
import { getSensorData, SensorData } from "@/services/apiLogSensor";
import { isLoggedIn } from "@/services/apiAuth";

const { width } = Dimensions.get("window");

// Risk mapping for colors and recommendations
const riskConfig: Record<string, { color: string; recommendationId: number; } | undefined> = {
  "Rendah": { color: "#10B981", recommendationId: 6 },
  "Sedang": { color: "#F59E0B", recommendationId: 5 },
  "Tinggi": { color: "#EF4444", recommendationId: 4 },
};

// Recommendations with driveId (kept as requested)
const recommendations = [
  // id 4: Tinggi
  {
    id: 4,
    content: "Resiko tinggi osteoarthritis dapat menyebabkan nyeri lutut yang parah dan goyangan postur ke lateral. Video ini menjelaskan gejala, faktor risiko, dan langkah pencegahan dini untuk pasien dengan kondisi ini.",
    driveId: "16-49n72m0grsz3coXijkSXAOOdpNTiI3",
  },
  // id 5: Sedang
  {
    id: 5,
    content: "Pada resiko sedang, gejala osteoarthritis mulai muncul seperti stadium awal dan nyeri ringan. Pelajari cara mengenali stadium OA, monitoring harian, dan pengobatan sederhana melalui video panduan ini.",
    driveId: "1c8g6X_Nsf8GPWOUiKFdQ171ZxE2cxtq_",
  },
  // id 6: Rendah
  {
    id: 6,
    content: "Resiko rendah memungkinkan pencegahan dini osteoarthritis melalui gaya hidup sehat. Video ini membahas tips pencegahan, pengobatan alami, dan pemantauan untuk menjaga kesehatan sendi secara optimal.",
    driveId: "1YCYfEdAnwiGhhghlbYfb1u6_hm6TckLT",
  },
];

// Sample details (static)
const sampleExaminationDetails = [
  "Pemeriksaan dilakukan dengan alat pengukuran standar",
  "Hasil pengukuran menunjukkan nilai pada skala 0-100",
  "Kondisi sendi lutut dalam kategori risiko",
  "Tidak ada tanda-tanda inflamasi akut",
  "Rentang gerak sendi masih dalam batas normal",
];

const sampleExerciseRecommendations = [
  "Latihan peregangan otot paha depan (quadriceps) 3x sehari",
  "Latihan penguatan otot paha belakang (hamstring) 2x sehari",
  "Berjalan kaki ringan 30 menit setiap hari",
  "Hindari aktivitas yang memberikan beban berlebihan pada lutut",
  "Konsultasi dengan fisioterapis untuk program latihan khusus",
];

const Hasil = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [isExerciseExpanded, setIsExerciseExpanded] = useState(false);
  // New states for video modal
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null); // Type as { title: string; driveId: string; } if needed

  // WebView error handler
  const onWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error in Hasil video:", nativeEvent);
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Auth check
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
          router.replace("/login");
          return;
        }

        // Fetch sensor data
        const data = await getSensorData();
        setSensorData(data); // Already sorted descending by created_at in API
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        console.error("Hasil fetch error:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get latest data
  const latest = sensorData.length > 0 ? sensorData[0] : null;
  const date = latest ? new Date(latest.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "28/04/2025";
  const score = latest ? Number(latest.oa_score) : 90;
  let riskCategory = latest ? latest.oa_risk_category : "Sedang";

  // Normalize riskCategory for safe matching
  const riskCategoryNormalized = riskCategory?.trim()?.charAt(0).toUpperCase() + riskCategory?.trim()?.slice(1).toLowerCase() || "Sedang";

  const config = riskConfig[riskCategoryNormalized] || { color: "#FF9500", recommendationId: 5 }; // Safe access with fallback
  const riskColor = config.color;
  const recId = config.recommendationId;

  // Dynamic examination details
  const examinationDetails = sampleExaminationDetails.map((detail) => 
    detail.replace("nilai", `${score}`).replace("kategori risiko", riskCategory)
  );

  // Dynamic exercise recommendations based on risk
  const getRecommendations = () => {
    const baseRec = recommendations.find(r => r.id === recId)?.content || recommendations[1].content; // Fallback to Sedang
    return baseRec.split('. ').map((item) => item.trim()).filter(Boolean);
  };
  const exerciseRecommendations = getRecommendations().length > 0 ? getRecommendations() : sampleExerciseRecommendations;

  // Get selected video for modal (based on risk)
  const handlePlayVideo = () => {
    const selectedRec = recommendations.find(r => r.id === recId);
    if (selectedRec && selectedRec.driveId) {
      setSelectedVideo({
        title: `Video Rekomendasi - ${riskCategoryNormalized}`,
        driveId: selectedRec.driveId,
      });
      setIsVideoModalVisible(true);
    } else {
      // Optional: Alert if no video
      console.warn("No video available for this risk category");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const applyNavBar = async () => {
        await NavigationBar.setButtonStyleAsync("dark");
      };
      applyNavBar();
    }, [])
  );

  // Loading
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Memuat hasil...</Text>
      </SafeAreaView>
    );
  }

  // Error
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-lg text-red-500 mb-4">Error: {error}</Text>
        <TouchableOpacity onPress={() => window.location.reload()} className="p-3 bg-blue-500 rounded-lg">
          <Text className="text-white font-semibold">Coba Lagi</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // No data fallback
  const isNoData = sensorData.length === 0;
  if (isNoData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-lg text-gray-500 mb-4">Belum ada data hasil pemeriksaan.</Text>
        <TouchableOpacity onPress={() => router.back()} className="p-3 bg-blue-500 rounded-lg">
          <Text className="text-white font-semibold">Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
          <Text className="text-center text-gray-600 text-sm mb-4">{date}</Text>

          {/* Score and Risk Row */}
          <View className="flex-row items-center">
            {/* Left Section - Last Score */}
            <View className="flex-1 items-center pr-4">
              <Text className="text-gray-600 text-sm mb-2">Skor Terakhir</Text>
              <Text className="text-4xl font-bold text-gray-900">{score}</Text>
            </View>

            {/* Vertical Divider */}
            <View className="w-px h-16 bg-gray-200" />

            {/* Right Section - Last Risk */}
            <View className="flex-1 items-center pl-4">
              <Text className="text-gray-600 text-sm mb-2">Risiko Terakhir</Text>
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: riskColor }} />
                <Text className="text-lg font-semibold text-gray-900">{riskCategory}</Text>
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
                  {examinationDetails.map((detail, index) => (
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
                  {exerciseRecommendations.map((rec, index) => (
                    <View key={index} className="flex-row items-start mb-2">
                      <View className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3" />
                      <Text className="text-gray-700 text-sm flex-1">{rec}</Text>
                    </View>
                  ))}
                  {/* New: Video Button (only if driveId exists) */}
                  {recommendations.find(r => r.id === recId)?.driveId && (
                    <TouchableOpacity 
                      onPress={handlePlayVideo} 
                      className="mt-4 p-3 bg-blue-500 rounded-lg items-center"
                    >
                      <Text className="text-white font-semibold">Tonton Video Rekomendasi</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* New: Video Modal (your provided code) */}
      <Modal
        visible={isVideoModalVisible}
        animationType="slide"
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => setIsVideoModalVisible(false)}
      >
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            <View className="flex-row items-center justify-between px-4 py-3 bg-black">
              <TouchableOpacity onPress={() => setIsVideoModalVisible(false)} className="p-2">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-white flex-1 text-center px-4">
                {selectedVideo?.title}
              </Text>
              <View className="w-10" />
            </View>

            {selectedVideo && (
              <View className="flex-1">
                <WebView
                  source={{
                    uri: `https://drive.google.com/file/d/${selectedVideo.driveId}/preview`,
                  }}
                  style={{ flex: 1 }}
                  allowsFullscreenVideo={true}
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  scalesPageToFit={true}
                  onError={onWebViewError}
                />
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Hasil;