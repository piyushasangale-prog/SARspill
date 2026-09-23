import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FilePlus,
  ChevronRight,
  ShieldAlert,
  User
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

export const CasesList: React.FC = () => {
  const navigate = useNavigate();
  const cases = useWorkspaceStore((state) => state.cases);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesQuery =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(169,174,193,0.18)] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight">
              INVESTIGATION CASE DOSSIERS
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]">
              {cases.length} TOTAL DOSSIERS
            </span>
          </div>
          <p className="text-[#A9AEC1] text-xs font-mono pt-1">
            Centralized Evidence Repository linking SAR Detections, Hydrodynamic Reverse Drift Vectors, and AIS Vessel Attribution
          </p>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          className="px-4 py-2 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(11,61,145,0.5)] transition-all"
        >
          <FilePlus className="w-4 h-4 text-[#FC3D21]" />
          <span>NEW CASE FROM WORKSPACE</span>
        </button>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#131314] p-1 rounded-md border border-[rgba(169,174,193,0.18)] w-full md:w-auto">
          {['ALL', 'INVESTIGATING', 'OPEN', 'RESOLVED', 'ARCHIVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded font-bold transition-colors ${
                filterStatus === status
                  ? 'bg-[#0B3D91] text-white shadow-[0_0_10px_rgba(11,61,145,0.5)]'
                  : 'text-[#A9AEC1] hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#A9AEC1] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Case ID, Title, Region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131314] border border-[rgba(169,174,193,0.25)] rounded-md pl-9 pr-3 py-2 text-white font-medium outline-none focus:border-[#0B3D91]"
          />
        </div>
      </div>

      {/* Cases Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/cases/${c.id}`)}
            className="bg-[#131314] p-5 rounded-lg border border-[rgba(169,174,193,0.18)] hover:border-[#0B3D91] transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-white group-hover:text-blue-400 transition-colors">
                  {c.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    c.status === 'INVESTIGATING'
                      ? 'bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]'
                      : c.status === 'OPEN'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm font-display line-clamp-1">
                {c.title}
              </h3>

              <div className="text-[11px] text-yellow-400 font-mono font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-yellow-400" />
                <span>REGION: {c.region}</span>
              </div>

              <p className="text-xs text-[#A9AEC1] line-clamp-3 leading-relaxed">
                {c.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 font-mono text-[11px] flex items-center justify-between text-[#A9AEC1]">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#0B3D91]" />
                <span className="truncate max-w-[140px]">{c.assignedAnalyst}</span>
              </div>

              <div className="flex items-center gap-1 text-white font-bold group-hover:translate-x-1 transition-transform">
                <span>INSPECT DOSSIER</span>
                <ChevronRight className="w-4 h-4 text-[#0B3D91]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
