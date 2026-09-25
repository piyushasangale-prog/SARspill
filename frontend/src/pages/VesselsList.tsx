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
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto font-body bg-[#F5F9FC]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#06283D]/12 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#06283D] tracking-tight">
              COMMERCIAL AIS VESSEL REGISTRY
            </h1>
            <span className="px-2.5 py-1 rounded-lg text-xs font-label font-bold bg-[#06283D] text-[#18C7E8] border border-[#087EA4]/40 shadow-xs">
              {vessels.length} TARGETS TRACKED
            </span>
          </div>
          <p className="text-[#06283D]/70 text-xs font-body pt-1.5">
            Realtime Automatic Identification System (AIS) Telemetry & Track History Database
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#06283D]/50 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search MMSI, Name, Flag, Type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#06283D]/15 rounded-xl pl-10 pr-3.5 py-2 text-[#06283D] font-medium outline-none focus:border-[#087EA4] focus:ring-2 focus:ring-[#087EA4]/20 transition-all text-xs font-body"
          />
        </div>
      </div>

      {/* Vessels Table Card (rounded-2xl 16px with white card surface over #F5F9FC) */}
      <div className="bg-white rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#06283D]/10 text-[#06283D]/70 text-[10px] font-label font-bold uppercase">
                <th className="py-2.5 px-3">VESSEL NAME / MMSI</th>
                <th className="py-2.5 px-3">IMO / CALLSIGN</th>
                <th className="py-2.5 px-3">FLAG</th>
                <th className="py-2.5 px-3">VESSEL TYPE</th>
                <th className="py-2.5 px-3">SPEED & HEADING</th>
                <th className="py-2.5 px-3">DIMENSIONS</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#06283D]/5 font-body">
              {filteredVessels.map((vessel) => (
                <tr key={vessel.mmsi} className="hover:bg-[#F5F9FC] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-headline font-bold text-[#06283D] text-xs">{vessel.name}</div>
                    <div className="text-[11px] text-[#087EA4] font-mono">MMSI: {vessel.mmsi}</div>
                  </td>
                  <td className="py-3 px-3 text-[#06283D]/70">
                    <div className="text-[#06283D] font-medium text-[11px]">{vessel.imo}</div>
                    <div className="text-[10px] text-[#06283D]/60 font-mono">{vessel.callsign}</div>
                  </td>
                  <td className="py-3 px-3 text-[#06283D]">
                    <span className="px-1.5 py-0.5 rounded bg-[#087EA4]/15 text-[#087EA4] font-label font-bold text-[10px]">
                      {vessel.flagCode}
                    </span>{' '}
                    <span className="text-[11px] font-medium">{vessel.flag}</span>
                  </td>
                  <td className="py-3 px-3 text-[#06283D]">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-label font-bold ${
                        vessel.type === 'OIL_TANKER'
                          ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                          : 'bg-[#087EA4]/15 text-[#087EA4] border border-[#087EA4]/30'
                      }`}
                    >
                      {vessel.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-label font-bold text-[#06283D]">
                    {vessel.speedKnots} kn <span className="text-[#06283D]/60 font-normal">@ {vessel.headingDeg}°</span>
                  </td>
                  <td className="py-3 px-3 text-[#06283D]/70 text-[11px]">
                    {vessel.lengthM}m × {vessel.beamM}m (Draft {vessel.draftM}m)
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedVessel(vessel.mmsi);
                        navigate(`/vessels/${vessel.mmsi}`);
                      }}
                      className="py-1 px-3 rounded-lg bg-[#F5F9FC] hover:bg-[#06283D] text-[#06283D] hover:text-white text-[10px] font-label font-bold uppercase transition-all inline-flex items-center gap-1.5 border border-[#06283D]/15 hover:border-[#087EA4] cursor-pointer"
                    >
                      <span>DOSSIER</span>
                      <ExternalLink className="w-3 h-3 text-[#087EA4]" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVessel(vessel.mmsi);
                        navigate(`/analyze?vesselMmsi=${vessel.mmsi}`);
                      }}
                      className="py-1 px-3 rounded-lg bg-[#06283D] hover:bg-[#087EA4] text-white text-[10px] font-label font-bold uppercase transition-all inline-flex items-center gap-1.5 border border-[#18C7E8]/30 shadow-xs hover:shadow-[0_0_12px_rgba(24,199,232,0.3)] cursor-pointer"
                    >
                      <span>MAP TRACK</span>
                      <Compass className="w-3 h-3 text-[#18C7E8]" />
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
