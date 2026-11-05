import React, { useState, useMemo, useRef, useEffect } from 'react';
import type * as GeoJSON from 'geojson';
import type * as MapLibreGL from 'maplibre-gl';
import { 
  Search, 
  Compass, 
  Wind, 
  Thermometer,
  Layers,
  Crosshair,
  SlidersHorizontal,
  Sun,
  Moon,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Navigation,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Droplets,
  RefreshCw
} from 'lucide-react';
import { 
  Map, 
  MapRoute, 
  MapMarker, 
  MarkerContent, 
  MapGeoJSON, 
  MapControls,
  type MapRef
} from '@/components/ui/map';
import { RoadSegment, NavigationComparison, AirQualityLevel } from '../types';
import { h3HexagonCoordinates, calculateAirQualityLevel } from '../data/mockData';
import { 
  surabayaH3HexagonCoordinates,
  surabayaCleanRouteCoordinates,
  surabayaFastestRouteCoordinates
} from '../data/surabayaData';
import { 
  getAirQualityMeta, 
  getTemperatureMeta, 
  getCityOverview 
} from '../lib/airQualityHelpers';

interface PublicMapProps {
  roads: RoadSegment[];
  routeComparison: NavigationComparison;
  selectedRoad: RoadSegment | null;
  onSelectRoad: (road: RoadSegment) => void;
  onUpdateRoad: (updated: RoadSegment) => void;
  onOpenDataStudio: () => void;
  isLiveStreaming: boolean;
  onToggleLiveStreaming: () => void;
  activeCity?: 'surabaya' | 'jakarta';
  onCityChange?: (city: 'surabaya' | 'jakarta') => void;
}

type BasemapType = 'streets' | 'osm' | 'satellite';
type ViewMode = 'both' | 'pm25' | 'temp';
type QuickFilterType = 'all' | 'clean' | 'polluted' | 'cool';

// 1. Street Vector Styles (CARTO Voyager for Light vs Dark Matter for Dark)
const streetLightStyle = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const streetDarkStyle = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

// 2. OpenStreetMap Styles (Standard Daylight vs Night Inverted Mode)
const osmLightStyle: MapLibreGL.StyleSpecification = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm-tiles',
      paint: {
        'raster-brightness-max': 1.0,
        'raster-contrast': 0
      }
    }
  ]
};

const osmDarkStyle: MapLibreGL.StyleSpecification = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors'
    }
  },
  layers: [
    {
      id: 'osm-layer',
      type: 'raster',
      source: 'osm-tiles',
      paint: {
        'raster-brightness-max': 0.38,
        'raster-contrast': 0.35,
        'raster-saturation': -0.7
      }
    }
  ]
};

// 3. Satellite Styles
const satelliteLightStyle: MapLibreGL.StyleSpecification = {
  version: 8,
  sources: {
    'esri-sat': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics'
    }
  },
  layers: [
    {
      id: 'esri-sat-layer',
      type: 'raster',
      source: 'esri-sat',
      paint: {
        'raster-brightness-min': 0.05,
        'raster-brightness-max': 1.0,
        'raster-saturation': 0.1
      }
    }
  ]
};

const satelliteDarkStyle: MapLibreGL.StyleSpecification = {
  version: 8,
  sources: {
    'esri-sat': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics'
    }
  },
  layers: [
    {
      id: 'esri-sat-layer',
      type: 'raster',
      source: 'esri-sat',
      paint: {
        'raster-brightness-max': 0.38,
        'raster-contrast': 0.25,
        'raster-saturation': -0.4
      }
    }
  ]
};

