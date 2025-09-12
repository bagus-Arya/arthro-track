import { View, StatusBar, ScrollView, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { cardData, CardData } from "@/constants/InfoDatas";
import { router } from "expo-router";
const { width } = Dimensions.get("window");

// Card data - replace placeholder images with real ones later

const Info = () => {
  const [selectedCard, setSelectedCard] = useState<CardData>(cardData[0]);

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
        <Text className="text-lg font-bold text-black">Info OA</Text>
        <View className="w-10" />
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 pt-2 bg-white">
        {/* Horizontal Scrollable Cards */}
        <View className="">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4">
            {cardData.map((card: CardData) => (
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
                  // Handle card press - navigate to detail page
                  console.log("Card pressed:", card.title);
                  setSelectedCard(card);
                }}
              >
                <Image source={{ uri: card.image }} className="w-full h-28 rounded-t-lg" resizeMode="cover" />
                <View className="p-3">
                  <Text className="text-xs font-semibold text-gray-900 leading-4">{card.title.length > 25 ? card.title.substring(0, 22) + "..." : card.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View className="">
          <Text className="text-lg font-bold text-black">{selectedCard.title}</Text>
          <Text className="text-sm text-gray-700">{selectedCard.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Info;
