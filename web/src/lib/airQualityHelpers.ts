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
        outdoorStatus: 'Sangat Aman'
      };
    case 'moderate':
      return {
        level: 'moderate',
        label: 'Sedang (Wajar)',
        shortLabel: 'Sedang',
        color: '#f59e0b', // Amber
        bgColor: 'bg-amber-50',
        solidBg: 'bg-[#d97706]',
        textColor: 'text-amber-800',
        borderColor: 'border-amber-200',
        iconEmoji: '🌤️',
        healthAdvice: 'Kualitas udara masih dapat diterima. Pengendara motor dan kelompok sensitif/asma disarankan waspada di jalan raya.',
        maskAdvice: 'Masker Opsional',
        outdoorStatus: 'Cukup Aman'
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
        outdoorStatus: 'Kurangi Paparan'
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
        outdoorStatus: 'Hindari Melintas'
      };
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
