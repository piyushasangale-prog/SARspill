import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, AlertTriangle } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { MOCK_VESSEL_TRACKS } from '../data/mockData';

export const VesselDetail: React.FC = () => {
  const { mmsi } = useParams<{ mmsi: string }>();
  const navigate = useNavigate();

  const { vessels, setSelectedVessel } = useWorkspaceStore();
  const vessel = vessels.find((v) => v.mmsi === mmsi);
  const track = mmsi ? MOCK_VESSEL_TRACKS[mmsi] : null;

  if (!vessel) {
    return (
      <div className="p-12 text-center font-mono space-y-4">
        <h2 className="text-xl font-bold text-white">VESSEL NOT FOUND IN REGISTRY ({mmsi})</h2>
        <button
          onClick={() => navigate('/vessels')}
          className="px-4 py-2 rounded bg-[#0B3D91] text-white text-xs font-bold"
        >
          RETURN TO VESSEL REGISTRY
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/vessels')}
        className="text-xs font-mono text-[#A9AEC1] hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#0B3D91]" />
        <span>BACK TO VESSEL REGISTRY</span>
      </button>

      {/* Header Banner */}
      <div className="bg-[#131314] p-5 rounded-lg border border-[rgba(169,174,193,0.18)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-3 font-mono">
              <span className="font-bold text-sm text-[#0B3D91]">MMSI: {vessel.mmsi}</span>
              <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 font-bold">
                {vessel.flagCode} — {vessel.flag}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  vessel.type === 'OIL_TANKER'
                    ? 'bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]'
                    : 'bg-cyan-500/20 text-cyan-300'
                }`}
              >
                {vessel.type}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight pt-1">
              {vessel.name}
            </h1>
          </div>

          <button
            onClick={() => {
              setSelectedVessel(vessel.mmsi);
              navigate(`/analyze?vesselMmsi=${vessel.mmsi}`);
            }}
            className="px-4 py-2 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(11,61,145,0.5)] transition-all"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>OPEN AIS TRACK ON MAP</span>
          </button>
        </div>

        {/* Specs Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs">
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">IMO NUMBER</span>
            <span className="text-white font-bold">{vessel.imo}</span>
          </div>
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">CALLSIGN</span>
            <span className="text-white font-bold">{vessel.callsign}</span>
          </div>
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">SPEED & HEADING</span>
            <span className="text-emerald-400 font-bold">{vessel.speedKnots} kn @ {vessel.headingDeg}°</span>
          </div>
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">DIMENSIONS</span>
            <span className="text-white">{vessel.lengthM}m × {vessel.beamM}m</span>
          </div>
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">DESTINATION</span>
            <span className="text-yellow-400 font-bold truncate block">{vessel.destination}</span>
          </div>
        </div>
      </div>

      {/* AIS Gap Alert */}
      {track?.aisGapDetected && (
        <div className="p-4 rounded-lg bg-[#FC3D21]/15 border border-[#FC3D21]/40 text-[#FC3D21] font-mono text-xs font-bold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <div>CRITICAL ATTRIBUTION ANOMALY: AIS TRANSCEIVER BLACKOUT DETECTED</div>
            <div className="text-[11px] font-normal text-white pt-0.5">
              Target vessel disabled AIS transmitter between {track.gapStartTimestamp} and {track.gapEndTimestamp} (90-minute window) directly inside the discharge origin ellipse.
            </div>
          </div>
        </div>
      )}

      {/* AIS Track Points History */}
      <div className="bg-[#131314] rounded-lg border border-[rgba(169,174,193,0.18)] p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">
            AIS TELEMETRY TRACK LOGS ({track?.points.length || 0} FIXES)
          </h3>
          <span className="text-[#A9AEC1]">SAMPLING INTERVAL: 15-45 MINS</span>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[#A9AEC1] text-[10px] uppercase">
              <th className="py-2 px-3">TIMESTAMP (UTC)</th>
              <th className="py-2 px-3">LATITUDE</th>
              <th className="py-2 px-3">LONGITUDE</th>
              <th className="py-2 px-3">SPEED (KNOTS)</th>
              <th className="py-2 px-3">HEADING</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-[11px]">
            {track?.points.map((pt, idx) => (
              <tr key={idx} className="hover:bg-[#1B1B1E]">
                <td className="py-2.5 px-3 text-white font-bold">{pt.timestamp.replace('T', ' ')}</td>
                <td className="py-2.5 px-3 text-[#A9AEC1]">{pt.lat}° N</td>
                <td className="py-2.5 px-3 text-[#A9AEC1]">{pt.lng}° E</td>
                <td className="py-2.5 px-3 text-emerald-400 font-bold">{pt.speedKnots} kn</td>
                <td className="py-2.5 px-3 text-white">{pt.headingDeg}°</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
