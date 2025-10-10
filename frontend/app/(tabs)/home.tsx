import React, { useState, useEffect } from "react";
import { Image, StatusBar, Text, TouchableOpacity, View, Dimensions, ActivityIndicator } from "react-native"; // Added ActivityIndicator
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import { getSensorData, SensorData } from "@/services/apiLogSensor";
import { isLoggedIn, getProfile } from "@/services/apiAuth"; // Import auth services like in Profile

// Define the expected data structure for LineChart
interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color: (opacity: number) => string;
    strokeWidth: number;
  }>;
}

const screenWidth = Dimensions.get("window").width;

const Home = () => {
  const [userName, setUserName] = useState(""); // User name from profile
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true); // Unified loading for auth/profile/sensor
  const [error, setError] = useState<string | null>(null);

  // Extracted initialization function for retry
  const initializeHome = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Check if logged in (like in Profile)
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        // Redirect to login if not authenticated
        router.replace("/login");
        return;
      }

      // Step 2: Fetch profile for user name (consistent with Profile)
      const userProfile = await getProfile();
      setUserName(userProfile.name || "User"); // Fallback if no name

      // Step 3: Fetch sensor data
      const data = await getSensorData();
      setSensorData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Home initialization error:", errorMessage);

      // If unauthorized (e.g., token expired), redirect to login
      if (errorMessage.includes("unauthorized") || errorMessage.includes("401")) {
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch everything on mount (auth check + profile + sensor data)
  useEffect(() => {
    initializeHome();
  }, []); // Run once on mount

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

// Prepare graph data for this month's progress (Line Chart) - Updated for per-day handling
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

  // Step 4: Create full array for days 1 to currentDay, filling missing with 0 (or null for gaps)
  const labels: string[] = [];
  const dataPoints: number[] = [];
  for (let day = 1; day <= currentDay; day++) {
    labels.push(`${day}`); // Labels: '1', '2', ..., '15'
    const dayData = dayScores.find((d) => d.day === day);
    dataPoints.push(dayData ? dayData.score : 0); // 0 for missing days (line will flatline or gap)
  }

  // Step 5: If insufficient real data (e.g., < 7 points), blend with mock or use full mock
  const realPoints = dayScores.length;
  if (realPoints < 7) {
    console.warn(`Only ${realPoints} real days of data; using mock for demo.`);
    return generateMockData(currentDay, dayScores); // Optional: Blend mock with real data
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

// Helper function to generate mock data (up to currentDay, optionally blending with real)
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

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    // New: Reduce margins and font for better fit
    decimalPlaces: 0, // No decimals for scores (e.g., 90 instead of 90.0)
    formatYLabel: (value: string) => `${value}`, // Simple label formatting
    // Optional: Custom props for tighter layout (if library supports)
    propsForVerticalLabels: {
      fontSize: 10, // Smaller y-axis labels
      fill: '#666',
    },
    propsForHorizontalLabels: {
      fontSize: 11, // Slightly smaller x-axis (day) labels
      fill: '#666',
    },
  };
  
  const graphData = prepareGraphData();

  // Show loading screen
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Memuat data...</Text>
      </View>
    );
  }

  // Show error screen (with retry option)
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-lg text-red-500 mb-4">Error: {error}</Text>
        <TouchableOpacity
          onPress={initializeHome} // Re-run initialization on retry
          className="p-3 bg-blue-500 rounded-lg"
        >
          <Text className="text-white font-semibold">Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              <Text className="text-xl font-bold text-black font-mulish_regular">{userName}</Text>
            </View>
          </View>

          <View className="flex flex-col rounded-lg border border-gray-300">
            <View className="flex flex-col justify-between items-center w-full">
              <View className="flex flex-row">
                <View className="flex flex-1 flex-col justify-center items-center border-b border-gray-400 p-3">
                  <Text className="text-sm text-black mb-1 font-mulish_bold">Skor Terakhir</Text>
                  <Text className="text-xl text-black font-mulish_bold">{score}</Text>
                </View>
                <View className="w-[1px] h-full bg-gray-400"></View>
                <View className="flex flex-1 flex-col justify-center items-center border-b border-gray-400 p-3">
                  <Text className="text-sm text-black mb-1 font-mulish_bold">Resiko terakhir</Text>
                  <View className="flex flex-row items-center justify-center">
                    <View className={`w-5 h-5 ${getRiskColor(riskCategory)} rounded-full mr-2`}></View>
                    <Text className="text-md text-black font-mulish_bold">{riskCategory}</Text>
                  </View>
                </View>
              </View>
              <View className="flex flex-col p-3 w-full">
                <Text className="text-sm text-black mb-3 font-mulish_bold text-left">Grafik Progress Bulan Ini</Text>
                {graphData ? (
                  <View 
                    className="w-full" // Remove fixed h-40; let it flex
                    style={{ 
                      height: 220, // Slightly taller than chart (200px) for padding/margin buffer
                      overflow: 'hidden', // Prevent overflow
                      borderRadius: 16, // Match chart style
                    }}
                  >
                    <LineChart
                      data={graphData}
                      width={screenWidth - 48} // Responsive, accounts for px-6 (24px each side)
                      height={200} // Keep as-is, but container now fits it
                      chartConfig={chartConfig}
                      bezier // Smooth curve
                      style={{ 
                        borderRadius: 16,
                        paddingBottom: 0, // Reduce bottom padding to fit better
                      }}
                    />
                  </View>
                ) : (
                  <View 
                    className="w-full bg-gray-200 rounded-lg flex items-center justify-center"
                    style={{ height: 220 }} // Match chart container height for consistency
                  >
                    <Text className="text-gray-500 font-mulish_regular">[No data available for this month]</Text>
                  </View>
                )}
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