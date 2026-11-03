import React, { useMemo } from 'react';
import type * as GeoJSON from 'geojson';
import { 
  Map, 
  MapRoute, 
  MapGeoJSON, 
  MapMarker, 
  MarkerContent 
} from '@/components/ui/map';
import { h3HexagonCoordinates } from '../data/mockData';

interface MiniH3MapProps {
  onNavigate?: () => void;
}

export const MiniH3Map: React.FC<MiniH3MapProps> = ({ onNavigate }) => {
  // Convert [lat, lng] to [lng, lat] GeoJSON polygon
  const h3GeoJson = useMemo<GeoJSON.Feature<GeoJSON.Polygon>>(() => ({
    type: "Feature",
    properties: { id: "h3-sudirman", bonus: "1.5x" },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          ...h3HexagonCoordinates.map(([lat, lng]) => [lng, lat] as [number, number]),
          [h3HexagonCoordinates[0][1], h3HexagonCoordinates[0][0]] // close ring
        ]
      ]
    }
  }), []);

  // Mission path in [lng, lat]
  const missionPathLngLat: [number, number][] = [
    [106.8215, -6.2135],
    [106.8228, -6.2078],
    [106.8234, -6.2015],
    [106.8230, -6.1952]
  ];

  return (
    <div 
      onClick={onNavigate}
      className="relative isolate z-0 w-full h-44 rounded-xl overflow-hidden border border-neutral-200/90 shadow-inner my-3 cursor-pointer group bg-neutral-100"
      title="Buka peta interaktif penuh"
    >
      <div className="w-full h-full pointer-events-none">
        <Map
          center={[106.8220, -6.2050]}
          zoom={14}
          interactive={false}
          attributionControl={false}
          className="w-full h-full"
        >
          {/* H3 Hexagon Zone with mapcn GeoJSON */}
          <MapGeoJSON
            id="h3-zone"
            data={h3GeoJson}
            fillPaint={{
              "fill-color": "#f59e0b",
              "fill-opacity": 0.15
            }}
            linePaint={{
              "line-color": "#b45309",
              "line-width": 1.5,
              "line-dasharray": [4, 4]
            }}
          />

          {/* Mission Route with mapcn MapRoute */}
          <MapRoute
            id="mission-path"
            coordinates={missionPathLngLat}
            color="#b45309"
            width={3}
            opacity={0.85}
          />

          {/* EV Vehicle Live Position Marker */}
          <MapMarker longitude={106.8218} latitude={-6.2120}>
            <MarkerContent>
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </MarkerContent>
          </MapMarker>

          {/* Mission Target Pin */}
          <MapMarker longitude={106.8232} latitude={-6.1985}>
            <MarkerContent>
              <div className="w-3.5 h-3.5 rounded-full bg-amber-600 border-2 border-white shadow-md flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </MarkerContent>
          </MapMarker>
        </Map>
      </div>

      {/* Floating Spatial Spec Note */}
      <div className="absolute bottom-2.5 left-2.5 z-[10] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-800 border border-neutral-200/90 shadow-xs flex items-center space-x-1.5 font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
        <span>H3 Resolusi 8 • Radius ±500m</span>
      </div>

      {/* Floating Prompt on Hover */}
      <div className="absolute top-2.5 right-2.5 z-[10] bg-neutral-900/90 text-white px-2 py-0.5 rounded text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Buka di Peta Warga &rarr;
      </div>
    </div>
  );
};
