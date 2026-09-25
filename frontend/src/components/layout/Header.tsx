import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Menu, Search } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const isSidebarOpen = useWorkspaceStore((state) => state.isSidebarOpen);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cases?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-[#06283D] border-b border-[#087EA4]/30 px-4 md:px-6 flex items-center justify-between gap-4 z-30 select-none shadow-[0_4px_20px_rgba(6,40,61,0.25)]">
      {/* Brand Identity & Menu Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Collapse navigation" : "Open navigation"}
          aria-label="Toggle Navigation"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#C2D6E6] hover:text-[#18C7E8] bg-[#031825]/60 hover:bg-[#087EA4]/30 active:scale-95 border border-[#087EA4]/20 hover:border-[#18C7E8]/40 transition-all cursor-pointer font-label"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#087EA4] to-[#06283D] flex items-center justify-center text-white shadow-[0_0_16px_rgba(24,199,232,0.35)] border border-[#18C7E8]/40 shrink-0">
          <Shield className="w-5 h-5 text-[#18C7E8]" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <span className="font-headline font-bold text-xl tracking-tight text-white leading-tight">
              SAR<span className="text-[#18C7E8]">spill</span>
            </span>
            <span className="text-[9px] font-label font-medium tracking-wider text-[#A2C9E4] uppercase hidden sm:block">
              Marine Geospatial Intelligence
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-lg text-[11px] font-label font-semibold bg-[#087EA4]/25 border border-[#18C7E8]/40 text-[#18C7E8]">
            v2.0
          </span>
        </div>
      </div>

      {/* Central Search Bar */}
      <div className="flex-1 max-w-lg mx-2 sm:mx-6">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-[#18C7E8] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vessels, spill coordinates, case dossiers..."
            className="w-full bg-[#031825]/90 border border-[#087EA4]/35 hover:border-[#087EA4]/60 focus:border-[#18C7E8] focus:ring-2 focus:ring-[#18C7E8]/20 rounded-xl pl-10 pr-12 py-2 text-xs text-[#F5F9FC] placeholder-[#8FB8D6]/60 font-body outline-none transition-all shadow-inner"
          />
          <span className="hidden md:inline-block absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8FB8D6] bg-[#06283D] border border-[#087EA4]/30 pointer-events-none">
            ↵ Enter
          </span>
        </form>
      </div>

      {/* Right-Hand Controls (Operator Profile) */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          title="Operator Profile: Coast Guard Sector 04"
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#031825] to-[#087EA4]/40 border border-[#18C7E8]/40 text-white shadow-sm cursor-pointer hover:border-[#18C7E8] transition-colors"
        >
          <span className="text-xs font-label font-bold tracking-tight text-[#18C7E8]">CG</span>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#06283D]" />
        </div>
      </div>
    </header>
  );
};
