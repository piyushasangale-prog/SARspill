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
      } bg-[#06283D] border-r border-[#087EA4]/25 flex flex-col justify-between shrink-0 select-none z-20 transition-all duration-300 ease-in-out font-label`}
    >
      {/* Primary Navigation */}
      <div className={`p-2.5 ${isSidebarOpen ? 'space-y-1.5' : 'space-y-2'}`}>
        {isSidebarOpen ? (
          <div className="px-3 py-2 text-[10px] font-label font-bold tracking-wider text-[#8FB8D6] uppercase">
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
                isSidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'
              } py-2.5 rounded-xl transition-all group relative font-label ${
                isActive
                  ? 'bg-[#087EA4] text-white font-semibold shadow-[0_0_16px_rgba(24,199,232,0.3)] border border-[#18C7E8]/50'
                  : 'text-[#C2D6E6] hover:bg-[#087EA4]/20 hover:text-white border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
                  <item.icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#18C7E8]' : 'text-[#8FB8D6] group-hover:text-[#18C7E8]'
                    }`}
                  />
                  {isSidebarOpen && <span className="text-xs font-label tracking-wide whitespace-nowrap">{item.label}</span>}
                </div>

                {item.badge &&
                  (isSidebarOpen ? (
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-label font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge === 'PRIMARY'
                          ? 'bg-[#18C7E8]/20 text-[#18C7E8] border border-[#18C7E8]/40'
                          : 'bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : (
                    <span
                      className={`absolute top-1.5 right-2 w-2 h-2 rounded-full ${
                        item.badge === 'PRIMARY' ? 'bg-[#18C7E8]' : 'bg-[#FC3D21]'
                      } ring-2 ring-[#06283D]`}
                    />
                  ))}
              </>
            )}
          </NavLink>
        ))}

        {isSidebarOpen ? (
          <>
            <div className="pt-4 px-3 py-2 text-[10px] font-label font-bold tracking-wider text-[#8FB8D6] uppercase">
              System Tools
            </div>

            <div className="px-3.5 py-2.5 rounded-xl text-xs text-[#8FB8D6] hover:bg-[#087EA4]/15 hover:text-white flex items-center gap-3 cursor-not-allowed opacity-75 transition-colors font-label">
              <Database className="w-5 h-5 shrink-0 text-[#087EA4]" />
              <span>SAR Catalog</span>
            </div>

            <div className="px-3.5 py-2.5 rounded-xl text-xs text-[#8FB8D6] hover:bg-[#087EA4]/15 hover:text-white flex items-center gap-3 cursor-not-allowed opacity-75 transition-colors font-label">
              <SlidersHorizontal className="w-5 h-5 shrink-0 text-[#087EA4]" />
              <span>Drift Settings</span>
            </div>
          </>
        ) : (
          <div className="pt-2 space-y-2 border-t border-[#087EA4]/20">
            <div
              title="SAR Catalog"
              className="py-2.5 rounded-xl text-[#8FB8D6] hover:bg-[#087EA4]/15 hover:text-white flex items-center justify-center cursor-not-allowed opacity-75"
            >
              <Database className="w-5 h-5 shrink-0" />
            </div>

            <div
              title="Drift Settings"
              className="py-2.5 rounded-xl text-[#8FB8D6] hover:bg-[#087EA4]/15 hover:text-white flex items-center justify-center cursor-not-allowed opacity-75"
            >
              <SlidersHorizontal className="w-5 h-5 shrink-0" />
            </div>
          </div>
        )}
      </div>

      {/* Footer Operator Info */}
      <div className="p-3 border-t border-[#087EA4]/25 bg-[#031825]">
        {isSidebarOpen ? (
          <div className="p-2.5 rounded-xl bg-[#06283D] border border-[#087EA4]/30 space-y-1.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-label font-bold text-[#8FB8D6]">SYSTEM STATUS</span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-label font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <p className="text-[11px] font-label font-semibold text-white truncate">Arabian Sea Sector 04</p>
            <div className="flex items-center justify-between text-[10px] text-[#A2C9E4] pt-1.5 border-t border-[#087EA4]/25 font-label">
              <span>MODELS: HYCOM+WW3</span>
              <HelpCircle className="w-3.5 h-3.5 text-[#18C7E8] hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-1">
            <div
              title="System Status: Online (Arabian Sea Sector 04)"
              className="w-9 h-9 rounded-xl bg-[#06283D] border border-[#087EA4]/40 flex items-center justify-center cursor-pointer hover:border-[#18C7E8] transition-colors shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
