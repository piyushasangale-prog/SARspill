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
  const isSidebarOpen = useWorkspaceStore((state) => state.isSidebarOpen);
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
    <aside
      className={`${
        isSidebarOpen ? 'w-60' : 'w-16'
      } bg-[#131314] border-r border-[rgba(169,174,193,0.18)] flex flex-col justify-between shrink-0 select-none z-20 transition-all duration-300 ease-in-out`}
    >
      {/* Primary Navigation */}
      <div className={`p-2 ${isSidebarOpen ? 'space-y-1' : 'space-y-2'}`}>
        {isSidebarOpen ? (
          <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-[#A9AEC1] uppercase">
            Mission Navigation
          </div>
        ) : (
          <div className="h-2" />
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={!isSidebarOpen ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center ${
                isSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'
              } py-2.5 rounded-lg transition-all group relative ${
                isActive
                  ? 'bg-[#0B3D91] text-white font-semibold shadow-[0_0_12px_rgba(11,61,145,0.4)] border border-blue-400/30'
                  : 'text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
                  <item.icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-[#A9AEC1] group-hover:text-white'
                    }`}
                  />
                  {isSidebarOpen && <span className="text-xs font-sans whitespace-nowrap">{item.label}</span>}
                </div>

                {item.badge &&
                  (isSidebarOpen ? (
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
                  ) : (
                    <span
                      className={`absolute top-1.5 right-2 w-2 h-2 rounded-full ${
                        item.badge === 'PRIMARY' ? 'bg-[#0B3D91]' : 'bg-[#FC3D21]'
                      } ring-2 ring-[#131314]`}
                    />
                  ))}
              </>
            )}
          </NavLink>
        ))}

        {isSidebarOpen ? (
          <>
            <div className="pt-4 px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-[#A9AEC1] uppercase">
              System Tools
            </div>

            <div className="px-3 py-2 rounded-lg text-xs text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white flex items-center gap-3 cursor-not-allowed opacity-60">
              <Database className="w-5 h-5 shrink-0" />
              <span>SAR Catalog</span>
            </div>

            <div className="px-3 py-2 rounded-lg text-xs text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white flex items-center gap-3 cursor-not-allowed opacity-60">
              <SlidersHorizontal className="w-5 h-5 shrink-0" />
              <span>Drift Settings</span>
            </div>
          </>
        ) : (
          <div className="pt-2 space-y-2 border-t border-white/5">
            <div
              title="SAR Catalog"
              className="py-2.5 rounded-lg text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white flex items-center justify-center cursor-not-allowed opacity-60"
            >
              <Database className="w-5 h-5 shrink-0" />
            </div>

            <div
              title="Drift Settings"
              className="py-2.5 rounded-lg text-[#A9AEC1] hover:bg-[#1B1B1E] hover:text-white flex items-center justify-center cursor-not-allowed opacity-60"
            >
              <SlidersHorizontal className="w-5 h-5 shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* Footer Operator Info */}
      <div className="p-3 border-t border-[rgba(169,174,193,0.15)] bg-[#0B0B0C]">
        {isSidebarOpen ? (
          <div className="p-2.5 rounded-lg bg-[#1B1B1E] border border-white/5 space-y-1.5">
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
        ) : (
          <div className="flex items-center justify-center py-1">
            <div
              title="System Status: Online (Arabian Sea Sector 04)"
              className="w-8 h-8 rounded-lg bg-[#1B1B1E] border border-white/10 flex items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
