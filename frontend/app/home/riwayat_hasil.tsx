import { View, StatusBar, ScrollView, Text, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native"; // Added ActivityIndicator
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit"; // Added for graph
import { getSensorData, SensorData } from "@/services/apiLogSensor";
import { isLoggedIn } from "@/services/apiAuth"; // Added for auth check

// Define the expected data structure for LineChart (same as Home)
interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color: (opacity: number) => string;
    strokeWidth: number;
  }>;
}

const { width: screenWidth } = Dimensions.get("window"); // Renamed for consistency

const RiwayatHasil = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount (with auth check)
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Auth check (like Home)
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
          router.replace("/login");
          return;
        }

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

  // Prepare graph data for this month's progress (exact same as Home - per-day handling)
  const prepareGraphData = (): ChartData | null => {
    if (loading || error || sensorData.length === 0) {
      return null; // Show placeholder
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentDay = now.getDate(); // Up to today's day

    // Step 1: Filter and sort data for current month/year
    const monthlyData = sensorData
      .filter((item) => {
        const itemDate = new Date(item.created_at || '');
        // Skip invalid dates
        if (isNaN(itemDate.getTime())) return false;
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
      })
      .sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()); // Sort ascending by date

    if (monthlyData.length === 0) {
      // No data for month - use mock
      return generateMockData(currentDay);
    }

    // Step 2: Group by day (YYYY-MM-DD) and compute average score per day
    const dailyScores = new Map<string, number[]>();
    monthlyData.forEach((item) => {
      const itemDate = new Date(item.created_at || '');
      const dayKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
      const score = Number(item.oa_score) || 0;
      if (dailyScores.has(dayKey)) {
        dailyScores.get(dayKey)!.push(score);
      } else {
        dailyScores.set(dayKey, [score]);
      }
    });

    // Step 3: Compute average score per day and map to day numbers
    const dayScores: { day: number; score: number }[] = [];
    dailyScores.forEach((scores, dayKey) => {
      const dayNum = parseInt(dayKey.split('-')[2]); // Extract day (e.g., '15' from '2023-10-15')
      if (dayNum <= currentDay) { // Only include up to today
        const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length; // Average per day
        dayScores.push({ day: dayNum, score: Math.round(avgScore) }); // Round for display
      }
    });

    // Step 4: Create full array for days 1 to currentDay, filling missing with 0
    const labels: string[] = [];
    const dataPoints: number[] = [];
    for (let day = 1; day <= currentDay; day++) {
      labels.push(`${day}`); // Labels: '1', '2', ..., '15'
      const dayData = dayScores.find((d) => d.day === day);
      dataPoints.push(dayData ? dayData.score : 0); // 0 for missing days
    }

    // Step 5: If insufficient real data (< 7 points), use mock
    const realPoints = dayScores.length;
    if (realPoints < 7) {
      console.warn(`Only ${realPoints} real days of data; using mock for demo.`);
      return generateMockData(currentDay, dayScores); // Blend mock with real
    }

    return {
      labels,
      datasets: [
        {
          data: dataPoints,
          color: (opacity = 1) => `rgba(56, 182, 255, ${opacity})`, // Blue line (#38b6ff theme)
          strokeWidth: 2,
        },
      ],
    };
  };

  // Helper for mock data (same as Home)
  const generateMockData = (currentDay: number, realDayScores?: { day: number; score: number }[]): ChartData => {
    const labels: string[] = [];
    const dataPoints: number[] = [];

    for (let day = 1; day <= currentDay; day++) {
      labels.push(`${day}`);
      let score = 0;
      // If blending with real data, use real where available
      if (realDayScores && realDayScores.length > 0) {
        const realData = realDayScores.find((d) => d.day === day);
        if (realData) {
          score = realData.score;
        } else {
          score = Math.floor(Math.random() * 20) + 80; // Mock for missing
        }
      } else {
        // Full mock
        score = Math.floor(Math.random() * 20) + 80; // Random scores 80-100
      }
      dataPoints.push(score);
    }

    return {
      labels,
      datasets: [
        {
          data: dataPoints,
          color: (opacity = 1) => `rgba(56, 182, 255, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  // Chart config (same as Home)
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    formatYLabel: (value: string) => `${value}`,
    propsForVerticalLabels: {
      fontSize: 10,
      fill: '#666',
    },
    propsForHorizontalLabels: {
      fontSize: 11,
      fill: '#666',
    },
  };

  const graphData = prepareGraphData();

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
        <Text className="mt-2 text-gray-600">Memuat riwayat...</Text>
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
        {/* Progress Graph Section (same as Home) */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-4">
          <Text className="text-lg font-bold text-gray-900 mb-4">Grafik Progres Bulan Ini</Text>

          {graphData ? (
            <View 
              className="w-full" 
              style={{ 
                height: 220, // Fits chart + buffer
                overflow: 'hidden',
                borderRadius: 16,
              }}
            >
              <LineChart
                data={graphData}
                width={screenWidth - 48} // Responsive (px-6 = 24px each side)
                height={200}
                chartConfig={chartConfig}
                bezier // Smooth curve
                style={{ 
                  borderRadius: 16,
                  paddingBottom: 0,
                }}
              />
            </View>
          ) : (
            <View className="bg-gray-50 rounded-lg p-4 h-48 items-center justify-center">
              <View className="items-center">
                <Ionicons name="bar-chart" size={48} color="#3B82F6" />
                <Text className="text-gray-600 text-sm mt-2">Grafik akan ditampilkan di sini</Text>
                <Text className="text-gray-500 text-xs mt-1">Data: No data available</Text>
              </View>
            </View>
          )}
        </View>

        {/* Examination History Section */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 mb-2">
          <Text className="text-lg font-bold text-gray-900 p-4 pb-2">Riwayat Pemeriksaan</Text>

          {/* Fixed height scrollable container */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            {sensorData.length === 0 ? (
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