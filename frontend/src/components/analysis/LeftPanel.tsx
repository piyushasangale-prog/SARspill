import React, { useState } from 'react';
import {
  Layers,
  Filter,
  Play,
  RotateCcw,
  Satellite,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export const LeftPanel: React.FC = () => {
  const {
    scenes,
    activeSceneId,
    setActiveScene,
    layers,
    toggleLayer,
    setAllLayers,
    runDetectionSimulation,
    isRunningDetection
  } = useWorkspaceStore();

  const [activeTab, setActiveTab] = useState<'SCENES' | 'LAYERS' | 'FILTER'>('SCENES');

  const activeScene = scenes.find((s) => s.id === activeSceneId);

  return (
    <div className="w-80 h-full bg-[#F5F9FC] border-r border-[#06283D]/12 flex flex-col shrink-0 select-none z-10 font-label text-xs">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[#06283D]/10 bg-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#06283D] flex items-center justify-center text-white">
            <Satellite className="w-4 h-4 text-[#18C7E8]" />
          </div>
          <span className="font-headline font-bold text-[#06283D] text-xs tracking-wider uppercase">
            SAR CONTROL DOCK
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 font-label font-bold border border-emerald-500/30">
          READY
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#06283D]/10 bg-[#F5F9FC]">
        <button
          onClick={() => setActiveTab('SCENES')}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'SCENES'
              ? 'border-[#087EA4] text-[#06283D] bg-white shadow-xs'
              : 'border-transparent text-[#06283D]/60 hover:text-[#06283D]'
          }`}
        >
          <Satellite className={`w-3.5 h-3.5 ${activeTab === 'SCENES' ? 'text-[#087EA4]' : 'text-[#06283D]/50'}`} />
          SCENES
        </button>
        <button
          onClick={() => setActiveTab('LAYERS')}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'LAYERS'
              ? 'border-[#087EA4] text-[#06283D] bg-white shadow-xs'
              : 'border-transparent text-[#06283D]/60 hover:text-[#06283D]'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 ${activeTab === 'LAYERS' ? 'text-[#087EA4]' : 'text-[#06283D]/50'}`} />
          LAYERS
        </button>
        <button
          onClick={() => setActiveTab('FILTER')}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'FILTER'
              ? 'border-[#087EA4] text-[#06283D] bg-white shadow-xs'
              : 'border-transparent text-[#06283D]/60 hover:text-[#06283D]'
          }`}
        >
          <Filter className={`w-3.5 h-3.5 ${activeTab === 'FILTER' ? 'text-[#087EA4]' : 'text-[#06283D]/50'}`} />
          FILTER
        </button>
      </div>

      {/* Main Dock Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* TAB 1: SCENE SELECTION */}
        {activeTab === 'SCENES' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#06283D]/70 font-label">
              <span>AVAILABLE SAR PASSES</span>
              <span className="text-[#087EA4] font-bold">{scenes.length} SCENES</span>
            </div>

            <div className="space-y-2">
              {scenes.map((scene) => {
                const isSelected = scene.id === activeSceneId;
                return (
                  <div
                    key={scene.id}
                    onClick={() => setActiveScene(scene.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#087EA4] shadow-md ring-2 ring-[#087EA4]/20'
                        : 'bg-white border-[#06283D]/10 hover:border-[#087EA4]/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-headline font-bold text-[#06283D] text-xs truncate max-w-[170px]">
                        {scene.satellite}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] px-2 py-0.5 bg-[#087EA4] text-white rounded-md font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#06283D]/60 font-medium">{scene.orbitPass}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#06283D]/70 space-y-1 font-body">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#06283D]/80">
                        <Calendar className="w-3.5 h-3.5 text-[#087EA4]" />
                        <span>{scene.acquisitionTime.replace('T', ' ').substring(0, 16)} UTC</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#06283D]/5 font-label text-[10px]">
                        <span>RES: {scene.resolution}</span>
                        <span className="text-[#087EA4] font-bold">
                          {scene.spillCount} DETECTIONS
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Run SAR Detection Simulation */}
            <div className="pt-2">
              <button
                onClick={runDetectionSimulation}
                disabled={isRunningDetection}
                className={`w-full py-2.5 px-3.5 rounded-xl font-label font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isRunningDetection
                    ? 'bg-[#E2E8F0] text-[#06283D]/50 border border-[#06283D]/10 cursor-wait'
                    : 'bg-[#06283D] hover:bg-[#087EA4] text-white shadow-sm hover:shadow-[0_0_16px_rgba(24,199,232,0.35)] border border-[#18C7E8]/40'
                }`}
              >
                {isRunningDetection ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-[#18C7E8]" />
                    <span>RUNNING SAR ML INFERENCE...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-[#18C7E8]" />
                    <span>RUN OIL SPILL DETECTION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LAYER CONTROLS */}
        {activeTab === 'LAYERS' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#06283D]/70 font-label">
              <span>MAP OVERLAY TOGGLES</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAllLayers(true)}
                  className="text-[10px] text-[#087EA4] hover:underline font-bold cursor-pointer"
                >
                  SHOW ALL
                </button>
                <span className="text-[#06283D]/30">|</span>
                <button
                  onClick={() => setAllLayers(false)}
                  className="text-[10px] text-red-600 hover:underline font-bold cursor-pointer"
                >
                  HIDE ALL
                </button>
              </div>
            </div>

            <div className="space-y-1.5 bg-white p-2 rounded-xl border border-[#06283D]/10 shadow-xs">
              {[
                { key: 'sarImagery' as const, label: 'Synthetic Aperture Radar Tiles', color: 'text-blue-600' },
                { key: 'spillPolygons' as const, label: 'Spill Slick Polygons', color: 'text-red-500' },
                { key: 'driftTrajectory' as const, label: 'Reverse Drift Vectors', color: 'text-purple-600' },
                { key: 'originRegion' as const, label: 'Estimated Origin Zone', color: 'text-emerald-600' },
                { key: 'vesselTracks' as const, label: 'AIS Vessel Track History', color: 'text-cyan-600' },
                { key: 'vesselMarkers' as const, label: 'Realtime Vessel Position', color: 'text-amber-500' }
              ].map((layerItem) => {
                const isEnabled = layers[layerItem.key];
                return (
                  <div
                    key={layerItem.key}
                    onClick={() => toggleLayer(layerItem.key)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F9FC] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-current ${layerItem.color}`} />
                      <span className="text-[#06283D] text-[11px] font-medium">{layerItem.label}</span>
                    </div>
                    {isEnabled ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-[#06283D]/40" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SPATIAL / TEMPORAL FILTER */}
        {activeTab === 'FILTER' && (
          <div className="space-y-3 font-body text-xs">
            <div className="text-[11px] font-label font-bold text-[#06283D]/70 uppercase">SPATIAL BOUNDING BOX</div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-white p-2.5 rounded-xl border border-[#06283D]/10 shadow-xs">
                <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">NORTH (LAT)</span>
                <input
                  type="text"
                  readOnly
                  value="19.4500° N"
                  className="bg-transparent text-[#06283D] font-bold w-full outline-none pt-0.5"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#06283D]/10 shadow-xs">
                <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">SOUTH (LAT)</span>
                <input
                  type="text"
                  readOnly
                  value="18.5000° N"
                  className="bg-transparent text-[#06283D] font-bold w-full outline-none pt-0.5"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#06283D]/10 shadow-xs">
                <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">EAST (LON)</span>
                <input
                  type="text"
                  readOnly
                  value="73.2000° E"
                  className="bg-transparent text-[#06283D] font-bold w-full outline-none pt-0.5"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#06283D]/10 shadow-xs">
                <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">WEST (LON)</span>
                <input
                  type="text"
                  readOnly
                  value="71.5000° E"
                  className="bg-transparent text-[#06283D] font-bold w-full outline-none pt-0.5"
                />
              </div>
            </div>

            <div className="text-[11px] font-label font-bold text-[#06283D]/70 uppercase pt-2">ACQUISITION TIME RANGE</div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-white p-2.5 rounded-xl border border-[#06283D]/10 shadow-xs">
                <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">START TIME (UTC)</span>
                <input
                  type="datetime-local"
                  defaultValue="2026-09-22T00:00"
                  className="bg-transparent text-[#06283D] font-medium w-full outline-none pt-0.5"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#06283D]/10 shadow-xs">
                <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">END TIME (UTC)</span>
                <input
                  type="datetime-local"
                  defaultValue="2026-09-23T23:59"
                  className="bg-transparent text-[#06283D] font-medium w-full outline-none pt-0.5"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Active Scene Footer Card */}
      {activeScene && (
        <div className="p-3.5 border-t border-[#06283D]/10 bg-white font-label text-[10px] shadow-xs">
          <div className="flex items-center justify-between text-[#06283D]/70 mb-1">
            <span>SELECTED SENSOR:</span>
            <span className="text-[#06283D] font-bold">{activeScene.satellite}</span>
          </div>
          <div className="text-[#087EA4] truncate font-bold text-[11px] mb-1 font-mono">
            {activeScene.id}
          </div>
          <div className="flex items-center justify-between text-[#06283D]/70">
            <span>MODE: {activeScene.mode}</span>
            <span className="text-emerald-700 font-bold">100% COVERAGE</span>
          </div>
        </div>
      )}
    </div>
  );
};
