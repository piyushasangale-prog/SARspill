import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Briefcase,
  ChevronRight,
  Activity,
  Ship,
  Compass
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
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-full xl:max-w-[1720px] mx-auto font-body bg-[#F5F9FC] fluid-scroll">
      {/* Page Title & Hero Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#06283D]/12 pb-5 fluid-animate">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold tracking-tight text-[#06283D] flex flex-wrap items-center gap-2.5">
              <span>MARINE GEOSPATIAL INTELLIGENCE</span>
              <span className="text-[#087EA4] font-headline font-semibold text-xl sm:text-2xl md:text-3xl">
                // DASHBOARD
              </span>
            </h1>
          </div>

          {/* Sector 04 Arabian Sea badge and description */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-label font-bold bg-[#06283D] text-[#18C7E8] border border-[#087EA4]/40 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18C7E8] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18C7E8]" />
              </span>
              SECTOR 04: ARABIAN SEA
            </span>
            <span className="hidden sm:inline-block text-[#06283D]/30">•</span>
            <p className="text-[#06283D]/70 text-xs font-body">
              Realtime Synthetic Aperture Radar Oil Spill Monitoring & AIS Vessel Attribution Platform
            </p>
          </div>
        </div>
      </div>

      {/* 4 High-Density Telemetry KPI Cards with Spotlight Focus & Fluid Entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 kpi-spotlight-grid">
        <div 
          className="bg-white p-4.5 rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] space-y-2 relative overflow-hidden group hover:border-[#087EA4] fluid-card fluid-animate kpi-spotlight-card cursor-pointer"
          style={{ animationDelay: '50ms' }}
        >
          <div className="flex items-center justify-between text-[#06283D]/70 text-xs font-label font-semibold">
            <span>DETECTIONS (LAST 7 DAYS)</span>
            <div className="w-7 h-7 rounded-lg bg-[#087EA4]/10 border border-[#087EA4]/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-[#087EA4]" />
            </div>
          </div>
          <div className="text-3xl font-headline font-bold text-[#06283D]">
            {detections.length} <span className="text-xs text-[#06283D]/60 font-body font-normal">SLICKS</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#06283D]/10 font-label">
            <span className="text-emerald-600 font-bold">{highConfDetections.length} HIGH CONFIDENCE</span>
            <span className="text-[#06283D]/60">100% COVERED</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/cases')}
          className="bg-white p-4.5 rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] space-y-2 relative overflow-hidden group hover:border-[#FC3D21] fluid-card fluid-animate kpi-spotlight-card cursor-pointer"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center justify-between text-[#06283D]/70 text-xs font-label font-semibold">
            <span>ACTIVE INVESTIGATION CASES</span>
            <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#FC3D21]" />
            </div>
          </div>
          <div className="text-3xl font-headline font-bold text-[#FC3D21]">
            {activeCases.length} <span className="text-xs text-[#06283D]/60 font-body font-normal">OPEN</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#06283D]/10 font-label">
            <span className="text-red-600 font-bold">1 URGENT DISPATCH</span>
            <span className="text-[#06283D]/60">COAST GUARD ACTIVE</span>
          </div>
        </div>

        <div 
          className="bg-white p-4.5 rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] space-y-2 relative overflow-hidden group hover:border-[#087EA4] fluid-card fluid-animate kpi-spotlight-card cursor-pointer"
          style={{ animationDelay: '150ms' }}
        >
          <div className="flex items-center justify-between text-[#06283D]/70 text-xs font-label font-semibold">
            <span>ESTIMATED OIL SPILL VOLUME</span>
            <div className="w-7 h-7 rounded-lg bg-[#087EA4]/10 border border-[#087EA4]/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#087EA4]" />
            </div>
          </div>
          <div className="text-3xl font-headline font-bold text-[#06283D]">
            {totalVolume.toLocaleString()} <span className="text-xs text-[#06283D]/60 font-body font-normal">m³</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#06283D]/10 font-label">
            <span className="text-[#06283D]/70">MAX SINGLE SLICK:</span>
            <span className="text-[#087EA4] font-bold">680 m³</span>
          </div>
        </div>

        <div 
          onClick={() => navigate('/vessels')}
          className="bg-white p-4.5 rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] space-y-2 relative overflow-hidden group hover:border-[#18C7E8] fluid-card fluid-animate kpi-spotlight-card cursor-pointer"
          style={{ animationDelay: '200ms' }}
          title="Click to view all vessels and ships map"
        >
          <div className="flex items-center justify-between text-[#06283D]/70 text-xs font-label font-semibold">
            <span>VESSELS FLAGGED / TRACKED</span>
            <div className="w-7 h-7 rounded-lg bg-[#087EA4]/15 border border-[#18C7E8]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Ship className="w-4 h-4 text-[#087EA4]" />
            </div>
          </div>
          <div className="text-3xl font-headline font-bold text-[#06283D]">
            {vessels.length} <span className="text-xs text-[#06283D]/60 font-body font-normal">TARGETS</span>
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#06283D]/10 font-label">
            <span className="text-[#FC3D21] font-bold">1 AIS BLACKOUT</span>
            <span className="text-[#087EA4] group-hover:text-[#18C7E8] flex items-center gap-1 font-bold transition-colors">
              VIEW SHIPS MAP →
            </span>
          </div>
        </div>
      </div>

      {/* Main Analysis Sections with Spotlight Hover Focus Effect */}
      <div className="section-spotlight-group space-y-6">
        {/* 1. Recent SAR Oil Spill Detections (Full-Width Flex Box) */}
        <div 
          className="section-spotlight-card w-full min-w-0 bg-white rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] p-5 space-y-4 fluid-animate"
          style={{ animationDelay: '250ms' }}
        >
        <div className="flex items-center justify-between border-b border-[#06283D]/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#06283D] flex items-center justify-center text-white shrink-0">
              <ShieldAlert className="w-4 h-4 text-[#18C7E8]" />
            </div>
            <h2 className="font-headline font-bold text-[#06283D] text-sm uppercase tracking-wider">
              RECENT SAR OIL SPILL DETECTIONS
            </h2>
          </div>
          <span className="text-xs font-label text-[#06283D]/60">SHOWING {detections.length} RECENT ACQUISITIONS</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#06283D]/10 text-[#06283D]/70 text-[10px] font-label font-bold uppercase">
                <th className="py-2.5 px-3">DETECTION ID</th>
                <th className="py-2.5 px-3">ACQUISITION TIME</th>
                <th className="py-2.5 px-3">LOCATION</th>
                <th className="py-2.5 px-3">AREA (KM²)</th>
                <th className="py-2.5 px-3 text-center">CONFIDENCE</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#06283D]/5">
              {detections.map((detection) => (
                <tr
                  key={detection.id}
                  className="hover:bg-[#F5F9FC] transition-colors group"
                >
                  <td className="py-3 px-3 font-label font-bold text-[#06283D]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FC3D21] shrink-0" />
                      <span>{detection.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#06283D]/70 text-[11px] font-mono">
                    {detection.timestamp.replace('T', ' ').substring(0, 16)} UTC
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-[#06283D] font-medium text-[11px] truncate max-w-[200px]">
                      {detection.regionName}
                    </div>
                    <div className="text-[10px] text-[#06283D]/60 font-mono">
                      {detection.location.lat}°N, {detection.location.lng}°E
                    </div>
                  </td>
                  <td className="py-3 px-3 font-label font-bold text-[#087EA4]">
                    {detection.areaKm2} km²
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-label font-bold ${
                        detection.confidence === 'HIGH'
                          ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                          : 'bg-yellow-500/15 text-yellow-800 border border-yellow-500/30'
                      }`}
                      style={{ borderRadius: '50%' }}
                    >
                      {detection.confidenceScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#06283D] text-[11px] font-medium">
                    {detection.type}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleInspectSpillOnMap(detection.id)}
                      className="group/btn py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-[#06283D] via-[#087EA4] to-[#087EA4] hover:from-[#087EA4] hover:to-[#06607e] text-white text-xs font-label font-bold tracking-wider uppercase transition-all duration-200 inline-flex items-center gap-1.5 border border-[#18C7E8]/50 hover:border-[#18C7E8] cursor-pointer shadow-[0_3px_12px_rgba(6,40,61,0.2)] hover:shadow-[0_0_18px_rgba(24,199,232,0.45)] hover:scale-[1.03] active:scale-[0.97]"
                      title={`Analyze spill ${detection.id} on interactive map`}
                    >
                      <Compass className="w-3.5 h-3.5 text-[#18C7E8] group-hover/btn:rotate-45 transition-transform duration-300" />
                      <span>ANALYZE</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Active Investigation Cases Dossiers (Full-Width Flex Box Positioned Below) */}
      <div 
        className="section-spotlight-card w-full min-w-0 bg-white rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] p-5 space-y-4 fluid-animate"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex items-center justify-between border-b border-[#06283D]/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center text-[#FC3D21] shrink-0">
              <Briefcase className="w-4 h-4 text-[#FC3D21]" />
            </div>
            <h2 className="font-headline font-bold text-[#06283D] text-sm uppercase tracking-wider">
              ACTIVE CASE DOSSIERS
            </h2>
          </div>
          <button
            onClick={() => navigate('/cases')}
            className="text-xs font-label font-bold text-[#087EA4] hover:text-[#06283D] transition-colors cursor-pointer"
          >
            VIEW ALL ({cases.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => navigate(`/cases/${c.id}`)}
              className="p-4 bg-[#F5F9FC] rounded-xl border border-[#06283D]/10 hover:border-[#087EA4] hover:bg-white transition-all cursor-pointer space-y-2.5 group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between font-label text-[11px]">
                  <span className="font-bold text-[#06283D] group-hover:text-[#087EA4] transition-colors">
                    {c.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      c.status === 'INVESTIGATING'
                        ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                        : 'bg-[#087EA4]/15 text-[#087EA4] border border-[#087EA4]/30'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>

                <h4 className="font-headline font-bold text-[#06283D] text-sm line-clamp-1">
                  {c.title}
                </h4>

                <p className="text-xs text-[#06283D]/70 font-body line-clamp-2 leading-relaxed">
                  {c.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#06283D]/10 text-[11px] font-label text-[#06283D]/60">
                <span>ANALYST: {c.assignedAnalyst.split(' ')[1] || c.assignedAnalyst}</span>
                <span className="flex items-center gap-1 text-[#06283D] font-bold group-hover:text-[#087EA4] transition-colors">
                  OPEN DOSSIER <ChevronRight className="w-3.5 h-3.5 text-[#087EA4]" />
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
