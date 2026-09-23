import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LeftPanel } from '../components/analysis/LeftPanel';
import { MapView } from '../components/map/MapView';
import { RightPanel } from '../components/analysis/RightPanel';
import { useWorkspaceStore } from '../store/workspaceStore';

export const AnalyzeWorkspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const setSelectedSpill = useWorkspaceStore((state) => state.setSelectedSpill);

  useEffect(() => {
    const spillId = searchParams.get('spillId');
    if (spillId) {
      setSelectedSpill(spillId);
    }
  }, [searchParams, setSelectedSpill]);

  return (
    <div className="w-full h-full flex overflow-hidden relative select-none">
      {/* 1. Left SAR Control Dock (320px) */}
      <LeftPanel />

      {/* 2. Central Interactive Leaflet Map Workspace (Flex) */}
      <div className="flex-1 h-full relative overflow-hidden bg-[#0B0B0C]">
        <MapView />
      </div>

      {/* 3. Right Context-Sensitive Analytical Inspector Panel (384px) */}
      <RightPanel />
    </div>
  );
};
