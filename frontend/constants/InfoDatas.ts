export interface CardData {
  id: number;
  title: string;
  image: string;
  content: string;
  driveId?: string;  
}

export const cardData: CardData[] = [
  {
    id: 1,
    title: "Nyeri Lutut Osteoartritis Berpengaruh terhadap Goyangan Postur ke Lateral",
    image: "https://picsum.photos/600/400?random=1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 2,
    title: "Mengenal Stadium Osteoarth dan Gejala yang Muncul",
    image: "https://picsum.photos/600/400?random=2",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 3,
    title: "Pencegahan dan Pengobatan Osteoarthritis",
    image: "https://picsum.photos/600/400?random=3",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: 4,
    title: "Resiko Tinggi",
    image: "https://picsum.photos/600/400?random=4",  
    content:
      "Resiko tinggi osteoarthritis dapat menyebabkan nyeri lutut yang parah dan goyangan postur ke lateral. Video ini menjelaskan gejala, faktor risiko, dan langkah pencegahan dini untuk pasien dengan kondisi ini.",
    driveId: "16-49n72m0grsz3coXijkSXAOOdpNTiI3",  
  },
  {
    id: 5,
    title: "Resiko Sedang",
    image: "https://picsum.photos/600/400?random=5",  
    content:
      "Pada resiko sedang, gejala osteoarthritis mulai muncul seperti stadium awal dan nyeri ringan. Pelajari cara mengenali stadium OA, monitoring harian, dan pengobatan sederhana melalui video panduan ini.",
    driveId: "1c8g6X_Nsf8GPWOUiKFdQ171ZxE2cxtq_",  
  },
  {
    id: 6,
    title: "Resiko Rendah",
    image: "https://picsum.photos/600/400?random=6", 
    content:
      "Resiko rendah memungkinkan pencegahan dini osteoarthritis melalui gaya hidup sehat. Video ini membahas tips pencegahan, pengobatan alami, dan pemantauan untuk menjaga kesehatan sendi secara optimal.",
    driveId: "1YCYfEdAnwiGhhghlbYfb1u6_hm6TckLT",  
  },
];