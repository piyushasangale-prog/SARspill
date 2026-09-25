import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Popup,
  Tooltip,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { MOCK_VESSEL_TRACKS } from '../../data/mockData';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom Vessel Icon SVG Creator
const createVesselIcon = (isSelected: boolean, isTanker: boolean) => {
  const color = isSelected ? '#FC3D21' : isTanker ? '#087EA4' : '#64748B';
  const size = isSelected ? 24 : 18;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="#FFFFFF" stroke-width="2">
      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-vessel-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

// Map View Recenter Controller
const MapController: React.FC<{ selectedSpillId: string | null }> = ({ selectedSpillId }) => {
  const map = useMap();
  const detections = useWorkspaceStore((state) => state.detections);

  useEffect(() => {
    if (selectedSpillId) {
      const selected = detections.find((d) => d.id === selectedSpillId);
      if (selected) {
        map.flyTo([selected.location.lat, selected.location.lng], 11, {
          duration: 1.2
        });
      }
    }
  }, [selectedSpillId, detections, map]);

  return null;
};

export const MapView: React.FC = () => {
  const {
    detections,
    vessels,
    selectedSpillId,
    selectedVesselMmsi,
    layers,
    driftResults,
    setSelectedSpill,
    setSelectedVessel
  } = useWorkspaceStore();

  const activeDrift = selectedSpillId ? driftResults[selectedSpillId] : null;

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#F5F9FC]">
      <MapContainer
        center={[18.9450, 72.3200]}
        zoom={10}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <MapController selectedSpillId={selectedSpillId} />

        {/* Base Tile Layer - CartoDB Positron Light */}
        {layers.sarImagery ? (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; Sentinel-1 SAR'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* 1. SPILL POLYGONS LAYER */}
        {layers.spillPolygons &&
          detections.map((detection) => {
            const isSelected = detection.id === selectedSpillId;
            const strokeColor = isSelected ? '#FC3D21' : '#F59E0B';
            const fillColor = isSelected ? '#FC3D21' : '#F59E0B';

            return (
              <Polygon
                key={detection.id}
                positions={detection.polygon}
                pathOptions={{
                  color: strokeColor,
                  fillColor: fillColor,
                  fillOpacity: isSelected ? 0.45 : 0.25,
                  weight: isSelected ? 3 : 2,
                  dashArray: detection.confidence === 'LOW' ? '4, 4' : undefined
                }}
                eventHandlers={{
                  click: () => setSelectedSpill(detection.id)
                }}
              >
                <Tooltip sticky className="font-label text-xs">
                  <div className="space-y-1 p-0.5 text-[#06283D]">
                    <div className="font-bold flex items-center justify-between gap-3">
                      <span>{detection.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-700 font-bold">
                        {detection.confidence} CONF
                      </span>
                    </div>
                    <p className="text-[#06283D]/70 text-[11px] font-body">{detection.type}</p>
                    <div className="text-[10px]">
                      Area: <span className="font-bold text-[#087EA4]">{detection.areaKm2} km²</span>
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

        {/* 2. REVERSE DRIFT TRAJECTORY VECTOR LAYER */}
        {layers.driftTrajectory && activeDrift && (
          <Polyline
            positions={activeDrift.driftTrajectory.map((p: any) => [p.lat, p.lng])}
            pathOptions={{
              color: '#7C3AED',
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.95
            }}
          >
            <Tooltip sticky className="font-label text-xs">
              <div className="text-purple-700 font-bold">
                REVERSE HYDRO-DRIFT TRAJECTORY
              </div>
              <div className="text-[10px] text-[#06283D]/70 font-body">
                Model: HYCOM+WW3 Ocean Vectors (6 hr release window)
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 3. ESTIMATED ORIGIN REGION BBOX */}
        {layers.originRegion && activeDrift && (
          <Polygon
            positions={activeDrift.estimatedOriginRegion.polygon}
            pathOptions={{
              color: '#10B981',
              fillColor: '#10B981',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '4, 4'
            }}
          >
            <Tooltip sticky className="font-label text-xs">
              <div className="text-emerald-700 font-bold">
                ESTIMATED RELEASE ORIGIN ZONE (94% CONF)
              </div>
              <div className="text-[10px] text-[#06283D] font-mono">
                Window: {activeDrift.estimatedOriginRegion.estimatedReleaseTimeStart.substring(11, 16)}Z —{' '}
                {activeDrift.estimatedOriginRegion.estimatedReleaseTimeEnd.substring(11, 16)}Z
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* 4. AIS VESSEL HISTORICAL TRACKS */}
        {layers.vesselTracks &&
          Object.values(MOCK_VESSEL_TRACKS).map((track) => {
            const isSelected = track.vesselMmsi === selectedVesselMmsi;
            const points = track.points.map((p) => [p.lat, p.lng] as [number, number]);

            return (
              <React.Fragment key={track.vesselMmsi}>
                <Polyline
                  positions={points}
                  pathOptions={{
                    color: isSelected ? '#087EA4' : '#94A3B8',
                    weight: isSelected ? 3.5 : 2,
                    opacity: isSelected ? 1 : 0.65
                  }}
                  eventHandlers={{
                    click: () => setSelectedVessel(track.vesselMmsi)
                  }}
                />

                {/* Highlight AIS Gap if present */}
                {track.aisGapDetected && points.length >= 4 && (
                  <Polyline
                    positions={[points[2], points[3]]}
                    pathOptions={{
                      color: '#FC3D21',
                      weight: 4,
                      dashArray: '4, 4',
                      opacity: 0.95
                    }}
                  >
                    <Tooltip sticky className="font-label text-xs">
                      <div className="text-red-700 font-bold">
                        ⚠️ AIS TRANSCEIVER BLACKOUT GAP (90 MINS)
                      </div>
                      <div className="text-[10px] text-[#06283D]/70 font-body">
                        Correlated to spill release window
                      </div>
                    </Tooltip>
                  </Polyline>
                )}
              </React.Fragment>
            );
          })}

        {/* 5. VESSEL MARKERS LAYER */}
        {layers.vesselMarkers &&
          vessels.map((vessel) => {
            const isSelected = vessel.mmsi === selectedVesselMmsi;
            const track = MOCK_VESSEL_TRACKS[vessel.mmsi];
            const lastPoint = track ? track.points[track.points.length - 1] : null;

            if (!lastPoint) return null;

            return (
              <Marker
                key={vessel.mmsi}
                position={[lastPoint.lat, lastPoint.lng]}
                icon={createVesselIcon(isSelected, vessel.type === 'OIL_TANKER')}
                eventHandlers={{
                  click: () => setSelectedVessel(vessel.mmsi)
                }}
              >
                <Popup className="font-label text-xs">
                  <div className="space-y-1.5 p-1 text-[#06283D]">
                    <div className="font-headline font-bold text-[#06283D] flex items-center justify-between gap-2 border-b border-[#06283D]/10 pb-1">
                      <span>{vessel.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#087EA4]/15 text-[#087EA4] font-bold">
                        {vessel.flagCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#06283D]/70 font-body">
                      MMSI: <span className="text-[#06283D] font-mono font-bold">{vessel.mmsi}</span> | TYPE: <span className="text-[#06283D] font-medium">{vessel.type}</span>
                    </div>
                    <div className="text-[11px] text-[#06283D]/70 font-body">
                      SPEED: <span className="text-emerald-700 font-bold font-mono">{vessel.speedKnots} kn</span> | HEADING: <span className="text-[#06283D] font-mono">{vessel.headingDeg}°</span>
                    </div>
                    <button
                      onClick={() => setSelectedVessel(vessel.mmsi)}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg bg-[#06283D] hover:bg-[#087EA4] text-white text-[10px] font-label font-bold tracking-wider uppercase transition-colors cursor-pointer border border-[#18C7E8]/30 shadow-xs"
                    >
                      Inspect Vessel Track
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-[#06283D]/15 rounded-xl p-3.5 text-xs font-label shadow-xl z-10 space-y-2 pointer-events-auto max-w-xs text-[#06283D]">
        <div className="text-[10px] font-bold text-[#06283D]/70 uppercase tracking-wider border-b border-[#06283D]/10 pb-1.5 flex items-center justify-between">
          <span>MAP OVERLAY LEGEND</span>
          <span className="text-emerald-700 text-[9px] font-bold">LIVE VECTOR</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-body">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#FC3D21] opacity-80 border border-[#FC3D21]" />
            <span className="text-[#06283D] font-medium">Active Spill</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#F59E0B] opacity-80 border border-[#F59E0B]" />
            <span className="text-[#06283D]/70 font-medium">Look-alike</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#7C3AED] border-t border-dashed border-[#7C3AED]" />
            <span className="text-[#06283D] font-medium">Reverse Drift</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#10B981] opacity-50 border border-dashed border-[#10B981]" />
            <span className="text-emerald-700 font-bold">Origin Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#087EA4]" />
            <span className="text-[#06283D] font-medium">Vessel AIS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#FC3D21] border-t border-dashed border-[#FC3D21]" />
            <span className="text-red-600 font-bold">AIS Gap (90m)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
