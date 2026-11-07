import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trophy, 
  Share2, 
  ArrowUpRight, 
  Wind, 
  Thermometer, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Copy,
  TrendingUp,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { RoadSegment } from '../types';
import { getAirQualityMeta, pm25ToUsAqi } from '../lib/airQualityHelpers';
import { AirQualityAvatar } from './AirQualityAvatar';

interface StreetLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  roads: RoadSegment[];
  activeCity: 'surabaya' | 'jakarta';
  onSelectRoad: (road: RoadSegment) => void;
}

type LeaderboardTab = 'all' | 'cleanest' | 'polluted' | 'temperature';

/**
 * Live City & Street Air Quality Leaderboard
 * Directly inspired by IQAir's Live Ranking (Screenshot 5),
 * tailored to UdaraJalan's street-level crowdsensing (DESIGN.md):
 * - Live pulse indicator & shareable report card.
 * - Multi-criteria sorting (Cleanest, Most Polluted, Temperature).
 * - High-contrast AQI badges with zero gradient slop.
 * - Interactive link to fly directly to road segment on map.
 */
export const StreetLeaderboardModal: React.FC<StreetLeaderboardModalProps> = ({
  isOpen,
  onClose,
  roads,
  activeCity,
  onSelectRoad
}) => {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('all');
  const [copied, setCopied] = useState(false);

  // Sorted Road Segments based on active tab
  const sortedRoads = useMemo(() => {
    const list = [...roads];
    if (activeTab === 'cleanest') {
      return list.sort((a, b) => a.pm25 - b.pm25).slice(0, 10);
    }
    if (activeTab === 'polluted') {
      return list.sort((a, b) => b.pm25 - a.pm25).slice(0, 10);
    }
    if (activeTab === 'temperature') {
      return list.sort((a, b) => a.temperature - b.temperature);
    }
    // Default 'all': sorted by worst to best or best to worst
    return list.sort((a, b) => a.pm25 - b.pm25);
  }, [roads, activeTab]);

  // Cleanest & Polluted summary
  const cleanest = useMemo(() => [...roads].sort((a, b) => a.pm25 - b.pm25)[0], [roads]);
  const polluted = useMemo(() => [...roads].sort((a, b) => b.pm25 - a.pm25)[0], [roads]);

  if (!isOpen) return null;

  // Handle share / copy card
  const handleCopyShare = () => {
    const shareText = `Laporan Udara Real-time ${activeCity === 'surabaya' ? 'Surabaya' : 'DKI Jakarta'} (UdaraJalan):\n🍃 Terbersih: ${cleanest?.name} (${cleanest?.pm25} µg/m³)\n⚠️ Paling Berpolusi: ${polluted?.name} (${polluted?.pm25} µg/m³)\nDipantau armada motor listrik IoT mandiri.`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRowClick = (road: RoadSegment) => {
    onSelectRoad(road);
    onClose();
  };

  const cityName = activeCity === 'surabaya' ? 'Surabaya' : 'DKI Jakarta';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Main Modal Surface */}
      <div className="relative w-full max-w-2xl bg-white rounded-[28px] border border-neutral-200/90 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* 1. Header (IQAir Live Ranking Style) */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 bg-neutral-50/60 flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                LIVE • 13.00 - 14.00 WIB
              </span>
              <span className="text-neutral-300">•</span>
              <span className="text-[11px] text-neutral-500 font-medium">6 Nov 2026</span>
            </div>
            
            <h2 className="text-base sm:text-lg font-extrabold text-neutral-900 tracking-tight mt-0.5">
              Peringkat Kualitas Udara Ruas Jalan {cityName}
            </h2>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Share / Copy Button */}
            <button
              onClick={handleCopyShare}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-all active:scale-95 shadow-xs"
              title="Salin ringkasan peringkat ke clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="hidden sm:inline">Bagikan</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Tutup Peringkat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Filter Navigation Pills */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-neutral-100 bg-white flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-neutral-900 text-white font-bold shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Ruas ({roads.length})
          </button>
          
          <button
            onClick={() => setActiveTab('cleanest')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'cleanest'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100/70 border border-emerald-200/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Top 10 Terbersih</span>
          </button>

          <button
            onClick={() => setActiveTab('polluted')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'polluted'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100/70 border border-rose-200/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Top 10 Berpolusi</span>
          </button>

          <button
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'temperature'
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100/70 border border-sky-200/50'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-sky-500" />
            <span>Tersejuk (SHT40)</span>
          </button>
        </div>

        {/* 3. Table Column Headers */}
        <div className="px-5 py-2 bg-neutral-50/70 border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider grid grid-cols-12 gap-2 shrink-0">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 sm:col-span-6">Ruas Jalan & Area</div>
          <div className="col-span-3 sm:col-span-3 text-right">Mutu & PM2.5</div>
          <div className="col-span-2 sm:col-span-2 text-right">Suhu</div>
        </div>

        {/* 4. Scrollable Table Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-1 sm:p-2">
          {sortedRoads.map((road, index) => {
            const meta = getAirQualityMeta(road.category, road.pm25);
            const aqi = pm25ToUsAqi(road.pm25);
            const isModerate = road.category === 'moderate';

            return (
              <div
                key={road.id}
                onClick={() => handleRowClick(road)}
                className="grid grid-cols-12 gap-2 items-center px-3 sm:px-4 py-3 rounded-2xl hover:bg-neutral-50/90 transition-all cursor-pointer group text-xs"
              >
                {/* Rank # */}
                <div className="col-span-1 text-center font-bold tabular-nums">
                  {index < 3 ? (
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                      index === 0 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : index === 1 
                        ? 'bg-slate-200 text-slate-800' 
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {index + 1}
                    </span>
                  ) : (
                    <span className="text-neutral-400 font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Road Name & Area */}
                <div className="col-span-6 sm:col-span-6 min-w-0 pr-2">
                  <div className="font-bold text-neutral-900 truncate group-hover:text-blue-600 transition-colors flex items-center space-x-1.5">
                    <span className="truncate">{road.name.split('(')[0].trim()}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {road.area} • <span className="tabular-nums">{road.uniquePassesCount} armada</span>
                  </div>
                </div>

                {/* AQI Pill & PM2.5 */}
                <div className="col-span-3 sm:col-span-3 flex items-center justify-end space-x-2">
                  <span className="hidden sm:inline font-bold tabular-nums text-neutral-700">
                    {road.pm25.toFixed(1)} <span className="text-[10px] text-neutral-400 font-normal">µg</span>
                  </span>
                  
                  {/* Clean AQI Pill matching IQAir */}
                  <div 
                    className={`px-2.5 py-1 rounded-full text-xs font-black tabular-nums shrink-0 shadow-2xs ${
                      isModerate 
                        ? 'bg-[#f59e0b] text-neutral-950 font-black' 
                        : `${meta.solidBg} text-white`
                    }`}
                  >
                    {aqi}
                  </div>
                </div>

                {/* SHT40 Temperature */}
                <div className="col-span-2 sm:col-span-2 text-right tabular-nums font-semibold text-neutral-700">
                  <span>{road.temperature.toFixed(0)}°C</span>
                  <div className="text-[10px] text-neutral-400 hidden sm:block">
                    {road.humidity}% RH
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Footer Quick Tip */}
        <div className="p-3.5 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span className="text-[11px]">
            Klik pada ruas jalan mana pun untuk terbang langsung ke peta.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
