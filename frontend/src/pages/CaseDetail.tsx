import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Ship,
  Clock,
  MessageSquare,
  ArrowLeft,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { useWorkspaceStore } from '../store/workspaceStore';

export const CaseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    cases,
    caseNotes,
    detections,
    vessels,
    attributionResults,
    addCaseNote,
    updateCaseStatus,
    setSelectedSpill,
    setSelectedVessel
  } = useWorkspaceStore();

  const currentCase = cases.find((c) => c.id === id);
  const notes = id ? caseNotes[id] || [] : [];
  
  const [activeTab, setActiveTab] = useState<'SPILLS' | 'VESSELS' | 'TIMELINE' | 'NOTES'>('SPILLS');
  const [newNoteText, setNewNoteText] = useState('');

  if (!currentCase) {
    return (
      <div className="p-12 text-center font-mono space-y-4">
        <h2 className="text-xl font-bold text-white">CASE DOSSIER NOT FOUND ({id})</h2>
        <button
          onClick={() => navigate('/cases')}
          className="px-4 py-2 rounded bg-[#0B3D91] text-white text-xs font-bold"
        >
          RETURN TO CASES DIRECTORY
        </button>
      </div>
    );
  }

  const linkedSpill = detections.find((d) => d.id === currentCase.linkedSpillId);
  const linkedVessel = currentCase.linkedVesselMmsi
    ? vessels.find((v) => v.mmsi === currentCase.linkedVesselMmsi)
    : null;

  const attributions = currentCase.linkedSpillId
    ? attributionResults[currentCase.linkedSpillId] || []
    : [];

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !id) return;
    addCaseNote(id, 'Commander A. Sharma', 'Lead Maritime Analyst', newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto font-sans">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/cases')}
        className="text-xs font-mono text-[#A9AEC1] hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-[#0B3D91]" />
        <span>BACK TO CASES DIRECTORY</span>
      </button>

      {/* Case Dossier Banner Header */}
      <div className="bg-[#131314] p-5 rounded-lg border border-[rgba(169,174,193,0.18)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-3 font-mono">
              <span className="font-extrabold text-sm text-[#0B3D91]">{currentCase.id}</span>
              <span
                className={`px-2.5 py-0.5 rounded font-bold text-xs ${
                  currentCase.status === 'INVESTIGATING'
                    ? 'bg-[#FC3D21]/20 text-[#FC3D21] border border-[#FC3D21]'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {currentCase.status}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-300 font-bold">
                PRIORITY: {currentCase.priority}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight pt-1">
              {currentCase.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-[#A9AEC1]">CHANGE STATUS:</span>
            <select
              value={currentCase.status}
              onChange={(e) => updateCaseStatus(currentCase.id, e.target.value as any)}
              className="bg-[#1B1B1E] border border-white/20 rounded px-3 py-1.5 text-white font-bold outline-none focus:border-[#0B3D91]"
            >
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-xs text-[#A9AEC1] font-sans leading-relaxed">
          {currentCase.summary}
        </p>

        {/* Metric Summary Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 font-mono text-xs border-t border-white/5">
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">LINKED SPILL DETECTION</span>
            <span className="text-white font-bold">{currentCase.linkedSpillId}</span>
          </div>
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">ATTRIBUTED TARGET</span>
            <span className="text-[#FC3D21] font-bold">
              {linkedVessel?.name || 'MT OCEAN VOYAGER'} (94%)
            </span>
          </div>
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">ASSIGNED ANALYST</span>
            <span className="text-white">{currentCase.assignedAnalyst}</span>
          </div>
          <div>
            <span className="text-[#A9AEC1] text-[10px] block">LAST UPDATED</span>
            <span className="text-[#8DADFF]">
              {currentCase.updatedAt.replace('T', ' ').substring(0, 16)} UTC
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(169,174,193,0.18)] font-mono text-xs">
        {[
          { key: 'SPILLS' as const, label: `LINKED SPILLS (${linkedSpill ? 1 : 0})`, icon: ShieldAlert },
          { key: 'VESSELS' as const, label: `ATTRIBUTED VESSELS (${attributions.length})`, icon: Ship },
          { key: 'TIMELINE' as const, label: 'INCIDENT TIMELINE', icon: Clock },
          { key: 'NOTES' as const, label: `ANALYST NOTES (${notes.length})`, icon: MessageSquare }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 font-bold tracking-wider transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === tab.key
                ? 'border-[#0B3D91] text-white bg-[#131314]'
                : 'border-transparent text-[#A9AEC1] hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4 text-[#0B3D91]" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[#131314] p-5 rounded-lg border border-[rgba(169,174,193,0.18)]">
        {/* TAB 1: LINKED SPILLS */}
        {activeTab === 'SPILLS' && linkedSpill && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 bg-[#1B1B1E] rounded border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{linkedSpill.id}</span>
                <button
                  onClick={() => {
                    setSelectedSpill(linkedSpill.id);
                    navigate(`/analyze?spillId=${linkedSpill.id}`);
                  }}
                  className="py-1 px-3 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white font-bold flex items-center gap-1.5"
                >
                  <span>OPEN IN ANALYSIS MAP</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px] pt-2 border-t border-white/5">
                <div>SURFACE AREA: <span className="text-yellow-400 font-bold">{linkedSpill.areaKm2} km²</span></div>
                <div>ESTIMATED VOLUME: <span className="text-yellow-400 font-bold">{linkedSpill.volumeM3} m³</span></div>
                <div>CONFIDENCE: <span className="text-emerald-400 font-bold">{linkedSpill.confidenceScore}%</span></div>
                <div>CLASSIFICATION: <span className="text-white">{linkedSpill.type}</span></div>
              </div>

              <p className="text-[#A9AEC1] font-sans text-xs pt-1">
                {linkedSpill.summary}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: ATTRIBUTED VESSELS */}
        {activeTab === 'VESSELS' && (
          <div className="space-y-3 font-mono text-xs">
            {attributions.map((candidate) => (
              <div
                key={candidate.vesselMmsi}
                className="p-4 bg-[#1B1B1E] rounded border border-white/5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">{candidate.vesselName}</span>
                    <span className="text-[#A9AEC1] text-xs block">
                      MMSI: {candidate.vesselMmsi} | FLAG: {candidate.flag}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-400 block">
                      {candidate.attributionScore}% CONFIDENCE
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold">
                      {candidate.riskLevel} RISK
                    </span>
                  </div>
                </div>

                {candidate.aisGapDetected && (
                  <div className="p-2 rounded bg-[#FC3D21]/15 border border-[#FC3D21]/40 text-[#FC3D21] font-bold flex items-center gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>90-MINUTE AIS TRANSCEIVER BLACKOUT GAP CORRELATED TO RELEASE EPOCH</span>
                  </div>
                )}

                <p className="text-[#A9AEC1] font-sans text-xs">
                  {candidate.evidenceNotes}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedVessel(candidate.vesselMmsi);
                      navigate(`/vessels/${candidate.vesselMmsi}`);
                    }}
                    className="py-1 px-3 rounded bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 text-xs"
                  >
                    <span>INSPECT VESSEL DOSSIER</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#0B3D91]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: INCIDENT TIMELINE */}
        {activeTab === 'TIMELINE' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="relative border-l-2 border-[#0B3D91] ml-4 pl-6 space-y-6">
              {[
                { title: 'SAR Satellite Acquisition', time: '2026-09-23T04:12:18Z', text: 'Sentinel-1A C-SAR pass over Arabian Sea.' },
                { title: 'Automated Oil Spill Detection', time: '2026-09-23T04:15:30Z', text: 'SARspill pipeline flagged 14.85 km² slick with 94% confidence rating.' },
                { title: 'Reverse Drift Simulation', time: '2026-09-23T04:20:00Z', text: 'Origin estimated at Lat 18.892°N, Lon 72.270°E (Release window: 01:00Z - 02:30Z).' },
                { title: 'Vessel Attribution & AIS Correlator', time: '2026-09-23T04:25:12Z', text: 'Attribution engine scored MT OCEAN VOYAGER at 94% confidence.' },
                { title: 'Case Dossier Opened', time: '2026-09-23T04:30:00Z', text: 'Urgent priority case initialized by Cmdr. A. Sharma.' }
              ].map((ev, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#0B3D91] border-2 border-[#0B0B0C]" />
                  <div className="font-bold text-white text-xs">{ev.title}</div>
                  <div className="text-[10px] text-[#0B3D91]">{ev.time.replace('T', ' ').substring(0, 19)} UTC</div>
                  <p className="text-[#A9AEC1] font-sans text-xs pt-0.5">{ev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYST NOTES & FEED */}
        {activeTab === 'NOTES' && (
          <div className="space-y-4">
            {/* Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} className="space-y-2 font-mono text-xs">
              <span className="text-[#A9AEC1] text-[10px] uppercase font-bold block">
                ADD OPERATIONAL ANALYST NOTE
              </span>
              <textarea
                rows={3}
                required
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Enter investigation update, aerial report notes, fine calculation, or Coast Guard coordination updates..."
                className="w-full bg-[#0B0B0C] border border-white/15 rounded p-2.5 text-white font-sans text-xs outline-none focus:border-[#0B3D91]"
              />
              <button
                type="submit"
                className="py-2 px-4 rounded bg-[#0B3D91] hover:bg-[#164EAA] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_10px_rgba(11,61,145,0.4)]"
              >
                POST ANALYST NOTE
              </button>
            </form>

            {/* Existing Notes Feed */}
            <div className="space-y-3 pt-3 border-t border-white/10 font-sans text-xs">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-[#1B1B1E] rounded border border-white/5 space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">{note.author} ({note.role})</span>
                    <span className="text-[#A9AEC1] text-[10px]">
                      {note.timestamp.replace('T', ' ').substring(0, 16)} UTC
                    </span>
                  </div>
                  <p className="text-white text-xs font-sans leading-relaxed pt-1">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
