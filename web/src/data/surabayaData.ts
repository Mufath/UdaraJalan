import { RoadSegment, NavigationComparison, H3Mission } from '../types';
import { calculateAirQualityLevel } from './mockData';

export const surabayaH3Mission: H3Mission = {
  id: "ID-H3-SBY-771",
  zoneName: "Koridor Raya Darmo - Taman Bungkul",
  multiplier: 2.0,
  unmeasuredMinutes: 42,
  rewardPerKm: 240,
  radiusMeters: 550
};

// H3 Hexagon coordinates centered on Taman Bungkul (Jl. Raya Darmo, Surabaya Selatan)
export const surabayaH3HexagonCoordinates: [number, number][] = [
  [-7.2885, 112.7390],
  [-7.2905, 112.7428],
  [-7.2940, 112.7428],
  [-7.2960, 112.7390],
  [-7.2940, 112.7352],
  [-7.2905, 112.7352]
];

// 12 Ruas Jalan Representatif Mencakup Seluruh 5 Wilayah Kota Surabaya
export const surabayaRoadSegments: RoadSegment[] = [
  // 1. SURABAYA PUSAT
  {
    id: "SEG-SBY-01",
    name: "Jl. Tunjungan (Heritage & Bisnis)",
    area: "Surabaya Pusat",
    pm25: 21.4,
    category: calculateAirQualityLevel(21.4),
    temperature: 31.0,
    humidity: 68,
    confidenceScore: "Tinggi",
    uniquePassesCount: 9,
    ageMinutes: 2,
    varianceSigma: 2.1,
    isIndicativeData: true,
    coordinates: [
      [-7.2555, 112.7386],
      [-7.2570, 112.7390],
      [-7.2588, 112.7395],
      [-7.2605, 112.7401],
      [-7.2625, 112.7405]
    ],
    center: [-7.2590, 112.7396],
    description: "Kawasan pedestrian bersejarah dan komersial jantung Kota Pahlawan."
  },
  {
    id: "SEG-SBY-02",
    name: "Jl. Basuki Rahmat (Koridor TP Mall)",
    area: "Surabaya Pusat",
    pm25: 27.5,
    category: calculateAirQualityLevel(27.5),
    temperature: 32.2,
    humidity: 65,
    confidenceScore: "Tinggi",
    uniquePassesCount: 12,
    ageMinutes: 3,
    varianceSigma: 2.8,
    isIndicativeData: true,
    coordinates: [
      [-7.2635, 112.7408],
      [-7.2670, 112.7412],
      [-7.2710, 112.7410],
      [-7.2750, 112.7402],
      [-7.2785, 112.7392],
      [-7.2820, 112.7383]
    ],
    center: [-7.2725, 112.7405],
    description: "Arteri perbankan dan pusat perbelanjaan Tunjungan Plaza."
  },
  {
    id: "SEG-SBY-03",
    name: "Jl. Pemuda (Grahadi - Balai Kota)",
    area: "Surabaya Pusat",
    pm25: 18.2,
    category: calculateAirQualityLevel(18.2),
    temperature: 30.8,
    humidity: 70,
    confidenceScore: "Tinggi",
    uniquePassesCount: 8,
    ageMinutes: 5,
    varianceSigma: 1.9,
    isIndicativeData: true,
    coordinates: [
      [-7.2630, 112.7415],
      [-7.2632, 112.7455],
      [-7.2636, 112.7495],
      [-7.2640, 112.7535],
      [-7.2645, 112.7580]
    ],
    center: [-7.2636, 112.7495],
    description: "Pusat pemerintahan kota, Gedung Grahadi, dan Delta Plaza."
  },

  // 2. SURABAYA SELATAN
  {
    id: "SEG-SBY-04",
    name: "Jl. Raya Darmo (Taman Bungkul)",
    area: "Surabaya Selatan",
    pm25: 12.8,
    category: calculateAirQualityLevel(12.8),
    temperature: 29.2,
    humidity: 74,
    confidenceScore: "Tinggi",
    uniquePassesCount: 14,
    ageMinutes: 1,
    varianceSigma: 1.5,
    isIndicativeData: true,
    coordinates: [
      [-7.2825, 112.7382],
      [-7.2860, 112.7386],
      [-7.2895, 112.7389],
      [-7.2925, 112.7391],
      [-7.2960, 112.7393],
      [-7.2995, 112.7394],
      [-7.3025, 112.7393]
    ],
    center: [-7.2925, 112.7391],
    description: "Koridor hijau ikonik dengan pepohonan rindang dan kawasan ramah pejalan kaki Taman Bungkul."
  },
  {
    id: "SEG-SBY-05",
    name: "Jl. Ahmad Yani (Bundaran Waru - Wonokromo)",
    area: "Surabaya Selatan",
    pm25: 47.8,
    category: calculateAirQualityLevel(47.8),
    temperature: 34.5,
    humidity: 58,
    confidenceScore: "Tinggi",
    uniquePassesCount: 16,
    ageMinutes: 1,
    varianceSigma: 4.2,
    isIndicativeData: true,
    coordinates: [
      [-7.3035, 112.7390],
      [-7.3110, 112.7370],
      [-7.3185, 112.7352],
      [-7.3260, 112.7340],
      [-7.3340, 112.7335],
      [-7.3425, 112.7330]
    ],
    center: [-7.3230, 112.7345],
    description: "Gerbang arteri utama arus komuter Surabaya - Sidoarjo, volume knalpot sangat padat."
  },
  {
    id: "SEG-SBY-06",
    name: "Jl. Diponegoro (Wonokromo Axis)",
    area: "Surabaya Selatan",
    pm25: 34.2,
    category: calculateAirQualityLevel(34.2),
    temperature: 32.8,
    humidity: 63,
    confidenceScore: "Sedang",
    uniquePassesCount: 7,
    ageMinutes: 8,
    varianceSigma: 3.1,
    isIndicativeData: true,
    coordinates: [
      [-7.2830, 112.7340],
      [-7.2890, 112.7345],
      [-7.2950, 112.7350],
      [-7.3010, 112.7355]
    ],
    center: [-7.2920, 112.7348],
    description: "Jalur arteri penghubung Surabaya barat daya menuju pusat kota."
  },

  // 3. SURABAYA TIMUR
  {
    id: "SEG-SBY-07",
    name: "Jl. Ir. H. Soekarno / MERR Timur",
    area: "Surabaya Timur",
    pm25: 32.1,
    category: calculateAirQualityLevel(32.1),
    temperature: 33.0,
    humidity: 64,
    confidenceScore: "Tinggi",
    uniquePassesCount: 11,
    ageMinutes: 4,
    varianceSigma: 3.0,
    isIndicativeData: true,
    coordinates: [
      [-7.2720, 112.7825],
      [-7.2820, 112.7830],
      [-7.2920, 112.7835],
      [-7.3020, 112.7840],
      [-7.3120, 112.7845],
      [-7.3240, 112.7850]
    ],
    center: [-7.2980, 112.7838],
    description: "Jalur lingkar timur (Middle East Ring Road) penghubung Rungkut, Galaxy Mall, hingga Kenjeran."
  },
  {
    id: "SEG-SBY-08",
    name: "Jl. Raya Manyar - Kertajaya (ITS / Unair)",
    area: "Surabaya Timur",
    pm25: 17.5,
    category: calculateAirQualityLevel(17.5),
    temperature: 30.6,
    humidity: 71,
    confidenceScore: "Tinggi",
    uniquePassesCount: 9,
    ageMinutes: 6,
    varianceSigma: 2.2,
    isIndicativeData: true,
    coordinates: [
      [-7.2780, 112.7510],
      [-7.2782, 112.7590],
      [-7.2785, 112.7670],
      [-7.2790, 112.7750],
      [-7.2795, 112.7830]
    ],
    center: [-7.2785, 112.7670],
    description: "Kawasan pendidikan kampus perguruan tinggi dan pusat kuliner timur."
  },

  // 4. SURABAYA BARAT
  {
    id: "SEG-SBY-09",
    name: "Jl. Mayjen Sungkono (Kawasan Bisnis Barat)",
    area: "Surabaya Barat",
    pm25: 38.4,
    category: calculateAirQualityLevel(38.4),
    temperature: 33.7,
    humidity: 61,
    confidenceScore: "Tinggi",
    uniquePassesCount: 10,
    ageMinutes: 3,
    varianceSigma: 3.5,
    isIndicativeData: true,
    coordinates: [
      [-7.2885, 112.7290],
      [-7.2880, 112.7210],
      [-7.2875, 112.7130],
      [-7.2870, 112.7050],
      [-7.2865, 112.6975]
    ],
    center: [-7.2875, 112.7130],
    description: "Akses gerbang barat Surabaya, pusat perhotelan, perkantoran, dan pintu tol satelit."
  },
  {
    id: "SEG-SBY-10",
    name: "Jl. HR Muhammad - Pakuwon (Graha Family)",
    area: "Surabaya Barat",
    pm25: 23.8,
    category: calculateAirQualityLevel(23.8),
    temperature: 31.6,
    humidity: 66,
    confidenceScore: "Tinggi",
    uniquePassesCount: 8,
    ageMinutes: 4,
    varianceSigma: 2.4,
    isIndicativeData: true,
    coordinates: [
      [-7.2865, 112.6975],
      [-7.2890, 112.6880],
      [-7.2920, 112.6800],
      [-7.2965, 112.6770],
      [-7.3030, 112.6760]
    ],
    center: [-7.2940, 112.6800],
    description: "Kawasan modern Surabaya Barat, pusat residensial Graha Family dan Pakuwon Mall."
  },

  // 5. SURABAYA UTARA
  {
    id: "SEG-SBY-11",
    name: "Jl. Perak Timur (Pelabuhan Tanjung Perak)",
    area: "Surabaya Utara",
    pm25: 58.2,
    category: calculateAirQualityLevel(58.2),
    temperature: 35.6,
    humidity: 54,
    confidenceScore: "Tinggi",
    uniquePassesCount: 13,
    ageMinutes: 2,
    varianceSigma: 4.8,
    isIndicativeData: true,
    coordinates: [
      [-7.1980, 112.7330],
      [-7.2060, 112.7335],
      [-7.2140, 112.7340],
      [-7.2220, 112.7345],
      [-7.2300, 112.7350]
    ],
    center: [-7.2140, 112.7340],
    description: "Pusat industri logistik maritim, gerbang pelabuhan kontainer nasional dengan panas terik pesisir."
  },
  {
    id: "SEG-SBY-12",
    name: "Jl. Kedung Cowek (Akses Jembatan Suramadu)",
    area: "Surabaya Utara",
    pm25: 29.4,
    category: calculateAirQualityLevel(29.4),
    temperature: 33.4,
    humidity: 62,
    confidenceScore: "Tinggi",
    uniquePassesCount: 7,
    ageMinutes: 7,
    varianceSigma: 2.7,
    isIndicativeData: true,
    coordinates: [
      [-7.2360, 112.7710],
      [-7.2260, 112.7725],
      [-7.2160, 112.7740],
      [-7.2060, 112.7755],
      [-7.1970, 112.7765]
    ],
    center: [-7.2160, 112.7740],
    description: "Koridor cepat akses Jembatan Suramadu penghubung Surabaya dan Pulau Madura."
  }
];

