const fs = require('fs');

const roads = JSON.parse(fs.readFileSync('roads_geojson.json', 'utf8'));
const cleanRoute = JSON.parse(fs.readFileSync('clean_route.json', 'utf8'));

// Format road segments
const segments = [
  {
    id: "SEG-01",
    name: "Jl. Senopati (Kebayoran Baru)",
    area: "Jakarta Selatan",
    pm25: 12.4,
    category: "good",
    temperature: 29.4,
    humidity: 74,
    confidenceScore: "Tinggi",
    uniquePassesCount: 8,
    ageMinutes: 14,
    varianceSigma: 2.8,
    isIndicativeData: true,
    coordinates: roads.senopati,
    center: roads.senopati[Math.floor(roads.senopati.length * 0.45)],
    description: "Jalur rindang dengan vegetasi peneduh lebat & koridor residensial rendah emisi"
  },
  {
    id: "SEG-02",
    name: "Jl. H.R. Rasuna Said (Kuningan)",
    area: "Jakarta Selatan",
    pm25: 26.8,
    category: "moderate",
    temperature: 32.1,
    humidity: 64,
    confidenceScore: "Sedang",
    uniquePassesCount: 5,
    ageMinutes: 32,
    varianceSigma: 5.2,
    isIndicativeData: true,
    coordinates: roads.rasuna,
    center: roads.rasuna[Math.floor(roads.rasuna.length * 0.5)],
    description: "Koridor bisnis dengan proyek LRT Jabodebek dan jalur lambat perkantoran"
  },
  {
    id: "SEG-03",
    name: "Jl. Jend. Sudirman (Semanggi - Senayan)",
    area: "Jakarta Pusat - Selatan",
    pm25: 38.6,
    category: "unhealthy",
    temperature: 33.4,
    humidity: 60,
    confidenceScore: "Tinggi",
    uniquePassesCount: 9,
    ageMinutes: 18,
    varianceSigma: 4.1,
    isIndicativeData: true,
    coordinates: roads.sudirman,
    center: roads.sudirman[Math.floor(roads.sudirman.length * 0.5)],
    description: "Arteri utama tersibuk ibu kota, koridor padat TransJakarta & kendaraan bermotor"
  },
  {
    id: "SEG-04",
    name: "Jl. Gatot Subroto (Pancoran - Kuningan)",
    area: "Jakarta Selatan",
    pm25: 48.2,
    category: "unhealthy",
    temperature: 34.2,
    humidity: 57,
    confidenceScore: "Tinggi",
    uniquePassesCount: 7,
    ageMinutes: 22,
    varianceSigma: 6.8,
    isIndicativeData: true,
    coordinates: roads.gatsu,
    center: roads.gatsu[Math.floor(roads.gatsu.length * 0.55)],
    description: "Jalur lingkar arteri dalam dengan gerbang tol dan flyover bertingkat"
  },
  {
    id: "SEG-05",
    name: "Underpass Mampang - Kuningan",
    area: "Jakarta Selatan",
    pm25: 64.5,
    category: "hazardous",
    temperature: 35.8,
    humidity: 52,
    confidenceScore: "Sedang",
    uniquePassesCount: 4,
    ageMinutes: 11,
    varianceSigma: 7.4,
    isIndicativeData: true,
    coordinates: roads.mampang,
    center: roads.mampang[Math.floor(roads.mampang.length * 0.5)],
    description: "Terowongan bawah tanah dengan sirkulasi udara terbatas & konsentrasi jelaga tinggi"
  },
  {
    id: "SEG-06",
    name: "Jl. M.H. Thamrin (Bundaran HI - Monas)",
    area: "Jakarta Pusat",
    pm25: 29.5,
    category: "moderate",
    temperature: 31.8,
    humidity: 65,
    confidenceScore: "Tinggi",
    uniquePassesCount: 8,
    ageMinutes: 16,
    varianceSigma: 3.5,
    isIndicativeData: true,
    coordinates: roads.thamrin,
    center: roads.thamrin[Math.floor(roads.thamrin.length * 0.45)],
    description: "Koridor Monas hingga Bundaran HI dengan pedestrian ramah pejalan kaki & pepohonan"
  },
  {
    id: "SEG-07",
    name: "Jl. Asia Afrika (Kawasan Senayan / GBK)",
    area: "Jakarta Pusat",
    pm25: 14.1,
    category: "good",
    temperature: 28.6,
    humidity: 78,
    confidenceScore: "Tinggi",
    uniquePassesCount: 6,
    ageMinutes: 19,
    varianceSigma: 2.1,
    isIndicativeData: true,
    coordinates: roads.asiaAfrika,
    center: roads.asiaAfrika[Math.floor(roads.asiaAfrika.length * 0.5)],
    description: "Kawasan ruang terbuka hijau kompleks olahraga GBK dengan sirkulasi angin sejuk"
  },
  {
    id: "SEG-08",
    name: "Jl. Prof. Dr. Satrio (Casablanca)",
    area: "Jakarta Selatan",
    pm25: 44.0,
    category: "unhealthy",
    temperature: 33.8,
    humidity: 58,
    confidenceScore: "Sedang",
    uniquePassesCount: 6,
    ageMinutes: 25,
    varianceSigma: 5.9,
    isIndicativeData: true,
    coordinates: roads.satrio,
    center: roads.satrio[Math.floor(roads.satrio.length * 0.4)],
    description: "Di bawah jalur layang non-tol Casablanca, akumulasi gas buang di bawah struktur beton"
  }
];

