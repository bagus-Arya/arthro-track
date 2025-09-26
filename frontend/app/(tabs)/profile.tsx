import React, { useState } from "react";
import { StatusBar, Text, View, TouchableOpacity, TextInput, ScrollView, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    name: "Jane Doe",
    age: 45,
    height: "157",
    weight: "53",
    gender: "Perempuan",
    birthDate: "15/03/1979",
    password: "••••••••",
  });

  const [editData, setEditData] = useState({
    height: userData.height,
    weight: userData.weight,
    gender: userData.gender,
    birthDate: userData.birthDate,
    password: "",
  });

  const handleEditProfile = () => {
    setEditData({
      height: userData.height,
      weight: userData.weight,
      gender: userData.gender,
      birthDate: userData.birthDate,
      password: "",
    });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!editData.height || !editData.weight || !editData.gender || !editData.birthDate) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    setUserData({
      ...userData,
      height: editData.height,
      weight: editData.weight,
      gender: editData.gender,
      birthDate: editData.birthDate,
      age: new Date().getFullYear() - parseInt(editData.birthDate.split("/")[2]),
    });
    setIsEditModalVisible(false);
    Alert.alert("Berhasil", "Profil berhasil diperbarui");
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { text: "Keluar", style: "destructive", onPress: () => console.log("Sign out") },
    ]);
  };

  return (
    <View className="bg-white h-full w-full">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="items-center pt-6">
          <Text className="text-2xl font-bold text-black">Profil</Text>
        </View>

        <ScrollView className="flex-1 px-6">
          {/* Profile Summary */}
          <View className=" mb-8">
            {/* Avatar */}
            <View className="w-24 h-24 bg-orange-100 rounded-full mr-4 items-center justify-center mb-2">
              <Text className="text-3xl">👤</Text>
            </View>

            {/* Name and Age */}
            <Text className="text-md font-semibold text-black mb-1">{userData.name}</Text>
            <Text className="text-gray-600 text-sm mb-4">{userData.age} Tahun</Text>

            {/* Edit Profile Button */}
            <TouchableOpacity onPress={handleEditProfile} className="bg-gray-200 p-4 rounded-lg">
              <Text className="text-black text-md font-medium text-center">Edit Profil</Text>
            </TouchableOpacity>
          </View>

          {/* Information List */}
          <View className="space-y-4  p-3 rounded-lg ">
            {/* Tinggi Badan */}
            <View className="flex-row items-center py-3">
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Tinggi Badan</Text>
              </View>
              <Text className="text-gray-600">{userData.height} cm</Text>
            </View>

            {/* Berat Badan */}
            <View className="flex-row items-center py-3">
              <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="scale" size={16} color="#666" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Berat Badan</Text>
              </View>
              <Text className="text-gray-600">{userData.weight} kg</Text>
            </View>

            {/* Jenis Kelamin */}
            <View className="flex-row items-center py-3">
              <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="person-outline" size={16} color="#666" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Jenis Kelamin</Text>
              </View>
              <Text className="text-gray-600">{userData.gender}</Text>
            </View>

            {/* Tanggal Lahir */}
            <View className="flex-row items-center py-3">
              <View className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center mr-3">
                <Ionicons name="calendar-outline" size={16} color="#666" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">Tanggal Lahir</Text>
              </View>
              <Text className="text-gray-600">{userData.birthDate}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sign Out Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity onPress={handleSignOut} className="bg-red-500 py-4 rounded-lg items-center">
            <Text className="text-white font-bold text-lg">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Profile Modal */}
        <Modal visible={isEditModalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView className="flex-1 bg-gray-50">
            {/* Modal Header */}
            <View className="bg-white border-b border-gray-200 shadow-sm">
              <View className="flex-row items-center justify-center px-6 py-4">
                <Text className="text-xl font-bold text-gray-900">Edit Profil</Text>
              </View>
            </View>

            {/* Form Content */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="px-6 py-6">
                <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <View className="p-6 space-y-6">
                    {/* Tinggi Badan */}
                    <View>
                      <Text className="text-gray-800 font-semibold mb-3 text-base">Tinggi Badan</Text>
                      <View className="relative">
                        <TextInput
                          value={editData.height}
                          onChangeText={(text) => setEditData({ ...editData, height: text })}
                          placeholder="Masukkan tinggi badan"
                          keyboardType="numeric"
                          className="bg-gray-50 border-0 rounded-xl px-4 py-4 text-gray-900 text-base"
                          style={{ fontSize: 16 }}
                        />
                        <View className="absolute right-4 top-4">
                          <Text className="text-gray-500 font-medium">cm</Text>
                        </View>
                      </View>
                    </View>

                    {/* Berat Badan */}
                    <View>
                      <Text className="text-gray-800 font-semibold mb-3 text-base">Berat Badan</Text>
                      <View className="relative">
                        <TextInput
                          value={editData.weight}
                          onChangeText={(text) => setEditData({ ...editData, weight: text })}
                          placeholder="Masukkan berat badan"
                          keyboardType="numeric"
                          className="bg-gray-50 border-0 rounded-xl px-4 py-4 text-gray-900 text-base"
                          style={{ fontSize: 16 }}
                        />
                        <View className="absolute right-4 top-4">
                          <Text className="text-gray-500 font-medium">kg</Text>
                        </View>
                      </View>
                    </View>

                    {/* Jenis Kelamin */}
                    <View>
                      <Text className="text-gray-800 font-semibold mb-3 text-base">Jenis Kelamin</Text>
                      <View className="flex-row space-x-3">
                        <TouchableOpacity
                          onPress={() => setEditData({ ...editData, gender: "Laki-laki" })}
                          className={`flex-1 py-4 rounded-xl border-2 ${editData.gender === "Laki-laki" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                        >
                          <Text className={`text-center font-medium ${editData.gender === "Laki-laki" ? "text-blue-600" : "text-gray-600"}`}>Laki-laki</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setEditData({ ...editData, gender: "Perempuan" })}
                          className={`flex-1 py-4 rounded-xl border-2 ${editData.gender === "Perempuan" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                        >
                          <Text className={`text-center font-medium ${editData.gender === "Perempuan" ? "text-blue-600" : "text-gray-600"}`}>Perempuan</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Tanggal Lahir */}
                    <View>
                      <Text className="text-gray-800 font-semibold mb-3 text-base">Tanggal Lahir</Text>
                      <TextInput
                        value={editData.birthDate}
                        onChangeText={(text) => setEditData({ ...editData, birthDate: text })}
                        placeholder="DD/MM/YYYY"
                        className="bg-gray-50 border-0 rounded-xl px-4 py-4 text-gray-900 text-base"
                        style={{ fontSize: 16 }}
                      />
                    </View>

                    {/* Password */}
                    <View>
                      <Text className="text-gray-800 font-semibold mb-3 text-base">Password Baru</Text>
                      <TextInput
                        value={editData.password}
                        onChangeText={(text) => setEditData({ ...editData, password: text })}
                        placeholder="Masukkan password baru (opsional)"
                        secureTextEntry
                        className="bg-gray-50 border-0 rounded-xl px-4 py-4 text-gray-900 text-base"
                        style={{ fontSize: 16 }}
                      />
                      <Text className="text-gray-500 text-sm mt-2">Kosongkan jika tidak ingin mengubah password</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View className="bg-white border-t border-gray-200 px-6 py-4">
              <View className="flex-row space-x-3">
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)} className="flex-1 py-4 rounded-xl bg-gray-100">
                  <Text className="text-gray-700 font-semibold text-center text-lg">Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveProfile} className="flex-1 py-4 rounded-xl bg-blue-500">
                  <Text className="text-white font-semibold text-center text-lg">Simpan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default Profile;
