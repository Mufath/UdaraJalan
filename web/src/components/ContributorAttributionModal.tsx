import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  Bike, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Layers, 
  FileCheck2,
  Lock,
  Compass
} from 'lucide-react';
import { RoadSegment } from '../types';
import { getFleetContributors } from '../lib/airQualityHelpers';

interface ContributorAttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  road: RoadSegment;
}

/**
 * Contributor & Station Fleet Attribution Modal
 * Directly inspired by IQAir's "6 stations from 5 Kontributor" transparency layer,
 * adapted to UdaraJalan's EV Fleet Crowdsensing & UU PDP compliance (PRD 5.2):
 * - Displays contributing EV motorbikes with pseudonymized fleet tokens.
 * - Hardware specifications (Sensirion SPS30 MCERTS + SHT40).
 * - Confidence Score mathematical breakdown.
 * - Zero gradient slop, pure native light mode clean aesthetics.
 */
export const ContributorAttributionModal: React.FC<ContributorAttributionModalProps> = ({
  isOpen,
  onClose,
  road
}) => {
  if (!isOpen) return null;

  const contributors = getFleetContributors(road);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-lg bg-white rounded-[28px] border border-neutral-200 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 tracking-tight">
                Transparansi Sumber Data & Kontributor
              </h3>
              <p className="text-[11px] text-neutral-500">
                {road.name.split('(')[0].trim()} ({road.area})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            aria-label="Tutup Dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          
          {/* 1. Crowdsensing Summary Banner */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-900 flex items-center space-x-1.5">
                <Bike className="w-3.5 h-3.5 text-neutral-700" />
                <span>Validasi Armada Bergerak</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Tingkat Keyakinan: {road.confidenceScore}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs tabular-nums pt-1">
              <div className="p-2 rounded-xl bg-white border border-neutral-100">
                <div className="text-base font-extrabold text-neutral-900">{road.uniquePassesCount}</div>
                <div className="text-[10px] text-neutral-400 font-medium">Lintasan Valid</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-neutral-100">
                <div className="text-base font-extrabold text-neutral-900">{contributors.length}</div>
                <div className="text-[10px] text-neutral-400 font-medium">Mitra EV Unik</div>
              </div>
              <div className="p-2 rounded-xl bg-white border border-neutral-100">
                <div className="text-base font-extrabold text-neutral-900">&lt; {road.ageMinutes}m</div>
                <div className="text-[10px] text-neutral-400 font-medium">Umur Sampel</div>
              </div>
            </div>
          </div>

          {/* 2. Contributor List (IQAir Contributor Style with Pseudonymized Fleet) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Daftar Stasiun Armada Pengukur
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                {contributors.length} Kontributor Terdaftar
              </span>
            </div>

            <div className="space-y-1.5">
              {contributors.map((contrib) => (
                <div 
                  key={contrib.id}
                  className="p-3 rounded-2xl bg-white border border-neutral-100 hover:border-neutral-200 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center text-sm font-bold shrink-0">
                      ⚡
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-neutral-900 truncate flex items-center space-x-1.5">
                        <span>{contrib.alias}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                        {contrib.fleetVehicle} • {contrib.readingsCount} sampel tervalidasi
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md tabular-nums">
                      {contrib.confidenceWeight}% Akurat
                    </span>
                    <div className="text-[10px] text-neutral-400 tabular-nums mt-0.5">
                      {contrib.lastPassMinutesAgo} mnt lalu
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Hardware & Sensor Rigor (Sensirion SPS30 & SHT40) */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2 text-xs">
            <span className="font-bold text-neutral-800 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-neutral-600" />
              <span>Sertifikasi Instrumen Hardware</span>
            </span>

            <div className="space-y-1.5 text-[11px] text-neutral-600">
              <div className="flex items-center justify-between">
                <span>Sensor Partikulat:</span>
                <span className="font-bold text-neutral-800">Sensirion SPS30 Laser (MCERTS Certified)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sensor Iklim Mikro:</span>
                <span className="font-bold text-neutral-800">Sensirion SHT40 (±0.2°C, ±1.8% RH)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pemosisian Spasial:</span>
                <span className="font-bold text-neutral-800">u-blox GNSS Multi-Constellation (1 Hz)</span>
              </div>
            </div>
          </div>

          {/* 4. Privacy & Regulatory Compliance (UU PDP No. 27/2022) */}
          <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start space-x-2.5 text-xs text-blue-900">
            <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold">Kepatuhan UU PDP No. 27/2022: </span>
              Identitas pribadi mitra pengemudi dan pelat nomor motor listrik dianonimkan secara kriptografis (*tokenized*) sebelum data telemetri dipublikasikan.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">
            Standar Verifikasi Algoritma Fusi Spasial UdaraJalan
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
