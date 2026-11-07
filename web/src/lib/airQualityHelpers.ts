import { AirQualityLevel, RoadSegment } from '../types';

export interface AirQualityMeta {
  level: AirQualityLevel;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  solidBg: string;
  textColor: string;
  borderColor: string;
  iconEmoji: string;
  healthAdvice: string;
  maskAdvice: string;
  outdoorStatus: string;
  // Hero Card styling following DESIGN.md & Unslop (No gradient slop, WCAG AA contrast)
  heroCardBg: string;
  heroTextContrast: 'dark' | 'light';
  heroTextPrimary: string;
  heroTextSecondary: string;
  heroChipBg: string;
  heroBorder: string;
}

export interface TemperatureMeta {
  level: 'cool' | 'comfortable' | 'warm' | 'hot';
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
  solidBg: string;
  textColor: string;
  borderColor: string;
  iconEmoji: string;
  comfortAdvice: string;
  sunExposure: string;
}

export function getAirQualityMeta(category: AirQualityLevel, _pm25?: number): AirQualityMeta {
  switch (category) {
    case 'good':
      return {
        level: 'good',
        label: 'Baik & Bersih',
        shortLabel: 'Bersih',
        color: '#10b981', // Emerald green
        bgColor: 'bg-emerald-50',
        solidBg: 'bg-[#059669]',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-200',
        iconEmoji: '🍃',
        healthAdvice: 'Kualitas udara sangat baik dan menyegarkan. Aman beraktivitas di luar tanpa masker.',
        maskAdvice: 'Tidak Perlu Masker',
        outdoorStatus: 'Sangat Aman',
        heroCardBg: 'bg-[#059669]',
        heroTextContrast: 'light',
        heroTextPrimary: 'text-white',
        heroTextSecondary: 'text-emerald-100',
        heroChipBg: 'bg-white/15 backdrop-blur-xs',
        heroBorder: 'border-emerald-500/30'
      };
    case 'moderate':
      return {
        level: 'moderate',
        label: 'Sedang (Wajar)',
        shortLabel: 'Sedang',
        color: '#f59e0b', // Amber
        bgColor: 'bg-amber-50',
        solidBg: 'bg-[#f59e0b]', // Golden amber matching IQAir
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200',
        iconEmoji: '🌤️',
        healthAdvice: 'Kualitas udara masih dapat diterima. Pengendara motor dan kelompok sensitif/asma disarankan waspada di jalan raya.',
        maskAdvice: 'Masker Opsional',
        outdoorStatus: 'Cukup Aman',
        // High contrast dark typography on solid yellow-amber card (No white text on yellow!)
        heroCardBg: 'bg-[#f59e0b]',
        heroTextContrast: 'dark',
        heroTextPrimary: 'text-neutral-900',
        heroTextSecondary: 'text-neutral-800/80',
        heroChipBg: 'bg-black/10 backdrop-blur-xs',
        heroBorder: 'border-amber-600/30'
      };
    case 'unhealthy':
      return {
        level: 'unhealthy',
        label: 'Tidak Sehat (Berpolusi)',
        shortLabel: 'Tidak Sehat',
        color: '#ef4444', // Red
        bgColor: 'bg-rose-50',
        solidBg: 'bg-[#e11d48]',
        textColor: 'text-rose-700',
        borderColor: 'border-rose-200',
        iconEmoji: '⚠️',
        healthAdvice: 'Tingkat partikulat debu PM2.5 tinggi akibat kepadatan kendaraan. Disarankan memakai masker medis saat melintas.',
        maskAdvice: 'Disarankan Pakai Masker',
        outdoorStatus: 'Kurangi Paparan',
        heroCardBg: 'bg-[#e11d48]',
        heroTextContrast: 'light',
        heroTextPrimary: 'text-white',
        heroTextSecondary: 'text-rose-100',
        heroChipBg: 'bg-white/15 backdrop-blur-xs',
        heroBorder: 'border-rose-600/30'
      };
    case 'hazardous':
      return {
        level: 'hazardous',
        label: 'Sangat Berbahaya',
        shortLabel: 'Bahaya',
        color: '#9333ea', // Purple
        bgColor: 'bg-purple-50',
        solidBg: 'bg-[#7e22ce]',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        iconEmoji: '☣️',
        healthAdvice: 'Konsentrasi polutan sangat pekat dan berbahaya bagi paru-paru. Wajib menggunakan masker N95 / respirator jika melintas.',
        maskAdvice: 'Wajib Masker N95',
        outdoorStatus: 'Hindari Melintas',
        heroCardBg: 'bg-[#7e22ce]',
        heroTextContrast: 'light',
        heroTextPrimary: 'text-white',
        heroTextSecondary: 'text-purple-100',
        heroChipBg: 'bg-white/15 backdrop-blur-xs',
        heroBorder: 'border-purple-600/30'
      };
  }
}

