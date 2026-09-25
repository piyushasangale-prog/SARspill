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
    <div className="p-6 md:p-8 space-y-7 max-w-[1600px] mx-auto font-body bg-[#F5F9FC] fluid-scroll">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#06283D]/12 pb-6 fluid-animate">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#06283D] tracking-tight">
              INVESTIGATION CASE DOSSIERS
            </h1>
            <span className="px-2.5 py-1 rounded-lg text-xs font-label font-bold bg-[#06283D] text-[#18C7E8] border border-[#087EA4]/40 shadow-xs">
              {cases.length} TOTAL DOSSIERS
            </span>
          </div>
          <p className="text-[#06283D]/70 text-xs font-body pt-1.5">
            Centralized Evidence Repository linking SAR Detections, Hydrodynamic Reverse Drift Vectors, and AIS Vessel Attribution
          </p>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          className="px-5 py-2.5 rounded-xl bg-[#06283D] hover:bg-[#087EA4] text-white font-label font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-[#18C7E8]/40 shadow-sm hover:shadow-[0_0_16px_rgba(24,199,232,0.35)] transition-all cursor-pointer"
        >
          <FilePlus className="w-4 h-4 text-[#18C7E8]" />
          <span>NEW CASE FROM WORKSPACE</span>
        </button>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-label text-xs fluid-animate" style={{ animationDelay: '100ms' }}>
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-[#06283D]/12 shadow-xs w-full md:w-auto">
          {['ALL', 'INVESTIGATING', 'OPEN', 'RESOLVED', 'ARCHIVED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-[#06283D] text-[#18C7E8] shadow-sm border border-[#087EA4]/40'
                  : 'text-[#06283D]/70 hover:text-[#06283D] hover:bg-[#F5F9FC]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#06283D]/50 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search Case ID, Title, Region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#06283D]/15 rounded-xl pl-10 pr-3.5 py-2 text-[#06283D] font-medium outline-none focus:border-[#087EA4] focus:ring-2 focus:ring-[#087EA4]/20 transition-all text-xs"
          />
        </div>
      </div>

      {/* Cases Matrix Grid (Cards with rounded corners 12px-16px and light neutral / white card surface) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCases.map((c, idx) => (
          <div
            key={c.id}
            onClick={() => navigate(`/cases/${c.id}`)}
            className="bg-white p-5 rounded-2xl border border-[#06283D]/10 hover:border-[#087EA4] shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] hover:shadow-lg transition-all cursor-pointer space-y-3.5 group flex flex-col justify-between fluid-card fluid-animate"
            style={{ animationDelay: `${150 + idx * 40}ms` }}
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between font-label text-xs">
                <span className="font-bold text-[#06283D] group-hover:text-[#087EA4] transition-colors">
                  {c.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                    c.status === 'INVESTIGATING'
                      ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                      : c.status === 'OPEN'
                      ? 'bg-[#087EA4]/15 text-[#087EA4] border border-[#087EA4]/30'
                      : 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h3 className="font-headline font-bold text-[#06283D] text-sm line-clamp-1 group-hover:text-[#087EA4] transition-colors">
                {c.title}
              </h3>

              <div className="text-[11px] text-[#087EA4] font-label font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#087EA4]" />
                <span>REGION: {c.region}</span>
              </div>

              <p className="text-xs text-[#06283D]/70 font-body line-clamp-3 leading-relaxed">
                {c.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#06283D]/10 font-label text-[11px] flex items-center justify-between text-[#06283D]/60">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#087EA4]" />
                <span className="truncate max-w-[140px] font-medium">{c.assignedAnalyst}</span>
              </div>

              <div className="flex items-center gap-1 text-[#06283D] font-bold group-hover:text-[#087EA4] group-hover:translate-x-1 transition-all">
                <span>INSPECT DOSSIER</span>
                <ChevronRight className="w-4 h-4 text-[#087EA4]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
