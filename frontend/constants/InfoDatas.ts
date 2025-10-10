export interface CardData {
  id: number;
  title: string;
  image: string;
  content: string;
}

export const cardData: CardData[] = [
  {
    id: 1,
    title: "Nyeri Lutut Osteoartritis Berpengaruh terhadap Goyangan Postur ke Lateral",
    image: "https://picsum.photos/600/400?random=1",
    content:
      "Nyeri lutut akibat osteoarthritis dapat menyebabkan goyangan postur tubuh ke samping saat berjalan. Hal ini terjadi karena sendi lutut yang rusak mengganggu keseimbangan. Pencegahan dini melalui latihan penguatan otot dapat membantu mengurangi dampak ini.",
  },
  {
    id: 2,
    title: "Mengenal Stadium Osteoarth dan Gejala yang Muncul",
    image: "https://picsum.photos/600/400?random=2",
    content:
      "Osteoarthritis memiliki stadium awal hingga lanjut, dengan gejala seperti nyeri ringan hingga parah, kekakuan pagi hari, dan pembengkakan sendi. Pada stadium awal, gejala masih bisa dikelola dengan obat dan fisioterapi. Pemantauan rutin penting untuk mencegah kemajuan.",
  },
  {
    id: 3,
    title: "Pencegahan dan Pengobatan Osteoarthritis",
    image: "https://picsum.photos/600/400?random=3",
    content:
      "Pencegahan OA meliputi menjaga berat badan ideal, olahraga ringan seperti berenang, dan menghindari cedera sendi. Pengobatan mencakup obat antiinflamasi, terapi fisik, dan pada kasus berat, operasi penggantian sendi. Konsultasi dokter dini dapat memperlambat perkembangan penyakit.",
  },
  {
    id: 4,
    title: "Gejala Osteoarthritis",
    image: "https://picsum.photos/600/400?random=4?blur=1", // Blurred placeholder for symptom diagram; replace with real image
    content:
      "Gejala osteoarthritis (OA) yang umum meliputi:\n" +
      "• Nyeri lutut saat berjalan, naik-turun tangga, atau berdiri lama.\n" +
      "• Kaku setelah duduk lama atau bangun tidur, biasanya hilang setelah bergerak sebentar.\n" +
      "• Bengkak lutut, kadang terasa hangat karena peradangan.\n" +
      "• Terdapat bunyi kretek atau berderit saat lutut digerakkan.\n" +
      "• Lutut terasa lemah dan mudah goyah, sehingga sulit menjaga keseimbangan.\n" +
      "• Sulit meluruskan atau menekuk lutut sepenuhnya.\n" +
      "• Perubahan bentuk lutut akibat kerusakan tulang rawan.\n" +
      "• Aktivitas sehari-hari jadi terbata-bata, misalnya sulit berjalan jauh atau mengangkat barang.\n\n" +
      "Jika mengalami gejala ini, segera konsultasikan dengan dokter untuk diagnosis dini.",
  },
  {
    id: 5,
    title: "Tingkat Resiko",
    image: "https://picsum.photos/600/400?random=5?blur=1", // Blurred placeholder for risk chart; replace with real image
    content:
      "Pembagian risiko pada aplikasi ini mengikuti Kellgren-Lawrence grading scale, yang menilai tingkat kerusakan sendi berdasarkan gambar X-ray:\n\n" +
      "• Tingkat 1 (Risiko Rendah): Kerusakan ringan, gejala minimal, pencegahan dini efektif.\n" +
      "• Tingkat 2 (Risiko Sedang): Kerusakan sedang, nyeri mulai terasa, butuh monitoring dan terapi fisik.\n" +
      "• Tingkat 3 (Risiko Tinggi): Kerusakan signifikan, nyeri parah, pengobatan medis diperlukan.\n" +
      "• Tingkat 4: Tidak ditampilkan karena kondisi sudah parah (OA lanjut), memerlukan intervensi bedah.\n\n" +
      "Skor OA di aplikasi membantu mengklasifikasikan risiko Anda untuk panduan perawatan yang tepat.",
  },
];

// export const cardData: CardData[] = [
//   {
//     id: 1,
//     title: "Nyeri Lutut Osteoartritis Berpengaruh terhadap Goyangan Postur ke Lateral",
//     image: "https://picsum.photos/600/400?random=1",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },
//   {
//     id: 2,
//     title: "Mengenal Stadium Osteoarth dan Gejala yang Muncul",
//     image: "https://picsum.photos/600/400?random=2",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },
//   {
//     id: 3,
//     title: "Pencegahan dan Pengobatan Osteoarthritis",
//     image: "https://picsum.photos/600/400?random=3",
//     content:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
//   },
  // {
  //   id: 4,
  //   title: "Resiko Tinggi",
  //   image: "https://picsum.photos/600/400?random=4",  
  //   content:
  //     "Resiko tinggi osteoarthritis dapat menyebabkan nyeri lutut yang parah dan goyangan postur ke lateral. Video ini menjelaskan gejala, faktor risiko, dan langkah pencegahan dini untuk pasien dengan kondisi ini.",
  //   driveId: "16-49n72m0grsz3coXijkSXAOOdpNTiI3",  
  // },
  // {
  //   id: 5,
  //   title: "Resiko Sedang",
  //   image: "https://picsum.photos/600/400?random=5",  
  //   content:
  //     "Pada resiko sedang, gejala osteoarthritis mulai muncul seperti stadium awal dan nyeri ringan. Pelajari cara mengenali stadium OA, monitoring harian, dan pengobatan sederhana melalui video panduan ini.",
  //   driveId: "1c8g6X_Nsf8GPWOUiKFdQ171ZxE2cxtq_",  
  // },
  // {
  //   id: 6,
  //   title: "Resiko Rendah",
  //   image: "https://picsum.photos/600/400?random=6", 
  //   content:
  //     "Resiko rendah memungkinkan pencegahan dini osteoarthritis melalui gaya hidup sehat. Video ini membahas tips pencegahan, pengobatan alami, dan pemantauan untuk menjaga kesehatan sendi secara optimal.",
  //   driveId: "1YCYfEdAnwiGhhghlbYfb1u6_hm6TckLT",  
  // },
// ];