/**
 * Standard EPA US AQI conversion formula for PM2.5 (µg/m³)
 * Matches standard international indices used by IQAir and regulatory bodies.
 */
export function pm25ToUsAqi(pm: number): number {
  if (pm <= 0) return 0;
  if (pm <= 12.0) {
    return Math.round(((50 - 0) / (12.0 - 0.0)) * (pm - 0.0) + 0);
  } else if (pm <= 35.4) {
    return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm - 12.1) + 51);
  } else if (pm <= 55.4) {
    return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm - 35.5) + 101);
  } else if (pm <= 150.4) {
    return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm - 55.5) + 151);
  } else if (pm <= 250.4) {
    return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm - 150.5) + 201);
  } else {
    return Math.min(500, Math.round(((500 - 301) / (500.4 - 250.5)) * (pm - 250.5) + 301));
  }
}

export function getTemperatureMeta(temperature: number): TemperatureMeta {
  if (temperature < 28) {
    return {
      level: 'cool',
      label: 'Sejuk & Teduh',
      shortLabel: 'Sejuk',
      color: '#0284c7', // Sky Blue
      bgColor: 'bg-sky-50',
      solidBg: 'bg-[#0284c7]',
      textColor: 'text-sky-700',
      borderColor: 'border-sky-200',
      iconEmoji: '❄️',
      comfortAdvice: 'Suhu jalanan sejuk dan teduh, sangat nyaman untuk jalan kaki maupun berkendara.',
      sunExposure: 'Paparan Panas Ringan'
    };
  }
  if (temperature <= 31.5) {
    return {
      level: 'comfortable',
      label: 'Hangat Normal',
      shortLabel: 'Nyaman',
      color: '#10b981', // Green
      bgColor: 'bg-emerald-50',
      solidBg: 'bg-[#059669]',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      iconEmoji: '🌤️',
      comfortAdvice: 'Suhu udara jalan tergolong wajar untuk perkotaan Jakarta. Kondisi nyaman.',
      sunExposure: 'Paparan Panas Sedang'
    };
  }
  if (temperature <= 34.0) {
    return {
      level: 'warm',
      label: 'Cukup Panas',
      shortLabel: 'Panas',
      color: '#f59e0b', // Amber / Orange
      bgColor: 'bg-amber-50',
      solidBg: 'bg-[#ea580c]',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-200',
      iconEmoji: '☀️',
      comfortAdvice: 'Jalanan terasa terik. Siapkan air minum dan kenakan jaket/pelindung sinar matahari saat berkendara.',
      sunExposure: 'Terik Cukup Tinggi'
    };
  }
  return {
    level: 'hot',
    label: 'Panas Terik Ekstrem',
    shortLabel: 'Terik Ekstrem',
    color: '#ef4444', // Red
    bgColor: 'bg-rose-50',
    solidBg: 'bg-[#dc2626]',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    iconEmoji: '🥵',
    comfortAdvice: 'Permukaan aspal jalanan sangat panas! Bahaya dehidrasi bagi pejalan kaki dan pesepeda, hindari paparan terik terlalu lama.',
    sunExposure: 'Paparan Panas Sangat Tinggi'
  };
}

