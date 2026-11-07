import React, { useState } from 'react';
import { Bike, AlertTriangle, BatteryMedium, Wind } from 'lucide-react';
import { DriverState } from '../types';
import { AirQualityAvatar } from './AirQualityAvatar';

interface DynamicIslandProps {
  driver: DriverState;
  onToggleAnomaly: () => void;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ driver, onToggleAnomaly }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Smooth fading backdrop when expanded */}
      <div
        onClick={() => setIsExpanded(false)}
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Anchor Container: Keeps header height rock-solid */}
      <div className="relative flex justify-center items-center h-[34px] w-[180px] select-none z-50">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className={`absolute top-0 right-0 sm:left-1/2 sm:-translate-x-1/2 bg-[#000000] text-white cursor-pointer overflow-hidden transition-[width,height,border-radius,box-shadow] duration-300 will-change-[width,height] ${
            isExpanded
              ? 'w-[min(356px,calc(100vw-24px))] h-[224px] rounded-[24px] shadow-[0_24px_50px_rgba(0,0,0,0.6)] border border-white/10 ring-1 ring-white/5 z-50'
              : 'w-[176px] h-[32px] rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98] border border-white/10'
          }`}
        >
          {/* 1. Compact Status Mode (Smooth Crossfade) */}
          <div
            className={`absolute inset-0 px-3 flex items-center justify-between transition-all duration-200 ${
              isExpanded
                ? 'opacity-0 scale-90 pointer-events-none invisible'
                : 'opacity-100 scale-100 pointer-events-auto visible'
            }`}
          >
            <div className="flex items-center space-x-2 text-neutral-300">
              <Bike className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[11px] font-medium tracking-tight">Telemetri</span>
            </div>
            <div className="flex items-center space-x-1.5 tabular-nums">
              <span className="text-[11px] font-semibold text-white">6.2 km</span>
              <span className="w-2 h-2 rounded-full bg-[#30d158]"></span>
            </div>
          </div>

          {/* 2. Expanded Live Activity Mode (Apple Pure Obsidian Glass Style - No X Button per iOS Standard) */}
          <div
            className={`w-full p-4 space-y-3.5 transition-all duration-250 ${
              isExpanded
                ? 'opacity-100 scale-100 pointer-events-auto delay-75 visible'
                : 'opacity-0 scale-95 pointer-events-none invisible absolute inset-x-0 top-0'
            }`}
          >
            {/* Header: Identity, Validated Distance & Tariff */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Bike className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Telemetri Armada</div>
                  <div className="text-[13px] font-bold text-white tracking-tight">6.2 km Tervalidasi</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">Tarif</div>
                  <div className="text-[11px] tabular-nums font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full font-mono">
                    +Rp120/km
                  </div>
                </div>
              </div>
            </div>

            {/* Hardware & Exposure Tiles:
                1. Kontainer "Kondisi Paparan" (dengan Avatar Dampak Paparan & PM2.5, bukan menempel pada chip sensor teknis)
                2. LiFePO4 Power & Battery
            */}
            <div className="grid grid-cols-2 gap-2.5 text-left">
              {/* Tile 1: Kontainer Kondisi Paparan Real-time */}
              <div className="bg-white/[0.07] hover:bg-white/[0.09] border border-white/[0.08] p-3 rounded-2xl transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-[10px] uppercase font-semibold tracking-wider">Kondisi Paparan</span>
                  <AirQualityAvatar category={driver.isSimulatingAnomaly ? 'unhealthy' : 'moderate'} size={26} theme="dark" />
                </div>
                <div className="text-lg font-black text-white tabular-nums tracking-tight mt-1 leading-none">
                  {driver.isSimulatingAnomaly ? '38.4' : '18.2'} 
                  <span className="text-[11px] font-normal text-neutral-400 ml-1">µg/m³</span>
                </div>
                <div className="text-[10px] text-amber-300 mt-1 font-semibold flex items-center space-x-1">
                  <span>{driver.isSimulatingAnomaly ? 'Tidak Sehat' : 'Sedang'}</span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-neutral-400 font-normal">SPS30</span>
                </div>
              </div>

              {/* Tile 2: Battery LiFePO4 Mandiri */}
              <div className="bg-white/[0.07] hover:bg-white/[0.09] border border-white/[0.08] p-3 rounded-2xl transition-colors">
                <div className="flex items-center space-x-1.5 text-[#30d158] text-[11px] font-semibold">
                  <BatteryMedium className="w-3.5 h-3.5 text-[#30d158]" />
                  <span>LiFePO4 Mandiri</span>
                </div>
                <div className="text-lg font-black text-white tabular-nums tracking-tight mt-1 leading-none">
                  {driver.batteryPercentage}% 
                  <span className="text-[11px] font-normal text-neutral-400 ml-1">~14 jam</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-1 font-medium">
                  Clip-on Mandiri
                </div>
              </div>
            </div>

            {/* Footer: Apple Pill Status & Action Button */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center space-x-1.5">
                {driver.isAntiCheatPassed ? (
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#30d158]/15 border border-[#30d158]/30 text-[#30d158] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
                    <span>Validasi Lolos</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Peringatan Anomali</span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAnomaly();
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-neutral-100 active:scale-95 text-neutral-950 text-xs font-bold transition-all shadow-sm"
              >
                {driver.isSimulatingAnomaly ? 'Normalkan Data' : 'Uji Anomali'}
              </button>
            </div>
            
            <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mt-2" />
          </div>
        </div>
      </div>
    </>
  );
};
