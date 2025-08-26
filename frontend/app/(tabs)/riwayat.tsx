import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { VictoryChart, VictoryLine, VictoryScatter, VictoryAxis } from "victory-native";
import { Card } from "react-native-paper";

interface RiwayatItem {
  id: string;
  tanggal: string;
  skor: number;
  risiko: string;
}

const dataRiwayat: RiwayatItem[] = [
  { id: "1", tanggal: "25 April 2025", skor: 120, risiko: "Tinggi" },
  { id: "2", tanggal: "20 April 2025", skor: 120, risiko: "Tinggi" },
  { id: "3", tanggal: "15 April 2025", skor: 120, risiko: "Tinggi" },
  { id: "4", tanggal: "10 April 2025", skor: 120, risiko: "Tinggi" },
];

const dataGrafik = [
  { x: "1 Apr", y: 60 },
  { x: "5 Apr", y: 65 },
  { x: "15 Apr", y: 68 },
  { x: "20 Apr", y: 70 },
  { x: "25 Apr", y: 76 },
];

const RiwayatHasil = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Riwayat Hasil</Text>

      {/* Grafik */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Grafik Progres Bulan Ini</Text>
        <VictoryChart domain={{ y: [60, 80] }}>
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 12, padding: 5 },
            }}
          />
          <VictoryLine
            data={dataGrafik}
            style={{
              data: { stroke: "#3b82f6", strokeWidth: 2 },
            }}
          />
          <VictoryScatter
            data={dataGrafik}
            size={4}
            style={{ data: { fill: "#3b82f6" } }}
          />
        </VictoryChart>
      </View>

      <Text style={styles.sectionTitle}>Riwayat Pemeriksaan</Text>
      <FlatList
        data={dataRiwayat}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.date}>{item.tanggal}</Text>
              <Text style={styles.detail}>Skor: {item.skor}</Text>
              <Text style={styles.detail}>Risiko: {item.risiko}</Text>
            </View>
          </Card>
        )}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Lihat Semua Riwayat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default RiwayatHasil;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
  },
  card: {
    marginBottom: 10,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "column",
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
  },
  detail: {
    fontSize: 14,
    color: "#374151",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
