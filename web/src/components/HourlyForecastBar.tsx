import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  Droplets, 
  Wind, 
  Compass, 
  Clock, 
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { RoadSegment } from '../types';
import { 
  generateRoadForecast, 
  getAirQualityMeta, 
  HourlyForecastItem, 
  DailyForecastItem 
} from '../lib/airQualityHelpers';

interface HourlyForecastBarProps {
  road: RoadSegment;
  className?: string;
}

/**
 * Hourly & Daily Air Quality Forecast Component
 * Inspired by IQAir's multi-horizon forecasting (Screenshot 1 & 2),
 * strictly tailored to UdaraJalan's CleanTech minimalist design system (DESIGN.md):
 * - Clean light background (#FFFFFF on #F2F2F7).
 * - Multi-metric alignment: Time, AQI pill, Weather icon, SHT40 Temp, Wind, and Humidity.
 * - 3d / 7d toggle for future horizon.
 * - Zero gradient slop, zero glowing edges, full tabular-nums stability.
 */
export const HourlyForecastBar: React.FC<HourlyForecastBarProps> = ({
  road,
  className = ''
}) => {
  const [viewHorizon, setViewHorizon] = useState<'hourly' | '3d' | '7d'>('hourly');

  const { hourly, daily } = useMemo(() => generateRoadForecast(road), [road]);

  // Find cleanest hour window for citizen recommendation
  const cleanestHour = useMemo(() => {
    return [...hourly].sort((a, b) => a.pm25 - b.pm25)[0];
  }, [hourly]);

  const displayedDaily = useMemo(() => {
    return viewHorizon === '3d' ? daily.slice(0, 3) : daily;
  }, [daily, viewHorizon]);

  return (
    <div className={`bg-white rounded-[24px] border border-neutral-200/80 p-4 sm:p-5 shadow-xs space-y-3.5 ${className}`}>
      
      {/* 1. Header & Horizon Switcher */}
      <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-neutral-500" />
          <h3 className="text-xs font-bold text-neutral-900 tracking-tight">
            Prakiraan Kualitas Udara Ruas
          </h3>
        </div>

        {/* Horizon Toggle Pills (Hourly | 3h | 7h) */}
        <div className="flex items-center p-0.5 bg-neutral-100 rounded-full text-[11px] font-semibold">
          <button
            onClick={() => setViewHorizon('hourly')}
            className={`px-2.5 py-1 rounded-full transition-all ${
              viewHorizon === 'hourly' 
                ? 'bg-white text-neutral-900 font-bold shadow-xs' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Per Jam
          </button>
          <button
            onClick={() => setViewHorizon('3d')}
            className={`px-2.5 py-1 rounded-full transition-all ${
              viewHorizon === '3d' 
                ? 'bg-white text-neutral-900 font-bold shadow-xs' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            3 Hari
          </button>
          <button
            onClick={() => setViewHorizon('7d')}
            className={`px-2.5 py-1 rounded-full transition-all ${
              viewHorizon === '7d' 
                ? 'bg-white text-neutral-900 font-bold shadow-xs' 
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            7 Hari
          </button>
        </div>
      </div>

      {/* 2. HOURLY HORIZONTAL SCROLL CAROUSEL */}
      {viewHorizon === 'hourly' ? (
        <div className="space-y-3">
          <div className="overflow-x-auto no-scrollbar -mx-2 px-2 py-1">
            <div className="flex items-stretch space-x-2 min-w-max">
              {hourly.map((item, idx) => {
                const meta = getAirQualityMeta(item.category, item.pm25);
                const isModerate = item.category === 'moderate';

                return (
                  <div
                    key={`hour-${item.hour}-${idx}`}
                    className={`flex flex-col items-center justify-between py-2.5 px-3 rounded-2xl border transition-all text-center min-w-[76px] sm:min-w-[82px] ${
                      idx === 0 
                        ? 'bg-neutral-50 border-neutral-300/80 shadow-xs ring-1 ring-neutral-200/50' 
                        : 'bg-white border-neutral-100 hover:bg-neutral-50/80'
                    }`}
                  >
                    {/* Time Label */}
                    <span className="text-[11px] font-bold text-neutral-600 mb-1.5 tabular-nums">
                      {item.time}
                    </span>

                    {/* AQI Pill with semantic solid background */}
                    <div 
                      className={`px-2 py-0.5 rounded-full text-xs font-black tabular-nums shadow-2xs mb-2 ${
                        isModerate 
                          ? 'bg-[#f59e0b] text-neutral-950 font-black' 
                          : `${meta.solidBg} text-white`
                      }`}
                      title={`PM2.5: ${item.pm25} µg/m³`}
                    >
                      {item.usAqi}
                    </div>

                    {/* Weather Condition Icon */}
                    <div className="w-6 h-6 flex items-center justify-center my-0.5">
                      {item.condition === 'sunny' && <Sun className="w-4 h-4 text-amber-500" />}
                      {item.condition === 'cloudy-sun' && <CloudSun className="w-4 h-4 text-amber-500" />}
                      {item.condition === 'cloudy' && <Cloud className="w-4 h-4 text-neutral-400" />}
                      {item.condition === 'rainy' && <Droplets className="w-4 h-4 text-blue-500" />}
                    </div>

                    {/* Temperature */}
                    <span className="text-xs font-bold text-neutral-800 tabular-nums mt-1">
                      {item.temp}°
                    </span>

                    {/* Wind Vector (Direction & Speed) */}
                    <div className="flex items-center space-x-0.5 text-[10px] text-neutral-500 tabular-nums mt-1.5">
                      <Wind className="w-2.5 h-2.5 text-neutral-400 shrink-0" />
                      <span className="font-semibold">{item.windSpeed}</span>
                      <span className="text-[8px] font-mono text-neutral-400">{item.windDir}</span>
                    </div>

                    {/* Humidity */}
                    <div className="flex items-center space-x-0.5 text-[9.5px] text-neutral-400 tabular-nums mt-1">
                      <Droplets className="w-2.5 h-2.5 text-sky-400 shrink-0" />
                      <span>{item.humidity}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Hour Window Insight Bar */}
          <div className="p-2.5 rounded-xl bg-emerald-50/90 border border-emerald-100 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-emerald-900">
                Waktu Terbersih Melintas:
              </span>
              <span className="font-extrabold text-emerald-800 tabular-nums">
                {cleanestHour.time} ({cleanestHour.pm25} µg/m³)
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-emerald-800 border border-emerald-200">
              Rekomendasi Rute
            </span>
          </div>
        </div>
      ) : (
        /* 3. DAILY FORECAST LIST (3-Day or 7-Day) */
        <div className="space-y-2 pt-1">
          {displayedDaily.map((item, idx) => {
            const meta = getAirQualityMeta(item.category, item.pm25);
            const isModerate = item.category === 'moderate';

            return (
              <div 
                key={`daily-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/80 hover:bg-neutral-50 border border-neutral-100 text-xs transition-colors"
              >
                {/* Day name & date */}
                <div className="w-24 flex flex-col">
                  <span className="font-bold text-neutral-900">{item.day}</span>
                  <span className="text-[10px] text-neutral-400 tabular-nums">{item.dateString}</span>
                </div>

                {/* AQI Pill */}
                <div 
                  className={`px-3 py-1 rounded-full text-xs font-black tabular-nums shrink-0 ${
                    isModerate 
                      ? 'bg-[#f59e0b] text-neutral-950 font-black' 
                      : `${meta.solidBg} text-white`
                  }`}
                >
                  {item.usAqi} <span className="text-[9px] font-normal opacity-90">AQI</span>
                </div>

                {/* Weather condition */}
                <div className="w-8 flex justify-center">
                  {item.condition === 'sunny' && <Sun className="w-4 h-4 text-amber-500" />}
                  {item.condition === 'cloudy-sun' && <CloudSun className="w-4 h-4 text-amber-500" />}
                  {item.condition === 'cloudy' && <Cloud className="w-4 h-4 text-neutral-400" />}
                </div>

                {/* Temp Max & Min */}
                <div className="flex items-center space-x-1.5 tabular-nums font-semibold text-neutral-700">
                  <span className="font-bold text-neutral-900">{item.tempMax}°</span>
                  <span className="text-neutral-400">{item.tempMin}°</span>
                </div>

                {/* Wind */}
                <div className="flex items-center space-x-1 text-neutral-500 tabular-nums">
                  <Wind className="w-3 h-3 text-neutral-400" />
                  <span>{item.windSpeed} km/j</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
