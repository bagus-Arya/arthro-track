import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HasilScreen = () => {
  const tanggal = "28/04/2025";
  const skorTerakhir = 90;
  const risikoTerakhir = "Sedang";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Hasil</Text>
      
      <View style={styles.resultContainer}>
        <Text style={styles.date}>{tanggal}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.label}>Skor Terakhir</Text>
          <Text style={styles.score}>{skorTerakhir}</Text>
        </View>
        <View style={styles.riskContainer}>
          <Text style={styles.label}>Risiko Terakhir</Text>
          <Text style={styles.risk}>{risikoTerakhir}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsText}>Detail Pemeriksaan</Text>
        <AntDesign name="down" size={16} color="black" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.recommendationButton}>
        <Text style={styles.detailsText}>Rekomendasi Latihan</Text>
        <AntDesign name="down" size={16} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  resultContainer: {
    marginBottom: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  scoreContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  riskContainer: {
    marginBottom: 10,
  },
  risk: {
    fontSize: 18,
    color: 'orange',
  },
  detailsButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendationButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  detailsText: {
    fontSize: 16,
    color: '#000',
  },
});

export default HasilScreen;
