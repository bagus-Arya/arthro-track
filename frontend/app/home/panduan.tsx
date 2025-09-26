import { View, StatusBar, ScrollView, Text, TouchableOpacity, Dimensions, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

// Video data
const videoData = [
  {
    id: 1,
    title: "Panduan Pemakaian Alat",
    youtubeId: "oaTOHmuN2M0", // Replace with your YouTube video ID
    description: "Cara menggunakan alat pengukuran osteoarthritis",
  },
  {
    id: 2,
    title: "Panduan Aplikasi",
    youtubeId: "oaTOHmuN2M0", // Replace with your YouTube video ID
    description: "Cara menggunakan aplikasi ArthroTrack",
  },
];

const Panduan = () => {
  const [selectedVideo, setSelectedVideo] = useState(videoData[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
        <Text className="text-lg font-bold text-black">Panduan</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-6 bg-white">
        {videoData.map((video) => (
          <View key={video.id} className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-4">{video.title}</Text>

            {/* Video Player */}
            <TouchableOpacity
              onPress={() => {
                setSelectedVideo(video);
                setIsFullscreen(true);
              }}
              className="bg-gray-200 rounded-lg overflow-hidden"
              style={{ height: 200 }}
            >
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&controls=1&showinfo=0&rel=0`,
                }}
                style={{ flex: 1 }}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
              />

              {/* Play Button Overlay */}
              <View className="absolute inset-0 justify-center items-center  bg-opacity-20">
                <View className=" bg-opacity-60 rounded-full p-4">
                  <Ionicons name="play" size={32} color="white" />
                </View>
              </View>
            </TouchableOpacity>

            <Text className="text-sm text-gray-600 mt-2">{video.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Fullscreen Modal */}
      <Modal visible={isFullscreen} animationType="slide" supportedOrientations={["portrait", "landscape"]} onRequestClose={() => setIsFullscreen(false)}>
        <View className="flex-1 bg-black">
          <SafeAreaView className="flex-1">
            {/* Fullscreen Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-black">
              <TouchableOpacity onPress={() => setIsFullscreen(false)} className="p-2">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text className="text-lg font-bold text-white">{selectedVideo.title}</Text>
              <View className="w-10" />
            </View>

            {/* Fullscreen Video */}
            <View className="flex-1">
              <WebView
                source={{
                  uri: `https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&controls=1&showinfo=0&rel=0&fs=1&modestbranding=1`,
                }}
                style={{ flex: 1 }}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                scalesPageToFit={true}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Panduan;
