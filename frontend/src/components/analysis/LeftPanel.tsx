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
    <div className="w-80 h-full bg-[#131314] border-r border-[rgba(169,174,193,0.18)] flex flex-col shrink-0 select-none z-10 font-mono text-xs">
      {/* Panel Header */}
      <div className="p-3 border-b border-[rgba(169,174,193,0.18)] bg-[#1B1B1E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Satellite className="w-4 h-4 text-[#0B3D91]" />
          <span className="font-display font-bold text-white text-xs tracking-wider uppercase">
            SAR CONTROL DOCK
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/40">
          READY
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[rgba(169,174,193,0.15)] bg-[#0B0B0C]">
        <button
          onClick={() => setActiveTab('SCENES')}
          className={`flex-1 py-2 text-[11px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'SCENES'
              ? 'border-[#0B3D91] text-white bg-[#1B1B1E]'
              : 'border-transparent text-[#A9AEC1] hover:text-white'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" />
          SCENES
        </button>
        <button
          onClick={() => setActiveTab('LAYERS')}
          className={`flex-1 py-2 text-[11px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'LAYERS'
              ? 'border-[#0B3D91] text-white bg-[#1B1B1E]'
              : 'border-transparent text-[#A9AEC1] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          LAYERS
        </button>
        <button
          onClick={() => setActiveTab('FILTER')}
          className={`flex-1 py-2 text-[11px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 border-b-2 ${
            activeTab === 'FILTER'
              ? 'border-[#0B3D91] text-white bg-[#1B1B1E]'
              : 'border-transparent text-[#A9AEC1] hover:text-white'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          FILTER
        </button>
      </div>

      {/* Main Dock Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TAB 1: SCENE SELECTION */}
        {activeTab === 'SCENES' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#A9AEC1]">
              <span>AVAILABLE SAR PASSES</span>
              <span>{scenes.length} SCENES</span>
            </div>

            <div className="space-y-2">
              {scenes.map((scene) => {
                const isSelected = scene.id === activeSceneId;
                return (
                  <div
                    key={scene.id}
                    onClick={() => setActiveScene(scene.id)}
                    className={`p-2.5 rounded border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0B3D91]/20 border-[#0B3D91] shadow-[0_0_12px_rgba(11,61,145,0.3)]'
                        : 'bg-[#1B1B1E] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-[11px] truncate max-w-[170px]">
                        {scene.satellite}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] px-1 bg-[#0B3D91] text-white rounded font-bold">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#A9AEC1]">{scene.orbitPass}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#A9AEC1] space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#0B3D91]" />
                        <span>{scene.acquisitionTime.replace('T', ' ').substring(0, 16)} UTC</span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span>RES: {scene.resolution}</span>
                        <span className="text-yellow-400 font-bold">
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
                className={`w-full py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isRunningDetection
                    ? 'bg-[#1B1B1E] text-[#A9AEC1] border border-white/10 cursor-wait'
                    : 'bg-[#0B3D91] hover:bg-[#164EAA] text-white shadow-[0_0_12px_rgba(11,61,145,0.5)]'
                }`}
              >
                {isRunningDetection ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-[#0B3D91]" />
                    <span>RUNNING SAR ML INFERENCE...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-white" />
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
            <div className="flex items-center justify-between text-[11px] text-[#A9AEC1]">
              <span>MAP OVERLAY TOGGLES</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAllLayers(true)}
                  className="text-[10px] text-[#0B3D91] hover:underline"
                >
                  SHOW ALL
                </button>
                <span>|</span>
                <button
                  onClick={() => setAllLayers(false)}
                  className="text-[10px] text-red-400 hover:underline"
                >
                  HIDE ALL
                </button>
              </div>
            </div>

            <div className="space-y-2 bg-[#1B1B1E] p-2.5 rounded border border-white/5">
              {[
                { key: 'sarImagery' as const, label: 'Synthetic Aperture Radar Tiles', color: 'text-blue-400' },
                { key: 'spillPolygons' as const, label: 'Spill Slick Polygons', color: 'text-red-400' },
                { key: 'driftTrajectory' as const, label: 'Reverse Drift Vectors', color: 'text-purple-400' },
                { key: 'originRegion' as const, label: 'Estimated Origin Zone', color: 'text-emerald-400' },
                { key: 'vesselTracks' as const, label: 'AIS Vessel Track History', color: 'text-cyan-400' },
                { key: 'vesselMarkers' as const, label: 'Realtime Vessel Position', color: 'text-yellow-400' }
              ].map((layerItem) => {
                const isEnabled = layers[layerItem.key];
                return (
                  <div
                    key={layerItem.key}
                    onClick={() => toggleLayer(layerItem.key)}
                    className="flex items-center justify-between p-2 rounded hover:bg-[#24242A] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-current ${layerItem.color}`} />
                      <span className="text-white text-[11px]">{layerItem.label}</span>
                    </div>
                    {isEnabled ? (
                      <Eye className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-[#A9AEC1]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SPATIAL / TEMPORAL FILTER */}
        {activeTab === 'FILTER' && (
          <div className="space-y-3 font-sans text-xs">
            <div className="text-[11px] font-mono text-[#A9AEC1]">SPATIAL BOUNDING BOX</div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-[#1B1B1E] p-2 rounded border border-white/5">
                <span className="text-[#A9AEC1] text-[10px] block">NORTH (LAT)</span>
                <input
                  type="text"
                  readOnly
                  value="19.4500° N"
                  className="bg-transparent text-white font-bold w-full outline-none"
                />
              </div>
              <div className="bg-[#1B1B1E] p-2 rounded border border-white/5">
                <span className="text-[#A9AEC1] text-[10px] block">SOUTH (LAT)</span>
                <input
                  type="text"
                  readOnly
                  value="18.5000° N"
                  className="bg-transparent text-white font-bold w-full outline-none"
                />
              </div>
              <div className="bg-[#1B1B1E] p-2 rounded border border-white/5">
                <span className="text-[#A9AEC1] text-[10px] block">EAST (LON)</span>
                <input
                  type="text"
                  readOnly
                  value="73.2000° E"
                  className="bg-transparent text-white font-bold w-full outline-none"
                />
              </div>
              <div className="bg-[#1B1B1E] p-2 rounded border border-white/5">
                <span className="text-[#A9AEC1] text-[10px] block">WEST (LON)</span>
                <input
                  type="text"
                  readOnly
                  value="71.5000° E"
                  className="bg-transparent text-white font-bold w-full outline-none"
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#A9AEC1] pt-2">ACQUISITION TIME RANGE</div>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="bg-[#1B1B1E] p-2 rounded border border-white/5">
                <span className="text-[#A9AEC1] text-[10px] block">START TIME (UTC)</span>
                <input
                  type="datetime-local"
                  defaultValue="2026-09-22T00:00"
                  className="bg-transparent text-white font-medium w-full outline-none"
                />
              </div>
              <div className="bg-[#1B1B1E] p-2 rounded border border-white/5">
                <span className="text-[#A9AEC1] text-[10px] block">END TIME (UTC)</span>
                <input
                  type="datetime-local"
                  defaultValue="2026-09-23T23:59"
                  className="bg-transparent text-white font-medium w-full outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Active Scene Footer Card */}
      {activeScene && (
        <div className="p-3 border-t border-[rgba(169,174,193,0.18)] bg-[#0B0B0C] font-mono text-[10px]">
          <div className="flex items-center justify-between text-[#A9AEC1] mb-1">
            <span>SELECTED SENSOR:</span>
            <span className="text-white font-bold">{activeScene.satellite}</span>
          </div>
          <div className="text-white truncate font-bold text-[11px] mb-1">
            {activeScene.id}
          </div>
          <div className="flex items-center justify-between text-[#A9AEC1]">
            <span>MODE: {activeScene.mode}</span>
            <span className="text-emerald-400 font-bold">100% COVERAGE</span>
          </div>
        </div>
      )}
    </div>
  );
};
