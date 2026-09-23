import React, { useState, useEffect } from 'react';
import { Shield, Radio, Activity, Clock, Terminal, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#131314] border-b border-[rgba(169,174,193,0.18)] px-4 flex items-center justify-between text-xs font-mono z-30 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#0B3D91] flex items-center justify-center text-white shadow-[0_0_12px_rgba(11,61,145,0.6)] border border-blue-400/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm tracking-tight text-white">
              SARspill <span className="text-[#0B3D91] font-mono text-xs uppercase font-normal">v2.0</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FC3D21]/20 border border-[#FC3D21] text-[#FC3D21]">
              MISSION READINESS
            </span>
          </div>
          <span className="text-[11px] text-[#A9AEC1] font-sans">
            Maritime SAR Intelligence & Spill Attribution Operations
          </span>
        </div>
      </div>

      {/* Telemetry Readouts Ticker */}
      <div className="hidden lg:flex items-center gap-6 bg-[#0B0B0C] px-3 py-1.5 rounded border border-[rgba(169,174,193,0.12)]">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[#A9AEC1]">SAT-LINK:</span>
          <span className="text-white font-medium">SENTINEL-1A (NOMINAL)</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[#0B3D91]" />
          <span className="text-[#A9AEC1]">AIS STREAM:</span>
          <span className="text-[#8DADFF]">ARABIAN SEA (1,420 TARGETS)</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[#FC3D21]" />
          <span className="text-[#A9AEC1]">CRITICAL SPILLS:</span>
          <span className="text-[#FC3D21] font-bold">1 UNCONTAINED</span>
        </div>
      </div>

      {/* Operational Clock & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[#A9AEC1] bg-[#1B1B1E] px-2.5 py-1 rounded border border-white/10 font-mono">
          <Clock className="w-3.5 h-3.5 text-[#0B3D91]" />
          <span className="text-white font-semibold">{utcTime || '00:00:00 UTC'}</span>
        </div>
        
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#0B3D91]/20 border border-[#0B3D91] text-[#8DADFF]">
          <Terminal className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">OPERATOR: CG-WEST-01</span>
        </div>
      </div>
    </header>
  );
};
