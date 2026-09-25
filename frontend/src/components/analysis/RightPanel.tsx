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
      <div className="w-96 h-full bg-[#F5F9FC] border-l border-[#06283D]/12 p-6 flex flex-col items-center justify-center text-center font-body text-xs">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[#06283D]/10 flex items-center justify-center mb-3 shadow-sm">
          <Info className="w-7 h-7 text-[#087EA4]" />
        </div>
        <h3 className="font-headline font-bold text-[#06283D] text-sm mb-1.5 uppercase">NO SPILL SELECTED</h3>
        <p className="text-[#06283D]/70 text-xs leading-relaxed max-w-[280px]">
          Select a spill detection polygon on the Leaflet map or choose a scene pass from the left SAR Control Dock to inspect telemetry metrics.
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
    <div className="w-96 h-full bg-[#F5F9FC] border-l border-[#06283D]/12 flex flex-col shrink-0 select-none z-10 font-label text-xs relative">
      {/* Header Inspector Bar */}
      <div className="p-3.5 border-b border-[#06283D]/10 bg-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#18C7E8] ring-2 ring-[#087EA4]/30 animate-pulse" />
          <span className="font-headline font-bold text-[#06283D] text-xs tracking-wider uppercase">
            ANALYTICAL INSPECTOR
          </span>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-[#06283D] text-[#18C7E8] font-bold border border-[#087EA4]/40 shadow-xs">
          {selectedSpill.id}
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#06283D]/10 bg-[#F5F9FC]">
        <button
          onClick={() => setActiveTab('SPILL')}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'SPILL'
              ? 'border-[#087EA4] text-[#06283D] bg-white shadow-xs'
              : 'border-transparent text-[#06283D]/60 hover:text-[#06283D]'
          }`}
        >
          <Info className={`w-3.5 h-3.5 ${activeTab === 'SPILL' ? 'text-[#087EA4]' : 'text-[#06283D]/50'}`} />
          SPILL
        </button>
        <button
          onClick={() => setActiveTab('DRIFT')}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'DRIFT'
              ? 'border-[#087EA4] text-[#06283D] bg-white shadow-xs'
              : 'border-transparent text-[#06283D]/60 hover:text-[#06283D]'
          }`}
        >
          <DriftIcon className={`w-3.5 h-3.5 ${activeTab === 'DRIFT' ? 'text-[#087EA4]' : 'text-[#06283D]/50'}`} />
          DRIFT
        </button>
        <button
          onClick={() => setActiveTab('ATTRIBUTION')}
          className={`flex-1 py-2.5 text-[11px] font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
            activeTab === 'ATTRIBUTION'
              ? 'border-[#087EA4] text-[#06283D] bg-white shadow-xs'
              : 'border-transparent text-[#06283D]/60 hover:text-[#06283D]'
          }`}
        >
          <Ship className={`w-3.5 h-3.5 ${activeTab === 'ATTRIBUTION' ? 'text-[#087EA4]' : 'text-[#06283D]/50'}`} />
          ATTRIBUTION
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* TAB 1: SPILL TELEMETRY METRICS */}
        {activeTab === 'SPILL' && (
          <div className="space-y-3 font-body">
            {/* Primary KPI Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white p-3 rounded-xl border border-[#06283D]/10 shadow-xs space-y-1">
                <span className="text-[#06283D]/60 text-[10px] font-label block uppercase font-semibold">SLICK SURFACE AREA</span>
                <div className="text-xl font-bold text-[#06283D] font-headline flex items-baseline gap-1">
                  <span>{selectedSpill.areaKm2}</span>
                  <span className="text-xs text-[#06283D]/60 font-normal">km²</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#06283D]/10 shadow-xs space-y-1">
                <span className="text-[#06283D]/60 text-[10px] font-label block uppercase font-semibold">ESTIMATED OIL VOLUME</span>
                <div className="text-xl font-bold text-[#087EA4] font-headline flex items-baseline gap-1">
                  <span>{selectedSpill.volumeM3}</span>
                  <span className="text-xs text-[#06283D]/60 font-normal">m³</span>
                </div>
              </div>
            </div>

            {/* Confidence & Type */}
            <div className="bg-white p-3.5 rounded-xl border border-[#06283D]/10 shadow-xs space-y-2">
              <div className="flex items-center justify-between font-label text-xs">
                <span className="text-[#06283D]/70 font-semibold">CONFIDENCE SCORE:</span>
                <span className="text-emerald-700 font-bold">
                  {selectedSpill.confidenceScore}% ({selectedSpill.confidence})
                </span>
              </div>
              <div className="w-full h-2 bg-[#F5F9FC] border border-[#06283D]/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#087EA4] rounded-full"
                  style={{ width: `${selectedSpill.confidenceScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-[#06283D]/10 text-xs font-label">
                <span className="text-[#06283D]/70 font-semibold">CLASSIFICATION:</span>
                <span className="text-[#06283D] font-bold">{selectedSpill.type}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-label">
                <span className="text-[#06283D]/70 font-semibold">SLICK MAX WIDTH:</span>
                <span className="text-[#06283D] font-bold">{selectedSpill.slickWidthKm} km</span>
              </div>
            </div>

            {/* Sensor Satellite Metadata */}
            <div className="bg-white p-3.5 rounded-xl border border-[#06283D]/10 shadow-xs space-y-2">
              <div className="text-[10px] text-[#087EA4] font-headline font-bold uppercase tracking-wider">
                SAR SENSOR SPECIFICATIONS
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#06283D]/80 pt-1 font-body">
                <div>SENSOR: <span className="text-[#06283D] font-bold">{selectedSpill.sensor}</span></div>
                <div>PASS: <span className="text-[#06283D] font-medium">{selectedSpill.passType}</span></div>
                <div>POLARIZATION: <span className="text-[#06283D] font-mono">{selectedSpill.polarization}</span></div>
                <div>INCIDENCE: <span className="text-[#06283D] font-medium">{selectedSpill.incidenceAngleDeg}°</span></div>
              </div>
            </div>

            {/* Summary Narrative */}
            <div className="bg-white p-3.5 rounded-xl border border-[#06283D]/10 shadow-xs space-y-1.5 font-body">
              <span className="text-[10px] font-label font-bold text-[#06283D]/70 uppercase">ANALYST NARRATIVE SUMMARY</span>
              <p className="text-[#06283D]/80 text-xs leading-relaxed">
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
              className="w-full py-2.5 px-3.5 rounded-xl font-label font-bold text-xs uppercase tracking-wider bg-[#06283D] hover:bg-[#087EA4] text-white shadow-sm hover:shadow-[0_0_16px_rgba(24,199,232,0.35)] border border-[#18C7E8]/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isAnalyzingDrift ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-[#18C7E8]" />
                  <span>SIMULATING REVERSE DRIFT...</span>
                </>
              ) : (
                <>
                  <DriftIcon className="w-4 h-4 text-[#18C7E8]" />
                  <span>RUN REVERSE DRIFT ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: REVERSE DRIFT SIMULATION */}
        {activeTab === 'DRIFT' && (
          <div className="space-y-3 font-body">
            {activeDrift ? (
              <>
                <div className="bg-white p-3.5 rounded-xl border border-[#087EA4]/30 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[#087EA4] font-headline font-bold border-b border-[#087EA4]/20 pb-1.5 text-xs">
                    <span>HYDRO-MODEL DRIFT VECTOR</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#087EA4]/15 text-[#087EA4] font-bold">
                      COMPUTED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-body">
                    <div className="bg-[#F5F9FC] p-2.5 rounded-lg border border-[#06283D]/5">
                      <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">SEA SURFACE CURRENT</span>
                      <span className="text-[#06283D] font-bold font-mono">{activeDrift.seaCurrentSpeed} kn @ {activeDrift.seaCurrentHeading}°</span>
                    </div>
                    <div className="bg-[#F5F9FC] p-2.5 rounded-lg border border-[#06283D]/5">
                      <span className="text-[#06283D]/60 text-[10px] font-label block font-semibold">WIND SPEED FIELD</span>
                      <span className="text-[#06283D] font-bold font-mono">{activeDrift.windSpeed} kn (SW)</span>
                    </div>
                  </div>
                </div>

                {/* Estimated Origin Ellipse */}
                <div className="bg-white p-3.5 rounded-xl border border-emerald-500/30 shadow-xs space-y-2 text-xs">
                  <div className="text-[10px] font-label font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ESTIMATED ORIGIN REGION BBOX</span>
                  </div>
                  <div className="text-[#06283D]">
                    CENTER: <span className="font-mono font-bold text-[#087EA4]">{activeDrift.estimatedOriginRegion.center[0]}°N, {activeDrift.estimatedOriginRegion.center[1]}°E</span>
                  </div>
                  <div className="text-[#06283D]/70 font-label">
                    RELEASE EPOCH WINDOW:{' '}
                    <span className="text-[#06283D] font-bold block pt-0.5 font-mono">
                      {activeDrift.estimatedOriginRegion.estimatedReleaseTimeStart.substring(11, 16)}Z — {activeDrift.estimatedOriginRegion.estimatedReleaseTimeEnd.substring(11, 16)}Z
                    </span>
                  </div>
                  <div className="text-[#06283D]/70 font-label">
                    UNCERTAINTY RADIUS: <span className="text-[#06283D] font-bold">{activeDrift.estimatedOriginRegion.radiusKm} km</span>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await computeAttribution(selectedSpill.id);
                    setActiveTab('ATTRIBUTION');
                  }}
                  disabled={isComputingAttribution}
                  className="w-full py-2.5 px-3.5 rounded-xl font-label font-bold text-xs uppercase tracking-wider bg-[#06283D] hover:bg-[#087EA4] text-white shadow-sm hover:shadow-[0_0_16px_rgba(24,199,232,0.35)] border border-[#18C7E8]/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isComputingAttribution ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin text-[#18C7E8]" />
                      <span>COMPUTING AIS ATTRIBUTION...</span>
                    </>
                  ) : (
                    <>
                      <Ship className="w-4 h-4 text-[#18C7E8]" />
                      <span>COMPUTE VESSEL ATTRIBUTION</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="p-5 bg-white rounded-xl border border-[#06283D]/10 text-center space-y-3 shadow-xs">
                <DriftIcon className="w-8 h-8 text-[#087EA4] mx-auto animate-pulse" />
                <p className="text-[#06283D] font-headline font-bold text-xs">REVERSE DRIFT NOT COMPUTED</p>
                <p className="text-[#06283D]/70 text-[11px] leading-relaxed font-body">
                  Run the hydrodynamic drift model to estimate the discharge origin location and release timestamp window.
                </p>
                <button
                  onClick={async () => {
                    await runReverseDrift(selectedSpill.id);
                  }}
                  disabled={isAnalyzingDrift}
                  className="w-full py-2 px-3.5 rounded-xl font-label font-bold text-xs bg-[#06283D] hover:bg-[#087EA4] text-white transition-all cursor-pointer shadow-sm"
                >
                  RUN SIMULATION NOW
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VESSEL ATTRIBUTION MATRIX */}
        {activeTab === 'ATTRIBUTION' && (
          <div className="space-y-3 font-body">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#06283D]/70 font-label">
              <span>CORRELATED CANDIDATE VESSELS</span>
              <span className="text-[#087EA4] font-bold">{activeAttributions.length} MATCHES</span>
            </div>

            {activeAttributions.map((candidate, idx) => {
              const isSelected = candidate.vesselMmsi === selectedVesselMmsi;
              return (
                <div
                  key={candidate.vesselMmsi}
                  onClick={() => setSelectedVessel(candidate.vesselMmsi)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-white border-[#087EA4] shadow-md ring-2 ring-[#087EA4]/20'
                      : 'bg-white border-[#06283D]/10 hover:border-[#087EA4]/50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#06283D] text-[#18C7E8] flex items-center justify-center font-label font-bold text-[10px]">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="font-headline font-bold text-[#06283D] text-xs">{candidate.vesselName}</div>
                        <div className="text-[10px] text-[#06283D]/60 font-mono">
                          MMSI: {candidate.vesselMmsi} | {candidate.flag}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-700 font-mono">
                        {candidate.attributionScore}%
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-label font-bold ${
                          candidate.riskLevel === 'CRITICAL'
                            ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                            : 'bg-yellow-500/15 text-yellow-800 border border-yellow-500/30'
                        }`}
                      >
                        {candidate.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* AIS Blackout warning indicator */}
                  {candidate.aisGapDetected && (
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-[10px] text-red-800 font-label font-bold">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                      <span>AIS TRANSCEIVER BLACKOUT DETECTED IN RELEASE WINDOW</span>
                    </div>
                  )}

                  <p className="text-[11px] text-[#06283D]/75 font-body leading-relaxed">
                    {candidate.evidenceNotes}
                  </p>
                </div>
              );
            })}

            {/* Initiate Case Action */}
            <div className="pt-2">
              <button
                onClick={handleOpenCaseModal}
                className="w-full py-2.5 px-3.5 rounded-xl font-label font-bold text-xs uppercase tracking-wider bg-[#06283D] hover:bg-[#087EA4] text-white shadow-sm hover:shadow-[0_0_16px_rgba(24,199,232,0.35)] border border-[#18C7E8]/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FilePlus className="w-4 h-4 text-[#18C7E8]" />
                <span>INITIATE CASE DOSSIER</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE CASE MODAL OVERLAY */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#06283D]/15 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl font-body text-[#06283D]">
            <div className="flex items-center justify-between border-b border-[#06283D]/10 pb-3 font-headline">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#06283D] flex items-center justify-center text-white">
                  <FilePlus className="w-4 h-4 text-[#18C7E8]" />
                </div>
                <h3 className="font-bold text-[#06283D] text-sm tracking-wider uppercase">
                  CREATE INVESTIGATION CASE DOSSIER
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#06283D]/60 hover:text-[#06283D] text-xs font-label font-bold px-2.5 py-1 bg-[#F5F9FC] rounded-lg border border-[#06283D]/10 cursor-pointer"
              >
                CLOSE [ESC]
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#06283D]/70 font-label text-[10px] uppercase font-bold mb-1">
                  CASE TITLE / INCIDENT IDENTIFIER
                </label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  className="w-full bg-[#F5F9FC] border border-[#06283D]/15 rounded-xl p-2.5 text-[#06283D] font-medium outline-none focus:border-[#087EA4] focus:ring-2 focus:ring-[#087EA4]/20 transition-all font-body"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-body">
                <div>
                  <label className="block text-[#06283D]/70 font-label text-[10px] uppercase font-bold mb-1">
                    PRIORITY LEVEL
                  </label>
                  <select
                    value={casePriority}
                    onChange={(e) => setCasePriority(e.target.value as any)}
                    className="w-full bg-[#F5F9FC] border border-[#06283D]/15 rounded-xl p-2.5 text-[#06283D] font-label font-semibold outline-none focus:border-[#087EA4] cursor-pointer"
                  >
                    <option value="URGENT">URGENT (IMMEDIATE FLIGHT)</option>
                    <option value="HIGH">HIGH PRIORITY</option>
                    <option value="MEDIUM">MEDIUM PRIORITY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#06283D]/70 font-label text-[10px] uppercase font-bold mb-1">
                    ASSIGNED ANALYST
                  </label>
                  <input
                    type="text"
                    required
                    value={caseAnalyst}
                    onChange={(e) => setCaseAnalyst(e.target.value)}
                    className="w-full bg-[#F5F9FC] border border-[#06283D]/15 rounded-xl p-2.5 text-[#06283D] font-medium outline-none focus:border-[#087EA4] focus:ring-2 focus:ring-[#087EA4]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#06283D]/70 font-label text-[10px] uppercase font-bold mb-1">
                  CASE DOSSIER EXECUTIVE SUMMARY & EVIDENCE
                </label>
                <textarea
                  rows={4}
                  required
                  value={caseSummary}
                  onChange={(e) => setCaseSummary(e.target.value)}
                  className="w-full bg-[#F5F9FC] border border-[#06283D]/15 rounded-xl p-2.5 text-[#06283D] font-normal outline-none focus:border-[#087EA4] focus:ring-2 focus:ring-[#087EA4]/20 leading-relaxed font-body transition-all"
                />
              </div>

              <div className="p-3 bg-[#F5F9FC] rounded-xl border border-[#06283D]/10 space-y-1 font-label text-[11px]">
                <div className="text-emerald-700 font-bold">LINKED EVIDENCE PRE-POPULATION</div>
                <div className="text-[#06283D]/70">SPILL DETECTION: <span className="text-[#06283D] font-bold">{selectedSpill.id}</span></div>
                <div className="text-[#06283D]/70">ATTRIBUTED VESSEL: <span className="text-[#087EA4] font-bold">{activeAttributions[0]?.vesselName || 'MT OCEAN VOYAGER'} ({activeAttributions[0]?.attributionScore || 94}%)</span></div>
              </div>

              <div className="flex justify-end gap-3 pt-2 font-label">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F5F9FC] hover:bg-[#E2E8F0] text-[#06283D] font-bold text-xs cursor-pointer border border-[#06283D]/10"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#06283D] hover:bg-[#087EA4] text-white font-bold text-xs uppercase shadow-sm border border-[#18C7E8]/40 cursor-pointer transition-all"
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