export const PublicMap: React.FC<PublicMapProps> = ({ 
  roads, 
  routeComparison,
  selectedRoad,
  onSelectRoad,
  onUpdateRoad,
  onOpenDataStudio,
  isLiveStreaming,
  onToggleLiveStreaming,
  activeCity = 'surabaya',
  onCityChange
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'map' | 'detail'>('map');
  const [activeLayer, setActiveLayer] = useState<ViewMode>('both');
  const [quickFilter, setQuickFilter] = useState<QuickFilterType>('all');
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('streets');
  const [mapTheme, setMapTheme] = useState<'light' | 'dark'>('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const [showH3Mission, setShowH3Mission] = useState(false);
  const [showBadges, setShowBadges] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [isSimSettingsOpen, setIsSimSettingsOpen] = useState(false);

  const mapRef = useRef<MapRef | null>(null);

  // City-wide statistics summary for citizens
  const cityOverview = useMemo(() => getCityOverview(roads), [roads]);

  // Basemap style switcher
  const selectedStyle = useMemo(() => {
    if (activeBasemap === 'satellite') {
      return mapTheme === 'dark' ? satelliteDarkStyle : satelliteLightStyle;
    }
    if (activeBasemap === 'osm') {
      return mapTheme === 'dark' ? osmDarkStyle : osmLightStyle;
    }
    return mapTheme === 'dark' ? streetDarkStyle : streetLightStyle;
  }, [activeBasemap, mapTheme]);

  const currentMapStyles = useMemo(() => ({
    light: selectedStyle,
    dark: selectedStyle
  }), [selectedStyle]);

  // Filtered roads based on quick filter and search query
  const filteredRoads = useMemo(() => {
    return roads.filter(road => {
      // 1. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = road.name.toLowerCase().includes(q);
        const matchArea = road.area.toLowerCase().includes(q);
        if (!matchName && !matchArea) return false;
      }

      // 2. Quick status filter
      if (quickFilter === 'clean') {
        return road.pm25 <= 15.0;
      }
      if (quickFilter === 'polluted') {
        return road.pm25 > 35.4;
      }
      if (quickFilter === 'cool') {
        return road.temperature <= 31.0;
      }

      return true;
    });
  }, [roads, searchQuery, quickFilter]);

  // H3 Hexagon as GeoJSON Polygon (Dynamic for Surabaya or Jakarta)
  const h3GeoJson = useMemo<GeoJSON.Feature<GeoJSON.Polygon>>(() => {
    const coords = activeCity === 'surabaya' 
      ? surabayaH3HexagonCoordinates 
      : h3HexagonCoordinates;
    return {
      type: "Feature",
      properties: { 
        id: activeCity === 'surabaya' ? "h3-bungkul" : "h3-sudirman", 
        bonus: "2.0x" 
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...coords.map(([lat, lng]) => [lng, lat] as [number, number]),
            [coords[0][1], coords[0][0]]
          ]
        ]
      }
    };
  }, [activeCity]);

  // Clean Route & Fastest Route in [lng, lat] format (Dynamic per City)
  const cleanRouteCoordsLngLat: [number, number][] = useMemo(() => {
    if (activeCity === 'surabaya') {
      return surabayaCleanRouteCoordinates;
    }
    return [
      [106.8320, -6.1950], // Menteng
      [106.8280, -6.2040],
      [106.8150, -6.2160],
      [106.8080, -6.2280], // Senopati
      [106.8040, -6.2330]
    ];
  }, [activeCity]);

  const fastestRouteCoordsLngLat: [number, number][] = useMemo(() => {
    if (activeCity === 'surabaya') {
      return surabayaFastestRouteCoordinates;
    }
    return [
      [106.8320, -6.1950],
      [106.8220, -6.2080],
      [106.8180, -6.2200],
      [106.8240, -6.2300], // Gatot Subroto
      [106.8040, -6.2330]
    ];
  }, [activeCity]);

  // Center coordinates & zoom per city
  const cityDefaultView = useMemo(() => {
    if (activeCity === 'surabaya') {
      return { center: [112.7420, -7.2750] as [number, number], zoom: 12.3 };
    }
    return { center: [106.8200, -6.2120] as [number, number], zoom: 13 };
  }, [activeCity]);

  // Auto-fly when activeCity changes
  const initialLoadRef = useRef(true);
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: cityDefaultView.center,
      zoom: cityDefaultView.zoom,
      duration: 1200
    });
  }, [activeCity, cityDefaultView]);

  // Center map on searched road
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    const query = searchQuery.toLowerCase();
    const found = roads.find(r => 
      r.name.toLowerCase().includes(query) || 
      r.area.toLowerCase().includes(query)
    );

    if (found) {
      onSelectRoad(found);
      setIsSheetOpen(true);
      mapRef.current.flyTo({
        center: [found.center[1], found.center[0]],
        zoom: 14.5,
        duration: 1000
      });
    }
  };

  const handleSelectAndFly = (road: RoadSegment) => {
    onSelectRoad(road);
    setIsSheetOpen(true);
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [road.center[1], road.center[0]],
        zoom: 14.5,
        duration: 800
      });
    }
  };

  const handleResetView = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: cityDefaultView.center,
      zoom: cityDefaultView.zoom,
      duration: 1000
    });
  };

  const originCoord: [number, number] = activeCity === 'surabaya' 
    ? [112.7315, -7.3425] // Bundaran Waru
    : [106.8320, -6.1950]; // Menteng

  const destCoord: [number, number] = activeCity === 'surabaya'
    ? [112.7408, -7.2600] // Jl. Tunjungan
    : [106.8040, -6.2330]; // Senopati

  const evCoord: [number, number] = activeCity === 'surabaya'
    ? [112.7350, -7.2840] // Armada IoT di koridor Diponegoro (tidak menumpuk dengan Bungkul)
    : [106.8218, -6.2120]; // Sudirman

  return (
    <div className="space-y-3.5">
      
      {/* 1. CITIZEN LIVE SUMMARY BAR: Kondisi Udara & Suhu Kota */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-3.5 sm:p-4 shadow-sm space-y-3">
        {/* Top Row: City Switcher & Live Telemetry Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-neutral-100">
          
          {/* City Switcher Pill: Surabaya (Utama) vs DKI Jakarta */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-neutral-500 hidden sm:inline">Kota:</span>
            {onCityChange && (
              <div className="flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onCityChange('surabaya')}
                  className={`px-3 py-1 rounded-full flex items-center space-x-1.5 transition-all ${
                    activeCity === 'surabaya'
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>📍 Surabaya</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${activeCity === 'surabaya' ? 'bg-white/25 text-white' : 'bg-blue-100 text-blue-700'}`}>
                    Utama
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onCityChange('jakarta')}
                  className={`px-3 py-1 rounded-full flex items-center space-x-1.5 transition-all ${
                    activeCity === 'jakarta'
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span>📍 DKI Jakarta</span>
                </button>
              </div>
            )}
          </div>

          {/* Real-time Live Telemetry Status */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onToggleLiveStreaming}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                isLiveStreaming 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
              }`}
              title={isLiveStreaming ? "Klik untuk menjeda pembaruan live" : "Klik untuk melanjutkan streaming live"}
            >
              {isLiveStreaming ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>LIVE STREAMING</span>
                  <Pause className="w-3 h-3 ml-1 opacity-80" />
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>DIJEDA</span>
                  <Play className="w-3 h-3 ml-1 text-emerald-600 fill-emerald-600" />
                </>
              )}
            </button>

            <span className="text-xs text-neutral-500 hidden lg:inline">
              Sensor armada motor listrik jalan raya
            </span>
          </div>
        </div>

        {/* Bottom Row: City-wide Stats Summary Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Avg PM2.5 */}
            <div className="flex items-center space-x-1.5 bg-neutral-100 px-3 py-1 rounded-full tabular-nums">
              <span className="text-neutral-500 font-sans">
                Polusi {activeCity === 'surabaya' ? 'Surabaya' : 'DKI'}:
              </span>
              <span 
                className="font-extrabold"
                style={{ color: getAirQualityMeta(cityOverview.overallCategory).color }}
              >
                {cityOverview.avgPM25} µg/m³
              </span>
              <span className="text-[10px] font-sans font-bold text-neutral-600">
                ({getAirQualityMeta(cityOverview.overallCategory).shortLabel})
              </span>
            </div>

            {/* Avg Temp */}
            <div className="flex items-center space-x-1.5 bg-neutral-100 px-3 py-1 rounded-full tabular-nums">
              <span className="text-neutral-500 font-sans">
                Suhu Jalan {activeCity === 'surabaya' ? 'Surabaya' : 'DKI'}:
              </span>
              <span 
                className="font-extrabold"
                style={{ color: getTemperatureMeta(cityOverview.avgTemp).color }}
              >
                {cityOverview.avgTemp}°C
              </span>
              <span className="text-[10px] font-sans font-bold text-neutral-600">
                ({getTemperatureMeta(cityOverview.avgTemp).shortLabel})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Cleanest Road Quick Pill */}
            {cityOverview.cleanestRoad && (
              <button
                onClick={() => handleSelectAndFly(cityOverview.cleanestRoad!)}
                className="flex items-center space-x-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                title="Lihat jalan dengan udara terbersih saat ini"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-neutral-500">Terbersih:</span>
                <span className="font-bold text-neutral-900">{cityOverview.cleanestRoad.name.split('(')[0].trim()}</span>
                <span className="font-bold tabular-nums text-emerald-700">({cityOverview.cleanestRoad.pm25} µg)</span>
              </button>
            )}

            {/* Most Polluted Road Quick Pill */}
            {cityOverview.mostPollutedRoad && (
              <button
                onClick={() => handleSelectAndFly(cityOverview.mostPollutedRoad!)}
                className="flex items-center space-x-1.5 bg-neutral-100 hover:bg-neutral-200/80 text-neutral-800 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                title="Lihat jalan dengan polusi tertinggi saat ini"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="text-neutral-500">Paling Berpolusi:</span>
                <span className="font-bold text-neutral-900">{cityOverview.mostPollutedRoad.name.split('(')[0].trim()}</span>
                <span className="font-bold tabular-nums text-rose-700">({cityOverview.mostPollutedRoad.pm25} µg)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Top Interactive Toolbar: Mode Tampilan & Filter Mudah untuk Pengguna Awam */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        
        {/* Left: 3 Mode Tampilan Utama */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-bold text-neutral-500 mr-1 hidden sm:inline">Lihat Data:</span>
          
          <div className="flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200 text-xs font-semibold">
            {/* Mode 1: Kombinasi (Polusi + Suhu) */}
            <button
              onClick={() => setActiveLayer('both')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
                activeLayer === 'both'
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Semua Data (Live)</span>
            </button>

            {/* Mode 2: Polusi Udara Saja */}
            <button
              onClick={() => setActiveLayer('pm25')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
                activeLayer === 'pm25'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Wind className="w-3.5 h-3.5 text-emerald-500" />
              <span>Polusi Udara (PM2.5)</span>
            </button>

            {/* Mode 3: Suhu Jalan Saja */}
            <button
              onClick={() => setActiveLayer('temp')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full transition-all ${
                activeLayer === 'temp'
                  ? 'bg-white text-amber-700 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-amber-500" />
              <span>Suhu Jalanan (°C)</span>
            </button>
          </div>
        </div>

        {/* Right: Map Theme & Quick Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          
          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setQuickFilter('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                quickFilter === 'all'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Semua Ruas ({roads.length})
            </button>

            <button
              onClick={() => setQuickFilter('clean')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                quickFilter === 'clean'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Udara Bersih</span>
            </button>

            <button
              onClick={() => setQuickFilter('polluted')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                quickFilter === 'polluted'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Berpolusi</span>
            </button>

            <button
              onClick={() => setQuickFilter('cool')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                quickFilter === 'cool'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5 text-sky-500" />
              <span>Sejuk</span>
            </button>
          </div>

          {/* Toggle Bandingkan Rute */}
          <button
            type="button"
            onClick={() => setShowRoutes(prev => !prev)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              showRoutes
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-neutral-200'
            }`}
            title="Tampilkan perbandingan rute terbersih vs rute tercepat"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{showRoutes ? 'Tutup Rute' : 'Bandingkan Rute'}</span>
          </button>

          {/* Theme Switcher (Terang / Gelap) */}
          <button
            onClick={() => setMapTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors ml-1"
            title={mapTheme === 'light' ? "Ubah ke peta mode gelap" : "Ubah ke peta mode terang"}
          >
            {mapTheme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          </button>
        </div>
      </div>

      {/* 2.5. Mobile View Mode Switcher: Tampilan Peta vs Detail Jalan (Khusus Layar HP < lg) */}
      <div className="flex lg:hidden bg-neutral-100 p-1 rounded-2xl border border-neutral-200 shadow-inner">
        <button
          onClick={() => {
            setMobileTab('map');
            setIsSheetOpen(false);
          }}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mobileTab === 'map'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Tampilan Peta</span>
        </button>
        <button
          onClick={() => setMobileTab('detail')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            mobileTab === 'detail'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Detail Ruas Jalan {selectedRoad ? `(${selectedRoad.name.split('(')[0].trim()})` : ''}</span>
        </button>
      </div>

      {/* 3. Main Grid: Left Map Canvas + Right Side Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start select-none">
        
        {/* MAP CANVAS SECTION (7 cols on desktop, full width on mobile) */}
        <div className={`lg:col-span-7 relative isolate z-0 w-full rounded-[24px] overflow-hidden border border-neutral-200/80 shadow-md bg-[#E5E5EA] ${
          mobileTab === 'map' ? 'block h-[65vh] sm:h-[600px] lg:h-[660px]' : 'hidden lg:block lg:h-[660px]'
        }`}>
          
          {/* MapLibre GL Map */}
          <Map
            ref={mapRef}
            center={cityDefaultView.center}
            zoom={cityDefaultView.zoom}
            theme={mapTheme}
            styles={currentMapStyles}
            className="w-full h-full"
          >
            <MapControls position="bottom-right" />

            {/* H3 Mission Zone (Optional for Citizens) */}
            {showH3Mission && (
              <MapGeoJSON
                id="h3-zone-public"
                data={h3GeoJson}
                fillPaint={{
                  "fill-color": "#f59e0b",
                  "fill-opacity": 0.12
                }}
                linePaint={{
                  "line-color": "#d97706",
                  "line-width": 2,
                  "line-dasharray": [4, 4]
                }}
              />
            )}

            {/* Clean Air vs Fastest Route Corridors (Hanya aktif saat Bandingkan Rute diaktifkan) */}
            {showRoutes && (
              <>
                {/* Clean Air Green Corridor */}
                <MapRoute
                  id="route-clean-air-casing"
                  coordinates={cleanRouteCoordsLngLat}
                  color="#ffffff"
                  width={9}
                  opacity={0.8}
                />
                <MapRoute
                  id="route-clean-air"
                  coordinates={cleanRouteCoordsLngLat}
                  color="#10b981"
                  width={6}
                  opacity={0.95}
                />

                {/* Fastest Arterial Route */}
                <MapRoute
                  id="route-fastest-casing"
                  coordinates={fastestRouteCoordsLngLat}
                  color="#ffffff"
                  width={7}
                  opacity={0.8}
                />
                <MapRoute
                  id="route-fastest"
                  coordinates={fastestRouteCoordsLngLat}
                  color="#f97316"
                  width={4.5}
                  opacity={0.85}
                />

                {/* Marker A (Origin) */}
                <MapMarker longitude={originCoord[0]} latitude={originCoord[1]}>
                  <MarkerContent>
                    <div 
                      className="group relative cursor-pointer select-none"
                      title={activeCity === 'surabaya' ? 'Titik A: Bundaran Waru' : 'Titik A: Menteng'}
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-xs border-2 border-white shadow-xl ring-2 ring-blue-400">
                        A
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex whitespace-nowrap bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg pointer-events-none z-30">
                        {activeCity === 'surabaya' ? 'Titik A (Waru)' : 'Titik A (Menteng)'}
                      </div>
                    </div>
                  </MarkerContent>
                </MapMarker>

                {/* Marker B (Destination) */}
                <MapMarker longitude={destCoord[0]} latitude={destCoord[1]}>
                  <MarkerContent>
                    <div 
                      className="group relative cursor-pointer select-none"
                      title={activeCity === 'surabaya' ? 'Titik B: Jl. Tunjungan' : 'Titik B: Senopati'}
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xs border-2 border-white shadow-xl ring-2 ring-emerald-400">
                        B
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex whitespace-nowrap bg-neutral-900 text-white text-[10px] px-2 py-0.5 rounded shadow-lg pointer-events-none z-30">
                        {activeCity === 'surabaya' ? 'Titik B (Tunjungan)' : 'Titik B (Senopati)'}
                      </div>
                    </div>
                  </MarkerContent>
                </MapMarker>
              </>
            )}

            {/* Road Polylines on Map (100% Precise OpenStreetMap Geometry) */}
            {filteredRoads.map((road) => {
              const isSelected = selectedRoad?.id === road.id;
              const pmMeta = getAirQualityMeta(road.category, road.pm25);
              const tempMeta = getTemperatureMeta(road.temperature);

              // Select color based on active display mode
              const color = activeLayer === 'temp' ? tempMeta.color : pmMeta.color;
              const lngLatCoords = road.coordinates.map(([lat, lng]) => [lng, lat] as [number, number]);

              return (
                <React.Fragment key={road.id}>
                  {/* Glowing Underlay for Selected Road */}
                  {isSelected && (
                    <MapRoute
                      id={`road-halo-${road.id}`}
                      coordinates={lngLatCoords}
                      color={color}
                      width={16}
                      opacity={0.35}
                    />
                  )}

                  {/* High-Contrast Casing for Visual Separation from Base Map */}
                  <MapRoute
                    id={`road-casing-${road.id}`}
                    coordinates={lngLatCoords}
                    color={mapTheme === 'dark' ? '#0f172a' : '#ffffff'}
                    width={isSelected ? 11 : 7.5}
                    opacity={0.85}
                  />

                  {/* Main Road Route Polyline */}
                  <MapRoute
                    id={`road-${road.id}`}
                    coordinates={lngLatCoords}
                    color={color}
                    width={isSelected ? 7.5 : 4.8}
                    opacity={isSelected ? 1.0 : 0.92}
                    interactive={true}
                    onClick={() => {
                      onSelectRoad(road);
                      setIsSheetOpen(true);
                    }}
                  />
                </React.Fragment>
              );
            })}

            {/* 1. PIN KHUSUS RUAS JALAN TERPILIH (Pin 32px dengan Indikator Cincin Aktif) */}
            {selectedRoad && showBadges && (
              <MapMarker
                key={`selected-pin-${selectedRoad.id}`}
                longitude={selectedRoad.center[1]}
                latitude={selectedRoad.center[0]}
                onClick={() => setIsSheetOpen(true)}
              >
                <MarkerContent>
                  <div className="relative group cursor-pointer z-30 select-none -translate-y-1">
                    <span 
                      className="absolute -inset-1.5 rounded-full animate-ping opacity-35"
                      style={{ backgroundColor: getAirQualityMeta(selectedRoad.category, selectedRoad.pm25).color }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full bg-white shadow-xl border-3 ring-4 ring-blue-500/30 flex items-center justify-center font-mono font-black text-xs text-neutral-900 transition-transform hover:scale-110 active:scale-95"
                      style={{ borderColor: getAirQualityMeta(selectedRoad.category, selectedRoad.pm25).color }}
                    >
                      {Math.round(selectedRoad.pm25)}
                    </div>
                  </div>
                </MarkerContent>
              </MapMarker>
            )}

            {/* 2. PIN RUAS LAINNYA (Pin Lingkaran 26px Bersih, Zero-Overlap) */}
            {showBadges && filteredRoads
              .filter(road => road.id !== selectedRoad?.id)
              .map((road) => {
                const pmMeta = getAirQualityMeta(road.category, road.pm25);

                return (
                  <MapMarker
                    key={`pin-${road.id}`}
                    longitude={road.center[1]}
                    latitude={road.center[0]}
                    onClick={() => {
                      onSelectRoad(road);
                    }}
                  >
                    <MarkerContent>
                      <div 
                        className="group relative cursor-pointer z-10 transition-transform hover:scale-125 hover:z-25 active:scale-95 select-none"
                        title={`${road.name}: ${Math.round(road.pm25)} µg/m³ • ${road.temperature.toFixed(0)}°C`}
                      >
                        <div 
                          className="w-6.5 h-6.5 rounded-full bg-white shadow-md border-2 flex items-center justify-center font-mono font-extrabold text-[10px] text-neutral-800 transition-all hover:shadow-lg hover:border-blue-500"
                          style={{ borderColor: pmMeta.color }}
                        >
                          {Math.round(road.pm25)}
                        </div>
                        {/* Mini Hover Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center whitespace-nowrap bg-neutral-900 text-white text-[10px] px-2 py-1 rounded-lg shadow-xl pointer-events-none z-30 font-sans">
                          <span className="font-bold">{road.name.split('(')[0].trim()}</span>
                          <span className="text-neutral-300 font-mono text-[9px]">
                            {Math.round(road.pm25)} µg/m³ • {road.temperature.toFixed(0)}°C
                          </span>
                        </div>
                      </div>
                    </MarkerContent>
                  </MapMarker>
                );
              })}

            {/* Live Telemetry EV Fleet Position Marker */}
            {isLiveStreaming && (
              <MapMarker longitude={evCoord[0]} latitude={evCoord[1]}>
                <MarkerContent>
                  <div 
                    className="relative flex items-center justify-center select-none cursor-pointer group"
                    title="Armada Motor Listrik Pengukur Polusi Real-Time"
                  >
                    <span className="absolute w-7 h-7 rounded-full bg-blue-500 opacity-30 animate-ping" />
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-bold">
                      ⚡
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover:flex whitespace-nowrap bg-blue-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow font-sans">
                      Armada Sensor IoT
                    </div>
                  </div>
                </MarkerContent>
              </MapMarker>
            )}
          </Map>

          {/* Top Floating Search Bar Inside Map */}
          <div className="absolute top-3 inset-x-3 space-y-2 z-20 pointer-events-none">
            <form onSubmit={handleSearchSubmit} className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 flex items-center space-x-2.5 border border-neutral-200/80 shadow-lg max-w-md mx-auto">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeCity === 'surabaya' 
                    ? "Cari jalan: Tunjungan, Darmo, A. Yani, MERR, Perak, Pakuwon..." 
                    : "Cari jalan: Sudirman, Senopati, Kuningan, Thamrin..."
                }
                className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-neutral-400 hover:text-neutral-900 font-semibold"
                >
                  Batal
                </button>
              )}
            </form>
          </div>

          {/* Top Route Comparison Explanation Banner */}
          {showRoutes && (
            <div className="absolute top-16 inset-x-3 sm:inset-x-auto sm:left-4 z-20 pointer-events-auto max-w-sm">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 px-3.5 shadow-xl border border-neutral-200/90 flex items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-neutral-900 leading-tight">Simulasi Rute Perjalanan</span>
                    <div className="flex items-center space-x-2 text-[10px] mt-0.5">
                      <span className="flex items-center space-x-1 text-emerald-700 font-bold shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Rute Hijau (-64% Polusi)</span>
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="flex items-center space-x-1 text-orange-700 font-bold shrink-0">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>Rute Cepat</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoutes(false)}
                  className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-700 shrink-0"
                  title="Tutup perbandingan rute"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* FLOATING SELECTED ROAD HUD CARD (Docked above bottom controls, never overlaps pins!) */}
          {selectedRoad && (
            <div className="hidden lg:block absolute bottom-16 left-4 max-w-sm z-20 pointer-events-auto">
              <div 
                className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border-2 ring-4 ring-black/5 flex items-center justify-between gap-3 transition-all"
                style={{ borderColor: getAirQualityMeta(selectedRoad.category, selectedRoad.pm25).color }}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div 
                    className="w-10 h-10 rounded-xl flex flex-col items-center justify-center text-white font-mono font-bold shrink-0 shadow-xs"
                    style={{ backgroundColor: getAirQualityMeta(selectedRoad.category, selectedRoad.pm25).color }}
                  >
                    <span className="text-xs font-black leading-none">{Math.round(selectedRoad.pm25)}</span>
                    <span className="text-[8px] font-sans font-normal opacity-90 mt-0.5">µg/m³</span>
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <h4 className="text-xs font-extrabold text-neutral-900 truncate">
                        {selectedRoad.name.split('(')[0].trim()}
                      </h4>
                      <span 
                        className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0"
                        style={{ 
                          backgroundColor: `${getAirQualityMeta(selectedRoad.category, selectedRoad.pm25).color}20`, 
                          color: getAirQualityMeta(selectedRoad.category, selectedRoad.pm25).color 
                        }}
                      >
                        {getAirQualityMeta(selectedRoad.category, selectedRoad.pm25).shortLabel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-neutral-600 mt-0.5 truncate">
                      <span className="text-amber-700 font-bold shrink-0">🌡️ {selectedRoad.temperature.toFixed(0)}°C</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-neutral-500 font-sans text-[10px] truncate">{selectedRoad.area}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={() => setIsSheetOpen(true)}
                    className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs active:scale-95"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Left: Re-center & Map Style Pill */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2">
            <button
              onClick={handleResetView}
              className="p-2.5 bg-white/95 backdrop-blur-md hover:bg-white text-blue-600 rounded-full shadow-lg border border-neutral-200/80 transition-all active:scale-95"
              title={`Pusatkan kembali ke ${activeCity === 'surabaya' ? 'Surabaya' : 'DKI Jakarta'}`}
            >
              <Crosshair className="w-4 h-4" />
            </button>

            {/* Quick Basemap Switcher */}
            <div className="hidden sm:flex items-center p-1 bg-white/95 backdrop-blur-md rounded-full border border-neutral-200/80 shadow-lg text-[11px] font-semibold">
              {(['streets', 'satellite'] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setActiveBasemap(b)}
                  className={`px-2.5 py-0.5 rounded-full transition-all capitalize ${
                    activeBasemap === b
                      ? 'bg-neutral-900 text-white font-bold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  {b === 'streets' ? 'Peta Jalan' : 'Satelit'}
                </button>
              ))}
            </div>
          </div>

          {/* FLOATING INTERACTIVE COLOR LEGEND (Panduan Warna Ramah Awam) */}
          {showLegend && (
            <div className="absolute bottom-4 right-14 sm:right-16 z-20 bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xl max-w-[280px] sm:max-w-xs transition-all">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-100">
                <span className="text-[11px] font-bold text-neutral-800 flex items-center space-x-1">
                  <Info className="w-3 h-3 text-blue-500" />
                  <span>
                    {activeLayer === 'temp' ? 'Panduan Suhu Jalan' : 'Panduan Kualitas Udara'}
                  </span>
                </span>
                <button 
                  onClick={() => setShowLegend(false)}
                  className="text-[10px] text-neutral-400 hover:text-neutral-700"
                >
                  Tutup
                </button>
              </div>

              {/* Legend for Air Pollution */}
              {activeLayer !== 'temp' && (
                <div className="space-y-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-neutral-800">Bersih & Segar</span>
                    </div>
                    <span className="font-mono text-neutral-500">0 - 15 µg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-semibold text-neutral-800">Sedang</span>
                    </div>
                    <span className="font-mono text-neutral-500">16 - 35 µg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="font-semibold text-neutral-800">Tidak Sehat</span>
                    </div>
                    <span className="font-mono text-neutral-500">36 - 55 µg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      <span className="font-semibold text-neutral-800">Sangat Bahaya</span>
                    </div>
                    <span className="font-mono text-neutral-500">&gt; 55 µg</span>
                  </div>
                </div>
              )}

              {/* Legend for Temperature */}
              {activeLayer === 'temp' && (
                <div className="space-y-1 text-[10px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <span className="font-semibold text-neutral-800">Sejuk</span>
                    </div>
                    <span className="font-mono text-neutral-500">&lt; 28°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-neutral-800">Hangat Normal</span>
                    </div>
                    <span className="font-mono text-neutral-500">28 - 31°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-semibold text-neutral-800">Cukup Panas</span>
                    </div>
                    <span className="font-mono text-neutral-500">32 - 34°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="font-semibold text-neutral-800">Panas Terik</span>
                    </div>
                    <span className="font-mono text-neutral-500">&ge; 35°C</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sleek Floating Peek Pill on Mobile Map (< lg) when Sheet is Closed */}
          {!isSheetOpen && selectedRoad && mobileTab === 'map' && (
            <div className="lg:hidden absolute bottom-3 inset-x-3 z-20 pointer-events-none">
              <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-neutral-200/90 shadow-xl flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-mono text-neutral-400 font-semibold uppercase truncate">
                    {selectedRoad.area}
                  </div>
                  <div className="text-xs font-bold text-neutral-900 truncate">
                    {selectedRoad.name}
                  </div>
                  <div className="flex items-center space-x-2 mt-0.5 text-xs">
                    <span className="font-extrabold" style={{ color: getAirQualityMeta(selectedRoad.category).color }}>
                      {selectedRoad.pm25.toFixed(1)} µg/m³
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="font-bold text-neutral-700">{selectedRoad.temperature.toFixed(1)}°C</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => setIsSheetOpen(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    Buka Card
                  </button>
                  <button
                    onClick={() => setMobileTab('detail')}
                    className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-all"
                    title="Lihat Detail Lengkap"
                  >
                    Detail Penuh
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Bottom Sheet Overlay (< lg) */}
          <div className="lg:hidden">
            {isSheetOpen && selectedRoad && (
              <div className="absolute inset-x-0 bottom-0 max-h-[75%] bg-white rounded-t-[28px] border-t border-neutral-200 shadow-2xl z-30 transition-all duration-300 overflow-y-auto no-scrollbar">
                {/* Sheet Header with Close Button */}
                <div className="w-full flex items-center justify-between px-4 pt-3 pb-2 sticky top-0 bg-white/95 backdrop-blur-md border-b border-neutral-100 z-10">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-neutral-800">Detail Ruas Jalan</span>
                  </div>
                  <div className="w-10 h-1 rounded-full bg-neutral-300" />
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full transition-colors"
                    aria-label="Tutup Panel Detail"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <RoadDetailContent 
                    selectedRoad={selectedRoad} 
                    routeComparison={routeComparison} 
                    onUpdateRoad={onUpdateRoad}
                    isSimSettingsOpen={isSimSettingsOpen}
                    setIsSimSettingsOpen={setIsSimSettingsOpen}
                    onOpenDataStudio={onOpenDataStudio}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DETAIL PANEL (Tampil di desktop SELALU, di mobile saat tab 'detail') */}
        <div className={`space-y-4 ${
          mobileTab === 'detail' ? 'block' : 'hidden lg:block lg:col-span-5'
        } lg:col-span-5 bg-white rounded-[24px] border border-neutral-200/80 p-5 ${
          mobileTab === 'detail' ? 'h-auto' : 'h-[660px] overflow-y-auto no-scrollbar shadow-xs'
        }`}>
          {selectedRoad ? (
            <>
              <RoadDetailContent 
                selectedRoad={selectedRoad} 
                routeComparison={routeComparison} 
                onUpdateRoad={onUpdateRoad}
                isSimSettingsOpen={isSimSettingsOpen}
                setIsSimSettingsOpen={setIsSimSettingsOpen}
                onOpenDataStudio={onOpenDataStudio}
              />

              {/* Tombol Kembali ke Peta untuk Layar Mobile */}
              <div className="lg:hidden pt-3 border-t border-neutral-100">
                <button
                  onClick={() => setMobileTab('map')}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
                >
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span>Kembali ke Tampilan Peta</span>
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Compass className="w-12 h-12 text-blue-500 mb-3 opacity-60 animate-pulse" />
              <div className="text-base font-bold text-neutral-900">Pilih Ruas Jalan di Peta</div>
              <div className="text-xs mt-1.5 max-w-xs leading-relaxed text-neutral-500">
                Klik salah satu garis jalan atau pin pada peta untuk melihat kualitas polusi udara, suhu aspal, dan panduan kesehatan secara live.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Reusable Detail Content Component for Ordinary Citizens
interface RoadDetailContentProps {
  selectedRoad: RoadSegment;
  routeComparison: NavigationComparison;
  onUpdateRoad: (updated: RoadSegment) => void;
  isSimSettingsOpen: boolean;
  setIsSimSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenDataStudio: () => void;
}

const RoadDetailContent: React.FC<RoadDetailContentProps> = ({
  selectedRoad,
  routeComparison,
  onUpdateRoad,
  isSimSettingsOpen,
  setIsSimSettingsOpen,
  onOpenDataStudio
}) => {
  const pmMeta = getAirQualityMeta(selectedRoad.category, selectedRoad.pm25);
  const tempMeta = getTemperatureMeta(selectedRoad.temperature);
  const pmPercentage = Math.min(100, Math.max(0, Math.round((selectedRoad.pm25 / 65) * 100)));

  return (
    <div className="space-y-4">
      
      {/* 1. Header Informasi Jalan */}
      <div className="border-b border-neutral-100 pb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-neutral-500 font-semibold uppercase tracking-wider">
            {selectedRoad.area}
          </span>
          <div className="flex items-center space-x-1.5 bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live • Baru Saja</span>
          </div>
        </div>

        <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight mt-1 leading-snug">
          {selectedRoad.name}
        </h2>
        
        <p className="text-xs text-neutral-500 mt-0.5">
          Diperiksa oleh armada motor listrik pengukur lingkungan
        </p>
      </div>

      {/* 2. DUA KARTU UTAMA BERDAMPINGAN: POLUSI UDARA & SUHU JALANAN (Apple Full-Color Card Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* KARTU 1: POLUSI UDARA (PM2.5) */}
        <div className={`p-5 rounded-[24px] text-white ${pmMeta.solidBg} shadow-lg shadow-black/10 flex flex-col justify-between transition-all duration-300`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/90 flex items-center space-x-1.5">
                <Wind className="w-4 h-4 text-white" />
                <span>Polusi Udara</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                {pmMeta.shortLabel}
              </span>
            </div>

            <div className="py-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
                {selectedRoad.pm25.toFixed(1)}
                <span className="text-xs font-medium text-white/80 ml-1">µg/m³</span>
              </div>
              <div className="text-xs font-bold text-white/95 mt-0.5">
                {pmMeta.label}
              </div>
            </div>
          </div>

          {/* Visual Spectrum Bar (Frosted white on solid color) */}
          <div className="pt-2 space-y-1">
            <div className="relative w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${pmPercentage}%` }} 
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-white/75">
              <span>0 Bersih</span>
              <span>35 Sedang</span>
              <span>55+ Bahaya</span>
            </div>
          </div>
        </div>

        {/* KARTU 2: SUHU & IKLIM JALANAN (°C) (Apple Sky-Blue Weather Card Style) */}
        <div className="p-5 rounded-[24px] text-white bg-[#0284c7] shadow-lg shadow-sky-950/10 flex flex-col justify-between transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-sky-100 flex items-center space-x-1.5">
                <Thermometer className="w-4 h-4 text-white" />
                <span>Suhu Jalanan</span>
              </span>
              <div className="w-7 h-7 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0">
                <Sun className="w-4 h-4 text-amber-200 fill-amber-200" />
              </div>
            </div>

            <div className="py-1">
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
                {selectedRoad.temperature.toFixed(1)}
                <span className="text-xs font-medium text-sky-100 ml-1">°C</span>
              </div>
              <div className="text-xs font-bold text-sky-100 mt-0.5">
                {tempMeta.label}
              </div>
            </div>
          </div>

          {/* Humidity & Sun info in Frosted Tile */}
          <div className="pt-2 text-[11px] text-white space-y-1">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center justify-between font-mono">
              <span className="flex items-center space-x-1 text-sky-100">
                <Droplets className="w-3 h-3 text-sky-200" />
                <span>Kelembapan:</span>
              </span>
              <span className="font-bold text-white">{selectedRoad.humidity}% RH</span>
            </div>
            <div className="text-[10px] text-sky-100 font-sans px-1">
              {tempMeta.sunExposure}
            </div>
          </div>
        </div>

      </div>

      {/* 3. PANDUAN KESEHATAN DAN KENYAMANAN WARGA */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 space-y-3 shadow-xs">
        <h4 className="text-xs font-bold text-neutral-900 flex items-center space-x-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Panduan Untuk Pengendara & Pejalan Kaki</span>
        </h4>

        <div className="space-y-2 text-xs">
          {/* Advice Masker with Solid Saturated Squircle */}
          <div className="flex items-start space-x-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-neutral-900">{pmMeta.maskAdvice}</div>
              <div className="text-neutral-500 text-[11px] mt-0.5">{pmMeta.healthAdvice}</div>
            </div>
          </div>

          {/* Advice Suhu & Panas with Solid Saturated Squircle */}
          <div className="flex items-start space-x-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <div className="w-8 h-8 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-neutral-900">{tempMeta.label}</div>
              <div className="text-neutral-500 text-[11px] mt-0.5">{tempMeta.comfortAdvice}</div>
            </div>
          </div>
        </div>

        {/* Armada Live Proof */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-500 font-mono">
          <span>Armada Melintas Hari Ini:</span>
          <span className="font-bold text-neutral-800">{selectedRoad.uniquePassesCount} Motor Listrik</span>
        </div>
      </div>

      {/* 4. REKOMENDASI RUTE BERSIH ALTERNATIF (Apple Solid Cobalt Navigation Card) */}
      <div className="rounded-[24px] p-5 bg-[#1d4ed8] text-white shadow-lg shadow-blue-950/15 space-y-3 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-white" />
            <span>Pilihan Rute Rendah Polusi</span>
          </span>
          <span className="text-[11px] font-black bg-emerald-400 text-neutral-950 px-2.5 py-0.5 rounded-full shadow-xs">
            Hemat -63% Polusi
          </span>
        </div>

        <p className="text-xs text-blue-100 leading-relaxed">
          Hindari paparan asap knalpot berlebih di jalan protokol padat dengan memilih Koridor Hijau ramah pernapasan.
        </p>

        {/* Comparison Pills with Frosted Glass Containers */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/25">
            <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Rute Bersih</div>
            <div className="text-white font-extrabold text-base mt-0.5 tabular-nums">
              {routeComparison.cleanAirRoute.averagePM25.toFixed(1)} µg/m³
            </div>
            <div className="text-[10px] text-blue-100 mt-0.5">
              {routeComparison.cleanAirRoute.durationMinutes} m • {routeComparison.cleanAirRoute.distanceKm} km
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
            <div className="text-[10px] text-blue-200 font-semibold uppercase tracking-wider">Rute Biasa</div>
            <div className="text-white/80 font-bold text-base mt-0.5 tabular-nums">
              {routeComparison.fastestRoute.averagePM25.toFixed(1)} µg/m³
            </div>
            <div className="text-[10px] text-blue-200 mt-0.5">
              {routeComparison.fastestRoute.durationMinutes} m • {routeComparison.fastestRoute.distanceKm} km
            </div>
          </div>
        </div>

        <button 
          onClick={() => alert(`Memulai panduan rute rendah polusi via ${routeComparison.cleanAirRoute.title}.`)}
          className="w-full py-2.5 bg-white hover:bg-blue-50 text-blue-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center space-x-1.5"
        >
          <Navigation className="w-3.5 h-3.5 fill-current" />
          <span>Navigasi Rute Bersih</span>
        </button>
      </div>

      {/* 5. ACCORDION PENGATURAN SENSOR (Mode Pengembang / Simulasi Tersembunyi) */}
      <div className="pt-1">
        <button
          onClick={() => setIsSimSettingsOpen(prev => !prev)}
          className="w-full flex items-center justify-between text-xs text-neutral-400 hover:text-neutral-700 py-1 font-medium transition-colors"
        >
          <span className="flex items-center space-x-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Mode Uji & Simulasi Sensor (Pengembang)</span>
          </span>
          {isSimSettingsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isSimSettingsOpen && (
          <div className="mt-2 p-3 bg-neutral-100 rounded-xl border border-neutral-200 space-y-3 text-xs">
            <div className="text-[11px] text-neutral-500">
              Gunakan penggeser di bawah ini jika ingin menguji visualisasi peta saat nilai sensor berubah:
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-neutral-600">Simulasi PM2.5:</span>
                <span className="font-bold" style={{ color: pmMeta.color }}>
                  {selectedRoad.pm25.toFixed(1)} µg/m³
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="0.5"
                value={selectedRoad.pm25}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateRoad({
                    ...selectedRoad,
                    pm25: val,
                    category: calculateAirQualityLevel(val)
                  });
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-neutral-600">Simulasi Suhu:</span>
                <span className="font-bold" style={{ color: tempMeta.color }}>
                  {selectedRoad.temperature.toFixed(1)} °C
                </span>
              </div>
              <input
                type="range"
                min="24"
                max="40"
                step="0.2"
                value={selectedRoad.temperature}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateRoad({
                    ...selectedRoad,
                    temperature: val
                  });
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <button
              onClick={onOpenDataStudio}
              className="w-full py-1.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-lg text-xs font-bold transition-all"
            >
              Buka Data Studio Lengkap
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
