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
  const color = isSelected ? '#FC3D21' : isTanker ? '#3B82F6' : '#A9AEC1';
  const size = isSelected ? 24 : 18;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="#0B0B0C" stroke-width="1.5">
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
    <div className="w-full h-full relative overflow-hidden">
      <MapContainer
        center={[18.9450, 72.3200]}
        zoom={10}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <MapController selectedSpillId={selectedSpillId} />

        {/* Base Tile Layer - CartoDB Dark Matter */}
        {layers.sarImagery ? (
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; Sentinel-1 SAR'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
                <Tooltip sticky className="font-mono text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center justify-between gap-3">
                      <span>{detection.id}</span>
                      <span className="text-[10px] px-1 rounded bg-red-500/30 text-red-300">
                        {detection.confidence} CONF
                      </span>
                    </div>
                    <p className="text-[#A9AEC1] text-[11px]">{detection.type}</p>
                    <div className="text-[10px] text-white">
                      Area: <span className="font-bold text-yellow-400">{detection.areaKm2} km²</span>
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}

        {/* 2. REVERSE DRIFT TRAJECTORY VECTOR LAYER */}
        {layers.driftTrajectory && activeDrift && (
          <Polyline
            positions={activeDrift.driftTrajectory.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: '#7C3AED', // Vector purple
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.9
            }}
          >
            <Tooltip sticky className="font-mono text-xs">
              <div className="text-purple-300 font-bold">
                Reverse Drift Trajectory Vector
              </div>
              <div className="text-[10px] text-white">
                Release Epoch: {activeDrift.estimatedOriginRegion.estimatedReleaseTimeStart}
              </div>
            </Tooltip>
          </Polyline>
        )}

        {/* 3. ESTIMATED ORIGIN REGION POLYGON LAYER */}
        {layers.originRegion && activeDrift && (
          <Polygon
            positions={activeDrift.estimatedOriginRegion.polygon}
            pathOptions={{
              color: '#10B981', // Emerald green origin
              fillColor: '#10B981',
              fillOpacity: 0.3,
              weight: 2,
              dashArray: '3, 3'
            }}
          >
            <Tooltip sticky className="font-mono text-xs">
              <div className="font-bold text-emerald-400">
                ESTIMATED ORIGIN REGION (HIGH CONFIDENCE)
              </div>
              <div className="text-[10px] text-white">
                Origin BBox Radius: {activeDrift.estimatedOriginRegion.radiusKm} km
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* 4. VESSEL TRACKS LAYER */}
        {layers.vesselTracks &&
          Object.values(MOCK_VESSEL_TRACKS).map((track) => {
            const isSelected = track.vesselMmsi === selectedVesselMmsi;
            const points = track.points.map((p) => [p.lat, p.lng] as [number, number]);

            return (
              <React.Fragment key={track.vesselMmsi}>
                <Polyline
                  positions={points}
                  pathOptions={{
                    color: isSelected ? '#06B6D4' : '#64748B',
                    weight: isSelected ? 3.5 : 1.5,
                    opacity: isSelected ? 1 : 0.6
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
                    <Tooltip sticky className="font-mono text-xs">
                      <div className="text-red-400 font-bold">
                        ⚠️ AIS TRANSCEIVER BLACKOUT GAP (90 MINS)
                      </div>
                      <div className="text-[10px] text-white">
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
                <Popup className="font-mono text-xs">
                  <div className="space-y-1.5 p-1">
                    <div className="font-bold text-white flex items-center justify-between gap-2 border-b border-white/10 pb-1">
                      <span>{vessel.name}</span>
                      <span className="text-[10px] px-1 bg-blue-500/30 text-blue-300 font-normal">
                        {vessel.flagCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A9AEC1]">
                      MMSI: <span className="text-white">{vessel.mmsi}</span> | TYPE: <span className="text-white">{vessel.type}</span>
                    </div>
                    <div className="text-[11px] text-[#A9AEC1]">
                      SPEED: <span className="text-white font-bold">{vessel.speedKnots} kn</span> | HEADING: <span className="text-white">{vessel.headingDeg}°</span>
                    </div>
                    <button
                      onClick={() => setSelectedVessel(vessel.mmsi)}
                      className="w-full mt-2 py-1 px-2 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white text-[10px] font-bold tracking-wider uppercase transition-colors"
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
      <div className="absolute bottom-4 left-4 bg-[#131314]/90 backdrop-blur-md border border-[rgba(169,174,193,0.18)] rounded-md p-3 text-xs font-mono shadow-2xl z-10 space-y-2 pointer-events-auto max-w-xs">
        <div className="text-[10px] font-bold text-[#A9AEC1] uppercase tracking-wider border-b border-white/10 pb-1 flex items-center justify-between">
          <span>MAP OVERLAY LEGEND</span>
          <span className="text-emerald-400 text-[9px]">LIVE VECTOR</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#FC3D21] opacity-70 border border-[#FC3D21]" />
            <span className="text-white">Active Spill</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#F59E0B] opacity-70 border border-[#F59E0B]" />
            <span className="text-[#A9AEC1]">Look-alike</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#7C3AED] border-t border-dashed border-[#7C3AED]" />
            <span className="text-white">Reverse Drift</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#10B981] opacity-40 border border-dashed border-[#10B981]" />
            <span className="text-emerald-400">Origin Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#06B6D4]" />
            <span className="text-white">Vessel AIS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-[#FC3D21] border-t border-dashed border-[#FC3D21]" />
            <span className="text-[#FC3D21]">AIS Gap (90m)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
