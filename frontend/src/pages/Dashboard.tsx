import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  Briefcase,
  ChevronRight,
  Activity,
  Compass,
  ExternalLink
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(169,174,193,0.18)] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
              MARITIME SAR INTELLIGENCE DASHBOARD
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#0B3D91] text-white border border-blue-400/30">
              SECTOR 04: ARABIAN SEA
            </span>
          </div>
          <p className="text-[#A9AEC1] text-xs font-mono pt-1">
            Realtime Satellite Synthetic Aperture Radar Oil Spill Monitoring & AIS Vessel Attribution Platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(11,61,145,0.5)] transition-all"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
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

        <div className="bg-[#131314] p-4 rounded-lg border border-[rgba(169,174,193,0.18)] space-y-2 relative overflow-hidden group hover:border-cyan-500 transition-all">
          <div className="flex items-center justify-between text-[#A9AEC1] text-xs">
            <span>VESSELS FLAGGED / TRACKED</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {vessels.length} <span className="text-xs text-[#A9AEC1] font-normal">TARGETS</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            <span className="text-[#FC3D21] font-bold">1 AIS BLACKOUT</span>
            <span className="text-[#A9AEC1]">94% ATTRIBUTION</span>
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
