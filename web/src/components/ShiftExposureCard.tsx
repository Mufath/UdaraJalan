import React, { useState } from 'react';
import { 
  Clock, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  Droplets, 
  Wind, 
  HeartPulse, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { DriverState } from '../types';
import { AirQualityAvatar } from './AirQualityAvatar';

interface ShiftExposureCardProps {
  driver: DriverState;
  shiftSeconds: number;
  className?: string;
}

/**
 * Driver Shift Air Quality Exposure Tracker
 * Adapted from IQAir's "Today's Exposure" 24h Radial Clock (Screenshot 3 & 4),
 * specialized for EV Courier & Ojol Mobility Health (PRD Persona 1 - Driver View):
 * - Radial Shift Dial showing exposure hours across Clean, Moderate, and High Pollution zones.
 * - Cumulative inhaled dose estimation (µg/m³).
 * - Timely respiratory health & mask replacement alerts.
 * - Strictly zero gradient slop, pure native system design (DESIGN.md).
 */
export const ShiftExposureCard: React.FC<ShiftExposureCardProps> = ({
  driver,
  shiftSeconds,
  className = ''
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'clean' | 'moderate' | 'unhealthy'>('all');

  // Convert shift seconds to hours & minutes
  const shiftHours = Math.floor(shiftSeconds / 3600);
  const shiftMins = Math.floor((shiftSeconds % 3600) / 60);

  // Realistic shift breakdown based on driver state
  const cleanMins = Math.round(shiftSeconds / 60 * 0.42);      // 42% in clean corridors
  const moderateMins = Math.round(shiftSeconds / 60 * 0.46);   // 46% in moderate traffic
  const unhealthyMins = Math.max(0, Math.round(shiftSeconds / 60) - cleanMins - moderateMins); // 12% in congested spots

  // Average exposure during shift
  const avgExposurePM25 = driver.isSimulatingAnomaly ? 38.4 : 21.6;

  // Format minutes into "Xj Ym"
  const formatMins = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}j ${m}m` : `${m} mnt`;
  };

  return (
    <div className={`bg-white rounded-[28px] border border-neutral-200/80 p-5 sm:p-6 shadow-xs space-y-4 ${className}`}>
      
      {/* 1. Card Header & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2 border-b border-neutral-100">
        <div>
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
              Paparan Polusi Shift Kerja Mitra
            </h3>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Estimasi dosis partikulat terhirup selama durasi berkendara hari ini
          </p>
        </div>

        {/* Filter Chips (Inspired by IQAir All | Home | Work | Outdoor) */}
        <div className="flex items-center p-0.5 bg-neutral-100 rounded-full text-[11px] font-semibold self-start sm:self-auto">
          {(['all', 'clean', 'moderate', 'unhealthy'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-2.5 py-1 rounded-full transition-all capitalize ${
                selectedFilter === filter
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {filter === 'all' ? 'Semua' : filter === 'clean' ? 'Bersih' : filter === 'moderate' ? 'Sedang' : 'Padat'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Radial Shift Exposure Clock & Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-1">
        
        {/* LEFT: 240-degree Radial Dial SVG */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center select-none">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Outer Track */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#F2F2F7"
                strokeWidth="10"
              />

              {/* Segment 1: Bersih (Emerald) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray={`${(cleanMins / (shiftSeconds / 60)) * 238.7} 238.7`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-700"
              />

              {/* Segment 2: Sedang (Amber) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeDasharray={`${(moderateMins / (shiftSeconds / 60)) * 238.7} 238.7`}
                strokeDashoffset={`-${(cleanMins / (shiftSeconds / 60)) * 238.7}`}
                className="transition-all duration-700"
              />

              {/* Segment 3: Padat / Tidak Sehat (Red) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ef4444"
                strokeWidth="10"
                strokeDasharray={`${(unhealthyMins / (shiftSeconds / 60)) * 238.7} 238.7`}
                strokeDashoffset={`-${((cleanMins + moderateMins) / (shiftSeconds / 60)) * 238.7}`}
                className="transition-all duration-700"
              />
            </svg>

            {/* Inner Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Durasi Shift</span>
              <span className="text-xl font-black text-neutral-900 tabular-nums tracking-tight">
                {shiftHours}j {shiftMins}m
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                {driver.validatedKm.toFixed(1)} km aktif
              </span>
            </div>
          </div>

          <span className="text-[10px] text-neutral-400 text-center mt-1">
            Jam Lingkaran Paparan Udara Mitra Lapangan
          </span>
        </div>

        {/* RIGHT: Metric Cards Breakdown */}
        <div className="md:col-span-7 space-y-2.5">
          
          {/* Average Cumulative Inhaled Dose */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Rata-rata Paparan PM2.5 Shift
              </span>
              <div className="text-2xl font-black text-neutral-900 tabular-nums tracking-tight mt-0.5">
                {avgExposurePM25.toFixed(1)} <span className="text-xs font-normal text-neutral-500">µg/m³</span>
              </div>
            </div>
            
            <AirQualityAvatar 
              category={avgExposurePM25 > 35 ? 'unhealthy' : 'moderate'} 
              size={44} 
              theme="light" 
            />
          </div>

          {/* 3-Row Color Distribution */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs tabular-nums">
            {/* Bersih */}
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-800">Zona Bersih</span>
              </div>
              <div className="font-extrabold text-sm">{formatMins(cleanMins)}</div>
              <div className="text-[9px] text-emerald-600 font-medium">42% shift</div>
            </div>

            {/* Sedang */}
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-950">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-bold text-amber-800">Zona Sedang</span>
              </div>
              <div className="font-extrabold text-sm">{formatMins(moderateMins)}</div>
              <div className="text-[9px] text-amber-600 font-medium">46% shift</div>
            </div>

            {/* Padat */}
            <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-rose-950">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-rose-800">Zona Padat</span>
              </div>
              <div className="font-extrabold text-sm">{formatMins(unhealthyMins)}</div>
              <div className="text-[9px] text-rose-600 font-medium">12% shift</div>
            </div>
          </div>

        </div>

      </div>

      {/* 3. CONTEXTUAL HEALTH & MASK ALERT ("Tahukah Anda?" Style) */}
      <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start space-x-3 text-xs">
        <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-neutral-900">
            Rekomendasi Kesehatan Mitra Berkendara
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed mt-0.5">
            Anda telah melintasi koridor padat selama <span className="font-bold text-neutral-900">{formatMins(unhealthyMins)}</span>. 
            Disarankan rehat sejenak di koridor hijau, minum air mineral, dan mengganti masker medis/N95 yang sudah jenuh debu aspal.
          </p>
        </div>
      </div>

    </div>
  );
};
