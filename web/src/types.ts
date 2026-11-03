export type AirQualityLevel = 'good' | 'moderate' | 'unhealthy' | 'hazardous';

export interface RoadSegment {
  id: string;
  name: string;
  area: string;
  pm25: number;
  category: AirQualityLevel;
  temperature: number;
  humidity: number;
  confidenceScore: 'Tinggi' | 'Sedang' | 'Rendah';
  uniquePassesCount: number;
  ageMinutes: number;
  varianceSigma: number;
  isIndicativeData: boolean;
  coordinates: [number, number][]; // Array of [lat, lng] real geographic coordinates
  center: [number, number];        // Center [lat, lng] for pin marker
  description?: string;
  svgPath?: string;
  labelCoord?: { x: number; y: number };
}

export interface RouteOption {
  title: string;
  durationMinutes: number;
  distanceKm: number;
  averagePM25: number;
  description: string;
  badge: string;
  reductionPercentage?: number;
  coordinates?: [number, number][]; // Real [lat, lng] path
}

export interface NavigationComparison {
  origin: string;
  destination: string;
  fastestRoute: RouteOption;
  cleanAirRoute: RouteOption;
}

export interface DriverState {
  name: string;
  fleetId: string;
  accumulatedPoints: number;
  dailyTargetPoints: number;
  validatedKm: number;
  todayEarningsRupiah: number;
  batteryPercentage: number;
  isCharging: boolean;
  sps30Health: string;
  currentSpeed: number;
  accelerometerRMS: number;
  isAntiCheatPassed: boolean;
  anomalyReason: string | null;
  isSimulatingAnomaly: boolean;
  offlineBufferCount: number;
  autoCleanCountdownHours: number;
}

export interface H3Mission {
  id: string;
  zoneName: string;
  multiplier: number;
  unmeasuredMinutes: number;
  rewardPerKm: number;
  radiusMeters: number;
}

export interface TransactionRecord {
  id: string;
  title: string;
  timeString: string;
  validatedKm: number;
  rupiahAmount: number;
  isMultiplierZone: boolean;
}
