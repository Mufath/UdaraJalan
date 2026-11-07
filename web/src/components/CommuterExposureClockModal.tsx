import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Home, 
  Briefcase, 
  Bike, 
  ShieldCheck, 
  Sparkles, 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  Info,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { RoadSegment, NavigationComparison } from '../types';
import { AirQualityAvatar } from './AirQualityAvatar';

interface CommuterExposureClockModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoad: RoadSegment | null;
  routeComparison: NavigationComparison;
}

type ExposureFilter = 'all' | 'home' | 'commute' | 'work';

/**
 * 24-Hour Commuter Exposure Clock Modal
 * Directly adapted from IQAir's "Today's Exposure" 24h Clock (Screenshots 3 & 4),
 * transformed for UdaraJalan's Mobility-First Urban Commuters (PRD Persona 2):
 * - 24-hour circular radial dial with current time needle.
 * - Commuter inhalation dose calculator (Clean Air Route savings: -38% to -63%).
 * - Routine setup cards (+ Lokasi Rumah, + Lokasi Kerja, + Jam Berangkat).
 * - "Tahukah Anda?" Air literacy educational card.
 * - Strictly zero gradient slop, pure native system design (DESIGN.md).
 */
export const CommuterExposureClockModal: React.FC<CommuterExposureClockModalProps> = ({
  isOpen,
  onClose,
  selectedRoad,
  routeComparison
}) => {
  const [filter, setFilter] = useState<ExposureFilter>('all');
  const [homeLocation, setHomeLocation] = useState('Rungkut Asri, Surabaya');
  const [workLocation, setWorkLocation] = useState('Tunjungan Plaza, Surabaya Pusat');
  const [isEditingHome, setIsEditingHome] = useState(false);
  const [isEditingWork, setIsEditingWork] = useState(false);

  if (!isOpen) return null;

  // 24-hour segments breakdown
  // 00:00 - 07:00: Rumah (7h) -> 9.5 µg/m³
  // 07:00 - 08:30: Komuter Pagi (1.5h) -> 16.4 µg/m³ (Clean Route)
  // 08:30 - 17:00: Kantor (8.5h) -> 12.0 µg/m³
  // 17:00 - 18:30: Komuter Sore (1.5h) -> 24.0 µg/m³
  // 18:30 - 24:00: Rumah (5.5h) -> 10.5 µg/m³
  const averageDailyPM = 12.8; // Daily weighted average
  const standardFastestPM = 21.4; // If commuter took congested route
  const savedPercentage = Math.round(((standardFastestPM - averageDailyPM) / standardFastestPM) * 100);

  // 24-hour angle for 14:00 (afternoon): (14 / 24) * 360 = 210 degrees
  const currentHour = 14;
  const needleAngle = (currentHour / 24) * 360;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Main Surface */}
      <div className="relative w-full max-w-xl bg-white rounded-[28px] border border-neutral-200/90 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Header (IQAir Today's Exposure Style) */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50 shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight">
              Jam Paparan Kualitas Udara 24 Jam
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Akumulasi dosis inhalasi partikulat komuter sepanjang hari
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Tutup Dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Filter Pills (All | Home | Commute | Work) */}
        <div className="px-5 py-2.5 border-b border-neutral-100 bg-white flex items-center space-x-2 shrink-0 overflow-x-auto no-scrollbar">
          {(['all', 'commute', 'work', 'home'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 capitalize ${
                filter === item
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
              }`}
            >
              {item === 'all' ? 'Semua 24 Jam' : item === 'commute' ? 'Perjalanan (Jalan Raya)' : item === 'work' ? 'Tempat Kerja' : 'Di Rumah'}
            </button>
          ))}
        </div>

        {/* 3. Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar flex-1">
          
          {/* Radial 24h Clock Gauge (Clean Vector SVG) */}
          <div className="flex flex-col items-center justify-center py-2 select-none">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                {/* 24-Hour Outer Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#F2F2F7"
                  strokeWidth="16"
                />

                {/* 1. Rumah Malam (00:00 - 07:00 -> 7h / 24h = 29.1%) */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray={`${(7 / 24) * 502.6} 502.6`}
                  strokeDashoffset="0"
                  strokeLinecap="butt"
                />

                {/* 2. Komuter Pagi (07:00 - 08:30 -> 1.5h / 24h = 6.25%) */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="16"
                  strokeDasharray={`${(1.5 / 24) * 502.6} 502.6`}
                  strokeDashoffset={`-${(7 / 24) * 502.6}`}
                  strokeLinecap="butt"
                />

                {/* 3. Kantor / Kampus (08:30 - 17:00 -> 8.5h / 24h = 35.4%) */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray={`${(8.5 / 24) * 502.6} 502.6`}
                  strokeDashoffset={`-${(8.5 / 24) * 502.6}`}
                  strokeLinecap="butt"
                />

                {/* 4. Komuter Sore (17:00 - 18:30 -> 1.5h / 24h = 6.25%) */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="16"
                  strokeDasharray={`${(1.5 / 24) * 502.6} 502.6`}
                  strokeDashoffset={`-${(17 / 24) * 502.6}`}
                  strokeLinecap="butt"
                />

                {/* 5. Rumah Malam (18:30 - 24:00 -> 5.5h / 24h = 22.9%) */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="16"
                  strokeDasharray={`${(5.5 / 24) * 502.6} 502.6`}
                  strokeDashoffset={`-${(18.5 / 24) * 502.6}`}
                  strokeLinecap="butt"
                />

                {/* Concentric Inner Ring (Microclimate Comfort) */}
                <circle
                  cx="100"
                  cy="100"
                  r="66"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
              </svg>

              {/* 24-Hour Numerical Graduations (0h, 6h, 12h, 18h) */}
              <span className="absolute top-2 text-[10px] font-bold text-neutral-400">0h</span>
              <span className="absolute right-2 text-[10px] font-bold text-neutral-400">6</span>
              <span className="absolute bottom-2 text-[10px] font-bold text-neutral-400">12</span>
              <span className="absolute left-2 text-[10px] font-bold text-neutral-400">18</span>

              {/* Needle Pointer Indicator at Current Time (14:00) */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700"
                style={{ transform: `rotate(${needleAngle}deg)` }}
              >
                <div className="w-1.5 h-16 bg-neutral-900 rounded-full -translate-y-8 flex items-start justify-center shadow-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-600 -mt-1 ring-2 ring-white" />
                </div>
              </div>

              {/* Center Card Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                <AirQualityAvatar category="good" size={44} theme="light" />
                <div className="text-xl font-black text-neutral-900 tabular-nums tracking-tight mt-1 leading-none">
                  {averageDailyPM.toFixed(1)} <span className="text-[10px] font-medium text-neutral-500">µg/m³</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
                  Dosis Harian: Bersih
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-medium text-neutral-500 mt-2">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Rumah (12.5j)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Komuter Pagi</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Komuter Sore</span>
              </span>
            </div>
          </div>

          {/* Dosis Savings Highlight Card (Core Value of UdaraJalan) */}
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/70 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Penghematan Paparan Polusi
                </span>
                <div className="text-sm font-extrabold text-neutral-900 tracking-tight">
                  Hemat -{savedPercentage}% Dosis Inhalasi PM2.5
                </div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  Berkat memilih <strong className="text-emerald-900">Rute Rendah Polusi</strong> saat komuter pagi & sore
                </div>
              </div>
            </div>

            <span className="text-xl font-black text-emerald-700 tabular-nums shrink-0">
              -38%
            </span>
          </div>

          {/* Routine Location Configuration Cards (IQAir + Set Home / Work Style) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Rute Komuter Harian Anda
            </span>

            {/* Home Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4 text-neutral-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 truncate">Titik Rumah</div>
                  <div className="text-[11px] text-neutral-500 truncate">{homeLocation}</div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                Teratur
              </span>
            </div>

            {/* Work Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 text-neutral-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-neutral-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-neutral-900 truncate">Titik Kantor / Tujuan</div>
                  <div className="text-[11px] text-neutral-500 truncate">{workLocation}</div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                Teratur
              </span>
            </div>
          </div>

          {/* "Tahukah Anda?" Educational Insight Card (IQAir Screenshot 4 Style) */}
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-900">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Tahukah Anda?</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Meskipun waktu komuter di jalan raya hanya menghabiskan 10–15% dari total hari kita, 
              <strong> lebih dari 60% dosis racun partikulat PM2.5 yang masuk ke paru-paru terjadi di jalan raya saat jam sibuk</strong>. 
              Menghindari koridor macet dengan Rute Rendah Polusi UdaraJalan secara kumulatif melindungi fungsi organ pernapasan jangka panjang.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs shrink-0">
          <span className="text-[11px] text-neutral-400">
            Dihitung otomatis dari fusi GPS dan telemetri armada motor listrik
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