const fileContent = `import { RoadSegment, NavigationComparison, DriverState, H3Mission, TransactionRecord, AirQualityLevel } from '../types';

export const calculateAirQualityLevel = (pm25: number): AirQualityLevel => {
  if (pm25 <= 15.0) return 'good';
  if (pm25 <= 35.4) return 'moderate';
  if (pm25 <= 55.4) return 'unhealthy';
  return 'hazardous';
};

export const initialDriverState: DriverState = {
  name: "Bang Rian",
  fleetId: "EV-FLT #B-4819-SXX",
  accumulatedPoints: 14850,
  dailyTargetPoints: 20000,
  validatedKm: 38.4,
  todayEarningsRupiah: 1782000,
  batteryPercentage: 84,
  isCharging: false,
  sps30Health: "Normal",
  currentSpeed: 34,
  accelerometerRMS: 0.28,
  isAntiCheatPassed: true,
  anomalyReason: null,
  isSimulatingAnomaly: false,
  offlineBufferCount: 0,
  autoCleanCountdownHours: 4.8
};

export const activeH3Mission: H3Mission = {
  id: "ID-H3-886541",
  zoneName: "Koridor Sudirman - Dukuh Atas",
  multiplier: 2.0,
  unmeasuredMinutes: 68,
  rewardPerKm: 240,
  radiusMeters: 500
};

// Exact regular H3 Hexagon coordinates centered on Jalan Jenderal Sudirman
export const h3HexagonCoordinates: [number, number][] = [
  [-6.19950, 106.82200],
  [-6.20225, 106.82680],
  [-6.20775, 106.82680],
  [-6.21050, 106.82200],
  [-6.20775, 106.81720],
  [-6.20225, 106.81720]
];

export const mockRoadSegments: RoadSegment[] = ${JSON.stringify(segments, null, 2)};

export const mockRouteComparison: NavigationComparison = {
  origin: "Stasiun MRT Bundaran HI",
  destination: "Plaza Senayan / GBK",
  fastestRoute: {
    title: "Rute Tercepat",
    durationMinutes: 8,
    distanceKm: 5.6,
    averagePM25: 41.5,
    description: "Melalui arteri Sudirman utama (padat gas buang solar/bensin)",
    badge: "Standar Jalan Raya",
    coordinates: ${JSON.stringify(roads.fastest)}
  },
  cleanAirRoute: {
    title: "Rute Rendah Polusi",
    durationMinutes: 12,
    distanceKm: 6.2,
    averagePM25: 14.8,
    description: "Melalui koridor hijau Menteng, kanopi rindang & koridor Senopati",
    badge: "Rekomendasi Sehat (-64% Polusi)",
    reductionPercentage: 64.3,
    coordinates: ${JSON.stringify(cleanRoute)}
  }
};

export const mockTransactions: TransactionRecord[] = [
  {
    id: "TX-9901",
    title: "Sesi Pagi: Senayan - Sudirman",
    timeString: "Hari ini, 09:40",
    validatedKm: 14.2,
    rupiahAmount: 2424,
    isMultiplierZone: true
  },
  {
    id: "TX-9902",
    title: "Sesi Siang: Kuningan - Rasuna Said",
    timeString: "Hari ini, 12:15",
    validatedKm: 9.8,
    rupiahAmount: 1176,
    isMultiplierZone: false
  },
  {
    id: "TX-9903",
    title: "Sesi Kemarin: Thamrin - Harmoni",
    timeString: "Kemarin, 17:30",
    validatedKm: 18.5,
    rupiahAmount: 2220,
    isMultiplierZone: false
  },
  {
    id: "TX-9904",
    title: "Misi Bonus: Koridor MRT Bundaran HI",
    timeString: "Kemarin, 14:10",
    validatedKm: 6.0,
    rupiahAmount: 1440,
    isMultiplierZone: true
  }
];

export interface DataPreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  apply: (currentRoads: RoadSegment[]) => RoadSegment[];
}

export const dataPresets: DataPreset[] = [
  {
    id: 'clean-rain',
    name: 'Pasca Hujan Lebat (Udara Bersih)',
    badge: 'Kualitas Baik',
    badgeColor: '#34C759',
    description: 'Hujan lebat mencuci partikulat debu atmosfer. Semua koridor berada di zona hijau aman.',
    apply: (roads) => roads.map(r => {
      const pm25 = Number((Math.random() * 5 + 8).toFixed(1));
      return {
        ...r,
        pm25,
        category: 'good',
        temperature: Number((Math.random() * 2 + 26.5).toFixed(1)),
        humidity: Number((Math.random() * 8 + 82).toFixed(0)),
        ageMinutes: 3
      };
    })
  },
  {
    id: 'morning-rush',
    name: 'Jam Sibuk Pagi (Polusi Berat)',
    badge: 'Polusi Tinggi',
    badgeColor: '#FF3B30',
    description: 'Arteri utama macet parah dengan ribuan kendaraan konvensional berbahan bakar fosil.',
    apply: (roads) => roads.map(r => {
      let pm25 = 35;
      if (r.id === 'SEG-03' || r.id === 'SEG-04' || r.id === 'SEG-05') {
        pm25 = Number((Math.random() * 25 + 65).toFixed(1));
      } else {
        pm25 = Number((Math.random() * 20 + 38).toFixed(1));
      }
      return {
        ...r,
        pm25,
        category: calculateAirQualityLevel(pm25),
        temperature: Number((Math.random() * 2 + 33.5).toFixed(1)),
        humidity: Number((Math.random() * 10 + 50).toFixed(0)),
        ageMinutes: 2
      };
    })
  },
  {
    id: 'cfd-sudirman',
    name: 'Car Free Day (CFD Sudirman-Thamrin)',
    badge: 'Hari Bebas Kendaraan',
    badgeColor: '#007AFF',
    description: 'Sudirman dan Thamrin steril dari emisi knalpot bermotor. Udara koridor utama menjadi hijau pekat.',
    apply: (roads) => roads.map(r => {
      if (r.name.includes('Sudirman') || r.name.includes('Thamrin') || r.name.includes('Asia Afrika')) {
        const pm25 = Number((Math.random() * 4 + 7.5).toFixed(1));
        return {
          ...r,
          pm25,
          category: 'good',
          temperature: 28.5,
          humidity: 72,
          ageMinutes: 4
        };
      }
      const pm25 = Number((Math.random() * 12 + 25).toFixed(1));
      return {
        ...r,
        pm25,
        category: calculateAirQualityLevel(pm25),
        ageMinutes: 8
      };
    })
  },
  {
    id: 'heat-island',
    name: 'Urban Heat Island / Terik Siang',
    badge: 'Suhu Tinggi',
    badgeColor: '#FF9500',
    description: 'Radiasi aspal panas menaikkan suhu mikro lokal hingga 37°C+ dengan polusi sedang-tinggi.',
    apply: (roads) => roads.map(r => {
      const pm25 = Number((Math.random() * 20 + 32).toFixed(1));
      return {
        ...r,
        pm25,
        category: calculateAirQualityLevel(pm25),
        temperature: Number((Math.random() * 3 + 36.0).toFixed(1)),
        humidity: Number((Math.random() * 8 + 42).toFixed(0)),
        ageMinutes: 6
      };
    })
  }
];
`;

fs.writeFileSync('web/src/data/mockData.ts', fileContent, 'utf8');
console.log('Successfully updated web/src/data/mockData.ts with 100% real OSRM road geometries!');
