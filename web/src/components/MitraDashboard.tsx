import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Info,
  ChevronDown,
  ChevronUp,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Clock,
  Newspaper,
  Sun,
  Cloud,
  CloudSun,
  Flame,
  Leaf,
  Volume2,
  VolumeX,
  Play,
  Pause,
  MapPin,
  CheckCircle2,
  FileEdit,
  ArrowRight,
  TrendingUp,
  Bike,
  BarChart3,
  RotateCw,
  Gauge,
  Wind,
  Compass
} from 'lucide-react';
import { DriverState, H3Mission } from '../types';
import { MiniH3Map } from './MiniH3Map';
import { StackedBars } from './StackedBars';

interface MitraDashboardProps {
  driver: DriverState;
  mission: H3Mission;
  onToggleAnomaly: () => void;
  onNavigateMission: () => void;
  activeCity?: 'surabaya' | 'jakarta';
}

export const MitraDashboard: React.FC<MitraDashboardProps> = ({
  driver,
  mission,
  onToggleAnomaly,
  onNavigateMission,
  activeCity = 'surabaya'
}) => {
  const [showH3Explanation, setShowH3Explanation] = useState(false);
  const [isCleaningFan, setIsCleaningFan] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(true);
  const [shiftSeconds, setShiftSeconds] = useState(15840); // 4 hours 24 mins
  const [fieldNote, setFieldNote] = useState('Catatan rute: Debu semen konstruksi galian MRT cukup padat di sekitar Dukuh Atas. Laju rata-rata 32 km/j.');
  const [noteSavedTime, setNoteSavedTime] = useState('Baru saja');
  const [selectedDayIndex, setSelectedDayIndex] = useState(6); // Default Sunday (Today)
  const [barsColour, setBarsColour] = useState<'Colour' | 'Mono'>('Colour');

  // 7-day validated distance data for Activity Widget (Inspired by reference Activity card)
  const weeklyActivity = [
    { day: 'Sen', km: 28.5, points: 11400, cash: 1425000, height: 60 },
    { day: 'Sel', km: 34.2, points: 13680, cash: 1710000, height: 75 },
    { day: 'Rab', km: 31.0, points: 12400, cash: 1550000, height: 68 },
    { day: 'Kam', km: 42.8, points: 17120, cash: 2140000, height: 92 },
    { day: 'Jum', km: 45.1, points: 18040, cash: 2255000, height: 100 },
    { day: 'Sab', km: 39.0, points: 15600, cash: 1950000, height: 85 },
    { 
      day: 'Min', 
      km: driver.validatedKm, 
      points: driver.accumulatedPoints, 
      cash: driver.todayEarningsRupiah, 
      height: Math.min(100, Math.round((driver.validatedKm / 48) * 100)), 
      isToday: true 
    }
  ];

  const selectedDay = weeklyActivity[selectedDayIndex];

  // Shift Timer counter
  useEffect(() => {
    if (!isShiftActive) return;
    const interval = setInterval(() => {
      setShiftSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isShiftActive]);

  const formatShiftTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressRatio = Math.min(driver.accumulatedPoints / driver.dailyTargetPoints, 1);
  const progressPercentage = Math.round(progressRatio * 100);

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider font-mono">
              Live Armada Telemetri
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            Ringkasan Mitra Lapangan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            {driver.name} <span className="text-neutral-300">•</span> {driver.fleetId} <span className="text-neutral-300">•</span> Smooth Z3 EV
          </p>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-neutral-200/80 shadow-xs text-xs">
            <span className="text-neutral-500 font-medium">Baterai LiFePO4:</span>
            <span className="font-mono font-bold text-neutral-900">{driver.batteryPercentage}%</span>
          </div>
          <button
            onClick={onToggleAnomaly}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              driver.isSimulatingAnomaly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 shadow-xs'
            }`}
          >
            {driver.isSimulatingAnomaly ? '⚠ Mode Anomali Aktif' : 'Simulasi Anomali'}
          </button>
        </div>
      </div>

      {/* ========================================================
          GRID ROW 1: 4 Cards (Inspired by Reference Top Row)
          1. Sensor Pulse / Audio Equalizer Card
          2. Flight-style H3 Corridor Trajectory Card
          3. Rich Sky-Blue Weather Card
          4. Top Stories / Warta Lapangan Card
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Sensirion SPS30 Laser Particulate Telemetry Card (Apple Eco-Emerald Style) */}
        <div className="flex flex-col">
          <span className="widget-overline mb-1.5">
            <Gauge className="w-3 h-3 text-neutral-400" />
            Telemetri Laser Partikulat (SPS30)
          </span>
          <div className="rounded-[28px] p-5 bg-[#059669] text-white shadow-lg shadow-emerald-950/10 flex flex-col justify-between flex-1 transition-all duration-300">
            <div>
              {/* Sensor Header + Status Pill */}
              <div className="flex items-center space-x-3 mb-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
                  <Wind className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">
                    Sensirion SPS30
                  </div>
                  <div className="text-xs text-emerald-100 truncate">
                    Laser Optical Particle Counter
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-[10px] text-emerald-100 font-mono font-bold">
                      1 Hz Real-time Stream
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Value: PM2.5 Tabular Figure */}
              <div className="bg-white/15 backdrop-blur-sm p-3.5 rounded-2xl mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-emerald-100 uppercase font-semibold">
                    Konsentrasi PM2.5
                  </span>
                  <span className="px-2 py-0.5 bg-white/25 text-white rounded-md text-[10px] font-bold font-mono">
                    Sedang (Baku 15–35)
                  </span>
                </div>
                <div className="flex items-baseline space-x-2 font-mono">
                  <span className="text-3xl font-extrabold text-white tracking-tight tabular-nums">
                    18.2
                  </span>
                  <span className="text-xs font-semibold text-emerald-100">µg/m³</span>
                </div>

                {/* 4-tier PM2.5 Quality Segmented Bar */}
                <div className="mt-2.5">
                  <div className="relative w-full">
                    <div className="grid grid-cols-4 gap-1 h-2 rounded-full overflow-hidden bg-black/20">
                      <div className="bg-emerald-300 h-full rounded-l-full" title="Baik (0-15)" />
                      <div className="bg-amber-300 h-full" title="Sedang (15-35)" />
                      <div className="bg-orange-400 h-full" title="Tidak Sehat (35-55)" />
                      <div className="bg-rose-400 h-full rounded-r-full" title="Bahaya (55+)" />
                    </div>
                    {/* Active Needle Pin at 18.2 µg/m³ */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-[#059669] rounded-full shadow-sm"
                      style={{ left: '33%' }}
                      title="18.2 µg/m³ (Baku Mutu Ambang)"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-emerald-100 mt-1">
                    <span>0 Baik</span>
                    <span>15 Ambang</span>
                    <span>35 Sedang</span>
                    <span>55+ Bahaya</span>
                  </div>
                </div>
              </div>

              {/* Sub-channel readings: PM1.0 & PM10 */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-2">
                <div className="px-2.5 py-1.5 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-between text-white">
                  <span className="text-[10px] text-emerald-100">PM1.0:</span>
                  <span className="font-bold text-white">9.4 µg/m³</span>
                </div>
                <div className="px-2.5 py-1.5 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-between text-white">
                  <span className="text-[10px] text-emerald-100">PM10:</span>
                  <span className="font-bold text-white">24.6 µg/m³</span>
                </div>
              </div>
            </div>

            {/* Self-cleaning Fan Routine */}
            <div className="flex items-center justify-between pt-2.5 border-t border-white/20">
              <div className="text-[10px] text-emerald-100 font-mono">
                {isCleaningFan ? (
                  <span className="text-white font-semibold animate-pulse">Membersihkan debu optik...</span>
                ) : (
                  <span>Pembersihan laser: <strong className="text-white">4.8 jam lagi</strong></span>
                )}
              </div>
              <button
                onClick={() => {
                  setIsCleaningFan(true);
                  setTimeout(() => setIsCleaningFan(false), 3500);
                }}
                disabled={isCleaningFan}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-mono font-semibold transition-all active:scale-95 disabled:opacity-60"
                title="Jalankan siklus motor kipas pembersih debu optik"
              >
                <RotateCw className={`w-3 h-3 ${isCleaningFan ? 'animate-spin text-white' : 'text-white'}`} />
                <span>{isCleaningFan ? 'Membersihkan' : 'Siklus Laser'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: Trajektori Misi Koridor Spasial (Flight style SFO -> JFK in reference) */}
        <div className="flex flex-col">
          <span className="widget-overline mb-1.5">
            <Bike className="w-3 h-3 text-neutral-400" />
            Trajektori Misi Koridor
          </span>
          <div className="ref-card p-5 flex flex-col justify-between flex-1">
            <div>
              {/* Header with On-time / Multiplier badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-900 font-mono">
                  Misi • H3-886541
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[11px] font-bold">
                  Multiplier 2.0x
                </span>
              </div>

              {/* Origin -> Trajectory -> Destination */}
              <div className="flex items-center justify-between my-2">
                <div>
                  <div className="text-xl font-extrabold text-neutral-900 font-mono tracking-tight">
                    SNY
                  </div>
                  <div className="text-[11px] text-neutral-400">Senayan</div>
                </div>

                {/* Trajectory Arc Graphic */}
                <div className="flex-1 px-3 flex flex-col items-center">
                  <div className="text-[10px] text-neutral-400 font-mono mb-0.5">18 mnt • 6.2 km</div>
                  <div className="w-full relative flex items-center justify-center">
                    <div className="w-full border-t-2 border-dashed border-blue-400" />
                    <div className="absolute w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                      <Bike className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-extrabold text-neutral-900 font-mono tracking-tight">
                    DKH
                  </div>
                  <div className="text-[11px] text-neutral-400">Dukuh Atas</div>
                </div>
              </div>

              {/* Time Breakdown */}
              <div className="flex items-center justify-between text-xs font-mono mt-3 pt-2 border-t border-neutral-100">
                <div>
                  <div className="font-bold text-neutral-900">09:40</div>
                  <div className="text-[10px] text-neutral-400">Mulai • WIB</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-neutral-900">10:02</div>
                  <div className="text-[10px] text-neutral-400">Estimasi Tiba</div>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <button
                onClick={onNavigateMission}
                className="w-full flex items-center justify-center space-x-1.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl transition-all active:scale-[0.98] shadow-xs"
              >
                <span>Navigasi Koridor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3: Kondisi Atmosfer & Cuaca (Sky-Blue Weather Card from Reference) */}
        <div className="flex flex-col">
          <span className="widget-overline mb-1.5">
            <Sun className="w-3 h-3 text-neutral-400" />
            Kondisi Atmosfer & Cuaca
          </span>
          <div className="rounded-[28px] p-5 bg-[#0284c7] text-white shadow-lg shadow-sky-950/10 flex flex-col justify-between flex-1 transition-all duration-300">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-sky-100 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-sky-200" />
                    <span>Jakarta Pusat</span>
                  </div>
                  <div className="text-4xl font-extrabold tracking-tight mt-1 font-mono text-white">
                    31.2°
                  </div>
                  <div className="text-xs text-sky-100 mt-0.5">
                    Cerah Berawan <span className="text-white/60">•</span> RH 68%
                  </div>
                </div>

                {/* Sun Icon in Frosted Squircle */}
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                  <Sun className="w-6 h-6 text-amber-200 fill-amber-200" />
                </div>
              </div>
            </div>

            {/* 5-Day Forecast Grid */}
            <div className="grid grid-cols-5 gap-1.5 pt-4 text-center">
              {[
                { time: 'Sen', val: '18µg' },
                { time: 'Sel', val: '22µg' },
                { time: 'Rab', val: '15µg' },
                { time: 'Kam', val: '28µg' },
                { time: 'Jum', val: '34µg' }
              ].map((slot, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl py-2 px-1">
                  <div className="text-[10px] text-sky-100 font-mono">{slot.time}</div>
                  <div className="text-[11px] font-bold font-mono text-white mt-0.5">{slot.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 4: Top Stories / Warta Kualitas Udara */}
        <div className="flex flex-col">
          <span className="widget-overline mb-1.5">
            <Newspaper className="w-3 h-3 text-neutral-400" />
            Warta & Notifikasi Emisi
          </span>
          <div className="ref-card p-5 flex flex-col justify-between flex-1">
            <div>
              {/* Header with Live Status Indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-900">Kabar Terkini</span>
                <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>Live</span>
                </span>
              </div>

              {/* 3 Story Items with Colorful Solid Squircles (Exact Reference Style) */}
              <div className="space-y-3">
                
                {/* Story 1: Tangerine Orange Squircle */}
                <div className="flex items-start space-x-2.5 group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-[#f97316] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      Insentif H3 Koridor 2x Dibuka
                    </div>
                    <div className="text-[10px] text-neutral-400">Prioritas Emisi • Sudirman</div>
                  </div>
                </div>

                {/* Story 2: Cobalt Blue Squircle */}
                <div className="flex items-start space-x-2.5 group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      Validasi Anti-Cheat Lolos
                    </div>
                    <div className="text-[10px] text-neutral-400">14.850 Poin Tervalidasi</div>
                  </div>
                </div>

                {/* Story 3: Emerald Green Squircle */}
                <div className="flex items-start space-x-2.5 group cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-neutral-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      38.4 km Koridor Berhasil Terpetakan
                    </div>
                    <div className="text-[10px] text-neutral-400">Jejaring Sensor Bergerak DKI</div>
                  </div>
                </div>

              </div>
            </div>

            <div className="pt-2 text-right">
              <span className="text-[10px] text-neutral-400 font-mono">Diperbarui 1m lalu</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          GRID ROW 2: 3 Cards
          1. Location Mini-Map Card (Point Reyes style in reference)
          2. Activity & Validasi Poin with Pastel/Electric Blue Bars
          3. Catatan Lapangan / Quick Note Card (Draft saved style)
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* CARD 5: Location Mini-Map Card (4 Cols) */}
        <div className="md:col-span-4 flex flex-col">
          <span className="widget-overline mb-1.5">
            <MapPin className="w-3 h-3 text-neutral-400" />
            Lokasi Zona Prioritas Misi
          </span>
          <div className="ref-card p-4 flex flex-col justify-between flex-1">
            <div>
              {/* Map Canvas with rounded borders */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200/80 mb-3 shadow-inner">
                <MiniH3Map activeCity={activeCity} onNavigate={onNavigateMission} />
              </div>

              {/* Location Info Pill Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {mission.zoneName}
                  </h3>
                  <div className="text-[11px] text-neutral-400">
                    Radius ±500m • Heksagon H3
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-full text-xs font-semibold font-mono">
                  12 min drive
                </span>
              </div>
            </div>

            {/* Rate Breakdown */}
            <div className="mt-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-500">Tarif Standar</span>
                <span className="text-neutral-400">+ Bonus Zona</span>
                <span className="font-bold text-emerald-600">Total Tarif</span>
              </div>
              <div className="flex items-center justify-between text-sm font-mono font-bold mt-1 text-neutral-900">
                <span>Rp120</span>
                <span className="text-neutral-400 text-xs font-normal">+ Rp120</span>
                <span className="text-emerald-700">Rp240 / km</span>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 flex overflow-hidden">
                <div className="w-1/2 bg-sky-400 h-full" />
                <div className="w-1/2 bg-emerald-600 h-full" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 6: Activity Bar Chart Card with Pastel / Electric Blue Pill Bars (4 Cols) */}
        <div className="md:col-span-4 flex flex-col">
          <span className="widget-overline mb-1.5">
            <Activity className="w-3 h-3 text-neutral-400" />
            Aktivitas & Validasi Poin
          </span>
          <div className="ref-card p-5 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-mono">
                  Target: {driver.dailyTargetPoints.toLocaleString('id-ID')} pts
                </span>
                <span className="text-xs font-semibold text-emerald-600 font-mono">
                  Rp{driver.todayEarningsRupiah.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Big Metric: 34pt Tabular Figure (Like "3.1 km today" in reference) */}
              <div className="flex items-baseline space-x-2 font-mono mb-3">
                <span className="text-3xl font-extrabold text-neutral-900 tracking-tight tabular-nums">
                  {selectedDay.km.toFixed(1)}
                </span>
                <span className="text-xs font-bold text-neutral-400">km {selectedDay.isToday ? 'hari ini' : `(${selectedDay.day})`}</span>
              </div>

              {/* 7-Day Histogram with Pill Bars (Exact reference style: pastel sky-blue + active electric blue) */}
              <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-100 my-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono mb-2">
                  <span>Histogram Mingguan</span>
                  <span className="text-blue-600 font-bold tabular-nums">
                    {selectedDay.points.toLocaleString('id-ID')} pts
                  </span>
                </div>

                <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1">
                  {weeklyActivity.map((item, idx) => {
                    const isSelected = selectedDayIndex === idx;
                    return (
                      <button
                        key={item.day}
                        onClick={() => setSelectedDayIndex(idx)}
                        className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group focus:outline-none"
                      >
                        <div className="w-full bg-neutral-200/50 rounded-full h-full flex items-end overflow-hidden p-0.5">
                          <div 
                            className={`w-full rounded-full transition-all duration-300 ${
                              isSelected
                                ? 'bg-blue-600 shadow-xs'
                                : 'bg-neutral-200 hover:bg-neutral-300'
                            }`}
                            style={{ height: `${item.height}%` }}
                            title={`${item.day}: ${item.km} km (${item.points} pts)`}
                          />
                        </div>
                        <span className={`text-[10px] font-mono transition-colors ${
                          isSelected ? 'font-bold text-blue-600' : 'text-neutral-400 group-hover:text-neutral-700'
                        }`}>
                          {item.day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Daily Target Progress */}
            <div className="pt-2 border-t border-neutral-100">
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono mt-1.5">
                <span className="tabular-nums font-semibold text-neutral-900">{progressPercentage}% tercapai</span>
                <span className="tabular-nums">{driver.validatedKm.toFixed(1)} / 50 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 7: Bencho Stacked Bars - Fusi Telemetri 4 Sensor Clip-on & Anti-Cheat (4 Cols) */}
        <div className="md:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="widget-overline">
              <Radio className="w-3 h-3 text-neutral-400" />
              Fusi 4 Sensor & Anti-Cheat
            </span>
            <div className="flex items-center space-x-1.5">
              {driver.isSimulatingAnomaly && (
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-neutral-100 text-rose-700 border border-rose-300 rounded text-[9px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Anomali Aktif</span>
                </span>
              )}
              <button
                onClick={() => setBarsColour(prev => prev === 'Colour' ? 'Mono' : 'Colour')}
                className="px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-full text-[10px] font-mono font-medium transition-colors"
                title="Ganti palet warna (Colour / Mono)"
              >
                {barsColour}
              </button>
            </div>
          </div>
          <div className="ref-card p-5 flex flex-col justify-between flex-1">
            <div className="w-full">
              <StackedBars 
                embedded={true}
                colour={barsColour} 
                bars={20} 
                width="100%"
                title="Fusi Telemetri"
                subtitle="SPS30 • SHT40 • GNSS • IMU"
                unit="sampel valid"
                categories={["SPS30 (PM2.5)", "SHT40 (Termal)", "GNSS (Spasial)", "IMU (Vibrasi)"]}
                escalatedLabel="Anomali Mock GPS"
                isSimulatingAnomaly={driver.isSimulatingAnomaly}
              />
            </div>

            {/* Micro Sensor Indicator Legend */}
            <div className="w-full mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-[#8b5cf6]" />
                <span>SPS30</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-[#0ea5e9]" />
                <span>SHT40</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-[#f59e0b]" />
                <span>GNSS</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-xs bg-[#10b981]" />
                <span>IMU</span>
              </span>
              <span className="flex items-center space-x-1 text-rose-600 font-semibold">
                <span className="w-2 h-2 rounded-xs bg-[#ef4444]" />
                <span>Anomali</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          GRID ROW 3: 3 Rich Technical Cards
          1. Focus Timer / Shift Monitoring Card (Dark Midnight Style from Reference)
          2. Integritas Sensor & Seismograf Getaran (Live SVG Wave)
          3. Telemetri Spektrum SPS30 & SHT40 Hardware Meters
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* CARD 8: Sesi Shift Monitoring (Apple Timer Widget) (4 Cols) */}
        <div className="md:col-span-4 flex flex-col">
          <span className="widget-overline mb-1.5">
            <Clock className="w-3 h-3 text-neutral-400" />
            Sesi Shift & Timer Telemetri
          </span>
          <div className="rounded-[28px] p-5 bg-[#ea580c] text-white shadow-lg shadow-orange-950/20 flex flex-col justify-between flex-1 transition-all duration-300">
            <div>
              {/* Header with In-Progress Indicator */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1.5 text-white/95">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold tracking-tight">Shift Telemetri</span>
                </div>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white rounded-full text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>{isShiftActive ? 'Berjalan' : 'Dijeda'}</span>
                </span>
              </div>

              {/* Circular Clock Display with Generous Breathing Room */}
              <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* SVG Circular Progress Ring */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="41"
                      stroke="rgba(255, 255, 255, 0.22)"
                      strokeWidth="3.5"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="41"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeDasharray="257.6"
                      strokeDashoffset={isShiftActive ? "64" : "140"}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  
                  {/* Digital Clock with Balanced Padding */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                    <span className="text-[26px] font-black tracking-tight tabular-nums text-white leading-none">
                      {formatShiftTime(shiftSeconds)}
                    </span>
                    <span className="text-[11px] text-white/80 font-medium mt-1">Waktu Operasi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Sub-Metrics & Pause Button */}
            <div className="pt-3 border-t border-white/20 space-y-2.5">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                  <div className="text-white/80 text-[10px] font-medium">Tervalidasi</div>
                  <div className="font-extrabold text-white text-base mt-0.5 tabular-nums">{driver.validatedKm} km</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                  <div className="text-white/80 text-[10px] font-medium">Laju Lacak</div>
                  <div className="font-extrabold text-white text-base mt-0.5 tabular-nums">{driver.currentSpeed} km/j</div>
                </div>
              </div>

              <button
                onClick={() => setIsShiftActive(!isShiftActive)}
                className="w-full py-3 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-xs shadow-sm transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                {isShiftActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-neutral-900" />
                    <span>Jeda Sesi Shift</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-neutral-900" />
                    <span>Lanjutkan Shift</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CARD 9: Integritas Fusi Sensor & Seismograf Getaran (4 Cols) */}
        <div className="md:col-span-4 flex flex-col">
          <span className="widget-overline mb-1.5">
            <ShieldCheck className="w-3 h-3 text-neutral-400" />
            Integritas Fusi Sensor & Anti-Curang
          </span>
          <div className="ref-card p-5 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500">
                  IMU & GNSS Correlation
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono ${
                  driver.isAntiCheatPassed 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {driver.isAntiCheatPassed ? 'Validasi Lolos' : '⚠ Anomali'}
                </span>
              </div>

              {/* Seismograph Waveform Container */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 my-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-neutral-500">Sensor Getaran Motor (IMU)</span>
                  <span className={`font-semibold ${driver.isSimulatingAnomaly ? 'text-amber-600' : 'text-neutral-900'}`}>
                    {driver.accelerometerRMS.toFixed(2)}g RMS {driver.isSimulatingAnomaly ? '(Diam)' : '(Aktif)'}
                  </span>
                </div>

                {/* Waveform SVG Graph */}
                <div className="h-14 w-full bg-white rounded-xl border border-neutral-200/70 p-1 flex items-center justify-center overflow-hidden shadow-inner">
                  {driver.isSimulatingAnomaly ? (
                    // Flatline stationary line when simulating desk anomaly
                    <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <line x1="0" y1="20" x2="200" y2="20" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
                    </svg>
                  ) : (
                    // Realistic vibration waveform when driving
                    <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path 
                        d="M 0 20 Q 10 5, 20 20 T 40 20 T 60 8 T 80 32 T 100 20 T 120 12 T 140 28 T 160 16 T 180 24 T 200 20" 
                        fill="none" 
                        stroke="#2563eb" 
                        strokeWidth="2" 
                      />
                    </svg>
                  )}
                </div>

                {/* Dual Range Indicators */}
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                  <div className="bg-white p-2 rounded-xl border border-neutral-200/60">
                    <div className="text-neutral-400">Laju GNSS</div>
                    <div className="text-sm font-bold text-neutral-900 mt-0.5 tabular-nums">{driver.currentSpeed} km/j</div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, (driver.currentSpeed / 65) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-neutral-200/60">
                    <div className="text-neutral-400">Ambang Vibrasi</div>
                    <div className="text-sm font-bold text-neutral-900 mt-0.5 tabular-nums">{driver.accelerometerRMS.toFixed(2)}g</div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${driver.isSimulatingAnomaly ? 'bg-amber-500' : 'bg-emerald-600'}`} 
                        style={{ width: `${Math.min(100, (driver.accelerometerRMS / 0.5) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle Anomaly Button */}
            <div className="pt-2 border-t border-neutral-100">
              <button
                onClick={onToggleAnomaly}
                className={`w-full py-2 rounded-xl text-xs font-semibold transition-all border ${
                  driver.isSimulatingAnomaly
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200/90 shadow-xs'
                }`}
              >
                {driver.isSimulatingAnomaly ? 'Hentikan Simulasi Anomali' : 'Uji Anomali Mock GPS'}
              </button>
            </div>
          </div>
        </div>

        {/* CARD 10: Telemetri Spektrum SPS30 & SHT40 Hardware Meters (4 Cols) */}
        <div className="md:col-span-4 flex flex-col">
          <span className="widget-overline mb-1.5">
            <Radio className="w-3 h-3 text-neutral-400" />
            Telemetri Instrumen Lapangan
          </span>
          <div className="ref-card p-5 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-neutral-500">
                  SPS30 & SHT40 Calibrated
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                  MCERTS UK
                </span>
              </div>

              {/* PM2.5 Spectrum Gauge */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2 mb-3">
                <div className="flex items-baseline justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Sensirion SPS30</span>
                    <div className="text-2xl font-extrabold text-neutral-900">
                      18.2 <span className="text-xs font-normal text-neutral-500">µg/m³ PM2.5</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600">Sedang</span>
                    <div className="text-[10px] text-neutral-400">Baku 15–35</div>
                  </div>
                </div>

                {/* 4-tier PM2.5 Quality Segmented Bar */}
                <div className="space-y-1 pt-1">
                  <div className="relative w-full">
                    <div className="grid grid-cols-4 gap-1 h-2 rounded-full overflow-hidden bg-neutral-100">
                      <div className="bg-emerald-500 h-full rounded-l-full" />
                      <div className="bg-amber-400 h-full" />
                      <div className="bg-orange-500 h-full" />
                      <div className="bg-rose-500 h-full rounded-r-full" />
                    </div>
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-neutral-900 border-2 border-white shadow-sm"
                      style={{ left: '32%' }}
                      title="18.2 µg/m³ PM2.5"
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-neutral-400 mt-1">
                    <span>0 Baik</span>
                    <span>15 Ambang</span>
                    <span>35 Sedang</span>
                    <span>55+ Bahaya</span>
                  </div>
                </div>
              </div>

              {/* Secondary Visual Hardware Meters: SHT40 & LiFePO4 */}
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="p-2.5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                  <div className="text-[10px] text-neutral-400">Sensirion SHT40</div>
                  <div className="font-bold text-neutral-900 text-sm">31.2°C <span className="font-normal text-neutral-500">68%</span></div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="text-[9px] text-neutral-400">Suhu & Kelembaban</div>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-1">
                  <div className="text-[10px] text-neutral-400">Catu Daya LiFePO4</div>
                  <div className="font-bold text-neutral-900 text-sm tabular-nums">{driver.batteryPercentage}% <span className="font-normal text-neutral-500">~14j</span></div>
                  <div className="flex gap-1 mt-1.5">
                    <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                    <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                    <div className="h-1.5 flex-1 bg-emerald-500 rounded-full" />
                    <div className="h-1.5 flex-1 bg-neutral-200 rounded-full" />
                  </div>
                  <div className="text-[9px] text-neutral-400">3.200 mAh Mandiri</div>
                </div>
              </div>
            </div>

            {/* Laser Auto-Clean Countdown */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Pembersihan laser optik:</span>
              <span className="text-neutral-900 font-semibold">{driver.autoCleanCountdownHours} jam tersisa</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          GRID ROW 4: Catatan Lapangan Cepat
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-12 flex flex-col">
          <span className="widget-overline mb-1.5">
            <FileEdit className="w-3 h-3 text-neutral-400" />
            Catatan Lapangan Cepat Pengemudi
          </span>
          <div className="ref-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:max-w-xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-bold text-neutral-900">Catatan Kondisi Jalur & Polusi</span>
                <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-200/70 rounded-full text-[10px] font-semibold">
                  Draft • {noteSavedTime}
                </span>
              </div>
              <textarea
                value={fieldNote}
                onChange={(e) => {
                  setFieldNote(e.target.value);
                  setNoteSavedTime('Baru saja');
                }}
                className="w-full h-16 text-xs text-neutral-700 font-sans leading-relaxed bg-neutral-50/70 p-2.5 rounded-xl border border-neutral-200/70 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                placeholder="Tulis catatan kondisi jalan atau debu..."
              />
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <span className="text-[11px] text-neutral-400 font-mono">Tag Cepat Lapangan:</span>
              <div className="flex flex-wrap gap-1">
                {['#Galian', '#Macet', '#DebuSemen', '#JalurBersih'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFieldNote(prev => `${prev} ${tag}`)}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-mono transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
