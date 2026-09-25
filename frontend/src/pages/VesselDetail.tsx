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
      <div className="p-12 text-center font-body space-y-4">
        <h2 className="text-xl font-headline font-bold text-[#06283D]">VESSEL NOT FOUND IN REGISTRY ({mmsi})</h2>
        <button
          onClick={() => navigate('/vessels')}
          className="px-5 py-2.5 rounded-xl bg-[#06283D] text-white text-xs font-label font-bold hover:bg-[#087EA4] transition-all cursor-pointer"
        >
          RETURN TO VESSEL REGISTRY
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto font-body bg-[#F5F9FC]">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/vessels')}
        className="text-xs font-label font-bold text-[#06283D]/70 hover:text-[#087EA4] flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#087EA4]" />
        <span>BACK TO VESSEL REGISTRY</span>
      </button>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#06283D]/10 pb-4">
          <div>
            <div className="flex items-center gap-3 font-label">
              <span className="font-bold text-sm text-[#087EA4]">MMSI: {vessel.mmsi}</span>
              <span className="px-2.5 py-0.5 rounded-md text-xs bg-[#087EA4]/15 text-[#087EA4] font-bold">
                {vessel.flagCode} — {vessel.flag}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  vessel.type === 'OIL_TANKER'
                    ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                    : 'bg-[#087EA4]/15 text-[#087EA4] border border-[#087EA4]/30'
                }`}
              >
                {vessel.type}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#06283D] tracking-tight pt-1.5">
              {vessel.name}
            </h1>
          </div>

          <button
            onClick={() => {
              setSelectedVessel(vessel.mmsi);
              navigate(`/analyze?vesselMmsi=${vessel.mmsi}`);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#06283D] hover:bg-[#087EA4] text-white font-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-[#18C7E8]/40 shadow-sm hover:shadow-[0_0_16px_rgba(24,199,232,0.35)] transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#18C7E8]" />
            <span>OPEN AIS TRACK ON MAP</span>
          </button>
        </div>

        {/* Specs Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-label text-xs">
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">IMO NUMBER</span>
            <span className="text-[#06283D] font-bold">{vessel.imo}</span>
          </div>
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">CALLSIGN</span>
            <span className="text-[#06283D] font-bold">{vessel.callsign}</span>
          </div>
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">SPEED & HEADING</span>
            <span className="text-emerald-700 font-bold">{vessel.speedKnots} kn @ {vessel.headingDeg}°</span>
          </div>
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">DIMENSIONS</span>
            <span className="text-[#06283D] font-medium">{vessel.lengthM}m × {vessel.beamM}m</span>
          </div>
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">DESTINATION</span>
            <span className="text-[#087EA4] font-bold truncate block">{vessel.destination}</span>
          </div>
        </div>
      </div>

      {/* AIS Gap Alert */}
      {track?.aisGapDetected && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-800 font-label text-xs font-bold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
          <div>
            <div>CRITICAL ATTRIBUTION ANOMALY: AIS TRANSCEIVER BLACKOUT DETECTED</div>
            <div className="text-[11px] font-normal font-body text-[#06283D]/80 pt-0.5">
              Target vessel disabled AIS transmitter between {track.gapStartTimestamp} and {track.gapEndTimestamp} (90-minute window) directly inside the discharge origin ellipse.
            </div>
          </div>
        </div>
      )}

      {/* AIS Track Points History */}
      <div className="bg-white rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] p-5 space-y-3 font-body text-xs">
        <div className="flex items-center justify-between border-b border-[#06283D]/10 pb-2.5">
          <h3 className="font-headline font-bold text-[#06283D] text-xs uppercase tracking-wider">
            AIS TELEMETRY TRACK LOGS ({track?.points.length || 0} FIXES)
          </h3>
          <span className="text-[#06283D]/60 font-label text-[11px]">SAMPLING INTERVAL: 15-45 MINS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#06283D]/10 text-[#06283D]/70 font-label text-[10px] font-bold uppercase">
                <th className="py-2 px-3">TIMESTAMP (UTC)</th>
                <th className="py-2 px-3">LATITUDE</th>
                <th className="py-2 px-3">LONGITUDE</th>
                <th className="py-2 px-3">SPEED (KNOTS)</th>
                <th className="py-2 px-3">HEADING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#06283D]/5 text-[11px] font-mono">
              {track?.points.map((pt, idx) => (
                <tr key={idx} className="hover:bg-[#F5F9FC]">
                  <td className="py-2.5 px-3 text-[#06283D] font-bold">{pt.timestamp.replace('T', ' ')}</td>
                  <td className="py-2.5 px-3 text-[#06283D]/70">{pt.lat}° N</td>
                  <td className="py-2.5 px-3 text-[#06283D]/70">{pt.lng}° E</td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">{pt.speedKnots} kn</td>
                  <td className="py-2.5 px-3 text-[#06283D]">{pt.headingDeg}°</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
