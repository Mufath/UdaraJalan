import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  Lock, 
  RefreshCw, 
  Info, 
  CheckCircle, 
  EyeOff, 
  BatteryMedium, 
  Check, 
  Copy, 
  Radio, 
  RotateCw, 
  Flame, 
  Award,
  Bike
} from 'lucide-react';
import { DriverState } from '../types';

interface ProfilePrivacyProps {
  driver: DriverState;
}

export const ProfilePrivacy: React.FC<ProfilePrivacyProps> = ({ driver }) => {
  const [privacyZoneEnabled, setPrivacyZoneEnabled] = useState(true);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanFeedback, setCleanFeedback] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const hashString = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handleCleanTrigger = () => {
    setIsCleaning(true);
    setCleanFeedback('Siklus pembersihan optik laser Sensirion SPS30 sedang berjalan (Kipas RPM tinggi)...');
    setTimeout(() => {
      setIsCleaning(false);
      setCleanFeedback('Optik laser SPS30 berhasil dibersihkan otomatis. Akurasi partikulat optimal.');
      setTimeout(() => setCleanFeedback(null), 4000);
    }, 2800);
  };

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(hashString);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
              Keamanan Data & Perangkat
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
            Profil & Privasi Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Kepatuhan regulasi UU PDP No. 27/2022 & pemeliharaan instrumen telemetri
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-white rounded-full border border-neutral-200/80 shadow-xs text-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-neutral-700 font-semibold">UU PDP Terenkripsi</span>
        </div>
      </div>

      {/* Cleaning Feedback Alert */}
      {cleanFeedback && (
        <div className="p-4 bg-neutral-900 text-white rounded-2xl text-xs font-medium flex items-center space-x-3 shadow-lg animate-in fade-in duration-200">
          <RotateCw className={`w-5 h-5 text-blue-400 shrink-0 ${isCleaning ? 'animate-spin' : ''}`} />
          <span>{cleanFeedback}</span>
        </div>
      )}

      {/* ========================================================
          GRID ROW 1: Profil Mitra & Kepatuhan Geofence Cloaking
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* CARD 1: Profil Mitra Card (Col 5) */}
        <div className="md:col-span-5 flex flex-col">
          <span className="widget-overline mb-1.5">
            <User className="w-3 h-3 text-neutral-400" />
            Identitas Mitra Armada
          </span>
          <div className="ref-card p-6 flex flex-col justify-between flex-1">
            <div>
              {/* Avatar + Monogram */}
              <div className="flex items-center space-x-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs shrink-0">
                  BR
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-neutral-900">{driver.name}</h2>
                    <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full text-[10px] font-bold">
                      Tier 1
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">Mitra Armada EV DKI Jakarta</div>
                  <div className="text-[11px] text-neutral-400 tabular-nums mt-0.5">ID: UJ-DRV-849102</div>
                </div>
              </div>

              {/* Hardware / EV Specs */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 flex items-center space-x-1.5">
                    <Bike className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Unit Motor Listrik:</span>
                  </span>
                  <span className="font-bold text-neutral-900">Smooth Z3 EV</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Perangkat Sensor:</span>
                  </span>
                  <span className="font-bold text-emerald-600">Clip-on SPS30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Status Verifikasi:</span>
                  </span>
                  <span className="font-bold text-neutral-900">Terverifikasi (KYC)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs tabular-nums text-neutral-500">
              <span>Rating Kualitas Data:</span>
              <span className="font-bold text-neutral-900">4.98 / 5.00 ★</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Kepatuhan Privasi UU PDP & Animated Radar Cloaking (Col 7) */}
        <div className="md:col-span-7 flex flex-col">
          <span className="widget-overline mb-1.5">
            <Lock className="w-3 h-3 text-neutral-400" />
            Proteksi Lokasi (UU PDP No. 27/2022)
          </span>
          <div className="ref-card p-6 flex flex-col justify-between flex-1">
            <div>
              {/* Header with Switch */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Geofence Cloaking Radius 500 Meter
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Koordinat sekitar tempat tinggal dikaburkan otomatis demi privasi mitra
                  </p>
                </div>

                {/* Animated Toggle Switch */}
                <button
                  onClick={() => setPrivacyZoneEnabled(!privacyZoneEnabled)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 focus:outline-none ${
                    privacyZoneEnabled ? 'bg-neutral-900' : 'bg-neutral-300'
                  }`}
                  aria-label="Toggle zona privasi"
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                      privacyZoneEnabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Animated Radar Cloaking Visual Diagram */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                {/* Radar Circle Graphic */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  {/* Concentric Pulsing Ripples */}
                  {privacyZoneEnabled && (
                    <>
                      <div className="absolute inset-0 rounded-full border border-blue-400 animate-radar" />
                      <div className="absolute inset-3 rounded-full border border-dashed border-blue-500/60" />
                      <div className="absolute inset-6 rounded-full bg-blue-500/10 backdrop-blur-xs" />
                    </>
                  )}
                  {/* Center House Pin */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md relative z-10 ${
                    privacyZoneEnabled ? 'bg-blue-600 text-white' : 'bg-neutral-300 text-neutral-600'
                  }`}>
                    <EyeOff className="w-4 h-4" />
                  </div>
                  {/* Radius Tag */}
                  <div className="absolute bottom-0 bg-neutral-900 text-white tabular-nums text-[9px] px-1.5 py-0.5 rounded-full z-20">
                    500m
                  </div>
                </div>

                {/* Cloaking Explanation */}
                <div className="text-xs text-neutral-600 space-y-1.5 flex-1 leading-relaxed">
                  <div className="font-semibold text-neutral-900">
                    {privacyZoneEnabled ? '✓ Mode Cloaking Aktif' : '✕ Mode Cloaking Nonaktif'}
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Titik awal dan akhir perjalanan dalam radius 500m rumah mitra digantikan dengan koordinat acak terdekat di jalan raya umum.
                  </p>
                </div>
              </div>

              {/* Cryptographic Hash & Auto-Purge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="text-neutral-400 text-[10px] flex items-center justify-between">
                    <span>Pseudonimisasi SHA-256</span>
                    <button 
                      onClick={handleCopyHash}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Salin Hash"
                    >
                      {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="font-bold text-neutral-800 tabular-nums mt-1 truncate">
                    {hashString.slice(0, 16)}...
                  </div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <div className="text-neutral-400 text-[10px]">Retensi Audit Raw</div>
                  <div className="font-bold text-neutral-800 tabular-nums mt-1">14 Hari Auto-Purge</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          GRID ROW 2: Clip-on Hardware & MCERTS Industry Standards
         ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* CARD 3: Perangkat Clip-on & Auto Cleaning (Col 6) */}
        <div className="md:col-span-6 flex flex-col">
          <span className="widget-overline mb-1.5">
            <Radio className="w-3 h-3 text-neutral-400" />
            Pemeliharaan Clip-on Telemetri
          </span>
          <div className="ref-card p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Perangkat Clip-on & Sensor</h3>
                  <div className="text-[11px] text-neutral-400 tabular-nums">Serial: UJ-EV-2026-X84</div>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  Sehat
                </span>
              </div>

              {/* Hardware Meters */}
              <div className="grid grid-cols-2 gap-3 mb-4 tabular-nums">
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="text-[10px] text-neutral-400">LiFePO4 Mandiri</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-0.5">{driver.batteryPercentage}%</div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${driver.batteryPercentage}%` }} />
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">~14 jam berkelanjutan</div>
                </div>

                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <div className="text-[10px] text-neutral-400">Buffer Offline</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-0.5">{driver.offlineBufferCount} Pending</div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">SQLite Tersinkron</div>
                </div>
              </div>
            </div>

            {/* Interactive Auto-Clean Button */}
            <div className="pt-2">
              <button
                onClick={handleCleanTrigger}
                disabled={isCleaning}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-600 text-white text-xs font-semibold rounded-2xl transition-all shadow-sm active:scale-[0.99]"
              >
                <RotateCw className={`w-4 h-4 ${isCleaning ? 'animate-spin' : ''}`} />
                <span>{isCleaning ? 'Membersihkan Optik Laser...' : 'Jalankan Auto-Cleaning SPS30'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* CARD 4: Sertifikasi Standar Industri DEFRA / MCERTS (Col 6) */}
        <div className="md:col-span-6 flex flex-col">
          <span className="widget-overline mb-1.5">
            <Award className="w-3 h-3 text-neutral-400" />
            Sertifikasi Standar Industri
          </span>
          <div className="ref-card p-6 flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-neutral-900">
                  Sertifikasi Instrumen Laboratorium
                </h3>
                <div className="flex gap-1.5 text-[10px]">
                  <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 rounded-full font-bold">
                    DEFRA
                  </span>
                  <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold">
                    MCERTS
                  </span>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>
                  Sensor <strong>Sensirion SPS30</strong> menggunakan prinsip hamburan laser optik berstandar <strong>MCERTS Inggris</strong>.
                </p>
                <p>
                  Unit clip-on beroperasi dengan daya baterai <strong>LiFePO4 mandiri</strong> tanpa menyedot aki ataupun menggugurkan garansi kelistrikan motor listrik mitra.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs tabular-nums text-neutral-400">
              <span>Masa Berlaku Kalibrasi:</span>
              <span className="font-bold text-neutral-900">2027 • ISO 14001</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