export function getCityOverview(roads: RoadSegment[]) {
  if (!roads || roads.length === 0) {
    return {
      avgPM25: 0,
      avgTemp: 0,
      cleanestRoad: null,
      mostPollutedRoad: null,
      coolestRoad: null,
      hottestRoad: null,
      overallCategory: 'good' as AirQualityLevel
    };
  }

  const sumPM = roads.reduce((acc, r) => acc + r.pm25, 0);
  const sumTemp = roads.reduce((acc, r) => acc + r.temperature, 0);
  const avgPM25 = Number((sumPM / roads.length).toFixed(1));
  const avgTemp = Number((sumTemp / roads.length).toFixed(1));

  const sortedByPM = [...roads].sort((a, b) => a.pm25 - b.pm25);
  const sortedByTemp = [...roads].sort((a, b) => a.temperature - b.temperature);

  let overallCategory: AirQualityLevel = 'good';
  if (avgPM25 <= 15) overallCategory = 'good';
  else if (avgPM25 <= 35.4) overallCategory = 'moderate';
  else if (avgPM25 <= 55.4) overallCategory = 'unhealthy';
  else overallCategory = 'hazardous';

  return {
    avgPM25,
    avgTemp,
    cleanestRoad: sortedByPM[0],
    mostPollutedRoad: sortedByPM[sortedByPM.length - 1],
    coolestRoad: sortedByTemp[0],
    hottestRoad: sortedByTemp[sortedByTemp.length - 1],
    overallCategory
  };
}

export function formatRelativeAge(ageMinutes?: number, compact = false): string {
  if (ageMinutes === undefined || ageMinutes === null || isNaN(ageMinutes)) {
    return compact ? 'Baru saja' : 'Diambil baru saja';
  }
  if (ageMinutes <= 0) {
    return compact ? 'Baru saja' : 'Diambil baru saja';
  }
  if (ageMinutes === 1) {
    return compact ? '1 mnt lalu' : 'Diambil 1 menit lalu';
  }
  if (ageMinutes < 60) {
    return compact ? `${ageMinutes} mnt lalu` : `Diambil ${ageMinutes} menit lalu`;
  }
  
  const hours = Math.floor(ageMinutes / 60);
  if (hours < 24) {
    const remMinutes = ageMinutes % 60;
    if (compact) {
      return remMinutes > 0 ? `${hours}j ${remMinutes}m lalu` : `${hours} jam lalu`;
    }
    return remMinutes > 0 
      ? `Diambil ${hours} jam ${remMinutes} mnt lalu` 
      : `Diambil ${hours} jam lalu`;
  }
  
  const days = Math.floor(hours / 24);
  if (compact) {
    return `${days} hari lalu`;
  }
  return days === 1 ? 'Diambil 1 hari lalu' : `Diambil ${days} hari lalu`;
}

export interface HourlyForecastItem {
  time: string;
  hour: number;
  pm25: number;
  usAqi: number;
  category: AirQualityLevel;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDir: string;
  condition: 'sunny' | 'cloudy-sun' | 'cloudy' | 'rainy';
}

export interface DailyForecastItem {
  day: string;
  dateString: string;
  pm25: number;
  usAqi: number;
  category: AirQualityLevel;
  tempMax: number;
  tempMin: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy-sun' | 'cloudy';
}

export interface FleetContributor {
  id: string;
  alias: string;
  fleetVehicle: string;
  sensorModel: string;
  lastPassMinutesAgo: number;
  readingsCount: number;
  confidenceWeight: number;
}

