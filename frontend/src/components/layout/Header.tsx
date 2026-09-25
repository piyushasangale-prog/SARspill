import React from 'react';
import { Shield, Bell, Menu } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export const Header: React.FC = () => {
  const isSidebarOpen = useWorkspaceStore((state) => state.isSidebarOpen);
  const toggleSidebar = useWorkspaceStore((state) => state.toggleSidebar);

  return (
    <header className="h-16 bg-[#131314]/90 backdrop-blur-md border-b border-[rgba(169,174,193,0.12)] px-4 md:px-6 flex items-center justify-between z-30 select-none">
      {/* Brand Identity & Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          title={isSidebarOpen ? "Collapse navigation" : "Open navigation"}
          aria-label="Toggle Navigation"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#A9AEC1] hover:text-white hover:bg-white/10 active:scale-95 border border-transparent hover:border-white/10 transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#164EAA] to-[#0B3D91] flex items-center justify-center text-white shadow-[0_0_16px_rgba(11,61,145,0.45)] border border-blue-400/30 shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="font-display font-extrabold text-2xl tracking-tight text-white">
            SAR<span className="text-[#60A5FA]">spill</span>
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#0B3D91]/25 border border-[#0B3D91]/50 text-[#8DADFF]">
            v2.0
          </span>
        </div>
      </div>

      {/* Central Live Status Indicator */}
      <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#1B1B1E]/80 border border-white/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-mono text-xs tracking-wider text-[#A9AEC1] uppercase">
          Sentinel-1A <span className="text-white/60">•</span> Live Radar Stream
        </span>
      </div>

      {/* Right-Hand Controls (Icons only, no cluttered text) */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Alerts and Notifications"
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#A9AEC1] hover:text-white bg-[#1B1B1E]/60 hover:bg-[#1B1B1E] border border-white/10 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FC3D21] ring-2 ring-[#131314]" />
        </button>

        <div className="w-px h-5 bg-white/10" />

        <div
          title="Operator Profile"
          className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#1B1B1E] to-[#24242A] border border-white/15 text-white shadow-sm cursor-pointer hover:border-blue-400/50 transition-colors"
        >
          <span className="text-xs font-mono font-bold tracking-tight text-[#8DADFF]">CG</span>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#131314]" />
        </div>
      </div>
    </header>
  );
};

