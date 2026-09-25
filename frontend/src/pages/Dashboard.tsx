import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Briefcase,
  ChevronRight,
  Activity,
  Compass,
  ExternalLink,
  Ship
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { detections, cases, vessels, setSelectedSpill } = useWorkspaceStore();

  const activeCases = cases.filter((c) => c.status === 'OPEN' || c.status === 'INVESTIGATING');
  const highConfDetections = detections.filter((d) => d.confidence === 'HIGH');
  const totalVolume = detections.reduce((sum, d) => sum + d.volumeM3, 0);

  const handleInspectSpillOnMap = (spillId: string) => {
    setSelectedSpill(spillId);
    navigate(`/analyze?spillId=${spillId}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Page Title & Hero Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[rgba(169,174,193,0.18)] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white font-display drop-shadow-sm flex flex-wrap items-center gap-2">
              <span className="bg-gradient-to-r from-white via-slate-100 to-sky-300 bg-clip-text text-transparent">
                MARITIME SAR INTELLIGENCE
              </span>
              <span className="text-[#8DADFF] font-semibold text-2xl md:text-3xl font-mono">
                // DASHBOARD
              </span>
            </h1>
          </div>

          {/* Sector 04 Arabian Sea badge and description positioned cleanly below the title */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#0B3D91]/25 text-[#8DADFF] border border-[#0B3D91]/60 shadow-[0_0_12px_rgba(11,61,145,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
              </span>
              SECTOR 04: ARABIAN SEA
            </span>
            <span className="hidden sm:inline-block text-white/20">•</span>
            <p className="text-[#A9AEC1] text-xs font-mono">
              Realtime Satellite Synthetic Aperture Radar Oil Spill Monitoring & AIS Vessel Attribution Platform
            </p>
          </div>
        </div>

        {/* Map & Ships Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate('/vessels')}
            className="px-5 py-3 rounded-xl bg-[#1B1B1E] hover:bg-[#24242A] border border-white/15 hover:border-cyan-400/50 text-white font-mono font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-sm hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="View all tracked vessels and AIS ship map"
          >
            <Ship className="w-5 h-5 text-cyan-400" />
            <span>SHIPS MAP</span>
          </button>

          <button
            onClick={() => navigate('/analyze')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0B3D91] to-[#164EAA] hover:from-[#164EAA] hover:to-[#1E5FD8] text-white font-mono font-bold text-xs md:text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_20px_rgba(11,61,145,0.6)] border border-blue-400/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Launch Interactive SAR Spill Analysis Map"
          >
            <Compass className="w-5 h-5 text-cyan-300 animate-[spin_12s_linear_infinite]" />
            <span>OPEN MAP WORKSPACE</span>
          </button>
        </div>
      </div>

      {/* 4 High-Density Telemetry KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#131314] p-4 rounded-lg border border-[rgba(169,174,193,0.18)] space-y-2 relative overflow-hidden group hover:border-[#0B3D91] transition-all">
          <div className="flex items-center justify-between text-[#A9AEC1] text-xs">
            <span>DETECTIONS (LAST 7 DAYS)</span>
            <ShieldAlert className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {detections.length} <span className="text-xs text-[#A9AEC1] font-normal">SLICKS</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-emerald-400 font-bold">{highConfDetections.length} HIGH CONFIDENCE</span>
            <span className="text-[#A9AEC1]">100% COVERED</span>
          </div>
        </div>

        <div className="bg-[#131314] p-4 rounded-lg border border-[rgba(169,174,193,0.18)] space-y-2 relative overflow-hidden group hover:border-[#FC3D21] transition-all">
          <div className="flex items-center justify-between text-[#A9AEC1] text-xs">
            <span>ACTIVE INVESTIGATION CASES</span>
            <Briefcase className="w-4 h-4 text-[#FC3D21]" />
          </div>
          <div className="text-3xl font-extrabold text-[#FC3D21]">
            {activeCases.length} <span className="text-xs text-[#A9AEC1] font-normal">OPEN</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-red-400 font-bold">1 URGENT DISPATCH</span>
            <span className="text-[#A9AEC1]">COAST GUARD ACTIVE</span>
          </div>
        </div>

        <div className="bg-[#131314] p-4 rounded-lg border border-[rgba(169,174,193,0.18)] space-y-2 relative overflow-hidden group hover:border-purple-500 transition-all">
          <div className="flex items-center justify-between text-[#A9AEC1] text-xs">
            <span>ESTIMATED OIL SPILL VOLUME</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-yellow-400">
            {totalVolume.toLocaleString()} <span className="text-xs text-[#A9AEC1] font-normal">m³</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-[#A9AEC1]">MAX SINGLE SLICK:</span>
            <span className="text-white font-bold">680 m³</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/vessels')}
          className="bg-[#131314] p-4 rounded-lg border border-[rgba(169,174,193,0.18)] space-y-2 relative overflow-hidden group hover:border-cyan-500 transition-all cursor-pointer"
          title="Click to view all vessels and ships map"
        >
          <div className="flex items-center justify-between text-[#A9AEC1] text-xs">
            <span>VESSELS FLAGGED / TRACKED</span>
            <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ship className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {vessels.length} <span className="text-xs text-[#A9AEC1] font-normal">TARGETS</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-[#FC3D21] font-bold">1 AIS BLACKOUT</span>
            <span className="text-cyan-400 group-hover:underline flex items-center gap-1 font-bold">
              VIEW SHIPS MAP →
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Detections Table + Active Cases Dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent SAR Detections Table */}
        <div className="lg:col-span-2 bg-[#131314] rounded-lg border border-[rgba(169,174,193,0.18)] p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#0B3D91]" />
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">
                RECENT SAR OIL SPILL DETECTIONS
              </h2>
            </div>
            <span className="text-xs text-[#A9AEC1]">SHOWING {detections.length} RECENT ACQUISITIONS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#A9AEC1] text-[10px] uppercase">
                  <th className="py-2 px-3">DETECTION ID</th>
                  <th className="py-2 px-3">ACQUISITION TIME</th>
                  <th className="py-2 px-3">LOCATION</th>
                  <th className="py-2 px-3">AREA (KM²)</th>
                  <th className="py-2 px-3">CONFIDENCE</th>
                  <th className="py-2 px-3">TYPE</th>
                  <th className="py-2 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {detections.map((detection) => (
                  <tr
                    key={detection.id}
                    className="hover:bg-[#1B1B1E] transition-colors group"
                  >
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FC3D21]" />
                      {detection.id}
                    </td>
                    <td className="py-3 px-3 text-[#A9AEC1] text-[11px]">
                      {detection.timestamp.replace('T', ' ').substring(0, 16)} UTC
                    </td>
                    <td className="py-3 px-3 text-[#A9AEC1]">
                      <div className="text-white text-[11px] truncate max-w-[160px]">
                        {detection.regionName}
                      </div>
                      <div className="text-[10px] text-[#A9AEC1]">
                        {detection.location.lat}°N, {detection.location.lng}°E
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-yellow-400">
                      {detection.areaKm2} km²
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          detection.confidence === 'HIGH'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                        }`}
                      >
                        {detection.confidenceScore}% ({detection.confidence})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white text-[11px]">
                      {detection.type}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleInspectSpillOnMap(detection.id)}
                        className="py-1 px-2.5 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white text-[10px] font-bold tracking-wider uppercase transition-colors inline-flex items-center gap-1"
                      >
                        <span>ANALYZE</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Active Investigation Cases Dossiers */}
        <div className="bg-[#131314] rounded-lg border border-[rgba(169,174,193,0.18)] p-4 space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#FC3D21]" />
              <h2 className="font-bold text-white text-sm uppercase tracking-wider">
                ACTIVE CASE DOSSIERS
              </h2>
            </div>
            <button
              onClick={() => navigate('/cases')}
              className="text-xs text-[#0B3D91] hover:underline"
            >
              VIEW ALL ({cases.length})
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {cases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="p-3 bg-[#1B1B1E] rounded border border-white/5 hover:border-[#0B3D91] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                    {c.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      c.status === 'INVESTIGATING'
                        ? 'bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs font-sans line-clamp-1">
                  {c.title}
                </h4>

                <p className="text-[11px] text-[#A9AEC1] font-sans line-clamp-2 leading-relaxed">
                  {c.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] font-mono text-[#A9AEC1]">
                  <span>ANALYST: {c.assignedAnalyst.split(' ')[1] || c.assignedAnalyst}</span>
                  <span className="flex items-center gap-1 text-white">
                    OPEN DOSSIER <ChevronRight className="w-3 h-3 text-[#0B3D91]" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
