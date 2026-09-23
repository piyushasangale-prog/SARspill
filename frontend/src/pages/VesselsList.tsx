import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, ExternalLink } from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

export const VesselsList: React.FC = () => {
  const navigate = useNavigate();
  const { vessels, setSelectedVessel } = useWorkspaceStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVessels = vessels.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mmsi.includes(searchQuery) ||
      v.flag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(169,174,193,0.18)] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
              COMMERCIAL AIS VESSEL REGISTRY
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#0B3D91] text-white border border-blue-400/30">
              {vessels.length} TARGETS TRACKED
            </span>
          </div>
          <p className="text-[#A9AEC1] text-xs font-mono pt-1">
            Realtime Automatic Identification System (AIS) Telemetry & Track History Database
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80 font-mono text-xs">
          <Search className="w-4 h-4 text-[#A9AEC1] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search MMSI, Name, Flag, Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131314] border border-[rgba(169,174,193,0.25)] rounded-md pl-9 pr-3 py-2 text-white font-medium outline-none focus:border-[#0B3D91]"
          />
        </div>
      </div>

      {/* Vessels Table */}
      <div className="bg-[#131314] rounded-lg border border-[rgba(169,174,193,0.18)] p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[#A9AEC1] text-[10px] uppercase">
                <th className="py-2 px-3">VESSEL NAME / MMSI</th>
                <th className="py-2 px-3">IMO / CALLSIGN</th>
                <th className="py-2 px-3">FLAG</th>
                <th className="py-2 px-3">VESSEL TYPE</th>
                <th className="py-2 px-3">SPEED & HEADING</th>
                <th className="py-2 px-3">DIMENSIONS</th>
                <th className="py-2 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVessels.map((vessel) => (
                <tr key={vessel.mmsi} className="hover:bg-[#1B1B1E] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white text-xs">{vessel.name}</div>
                    <div className="text-[10px] text-[#A9AEC1]">MMSI: {vessel.mmsi}</div>
                  </td>
                  <td className="py-3 px-3 text-[#A9AEC1]">
                    <div className="text-white text-[11px]">{vessel.imo}</div>
                    <div className="text-[10px] text-[#A9AEC1]">{vessel.callsign}</div>
                  </td>
                  <td className="py-3 px-3 text-white">
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                      {vessel.flagCode}
                    </span>{' '}
                    {vessel.flag}
                  </td>
                  <td className="py-3 px-3 text-white">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        vessel.type === 'OIL_TANKER'
                          ? 'bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {vessel.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-white">
                    {vessel.speedKnots} kn <span className="text-[#A9AEC1] font-normal">@ {vessel.headingDeg}°</span>
                  </td>
                  <td className="py-3 px-3 text-[#A9AEC1]">
                    {vessel.lengthM}m × {vessel.beamM}m (Draft {vessel.draftM}m)
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedVessel(vessel.mmsi);
                        navigate(`/vessels/${vessel.mmsi}`);
                      }}
                      className="py-1 px-2.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase transition-colors inline-flex items-center gap-1"
                    >
                      <span>DOSSIER</span>
                      <ExternalLink className="w-3 h-3 text-[#0B3D91]" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVessel(vessel.mmsi);
                        navigate(`/analyze?vesselMmsi=${vessel.mmsi}`);
                      }}
                      className="py-1 px-2.5 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white text-[10px] font-bold uppercase transition-colors inline-flex items-center gap-1"
                    >
                      <span>MAP TRACK</span>
                      <Compass className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
