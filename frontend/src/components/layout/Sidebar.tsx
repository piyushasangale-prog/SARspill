import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  Ship,
  Database,
  SlidersHorizontal,
  HelpCircle
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export const Sidebar: React.FC = () => {
  const cases = useWorkspaceStore((state) => state.cases);
  const openCasesCount = cases.filter((c) => c.status === 'OPEN' || c.status === 'INVESTIGATING').length;

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/analyze',
      label: 'Analyze Workspace',
      icon: Compass,
      badge: 'PRIMARY',
      highlight: true
    },
    {
      to: '/cases',
      label: 'Cases',
      icon: Briefcase,
      badge: openCasesCount > 0 ? `${openCasesCount}` : null
    },
    {
      to: '/vessels',
      label: 'Vessel Registry',
      icon: Ship,
      badge: null
    }
  ];

  return (
    <aside className="w-60 bg-[#131314] border-r border-[rgba(169,174,193,0.18)] flex flex-col justify-between shrink-0 select-none z-20">
      {/* Primary Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-[#A9AEC1] uppercase">
          Mission Navigation
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded transition-all group ${
                isActive
                  ? 'bg-[#0B3D91] text-white font-semibold shadow-[0_0_12px_rgba(11,61,145,0.4)] border border-blue-400/30'
                  : 'text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-[#A9AEC1] group-hover:text-white'
                    }`}
                  />
                  <span className="text-xs font-sans">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'PRIMARY'
                        ? 'bg-[#0B3D91]/40 text-[#8DADFF] border border-[#0B3D91]'
                        : 'bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-[#A9AEC1] uppercase">
          System Tools
        </div>

        <div className="px-3 py-2 rounded text-xs text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white flex items-center gap-3 cursor-not-allowed opacity-60">
          <Database className="w-4 h-4" />
          <span>SAR Catalog</span>
        </div>

        <div className="px-3 py-2 rounded text-xs text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white flex items-center gap-3 cursor-not-allowed opacity-60">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Drift Settings</span>
        </div>
      </div>

      {/* Footer Operator Info */}
      <div className="p-3 border-t border-[rgba(169,174,193,0.15)] bg-[#0B0B0C]">
        <div className="p-2.5 rounded bg-[#1B1B1E] border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#A9AEC1]">SYSTEM STATUS</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
          <p className="text-[11px] font-mono text-white truncate">Arabian Sea Sector 04</p>
          <div className="flex items-center justify-between text-[10px] text-[#A9AEC1] pt-1 border-t border-white/10 font-mono">
            <span>MODELS: HYCOM+WW3</span>
            <HelpCircle className="w-3 h-3 text-[#A9AEC1] hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </aside>
  );
};
