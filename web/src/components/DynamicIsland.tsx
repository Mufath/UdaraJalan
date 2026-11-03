import React, { useState } from 'react';
import { Bike, ShieldCheck, AlertTriangle, BatteryMedium, Wind } from 'lucide-react';
import { DriverState } from '../types';

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
        className={`fixed inset-0 z-40 bg-black/15 backdrop-blur-[1px] transition-opacity duration-300 ${
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
          className={`absolute top-0 left-1/2 -translate-x-1/2 bg-neutral-900 text-white cursor-pointer overflow-hidden transition-[width,height,border-radius,box-shadow] duration-300 will-change-[width,height] ${
            isExpanded
              ? 'w-[min(340px,calc(100vw-24px))] h-[202px] rounded-[24px] shadow-2xl ring-1 ring-white/10 z-50'
              : 'w-[176px] h-[32px] rounded-full shadow-md hover:scale-[1.02] active:scale-[0.98]'
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
            <div className="flex items-center space-x-1.5 font-mono">
              <span className="text-[11px] font-medium tabular-nums text-white">6.2 km</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>

          {/* 2. Expanded Live Activity Mode (Smooth Spring Bloom) */}
          <div
            className={`w-full p-3.5 space-y-3 transition-all duration-250 ${
              isExpanded
                ? 'opacity-100 scale-100 pointer-events-auto delay-75 visible'
                : 'opacity-0 scale-95 pointer-events-none invisible absolute inset-x-0 top-0'
            }`}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2.5">
                <Bike className="w-4 h-4 text-neutral-300" />
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Sesi Aktif</div>
                  <div className="text-[13px] font-semibold text-white">6.2 Km Tervalidasi</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-neutral-400">Tarif</div>
                <div className="text-[12px] font-mono font-medium text-emerald-400">+Rp120/km</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="flex items-center space-x-1.5 text-neutral-400 text-[10px]">
                  <Wind className="w-3 h-3 text-neutral-400" />
                  <span>SPS30 PM2.5</span>
                </div>
                <div className="text-[14px] font-semibold text-white tabular-nums font-mono mt-0.5">
                  {driver.isSimulatingAnomaly ? '38.4' : '18.2'} <span className="text-[10px] font-normal text-neutral-400">µg/m³</span>
                </div>
              </div>

              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <div className="flex items-center space-x-1.5 text-neutral-400 text-[10px]">
                  <BatteryMedium className="w-3 h-3 text-neutral-400" />
                  <span>LiFePO4</span>
                </div>
                <div className="text-[14px] font-semibold text-white tabular-nums font-mono mt-0.5">
                  {driver.batteryPercentage}% <span className="text-[10px] font-normal text-neutral-400">~14 jam</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1.5">
                {driver.isAntiCheatPassed ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-medium text-emerald-400">Validasi: Lolos</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-medium text-amber-400">Peringatan Anomali</span>
                  </>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleAnomaly();
                }}
                className="text-[10px] bg-white/10 hover:bg-white/20 active:bg-white/30 px-2 py-1 rounded text-white font-medium transition-colors"
              >
                {driver.isSimulatingAnomaly ? 'Normalkan' : 'Uji Anomali'}
              </button>
            </div>
            
            <div className="text-center text-[9px] text-neutral-500 pt-0.5">
              Ketuk untuk menutup
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
