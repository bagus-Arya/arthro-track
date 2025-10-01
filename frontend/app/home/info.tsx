import { View, StatusBar, ScrollView, Text, TouchableOpacity, Image, Dimensions, Modal } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { WebView } from "react-native-webview";  
import { cardData, CardData } from "@/constants/InfoDatas";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Info = () => {
  const [selectedCard, setSelectedCard] = useState<CardData>(cardData[0]);
  const [selectedVideo, setSelectedVideo] = useState<CardData | null>(null);  
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);  
  const textCards = cardData.filter((card) => !card.driveId);  
  const videoCards = cardData.filter((card) => card.driveId);  

  useFocusEffect(
    useCallback(() => {
      const applyNavBar = async () => {
        await NavigationBar.setButtonStyleAsync("dark"); 
      };
      applyNavBar();
    }, [])
  );

  const onWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("WebView error in Info video:", nativeEvent);
  };

  const handleVideoPress = (video: CardData) => {
    setSelectedVideo(video);
    setIsVideoModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Info OA</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-2 bg-white">
        <View className="">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4">
            {textCards.map((card: CardData) => (
              <TouchableOpacity
                key={card.id}
                className="mr-3 bg-gray-100 rounded-lg shadow-sm"
                style={{
                  width: width * 0.65,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                  elevation: 2,
                }}
                onPress={() => {
                  console.log("Text card pressed:", card.title);
                  setSelectedCard(card);
                }}
              >
                <Image source={{ uri: card.image }} className="w-full h-28 rounded-t-lg" resizeMode="cover" />
                <View className="p-3">
                  <Text className="text-xs font-semibold text-gray-900 leading-4">
                    {card.title.length > 25 ? card.title.substring(0, 22) + "..." : card.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="mt-4 mb-6">  
          <Text className="text-lg font-bold text-black mb-3">{selectedCard.title}</Text>
          <Text className="text-sm text-gray-700 leading-5">{selectedCard.content}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-black mb-4">Apa itu Osteoarthritis?</Text>

          <View className="flex-row justify-between mb-4">  
            <View className="flex-1 mr-2 bg-gray-100 rounded-lg overflow-hidden shadow-sm" style={{ height: 180 }}>  
              <Image
                source={require('../../assets/images/lutut.png')}
                className="w-full h-full"
                resizeMode="cover"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                }}
              />
            </View>
            <View className="flex-1 ml-2 bg-gray-100 rounded-lg overflow-hidden shadow-sm" style={{ height: 180 }}>  
              <Image
                source={require('../../assets/images/sendi.png')}
                className="w-full h-full"
                resizeMode="cover"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.08,
                  shadowRadius: 2,
                }}
              />
            </View>
          </View>

          <Text className="text-sm text-gray-700 leading-5">
            Osteoarthritis (OA) adalah kondisi di mana tulang rawan di dalam sendi menipis, 
            menyebabkan tulang saling bergesekan dan mengakibatkan rasa sakit serta kekakuan. 
            Kondisi ini umumnya terjadi seiring bertambahnya usia, 
            meskipun faktor seperti obesitas atau cedera sendi juga dapat mempercepat prosesnya. 
            OA sering menyerang sendi besar yang menopang berat badan, seperti lutut, 
            karena sering digunakan dalam aktivitas sehari-hari seperti berjalan, berdiri, dan duduk. 
            Jika tidak ditangani dengan baik, OA lutut dapat mengganggu aktivitas sehari-hari dan menurunkan kualitas hidup, 
            sehingga sangat penting untuk segera mengenali tanda-tanda dan memperoleh perawatan yang tepat.
          </Text>
        </View>

        {videoCards.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-black mb-4">Video Latihan OA</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2">
              {videoCards.map((video: CardData) => (
                <TouchableOpacity
                  key={video.id}
                  className="mr-3 bg-gray-100 rounded-lg shadow-sm overflow-hidden"
                  style={{
                    width: 150,  
                    height: 120,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.08,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                  onPress={() => handleVideoPress(video)}
                >
                  <Image source={{ uri: video.image }} className="w-full h-full" resizeMode="cover" />
                  
                  <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-30">
                    <View className="bg-black bg-opacity-70 rounded-full p-2">
                      <Ionicons name="play" size={24} color="white" />
                    </View>
                  </View>

                  <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <Text className="text-xs text-white font-semibold" numberOfLines={1}>
                      {video.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

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
                  mediaPlaybackRequiresUser Action={false}
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

export default Info;