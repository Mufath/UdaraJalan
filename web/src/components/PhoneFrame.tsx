import React, { ReactNode } from 'react';
import { 
  BatteryMedium, 
  Compass, 
  Map, 
  CreditCard, 
  ShieldCheck
} from 'lucide-react';
import { DynamicIsland } from './DynamicIsland';
import { DriverState } from '../types';

interface PhoneFrameProps {
  children: ReactNode;
  activeTab: 'mitra' | 'map' | 'wallet' | 'privacy';
  onTabChange: (tab: 'mitra' | 'map' | 'wallet' | 'privacy') => void;
  driver: DriverState;
  onToggleAnomaly: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  driver,
  onToggleAnomaly
}) => {
  const tabs = [
    { id: 'mitra', label: 'Mitra', icon: Compass },
    { id: 'map', label: 'Peta Warga', icon: Map },
    { id: 'wallet', label: 'Dompet', icon: CreditCard },
    { id: 'privacy', label: 'Privasi', icon: ShieldCheck }
  ] as const;

  return (
    <div className="min-h-screen w-full bg-canvas-dots flex flex-col font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Top Floating Navigation Bar (Segmented Control matching Reference) */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* Official UdaraJalan Brand Logo */}
          <div className="flex items-center space-x-2.5 shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-white border border-neutral-200/80 p-0.5 flex items-center justify-center shadow-xs overflow-hidden">
              <img 
                src="/logo-icon.png" 
                alt="UdaraJalan Emblem" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center font-brand font-bold text-[17px] tracking-tight leading-tight">
                <span className="text-[#146178]">Udara</span>
                <span className="text-[#2c9f7d]">Jalan</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] text-neutral-400 font-medium">
                Pemantauan Kualitas Udara
              </span>
            </div>
          </div>

          {/* Center Floating Segmented Pill Controller (Matching Reference Pill `Widgets | Specs | Motion`) */}
          <div className="hidden md:flex items-center p-1 bg-neutral-100/90 rounded-full border border-neutral-200/70 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Status Indicator: Dynamic Island Capsule & Battery */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Dynamic Status Capsule */}
            <DynamicIsland driver={driver} onToggleAnomaly={onToggleAnomaly} />

            {/* Hardware Battery Meter Pill */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-neutral-100/80 px-2.5 py-1 rounded-full border border-neutral-200/60 text-xs text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="tabular-nums font-semibold">{driver.batteryPercentage}%</span>
              <BatteryMedium className="w-3.5 h-3.5 text-neutral-500" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Fluid Content Canvas */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16">
        {children}
      </main>

      {/* 3. Floating Bottom Navigation Bar (For mobile or quick thumb reach) */}
      <nav aria-label="Navigasi Bawah" className="fixed inset-x-0 bottom-0 z-40 pointer-events-none pb-3 px-4 md:hidden">
        <div className="pointer-events-auto max-w-sm mx-auto h-[60px] bg-white/95 backdrop-blur-xl border border-neutral-200/80 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.12)] flex items-center justify-around px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'text-neutral-900 font-bold scale-105' 
                    : 'text-neutral-400 hover:text-neutral-600 font-normal'
                }`}
              >
                <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-neutral-100 text-blue-600' : ''}`}>
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[10px] mt-0.5">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
