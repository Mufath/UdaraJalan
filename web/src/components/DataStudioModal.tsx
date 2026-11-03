import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Plus, 
  RotateCcw, 
  Radio, 
  Trash2, 
  Wind, 
  Thermometer, 
  Droplets, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { RoadSegment, AirQualityLevel } from '../types';
import { dataPresets, calculateAirQualityLevel } from '../data/mockData';

interface DataStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  roads: RoadSegment[];
  onUpdateRoad: (updated: RoadSegment) => void;
  onSetAllRoads: (roads: RoadSegment[]) => void;
  onAddRoad: (newRoad: RoadSegment) => void;
  onDeleteRoad: (id: string) => void;
  onResetDefaults: () => void;
  selectedRoadId: string | null;
  onSelectRoad: (id: string) => void;
  isLiveStreaming: boolean;
  onToggleLiveStreaming: () => void;
}

export const DataStudioModal: React.FC<DataStudioModalProps> = ({
  isOpen,
  onClose,
  roads,
  onUpdateRoad,
  onSetAllRoads,
  onAddRoad,
  onDeleteRoad,
  onResetDefaults,
  selectedRoadId,
  onSelectRoad,
  isLiveStreaming,
  onToggleLiveStreaming
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'editor' | 'add'>('presets');
  const [activeEditorId, setActiveEditorId] = useState<string>(selectedRoadId || roads[0]?.id || '');
  
  // New Road Form State
  const [newRoadName, setNewRoadName] = useState('');
  const [newRoadArea, setNewRoadArea] = useState('Jakarta Selatan');
  const [newRoadPM25, setNewRoadPM25] = useState(25);
  const [newRoadTemp, setNewRoadTemp] = useState(31.5);
  const [newRoadHumidity, setNewRoadHumidity] = useState(65);
  const [newRoadTemplate, setNewRoadTemplate] = useState('casablanca');

  if (!isOpen) return null;

  const currentEditingRoad = roads.find(r => r.id === activeEditorId) || roads[0];

  const getCategoryColor = (cat: AirQualityLevel) => {
    switch (cat) {
      case 'good': return '#16a34a';
      case 'moderate': return '#d97706';
      case 'unhealthy': return '#dc2626';
      case 'hazardous': return '#9333ea';
    }
  };

  const getCategoryLabel = (cat: AirQualityLevel) => {
    switch (cat) {
      case 'good': return 'Baik (0–15 µg/m³)';
      case 'moderate': return 'Sedang (15–35 µg/m³)';
      case 'unhealthy': return 'Tidak Sehat (35–55 µg/m³)';
      case 'hazardous': return 'Berbahaya (>55 µg/m³)';
    }
  };

  // Pre-configured Jakarta templates for adding new road
  const jakartaLocationTemplates = [
    {
      id: 'casablanca',
      name: 'Jl. Casablanca / Dr. Satrio Flyover',
      area: 'Jakarta Selatan',
      center: [-6.2225, 106.8250] as [number, number],
      coordinates: [
        [-6.2205, 106.8185],
        [-6.2225, 106.8250],
        [-6.2235, 106.8315],
        [-6.2245, 106.8400]
      ] as [number, number][]
    },
    {
      id: 'kemang',
      name: 'Jl. Kemang Raya (Bangka - Pejaten)',
      area: 'Jakarta Selatan',
      center: [-6.2650, 106.8160] as [number, number],
      coordinates: [
        [-6.2550, 106.8150],
        [-6.2630, 106.8160],
        [-6.2710, 106.8170],
        [-6.2800, 106.8180]
      ] as [number, number][]
    },
    {
      id: 'tomang',
      name: 'Jl. Tomang Raya (Grogol - Cideng)',
      area: 'Jakarta Barat',
      center: [-6.1755, 106.7995] as [number, number],
      coordinates: [
        [-6.1740, 106.7920],
        [-6.1755, 106.7995],
        [-6.1770, 106.8080]
      ] as [number, number][]
    },
    {
      id: 'harmoni',
      name: 'Jl. Gajah Mada (Harmoni - Glodok)',
      area: 'Jakarta Pusat - Barat',
      center: [-6.1620, 106.8190] as [number, number],
      coordinates: [
        [-6.1685, 106.8200],
        [-6.1620, 106.8190],
        [-6.1520, 106.8180]
      ] as [number, number][]
    },
    {
      id: 'simatupang',
      name: 'Jl. TB Simatupang (Cilandak - Pasar Minggu)',
      area: 'Jakarta Selatan',
      center: [-6.2950, 106.8280] as [number, number],
      coordinates: [
        [-6.2920, 106.8050],
        [-6.2940, 106.8180],
        [-6.2950, 106.8280],
        [-6.2980, 106.8420]
      ] as [number, number][]
    }
  ];

  const handleAddNewRoad = (e: React.FormEvent) => {
    e.preventDefault();
    const template = jakartaLocationTemplates.find(t => t.id === newRoadTemplate) || jakartaLocationTemplates[0];
    const newId = `SEG-${String(roads.length + 1).padStart(2, '0')}`;
    
    const newSegment: RoadSegment = {
      id: newId,
      name: newRoadName.trim() || template.name,
      area: newRoadArea || template.area,
      pm25: Number(newRoadPM25),
      category: calculateAirQualityLevel(newRoadPM25),
      temperature: Number(newRoadTemp),
      humidity: Number(newRoadHumidity),
      confidenceScore: 'Tinggi',
      uniquePassesCount: 6,
      ageMinutes: 2,
      varianceSigma: 3.2,
      isIndicativeData: true,
      coordinates: template.coordinates,
      center: template.center,
      description: 'Ruas hasil penambahan manual untuk simulasi pemodelan spasial'
    };

    onAddRoad(newSegment);
    onSelectRoad(newId);
    setActiveEditorId(newId);
    setActiveTab('editor');
    setNewRoadName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-[28px] shadow-2xl border border-neutral-200/90 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header (Quiet Chrome) */}
        <div className="px-6 py-4 border-b border-neutral-200/80 flex items-center justify-between bg-white">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-neutral-900 leading-tight">
                Simulasi Skenario Kualitas Udara
              </h2>
              <span className="text-xs text-neutral-400 font-mono">
                ({roads.length} ruas)
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Uji respons peta, rute rendah polusi, dan telemetri sensor terhadap kondisi lapangan
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Live Drift Switch */}
            <button
              onClick={onToggleLiveStreaming}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                isLiveStreaming 
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs' 
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
              title="Simulasi otomatis fluktuasi sensor tiap 3 detik"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Drift Sensor</span>
              <span className="font-mono text-[10px] opacity-70">
                {isLiveStreaming ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Tutup dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Sleek Segmented Pill matching Reference) */}
        <div className="flex border-b border-neutral-200/80 bg-neutral-100/80 p-1.5 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'presets'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skenario Preset</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'editor'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Editor Ruas</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 py-1.5 px-3 rounded-full transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'add'
                ? 'bg-white text-neutral-900 shadow-xs font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Ruas</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-500">
                Pilih skenario kondisi lapangan untuk menguji respons visualisasi spasial dan rekomendasi rute:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dataPresets.map((preset) => (
                  <div 
                    key={preset.id}
                    className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-1.5 mb-1.5">
                        <span 
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: preset.badgeColor }}
                        />
                        <span className="text-xs font-medium text-neutral-700">
                          {preset.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">
                        {preset.name}
                      </h4>
                      <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                        {preset.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const updated = preset.apply(roads);
                        onSetAllRoads(updated);
                      }}
                      className="w-full py-2 bg-white hover:bg-neutral-100 active:bg-neutral-200 text-neutral-900 text-xs font-medium rounded-lg border border-neutral-200 transition-colors shadow-xs flex items-center justify-center space-x-1.5"
                    >
                      <span>Terapkan Skenario</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Reset to baseline button (Quiet Link) */}
              <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
                <span className="text-neutral-500">
                  Kembali ke konfigurasi data awal bawaan sistem:
                </span>
                <button
                  onClick={onResetDefaults}
                  className="flex items-center space-x-1.5 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ROAD VALUE SLIDER EDITOR */}
          {activeTab === 'editor' && currentEditingRoad && (
            <div className="space-y-4">
              {/* Select Road Dropdown */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Pilih Ruas Jalan:
                </label>
                <select
                  value={currentEditingRoad.id}
                  onChange={(e) => {
                    setActiveEditorId(e.target.value);
                    onSelectRoad(e.target.value);
                  }}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 shadow-xs"
                >
                  {roads.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({Math.round(r.pm25)} µg/m³ • {r.area})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Preview Card */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span 
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: getCategoryColor(currentEditingRoad.category) }}
                    />
                    <span className="text-xs font-medium text-neutral-700">
                      {getCategoryLabel(currentEditingRoad.category)}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900">
                    {currentEditingRoad.name}
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    {currentEditingRoad.area}
                  </p>
                </div>

                <div className="text-right">
                  <div 
                    className="text-2xl font-bold font-mono tabular-nums leading-none"
                    style={{ color: getCategoryColor(currentEditingRoad.category) }}
                  >
                    {currentEditingRoad.pm25.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-1">
                    µg/m³ PM2.5
                  </div>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-3 pt-1">
                {/* 1. Slider PM2.5 */}
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800 flex items-center space-x-1.5">
                      <Wind className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Kadar Partikulat PM2.5</span>
                    </span>
                    <span 
                      className="font-mono font-semibold tabular-nums"
                      style={{ color: getCategoryColor(currentEditingRoad.category) }}
                    >
                      {currentEditingRoad.pm25.toFixed(1)} µg/m³
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    step="0.5"
                    value={currentEditingRoad.pm25}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateRoad({
                        ...currentEditingRoad,
                        pm25: val,
                        category: calculateAirQualityLevel(val)
                      });
                    }}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                    <span>0 (Aman)</span>
                    <span>15 (Ambang Baku)</span>
                    <span>35 (Sedang)</span>
                    <span>55 (Tidak Sehat)</span>
                    <span>120 (Kritis)</span>
                  </div>
                </div>

                {/* 2. Slider Suhu Mikro */}
                <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800 flex items-center space-x-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Suhu Mikro (SHT40)</span>
                    </span>
                    <span className="font-mono font-semibold text-neutral-800 tabular-nums">
                      {currentEditingRoad.temperature.toFixed(1)} °C
                    </span>
                  </div>
                  <input
                    type="range"
                    min="22"
                    max="42"
                    step="0.2"
                    value={currentEditingRoad.temperature}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      onUpdateRoad({
                        ...currentEditingRoad,
                        temperature: val
                      });
                    }}
                    className="w-full accent-neutral-900 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                    <span>22°C (Sejuk)</span>
                    <span>30°C (Normal)</span>
                    <span>38°C+ (Urban Heat Island)</span>
                  </div>
                </div>

                {/* 3. Slider Kelembapan & Armada */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800 flex items-center space-x-1">
                        <Droplets className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Kelembapan RH</span>
                      </span>
                      <span className="font-mono font-semibold text-neutral-800">
                        {currentEditingRoad.humidity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="95"
                      value={currentEditingRoad.humidity}
                      onChange={(e) => {
                        onUpdateRoad({
                          ...currentEditingRoad,
                          humidity: parseInt(e.target.value)
                        });
                      }}
                      className="w-full accent-neutral-900 cursor-pointer"
                    />
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-neutral-800 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Armada Melintas</span>
                      </span>
                      <span className="font-mono font-semibold text-neutral-800">
                        {currentEditingRoad.uniquePassesCount} Unit
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={currentEditingRoad.uniquePassesCount}
                      onChange={(e) => {
                        const count = parseInt(e.target.value);
                        onUpdateRoad({
                          ...currentEditingRoad,
                          uniquePassesCount: count,
                          confidenceScore: count >= 7 ? 'Tinggi' : count >= 4 ? 'Sedang' : 'Rendah'
                        });
                      }}
                      className="w-full accent-neutral-900 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Delete Road Action */}
                {roads.length > 1 && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        onDeleteRoad(currentEditingRoad.id);
                        const remaining = roads.filter(r => r.id !== currentEditingRoad.id);
                        if (remaining.length > 0) {
                          setActiveEditorId(remaining[0].id);
                          onSelectRoad(remaining[0].id);
                        }
                      }}
                      className="text-xs text-neutral-500 hover:text-red-600 transition-colors flex items-center space-x-1 py-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus ruas dari model</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ADD NEW ROAD */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddNewRoad} className="space-y-4 text-xs">
              <p className="text-neutral-500">
                Tambahkan ruas jalan baru ke jaringan pemantauan armada motor listrik:
              </p>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Pilih Koridor Jakarta (Template Presisi):
                </label>
                <select
                  value={newRoadTemplate}
                  onChange={(e) => {
                    setNewRoadTemplate(e.target.value);
                    const selected = jakartaLocationTemplates.find(t => t.id === e.target.value);
                    if (selected) {
                      setNewRoadName(selected.name);
                      setNewRoadArea(selected.area);
                    }
                  }}
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:border-neutral-900 shadow-xs"
                >
                  {jakartaLocationTemplates.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Nama Ruas:
                </label>
                <input
                  type="text"
                  required
                  value={newRoadName}
                  onChange={(e) => setNewRoadName(e.target.value)}
                  placeholder="Contoh: Jl. Casablanca (Flyover)"
                  className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:border-neutral-900 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Wilayah:
                  </label>
                  <input
                    type="text"
                    value={newRoadArea}
                    onChange={(e) => setNewRoadArea(e.target.value)}
                    placeholder="Jakarta Selatan"
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-medium focus:outline-none focus:border-neutral-900 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Nilai Awal PM2.5 (µg/m³):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={newRoadPM25}
                    onChange={(e) => setNewRoadPM25(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-mono font-medium focus:outline-none focus:border-neutral-900 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Suhu Mikro (°C):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newRoadTemp}
                    onChange={(e) => setNewRoadTemp(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-mono font-medium focus:outline-none focus:border-neutral-900 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Kelembapan (%):
                  </label>
                  <input
                    type="number"
                    value={newRoadHumidity}
                    onChange={(e) => setNewRoadHumidity(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-mono font-medium focus:outline-none focus:border-neutral-900 shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors shadow-xs flex items-center justify-center space-x-1.5 mt-2"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan dan Tampilkan di Peta</span>
              </button>
            </form>
          )}

        </div>

        {/* Footer (Quiet Utility) */}
        <div className="px-5 py-3 border-t border-neutral-200/80 bg-neutral-50 flex items-center justify-between text-xs">
          <span className="text-neutral-400 font-mono text-[11px]">
            Data tersinkron otomatis ke peta dan rute
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors shadow-xs"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
