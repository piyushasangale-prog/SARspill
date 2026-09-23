import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass as DriftIcon,
  Ship,
  FilePlus,
  RotateCcw,
  AlertTriangle,
  Info,
  MapPin
} from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';

export const RightPanel: React.FC = () => {
  const navigate = useNavigate();

  const {
    selectedSpillId,
    selectedVesselMmsi,
    detections,
    driftResults,
    attributionResults,
    runReverseDrift,
    computeAttribution,
    isAnalyzingDrift,
    isComputingAttribution,
    createCase,
    setSelectedVessel
  } = useWorkspaceStore();

  const [activeTab, setActiveTab] = useState<'SPILL' | 'DRIFT' | 'ATTRIBUTION'>('SPILL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for Create Case
  const [caseTitle, setCaseTitle] = useState('');
  const [casePriority, setCasePriority] = useState<'URGENT' | 'HIGH' | 'MEDIUM'>('URGENT');
  const [caseAnalyst, setCaseAnalyst] = useState('Commander A. Sharma');
  const [caseSummary, setCaseSummary] = useState('');

  const selectedSpill = detections.find((d) => d.id === selectedSpillId);
  const activeDrift = selectedSpillId ? driftResults[selectedSpillId] : null;
  const activeAttributions = selectedSpillId ? attributionResults[selectedSpillId] || [] : [];

  if (!selectedSpill) {
    return (
      <div className="w-96 h-full bg-[#131314] border-l border-[rgba(169,174,193,0.18)] p-6 flex flex-col items-center justify-center text-center font-mono text-xs">
        <Info className="w-10 h-10 text-[#0B3D91] mb-3" />
        <h3 className="font-display font-bold text-white text-sm mb-1">NO SPILL DETECTED / SELECTED</h3>
        <p className="text-[#A9AEC1] text-[11px] leading-relaxed">
          Select a spill detection slick polygon on the Leaflet map workspace or pick a detection from the left SAR Control Dock to inspect telemetry metrics.
        </p>
      </div>
    );
  }

  const handleOpenCaseModal = () => {
    setCaseTitle(`Incident Case — ${selectedSpill.id} (${selectedSpill.regionName})`);
    setCaseSummary(
      `High-confidence ${selectedSpill.areaKm2} km² spill detected at Lat ${selectedSpill.location.lat}°N, Lon ${selectedSpill.location.lng}°E. Reverse drift traces release to estimated origin zone with top attributed vessel ${
        activeAttributions[0]?.vesselName || 'MT OCEAN VOYAGER'
      }.`
    );
    setShowCreateModal(true);
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCaseId = createCase({
      title: caseTitle,
      priority: casePriority,
      region: selectedSpill.regionName,
      assignedAnalyst: caseAnalyst,
      linkedSpillId: selectedSpill.id,
      linkedVesselMmsi: activeAttributions[0]?.vesselMmsi || selectedVesselMmsi || undefined,
      summary: caseSummary
    });
    setShowCreateModal(false);
    navigate(`/cases/${newCaseId}`);
  };

  return (
    <div className="w-96 h-full bg-[#131314] border-l border-[rgba(169,174,193,0.18)] flex flex-col shrink-0 select-none z-10 font-mono text-xs relative">
      {/* Header Inspector Bar */}
      <div className="p-3 border-b border-[rgba(169,174,193,0.18)] bg-[#1B1B1E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FC3D21] animate-ping" />
          <span className="font-display font-bold text-white text-xs tracking-wider uppercase">
            ANALYTICAL INSPECTOR
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[#FC3D21]/20 text-[#FC3D21] font-bold border border-[#FC3D21]">
          {selectedSpill.id}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[rgba(169,174,193,0.15)] bg-[#0B0B0C]">
        <button
          onClick={() => setActiveTab('SPILL')}
          className={`flex-1 py-2 text-[11px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1 border-b-2 ${
            activeTab === 'SPILL'
              ? 'border-[#0B3D91] text-white bg-[#1B1B1E]'
              : 'border-transparent text-[#A9AEC1] hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          SPILL
        </button>
        <button
          onClick={() => setActiveTab('DRIFT')}
          className={`flex-1 py-2 text-[11px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1 border-b-2 ${
            activeTab === 'DRIFT'
              ? 'border-[#0B3D91] text-white bg-[#1B1B1E]'
              : 'border-transparent text-[#A9AEC1] hover:text-white'
          }`}
        >
          <DriftIcon className="w-3.5 h-3.5" />
          DRIFT
        </button>
        <button
          onClick={() => setActiveTab('ATTRIBUTION')}
          className={`flex-1 py-2 text-[11px] font-bold tracking-wider transition-colors flex items-center justify-center gap-1 border-b-2 ${
            activeTab === 'ATTRIBUTION'
              ? 'border-[#0B3D91] text-white bg-[#1B1B1E]'
              : 'border-transparent text-[#A9AEC1] hover:text-white'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          ATTRIBUTION
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TAB 1: SPILL TELEMETRY METRICS */}
        {activeTab === 'SPILL' && (
          <div className="space-y-3">
            {/* Primary KPI Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1B1B1E] p-2.5 rounded border border-white/5 space-y-1">
                <span className="text-[#A9AEC1] text-[10px] block uppercase">SLICK SURFACE AREA</span>
                <div className="text-xl font-bold text-white font-mono flex items-baseline gap-1">
                  <span>{selectedSpill.areaKm2}</span>
                  <span className="text-xs text-[#A9AEC1] font-normal">km²</span>
                </div>
              </div>

              <div className="bg-[#1B1B1E] p-2.5 rounded border border-white/5 space-y-1">
                <span className="text-[#A9AEC1] text-[10px] block uppercase">ESTIMATED OIL VOLUME</span>
                <div className="text-xl font-bold text-yellow-400 font-mono flex items-baseline gap-1">
                  <span>{selectedSpill.volumeM3}</span>
                  <span className="text-xs text-[#A9AEC1] font-normal">m³</span>
                </div>
              </div>
            </div>

            {/* Confidence & Type */}
            <div className="bg-[#1B1B1E] p-3 rounded border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#A9AEC1]">CONFIDENCE SCORE:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {selectedSpill.confidenceScore}% ({selectedSpill.confidence})
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0B0B0C] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${selectedSpill.confidenceScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                <span className="text-[#A9AEC1]">CLASSIFICATION:</span>
                <span className="text-white font-bold">{selectedSpill.type}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#A9AEC1]">SLICK MAX WIDTH:</span>
                <span className="text-white">{selectedSpill.slickWidthKm} km</span>
              </div>
            </div>

            {/* Sensor Satellite Metadata */}
            <div className="bg-[#1B1B1E] p-3 rounded border border-white/5 space-y-1.5">
              <div className="text-[10px] text-[#0B3D91] font-bold uppercase tracking-wider">
                SAR SENSOR SPECIFICATIONS
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A9AEC1] pt-1">
                <div>SENSOR: <span className="text-white font-bold">{selectedSpill.sensor}</span></div>
                <div>PASS: <span className="text-white">{selectedSpill.passType}</span></div>
                <div>POLARIZATION: <span className="text-white font-mono">{selectedSpill.polarization}</span></div>
                <div>INCIDENCE: <span className="text-white">{selectedSpill.incidenceAngleDeg}°</span></div>
              </div>
            </div>

            {/* Summary Narrative */}
            <div className="bg-[#1B1B1E] p-3 rounded border border-white/5 space-y-1 font-sans">
              <span className="text-[10px] font-mono text-[#A9AEC1] uppercase">ANALYST NARRATIVE SUMMARY</span>
              <p className="text-white text-[11px] leading-relaxed font-light">
                {selectedSpill.summary}
              </p>
            </div>

            {/* Action Trigger */}
            <button
              onClick={async () => {
                await runReverseDrift(selectedSpill.id);
                setActiveTab('DRIFT');
              }}
              disabled={isAnalyzingDrift}
              className="w-full py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider bg-[#0B3D91] hover:bg-[#164EAA] text-white shadow-[0_0_12px_rgba(11,61,145,0.5)] flex items-center justify-center gap-2 transition-all"
            >
              {isAnalyzingDrift ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-[#0B3D91]" />
                  <span>SIMULATING REVERSE DRIFT...</span>
                </>
              ) : (
                <>
                  <DriftIcon className="w-4 h-4 text-purple-400" />
                  <span>RUN REVERSE DRIFT ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: REVERSE DRIFT SIMULATION */}
        {activeTab === 'DRIFT' && (
          <div className="space-y-3">
            {activeDrift ? (
              <>
                <div className="bg-[#1B1B1E] p-3 rounded border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between text-purple-300 font-bold border-b border-purple-500/20 pb-1">
                    <span>HYDRO-MODEL DRIFT VECTOR</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      COMPUTED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="bg-[#0B0B0C] p-2 rounded">
                      <span className="text-[#A9AEC1] text-[10px] block">SEA SURFACE CURRENT</span>
                      <span className="text-white font-bold">{activeDrift.seaCurrentSpeed} kn @ {activeDrift.seaCurrentHeading}°</span>
                    </div>
                    <div className="bg-[#0B0B0C] p-2 rounded">
                      <span className="text-[#A9AEC1] text-[10px] block">WIND SPEED FIELD</span>
                      <span className="text-white font-bold">{activeDrift.windSpeed} kn (SW)</span>
                    </div>
                  </div>
                </div>

                {/* Estimated Origin Ellipse */}
                <div className="bg-[#1B1B1E] p-3 rounded border border-emerald-500/30 space-y-2">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ESTIMATED ORIGIN REGION BBOX</span>
                  </div>
                  <div className="text-[11px] text-white">
                    CENTER: <span className="font-mono font-bold">{activeDrift.estimatedOriginRegion.center[0]}°N, {activeDrift.estimatedOriginRegion.center[1]}°E</span>
                  </div>
                  <div className="text-[11px] text-[#A9AEC1]">
                    RELEASE EPOCH WINDOW:{' '}
                    <span className="text-yellow-400 font-bold block">
                      {activeDrift.estimatedOriginRegion.estimatedReleaseTimeStart.substring(11, 16)}Z — {activeDrift.estimatedOriginRegion.estimatedReleaseTimeEnd.substring(11, 16)}Z
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A9AEC1]">
                    UNCERTAINTY RADIUS: <span className="text-white font-bold">{activeDrift.estimatedOriginRegion.radiusKm} km</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await computeAttribution(selectedSpill.id);
                    setActiveTab('ATTRIBUTION');
                  }}
                  disabled={isComputingAttribution}
                  className="w-full py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider bg-[#0B3D91] hover:bg-[#164EAA] text-white shadow-[0_0_12px_rgba(11,61,145,0.5)] flex items-center justify-center gap-2 transition-all"
                >
                  {isComputingAttribution ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-[#0B3D91]" />
                      <span>COMPUTING AIS ATTRIBUTION...</span>
                    </>
                  ) : (
                    <>
                      <Ship className="w-4 h-4 text-cyan-400" />
                      <span>COMPUTE VESSEL ATTRIBUTION</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="p-4 bg-[#1B1B1E] rounded text-center space-y-3">
                <DriftIcon className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                <p className="text-white text-xs font-bold">REVERSE DRIFT NOT COMPUTED</p>
                <p className="text-[#A9AEC1] text-[11px]">
                  Run the hydrodynamic drift model to estimate the discharge origin location and release timestamp window.
                </p>
                <button
                  onClick={async () => {
                    await runReverseDrift(selectedSpill.id);
                  }}
                  disabled={isAnalyzingDrift}
                  className="w-full py-2 px-3 rounded font-bold text-xs bg-[#0B3D91] hover:bg-[#164EAA] text-white"
                >
                  RUN SIMULATION NOW
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VESSEL ATTRIBUTION MATRIX */}
        {activeTab === 'ATTRIBUTION' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-[#A9AEC1]">
              <span>CORRELATED CANDIDATE VESSELS</span>
              <span>{activeAttributions.length} MATCHES</span>
            </div>

            {activeAttributions.map((candidate, idx) => {
              const isSelected = candidate.vesselMmsi === selectedVesselMmsi;
              return (
                <div
                  key={candidate.vesselMmsi}
                  onClick={() => setSelectedVessel(candidate.vesselMmsi)}
                  className={`p-3 rounded border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#0B3D91]/20 border-[#0B3D91] shadow-[0_0_12px_rgba(11,61,145,0.4)]'
                      : 'bg-[#1B1B1E] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0B0B0C] border border-white/20 flex items-center justify-center font-bold text-[10px] text-white">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-white text-xs">{candidate.vesselName}</div>
                        <div className="text-[10px] text-[#A9AEC1]">
                          MMSI: {candidate.vesselMmsi} | {candidate.flag}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        {candidate.attributionScore}%
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          candidate.riskLevel === 'CRITICAL'
                            ? 'bg-[#FC3D21] text-white'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {candidate.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* AIS Blackout warning indicator */}
                  {candidate.aisGapDetected && (
                    <div className="p-1.5 rounded bg-[#FC3D21]/10 border border-[#FC3D21]/40 flex items-center gap-2 text-[10px] text-[#FC3D21] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>AIS TRANSCEIVER BLACKOUT DETECTED IN RELEASE WINDOW</span>
                    </div>
                  )}

                  <p className="text-[11px] text-[#A9AEC1] font-sans leading-tight">
                    {candidate.evidenceNotes}
                  </p>
                </div>
              );
            })}

            {/* Initiate Case Action */}
            <div className="pt-2">
              <button
                onClick={handleOpenCaseModal}
                className="w-full py-2.5 px-3 rounded font-bold text-xs uppercase tracking-wider bg-[#FC3D21] hover:bg-red-600 text-white shadow-[0_0_12px_rgba(252,61,33,0.5)] flex items-center justify-center gap-2 transition-all"
              >
                <FilePlus className="w-4 h-4" />
                <span>INITIATE CASE DOSSIER</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE CASE MODAL OVERLAY */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131314] border border-[rgba(169,174,193,0.25)] rounded-lg w-full max-w-lg p-5 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-[#FC3D21]" />
                <h3 className="font-bold text-white text-sm tracking-wider uppercase">
                  CREATE INVESTIGATION CASE DOSSIER
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#A9AEC1] hover:text-white text-xs font-bold px-2 py-1 bg-white/5 rounded"
              >
                CLOSE [ESC]
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#A9AEC1] font-mono text-[10px] uppercase mb-1">
                  CASE TITLE / INCIDENT IDENTIFIER
                </label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-white/15 rounded p-2 text-white font-medium outline-none focus:border-[#0B3D91]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A9AEC1] font-mono text-[10px] uppercase mb-1">
                    PRIORITY LEVEL
                  </label>
                  <select
                    value={casePriority}
                    onChange={(e) => setCasePriority(e.target.value as any)}
                    className="w-full bg-[#0B0B0C] border border-white/15 rounded p-2 text-white font-mono outline-none focus:border-[#0B3D91]"
                  >
                    <option value="URGENT">URGENT (IMMEDIATE FLIGHT)</option>
                    <option value="HIGH">HIGH PRIORITY</option>
                    <option value="MEDIUM">MEDIUM PRIORITY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A9AEC1] font-mono text-[10px] uppercase mb-1">
                    ASSIGNED ANALYST
                  </label>
                  <input
                    type="text"
                    required
                    value={caseAnalyst}
                    onChange={(e) => setCaseAnalyst(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-white/15 rounded p-2 text-white font-medium outline-none focus:border-[#0B3D91]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A9AEC1] font-mono text-[10px] uppercase mb-1">
                  CASE DOSSIER EXECUTIVE SUMMARY & EVIDENCE
                </label>
                <textarea
                  rows={4}
                  required
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-white/15 rounded p-2 text-white font-normal outline-none focus:border-[#0B3D91] leading-relaxed"
                />
              </div>

              <div className="p-3 bg-[#1B1B1E] rounded border border-white/5 space-y-1 font-mono text-[11px]">
                <div className="text-emerald-400 font-bold">LINKED EVIDENCE PRE-POPULATION</div>
                <div className="text-[#A9AEC1]">SPILL DETECTION: <span className="text-white font-bold">{selectedSpill.id}</span></div>
                <div className="text-[#A9AEC1]">ATTRIBUTED VESSEL: <span className="text-[#FC3D21] font-bold">{activeAttributions[0]?.vesselName || 'MT OCEAN VOYAGER'} ({activeAttributions[0]?.attributionScore || 94}%)</span></div>
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white font-bold text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#FC3D21] hover:bg-red-600 text-white font-bold text-xs uppercase shadow-[0_0_12px_rgba(252,61,33,0.5)]"
                >
                  OPEN INVESTIGATION CASE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
