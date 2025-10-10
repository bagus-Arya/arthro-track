import { View, StatusBar, ScrollView, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { useFocusEffect } from "@react-navigation/native";
import { cardData, CardData } from "@/constants/InfoDatas";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const Info = () => {
  const [selectedCard, setSelectedCard] = useState<CardData>(cardData[0]);

  useFocusEffect(
    useCallback(() => {
      const applyNavBar = async () => {
        await NavigationBar.setButtonStyleAsync("dark"); 
      };
      applyNavBar();
    }, [])
  );

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
          <View className="space-y-1"> {/* Container for line spacing */}
            {selectedCard.content.split('\n').map((line, index) => (
              <Text 
                key={index} 
                className="text-sm text-gray-700 leading-6" 
                style={{ marginBottom: 4 }} // Extra spacing between lines
              >
                {line.trim()} {/* Trim whitespace for clean bullets */}
              </Text>
            ))}
          </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Info;