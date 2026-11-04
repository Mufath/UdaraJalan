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

// Clean continuous route geometry for Clean Air Route (Bundaran Waru -> Darmo -> Tunjungan)
export const surabayaCleanRouteCoordinates: [number, number][] = [
[112.7315, -7.3425],
  [112.7335, -7.33],
  [112.736, -7.315],
  [112.7385, -7.3],
  [112.7391, -7.291],
  [112.7388, -7.28],
  [112.741, -7.271],
  [112.7405, -7.2625],
  [112.7382, -7.2555]
];

// Clean continuous route geometry for Fastest Route (Bundaran Waru -> Diponegoro -> Tunjungan)
export const surabayaFastestRouteCoordinates: [number, number][] = [
[112.7315, -7.3425],
  [112.735, -7.2995],
  [112.734, -7.286],
  [112.7315, -7.2725],
  [112.7382, -7.2555]
];

// 12 Ruas Jalan Representatif Mencakup Seluruh 5 Wilayah Kota Surabaya
// Geometri Presisi 100% Mengikuti Koridor Jalan Asli Peta OpenStreetMap (Bebas Loop/U-Turn)
export const surabayaRoadSegments: RoadSegment[] = [
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
      [-7.2625, 112.7405],
      [-7.2612, 112.7401],
      [-7.2598, 112.7396],
      [-7.2585, 112.7391],
      [-7.257, 112.7386],
      [-7.2555, 112.7382]
    ],
    center: [-7.259, 112.7394],
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
      [-7.28, 112.7388],
      [-7.2765, 112.7398],
      [-7.273, 112.7407],
      [-7.2695, 112.7413],
      [-7.266, 112.7412],
      [-7.2625, 112.7405]
    ],
    center: [-7.271, 112.741],
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
      [-7.263, 112.7418],
      [-7.2632, 112.7445],
      [-7.2635, 112.747],
      [-7.2638, 112.7495],
      [-7.2642, 112.7525]
    ],
    center: [-7.2635, 112.747],
    description: "Pusat pemerintahan kota, Gedung Grahadi, dan Delta Plaza."
  },
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
      [-7.2995, 112.7385],
      [-7.2965, 112.7388],
      [-7.2935, 112.739],
      [-7.291, 112.7391],
      [-7.288, 112.7391],
      [-7.2845, 112.739],
      [-7.28, 112.7388]
    ],
    center: [-7.291, 112.7391],
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
      [-7.3425, 112.7315],
      [-7.337, 112.7324],
      [-7.33, 112.7338],
      [-7.323, 112.735],
      [-7.316, 112.7363],
      [-7.309, 112.7374],
      [-7.303, 112.7381],
      [-7.2995, 112.7385]
    ],
    center: [-7.321, 112.7354],
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
      [-7.2995, 112.735],
      [-7.295, 112.735],
      [-7.29, 112.7345],
      [-7.285, 112.7338],
      [-7.279, 112.7328],
      [-7.2725, 112.7315]
    ],
    center: [-7.286, 112.734],
    description: "Jalur arteri penghubung Surabaya barat daya menuju pusat kota."
  },
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
      [-7.25, 112.793],
      [-7.26, 112.7885],
      [-7.27, 112.785],
      [-7.282, 112.783],
      [-7.295, 112.7832],
      [-7.31, 112.7845],
      [-7.325, 112.7865],
      [-7.338, 112.789]
    ],
    center: [-7.295, 112.7832],
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
      [-7.273, 112.749],
      [-7.275, 112.756],
      [-7.277, 112.764],
      [-7.2782, 112.772],
      [-7.2785, 112.783],
      [-7.279, 112.793]
    ],
    center: [-7.2776, 112.772],
    description: "Kawasan pendidikan kampus perguruan tinggi dan pusat kuliner timur."
  },
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
      [-7.288, 112.732],
      [-7.2878, 112.723],
      [-7.2875, 112.714],
      [-7.287, 112.705],
      [-7.2865, 112.6975]
    ],
    center: [-7.2873, 112.714],
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
      [-7.2868, 112.69],
      [-7.2872, 112.682],
      [-7.288, 112.678],
      [-7.292, 112.677],
      [-7.297, 112.6765]
    ],
    center: [-7.288, 112.678],
    description: "Kawasan modern Surabaya Barat, pusat residensial Graha Family dan Pakuwon Mall."
  },
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
      [-7.235, 112.735],
      [-7.228, 112.7348],
      [-7.22, 112.7345],
      [-7.212, 112.734],
      [-7.205, 112.7335],
      [-7.198, 112.733]
    ],
    center: [-7.216, 112.7342],
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
    varianceSigma: 2.6,
    isIndicativeData: true,
    coordinates: [
      [-7.245, 112.766],
      [-7.235, 112.77],
      [-7.225, 112.775],
      [-7.212, 112.78],
      [-7.198, 112.7845]
    ],
    center: [-7.221, 112.7765],
    description: "Koridor tol antar-pulau penghubung Surabaya dan Madura, angin pantai kencang."
  },
];

export const surabayaRouteComparison: NavigationComparison = {
  origin: "Bundaran Waru (Gerbang Masuk Selatan)",
  destination: "Jl. Tunjungan (Pusat Kota Surabaya)",
  fastestRoute: {
    name: "Via Tol / Jl. Diponegoro (Arteri)",
    estimatedMinutes: 24,
    distanceKm: 14.8,
    averagePM25: 45.2,
    badge: "Arus Cepat Padat Polusi"
  },
  cleanAirRoute: {
    name: "Via Koridor Hijau Jl. Raya Darmo (Taman Bungkul)",
    estimatedMinutes: 29,
    distanceKm: 13.9,
    averagePM25: 16.4,
    reductionPercentage: 64,
    badge: "-64% paparan polusi"
  }
};
