import React, { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { PhoneFrame } from './components/PhoneFrame';
import { MitraDashboard } from './components/MitraDashboard';
import { PublicMap } from './components/PublicMap';
import { WalletView } from './components/WalletView';
import { ProfilePrivacy } from './components/ProfilePrivacy';
import { DataStudioModal } from './components/DataStudioModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  initialDriverState, 
  activeH3Mission, 
  mockRoadSegments, 
  mockRouteComparison, 
  mockTransactions,
  calculateAirQualityLevel
} from './data/mockData';
import {
  surabayaRoadSegments,
  surabayaRouteComparison,
  surabayaH3Mission
} from './data/surabayaData';
import { DriverState, RoadSegment, NavigationComparison } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'mitra' | 'map' | 'wallet' | 'privacy'>('mitra');
  const [driver, setDriver] = useState<DriverState>(initialDriverState);
  
  // Active City State: Default to Surabaya as the main focus
  const [activeCity, setActiveCity] = useState<'surabaya' | 'jakarta'>('surabaya');

  // Interactive Road Data State (Defaults to Surabaya)
  const [roads, setRoads] = useState<RoadSegment[]>(surabayaRoadSegments);
  const [selectedRoadId, setSelectedRoadId] = useState<string>('SEG-SBY-04'); // Jl. Raya Darmo (Taman Bungkul)
  
  // Interactive Studio & Live Drift State
  const [isDataStudioOpen, setIsDataStudioOpen] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Selected Road Object
  const selectedRoad = useMemo(() => {
    return roads.find(r => r.id === selectedRoadId) || roads[0] || null;
  }, [roads, selectedRoadId]);

  // City Switcher Handler
  const handleSwitchCity = (city: 'surabaya' | 'jakarta') => {
    setActiveCity(city);
    if (city === 'surabaya') {
      setRoads(surabayaRoadSegments);
      setSelectedRoadId('SEG-SBY-04');
    } else {
      setRoads(mockRoadSegments);
      setSelectedRoadId('SEG-03');
    }
  };

  // Dynamically Recalculate Route Comparison when Roads or City changes
  const dynamicRouteComparison = useMemo<NavigationComparison>(() => {
    if (activeCity === 'surabaya') {
      const aYani = roads.find(r => r.name.includes('Ahmad Yani'));
      const darmo = roads.find(r => r.name.includes('Darmo'));
      const basuki = roads.find(r => r.name.includes('Basuki Rahmat'));

      const fastestPM25 = aYani ? aYani.pm25 : 45.2;
      const cleanPM25 = darmo && basuki 
        ? (darmo.pm25 * 0.6 + basuki.pm25 * 0.4) 
        : (darmo ? darmo.pm25 : 16.4);

      const reduction = Math.max(0, Math.min(95, Math.round(((fastestPM25 - cleanPM25) / Math.max(fastestPM25, 1)) * 100)));

      return {
        ...surabayaRouteComparison,
        fastestRoute: {
          ...surabayaRouteComparison.fastestRoute,
          averagePM25: Number(fastestPM25.toFixed(1))
        },
        cleanAirRoute: {
          ...surabayaRouteComparison.cleanAirRoute,
          averagePM25: Number(cleanPM25.toFixed(1)),
          reductionPercentage: reduction,
          badge: reduction > 0 ? `-${reduction}% paparan polusi` : 'Paparan Seimbang'
        }
      };
    }

    // Jakarta
    const sudirman = roads.find(r => r.name.includes('Sudirman'));
    const gatsu = roads.find(r => r.name.includes('Gatot Subroto'));
    const senopati = roads.find(r => r.name.includes('Senopati'));
    const asiaAfrika = roads.find(r => r.name.includes('Asia Afrika'));
    const thamrin = roads.find(r => r.name.includes('Thamrin'));

    const fastestPM25 = sudirman && gatsu 
      ? (sudirman.pm25 * 0.65 + gatsu.pm25 * 0.35)
      : (sudirman ? sudirman.pm25 : 41.5);

    const cleanPM25 = senopati && asiaAfrika 
      ? (senopati.pm25 * 0.5 + asiaAfrika.pm25 * 0.35 + (thamrin ? thamrin.pm25 * 0.15 : 12 * 0.15))
      : (senopati ? senopati.pm25 : 14.8);

    const reduction = Math.max(0, Math.min(95, Math.round(((fastestPM25 - cleanPM25) / Math.max(fastestPM25, 1)) * 100)));

    return {
      ...mockRouteComparison,
      fastestRoute: {
        ...mockRouteComparison.fastestRoute,
        averagePM25: Number(fastestPM25.toFixed(1))
      },
      cleanAirRoute: {
        ...mockRouteComparison.cleanAirRoute,
        averagePM25: Number(cleanPM25.toFixed(1)),
        reductionPercentage: reduction,
        badge: reduction > 0 ? `-${reduction}% paparan polusi` : 'Paparan Seimbang'
      }
    };
  }, [roads, activeCity]);

  // Real-time IoT Simulation Drift for both Air Pollution & Street Temperature
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      setRoads((prevRoads) => {
        if (prevRoads.length === 0) return prevRoads;
        const randomIndex = Math.floor(Math.random() * prevRoads.length);
        const target = prevRoads[randomIndex];
        const deltaPM = (Math.random() * 2.2 - 1.1);
        const deltaTemp = (Math.random() * 0.4 - 0.2);
        const newPM = Math.max(5, Math.min(125, Number((target.pm25 + deltaPM).toFixed(1))));
        const newTemp = Math.max(25, Math.min(38, Number((target.temperature + deltaTemp).toFixed(1))));
        const newCategory = calculateAirQualityLevel(newPM);

        const updated = [...prevRoads];
        updated[randomIndex] = {
          ...target,
          pm25: newPM,
          temperature: newTemp,
          category: newCategory,
          ageMinutes: 0
        };
        return updated;
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Road Data Actions
  const handleUpdateRoad = (updated: RoadSegment) => {
    setRoads(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleSetAllRoads = (newRoads: RoadSegment[]) => {
    setRoads(newRoads);
  };

  const handleAddRoad = (newRoad: RoadSegment) => {
    setRoads(prev => [newRoad, ...prev]);
    setSelectedRoadId(newRoad.id);
  };

  const handleDeleteRoad = (id: string) => {
    setRoads(prev => prev.filter(r => r.id !== id));
  };

  const handleResetDefaults = () => {
    if (activeCity === 'surabaya') {
      setRoads(surabayaRoadSegments);
      setSelectedRoadId('SEG-SBY-04');
    } else {
      setRoads(mockRoadSegments);
      setSelectedRoadId(mockRoadSegments[2]?.id || 'SEG-03');
    }
  };

  // Toggle Anomaly Simulation: Normal Driving vs Mock GPS / 0.0g stationary desk
  const handleToggleAnomaly = () => {
    setDriver((prev) => {
      const willBeAnomaly = !prev.isSimulatingAnomaly;
      return {
        ...prev,
        isSimulatingAnomaly: willBeAnomaly,
        isAntiCheatPassed: !willBeAnomaly,
        currentSpeed: willBeAnomaly ? 45 : 34,
        accelerometerRMS: willBeAnomaly ? 0.01 : 0.28,
        anomalyReason: willBeAnomaly 
          ? 'Indikasi Mock GPS: Koordinat bergerak 45 km/j saat getaran fisik 0.01g' 
          : null
      };
    });
  };

  const handleNavigateMission = () => {
    setActiveTab('map');
  };

  return (
    <>
      <PhoneFrame
        activeTab={activeTab}
        onTabChange={setActiveTab}
        driver={driver}
        onToggleAnomaly={handleToggleAnomaly}
      >
        {activeTab === 'mitra' && (
          <MitraDashboard
            driver={driver}
            mission={activeCity === 'surabaya' ? surabayaH3Mission : activeH3Mission}
            onToggleAnomaly={handleToggleAnomaly}
            onNavigateMission={handleNavigateMission}
            activeCity={activeCity}
          />
        )}

        {activeTab === 'map' && (
          <ErrorBoundary fallbackTitle="Peta Warga Sedang Tidak Dapat Dimuat">
            <div className="space-y-4 pb-24">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      Pemantauan Hiper-Lokal Live • {activeCity === 'surabaya' ? 'Kota Surabaya (Utama)' : 'DKI Jakarta'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-0.5">
                    Peta Polusi Udara & Suhu Jalanan {activeCity === 'surabaya' ? 'Surabaya' : 'Jakarta'}
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                    {activeCity === 'surabaya'
                      ? 'Pemantauan live menyeluruh mencakup 5 wilayah: Surabaya Pusat, Selatan, Timur, Barat, hingga Utara'
                      : 'Kondisi real-time jalanan Jakarta dari sensor bergerak armada motor listrik'}
                  </p>
                </div>

                {/* Quick Launch Scenario Simulation */}
                <button
                  onClick={() => setIsDataStudioOpen(true)}
                  className="self-start sm:self-auto flex items-center space-x-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Simulasi Skenario</span>
                </button>
              </div>

              <PublicMap
                roads={roads}
                routeComparison={dynamicRouteComparison}
                selectedRoad={selectedRoad}
                onSelectRoad={(road) => setSelectedRoadId(road.id)}
                onUpdateRoad={handleUpdateRoad}
                onOpenDataStudio={() => setIsDataStudioOpen(true)}
                isLiveStreaming={isLiveStreaming}
                onToggleLiveStreaming={() => setIsLiveStreaming(prev => !prev)}
                activeCity={activeCity}
                onCityChange={handleSwitchCity}
              />
            </div>
          </ErrorBoundary>
        )}

        {activeTab === 'wallet' && (
          <WalletView transactions={mockTransactions} />
        )}

        {activeTab === 'privacy' && (
          <ProfilePrivacy driver={driver} />
        )}
      </PhoneFrame>

      {/* Global Interactive Data Studio Modal */}
      <DataStudioModal
        isOpen={isDataStudioOpen}
        onClose={() => setIsDataStudioOpen(false)}
        roads={roads}
        onUpdateRoad={handleUpdateRoad}
        onSetAllRoads={handleSetAllRoads}
        onAddRoad={handleAddRoad}
        onDeleteRoad={handleDeleteRoad}
        onResetDefaults={handleResetDefaults}
        selectedRoadId={selectedRoadId}
        onSelectRoad={setSelectedRoadId}
        isLiveStreaming={isLiveStreaming}
        onToggleLiveStreaming={() => setIsLiveStreaming(prev => !prev)}
        activeCity={activeCity}
      />
    </>
  );
}

export default App;
