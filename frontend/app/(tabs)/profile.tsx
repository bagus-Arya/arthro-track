import React, { useState, useEffect } from "react";
import { StatusBar, Text, View, TouchableOpacity, TextInput, ScrollView, Modal, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getProfile, updateProfile, logout, isLoggedIn } from '@/services/apiAuth'; // Adjust path to your auth service

const Profile = () => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for fetch/update
  const [userData, setUserData] = useState({
    name: "",
    age: 0,
    height: "",
    weight: "",
    gender: "",
    birthDate: "", // Not in API; can be computed or stored separately
    password: "••••••••", // Placeholder; not from API
  });

  const [editData, setEditData] = useState({
    height: "",
    weight: "",
    gender: "",
    birthDate: "",
    password: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
          Alert.alert("Error", "Anda harus login terlebih dahulu");
          return; // Or navigate to login
        }

        const user = await getProfile();
        // Map API data to local state (assume API gender is 'male'/'female')
        const displayGender = user.gender === 'male' ? 'Laki-laki' : 'Perempuan';
        setUserData({
          name: user.name,
          age: user.age || 0,
          height: user.height?.toString() || "",
          weight: user.weight?.toString() || "",
          gender: displayGender,
          birthDate: "", // TODO: If API returns birthDate, set it here; otherwise, compute from age if needed
          password: "••••••••",
        });

        // Initialize editData from fetched data
        setEditData({
          height: user.height?.toString() || "",
          weight: user.weight?.toString() || "",
          gender: displayGender,
          birthDate: "", // Set initial birthDate if available
          password: "",
        });
      } catch (error: any) {
        console.error('Profile fetch error:', error);
        Alert.alert("Error", error.message || "Gagal memuat profil");
        // If unauthorized, already handled in service (auto-logout)
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const handleSaveProfile = async () => {
    if (!editData.height || !editData.weight || !editData.gender || !editData.birthDate) {
      Alert.alert("Error", "Semua field harus diisi");
      return;
    }

    try {
      setLoading(true);

      // Calculate age from birthDate (DD/MM/YYYY)
      const birthYear = parseInt(editData.birthDate.split("/")[2]);
      const calculatedAge = new Date().getFullYear() - birthYear;

      // Map gender to API format
      const apiGender = editData.gender === "Laki-laki" ? "male" : "female";

      // Prepare data for API (password not sent; extend if needed)
      const updateData = {
        height: parseFloat(editData.height),
        weight: parseFloat(editData.weight),
        gender: apiGender,
        age: calculatedAge,
        // password: editData.password ? editData.password : undefined, // If API supports
      };

      const updatedUser  = await updateProfile(updateData);

      // Update local state with API response
      const displayGender = updatedUser .gender === 'male' ? 'Laki-laki' : 'Perempuan';
      setUserData({
        ...userData,
        name: updatedUser .name || userData.name,
        age: updatedUser .age || calculatedAge,
        height: updatedUser .height?.toString() || editData.height,
        weight: updatedUser .weight?.toString() || editData.weight,
        gender: displayGender,
        birthDate: editData.birthDate,
      });

      setIsEditModalVisible(false);
      Alert.alert("Berhasil", "Profil berhasil diperbarui");
    } catch (error: any) {
      console.error('Profile update error:', error);
      Alert.alert("Error", error.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            Alert.alert("Berhasil", "Anda telah keluar");
            // TODO: Navigate to login screen, e.g., navigation.navigate('Login');
            console.log("User  logged out");
          } catch (error: any) {
            console.error('Logout error:', error);
            Alert.alert("Error", "Gagal logout");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Memuat profil...</Text>
      </View>
    );
  }

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
          <View className="mb-8">
            {/* Avatar */}
            <View className="w-24 h-24 bg-orange-100 rounded-full mr-4 items-center justify-center mb-2">
              <Text className="text-3xl">👤</Text>
            </View>

            {/* Name and Age */}
            <Text className="text-md font-semibold text-black mb-1">{userData.name}</Text>
            <Text className="text-gray-600 text-sm mb-4">{userData.age} Tahun</Text>

            {/* Edit Profile Button */}
            <TouchableOpacity onPress={handleEditProfile} className="bg-gray-200 p-4 rounded-lg" disabled={loading}>
              <Text className="text-black text-md font-medium text-center">Edit Profil</Text>
            </TouchableOpacity>
          </View>

          {/* Information List */}
          <View className="space-y-4 p-3 rounded-lg">
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
              <Text className="text-gray-600">{userData.birthDate || 'Tidak tersedia'}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sign Out Button */}
        <View className="px-6 pb-6">
          <TouchableOpacity onPress={handleSignOut} className="bg-red-500 py-4 rounded-lg items-center" disabled={loading}>
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
                          editable={!loading}
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
                          editable={!loading}
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
                          disabled={loading}
                        >
                          <Text className={`text-center font-medium ${editData.gender === "Laki-laki" ? "text-blue-600" : "text-gray-600"}`}>Laki-laki</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setEditData({ ...editData, gender: "Perempuan" })}
                          className={`flex-1 py-4 rounded-xl border-2 ${editData.gender === "Perempuan" ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
                          disabled={loading}
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
                        editable={!loading}
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
                        editable={!loading}
                      />
                      <Text className="text-gray-500 text-sm mt-2">Kosongkan jika tidak ingin mengubah password</Text>
                      {editData.password && <Text className="text-yellow-600 text-sm mt-1">Password akan diupdate secara lokal (API belum mendukung).</Text>}
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View className="bg-white border-t border-gray-200 px-6 py-4">
              <View className="flex-row space-x-3">
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)} className="flex-1 py-4 rounded-xl bg-gray-100" disabled={loading}>
                  <Text className="text-gray-700 font-semibold text-center text-lg">Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveProfile} className="flex-1 py-4 rounded-xl bg-blue-500" disabled={loading}>
                  <Text className="text-white font-semibold text-center text-lg">
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : "Simpan"}
                  </Text>
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