export function generateRoadForecast(road: RoadSegment): { hourly: HourlyForecastItem[]; daily: DailyForecastItem[] } {
  const currentHour = 13; // default afternoon baseline
  const basePM = road.pm25;
  const baseTemp = road.temperature;
  const baseHumidity = road.humidity;

  const hourly: HourlyForecastItem[] = [];
  const hoursToGenerate = 8;

  for (let i = 0; i < hoursToGenerate; i++) {
    const h = (currentHour + i) % 24;
    const timeLabel = i === 0 ? 'Sekarang' : `${String(h).padStart(2, '0')}:00`;

    // Traffic peak curve: rush hour (16:00 - 18:30) increases PM2.5
    let pmMultiplier = 1.0;
    if (h >= 16 && h <= 18) {
      pmMultiplier = 1.25 + ((h - 16) * 0.08);
    } else if (h >= 19 && h <= 21) {
      pmMultiplier = 1.15;
    } else if (h >= 14 && h <= 15) {
      pmMultiplier = 1.05;
    }

    const pm = Number((basePM * pmMultiplier).toFixed(1));
    const aqi = pm25ToUsAqi(pm);

    let cat: AirQualityLevel = 'good';
    if (pm <= 15.0) cat = 'good';
    else if (pm <= 35.4) cat = 'moderate';
    else if (pm <= 55.4) cat = 'unhealthy';
    else cat = 'hazardous';

    const tempOffset = i <= 2 ? 0.5 * i : -(i - 2) * 0.8;
    const temp = Math.round(baseTemp + tempOffset);
    const hum = Math.min(85, Math.max(45, Math.round(baseHumidity + (i * 2.2))));
    const wind = Number((18.0 + Math.sin(i * 1.2) * 6).toFixed(0));
    const dirs = ['TL', 'T', 'TG', 'S', 'BD', 'B', 'BL', 'U'];
    const windDir = dirs[(i + road.name.length) % dirs.length];

    hourly.push({
      time: timeLabel,
      hour: h,
      pm25: pm,
      usAqi: aqi,
      category: cat,
      temp,
      humidity: hum,
      windSpeed: wind,
      windDir,
      condition: h >= 18 ? 'cloudy' : (i % 2 === 0 ? 'sunny' : 'cloudy-sun')
    });
  }

  const days = ['Hari Ini', 'Sab', 'Min', 'Sen', 'Sel', 'Rab', 'Kam'];
  const daily: DailyForecastItem[] = days.map((day, idx) => {
    const dailyPM = Number((basePM * (1.0 + Math.sin(idx * 0.9) * 0.22)).toFixed(1));
    const aqi = pm25ToUsAqi(dailyPM);
    let cat: AirQualityLevel = 'good';
    if (dailyPM <= 15.0) cat = 'good';
    else if (dailyPM <= 35.4) cat = 'moderate';
    else if (dailyPM <= 55.4) cat = 'unhealthy';
    else cat = 'hazardous';

    return {
      day: idx === 0 ? 'Hari Ini' : day,
      dateString: `${6 + idx} Nov`,
      pm25: dailyPM,
      usAqi: aqi,
      category: cat,
      tempMax: Math.round(baseTemp + 1 + (idx % 2)),
      tempMin: Math.round(baseTemp - 5 - (idx % 2)),
      windSpeed: Math.round(20 + Math.sin(idx) * 6),
      condition: idx % 3 === 0 ? 'cloudy-sun' : (idx % 3 === 1 ? 'sunny' : 'cloudy')
    };
  });

  return { hourly, daily };
}

export function getFleetContributors(road: RoadSegment): FleetContributor[] {
  const count = Math.max(3, road.uniquePassesCount);
  const models = ['Smooth Z3 EV', 'Gesits G1 Electric', 'Polytron Fox-R', 'Alva Cervo EV', 'Viar Q1 EV'];
  const aliases = [
    'Armada EV #B-4819 (Rian S.)',
    'Armada EV #L-1932 (Dimas A.)',
    'Armada EV #B-3721 (Bambang H.)',
    'Armada EV #L-8410 (Hendra W.)',
    'Armada EV #B-6599 (Siti M.)',
    'Armada EV #L-2481 (Ahmad K.)'
  ];

  const contributors: FleetContributor[] = [];
  for (let i = 0; i < Math.min(count, 5); i++) {
    contributors.push({
      id: `EV-CONTRIB-0${i + 1}`,
      alias: aliases[i % aliases.length],
      fleetVehicle: models[i % models.length],
      sensorModel: 'Sensirion SPS30 Laser Optical (MCERTS Grade)',
      lastPassMinutesAgo: Math.max(2, (road.ageMinutes || 5) + (i * 7)),
      readingsCount: 12 + (i * 5),
      confidenceWeight: 96 - (i * 3)
    });
  }
  return contributors;
}