// Perbandingan Rute Ramah Udara di Surabaya
export const surabayaRouteComparison: NavigationComparison = {
  origin: "Bundaran Waru (Surabaya Selatan)",
  destination: "Tunjungan Plaza (Surabaya Pusat)",
  fastestRoute: {
    title: "Rute Arteri Utama (Ahmad Yani - Wonokromo)",
    durationMinutes: 18,
    distanceKm: 8.2,
    averagePM25: 45.2,
    description: "Melewati arteri padat truk & motor A. Yani, paparan panas aspal tinggi",
    badge: "Macet & Berpolusi",
    coordinates: [
      [-7.3425, 112.7330],
      [-7.3230, 112.7345],
      [-7.3035, 112.7390],
      [-7.2830, 112.7340],
      [-7.2625, 112.7405]
    ]
  },
  cleanAirRoute: {
    title: "Koridor Hijau Bungkul (Darmo - Basuki Rahmat)",
    durationMinutes: 21,
    distanceKm: 8.8,
    averagePM25: 16.4,
    description: "Melintasi jalur rimbun pepohonan Raya Darmo & Taman Bungkul yang sejuk",
    badge: "-64% paparan polusi",
    reductionPercentage: 64,
    coordinates: [
      [-7.3425, 112.7330],
      [-7.3180, 112.7380],
      [-7.2925, 112.7391],
      [-7.2725, 112.7405],
      [-7.2625, 112.7405]
    ]
  }
};
