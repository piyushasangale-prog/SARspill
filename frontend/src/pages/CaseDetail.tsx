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
      <div className="p-12 text-center font-body space-y-4">
        <h2 className="text-xl font-headline font-bold text-[#06283D]">CASE DOSSIER NOT FOUND ({id})</h2>
        <button
          onClick={() => navigate('/cases')}
          className="px-5 py-2.5 rounded-xl bg-[#06283D] text-white text-xs font-label font-bold hover:bg-[#087EA4] transition-all cursor-pointer"
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
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto font-body bg-[#F5F9FC]">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/cases')}
        className="text-xs font-label font-bold text-[#06283D]/70 hover:text-[#087EA4] flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#087EA4]" />
        <span>BACK TO CASES DIRECTORY</span>
      </button>

      {/* Case Dossier Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#06283D]/10 pb-4">
          <div>
            <div className="flex items-center gap-3 font-label">
              <span className="font-extrabold text-sm text-[#087EA4]">{currentCase.id}</span>
              <span
                className={`px-2.5 py-0.5 rounded-md font-bold text-xs ${
                  currentCase.status === 'INVESTIGATING'
                    ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                    : 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                }`}
              >
                {currentCase.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs bg-yellow-500/15 text-yellow-800 border border-yellow-500/30 font-bold">
                PRIORITY: {currentCase.priority}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#06283D] tracking-tight pt-1.5">
              {currentCase.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 font-label text-xs">
            <span className="text-[#06283D]/70 font-semibold">CHANGE STATUS:</span>
            <select
              value={currentCase.status}
              onChange={(e) => updateCaseStatus(currentCase.id, e.target.value as any)}
              className="bg-[#F5F9FC] border border-[#06283D]/15 rounded-xl px-3.5 py-2 text-[#06283D] font-bold outline-none focus:border-[#087EA4] cursor-pointer"
            >
              <option value="OPEN">OPEN</option>
              <option value="INVESTIGATING">INVESTIGATING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-xs md:text-sm text-[#06283D]/80 font-body leading-relaxed">
          {currentCase.summary}
        </p>

        {/* Metric Summary Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 font-label text-xs border-t border-[#06283D]/10">
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">LINKED SPILL DETECTION</span>
            <span className="text-[#06283D] font-bold">{currentCase.linkedSpillId}</span>
          </div>
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">ATTRIBUTED TARGET</span>
            <span className="text-[#FC3D21] font-bold">
              {linkedVessel?.name || 'MT OCEAN VOYAGER'} (94%)
            </span>
          </div>
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">ASSIGNED ANALYST</span>
            <span className="text-[#06283D] font-medium">{currentCase.assignedAnalyst}</span>
          </div>
          <div>
            <span className="text-[#06283D]/60 text-[10px] block font-semibold uppercase">LAST UPDATED</span>
            <span className="text-[#087EA4] font-mono">
              {currentCase.updatedAt.replace('T', ' ').substring(0, 16)} UTC
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#06283D]/12 font-label text-xs gap-1">
        {[
          { key: 'SPILLS' as const, label: `LINKED SPILLS (${linkedSpill ? 1 : 0})`, icon: ShieldAlert },
          { key: 'VESSELS' as const, label: `ATTRIBUTED VESSELS (${attributions.length})`, icon: Ship },
          { key: 'TIMELINE' as const, label: 'INCIDENT TIMELINE', icon: Clock },
          { key: 'NOTES' as const, label: `ANALYST NOTES (${notes.length})`, icon: MessageSquare }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 font-bold tracking-wide transition-all flex items-center gap-2 border-b-2 rounded-t-xl cursor-pointer ${
              activeTab === tab.key
                ? 'border-[#087EA4] text-[#06283D] bg-white shadow-xs'
                : 'border-transparent text-[#06283D]/60 hover:text-[#06283D]'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.key ? 'text-[#087EA4]' : 'text-[#06283D]/50'}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-2xl border border-[#06283D]/10 shadow-[0_4px_20px_-4px_rgba(6,40,61,0.06)]">
        {/* TAB 1: LINKED SPILLS */}
        {activeTab === 'SPILLS' && linkedSpill && (
          <div className="space-y-4 font-body text-xs">
            <div className="p-5 bg-[#F5F9FC] rounded-xl border border-[#06283D]/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-headline font-bold text-[#06283D] text-base">{linkedSpill.id}</span>
                <button
                  onClick={() => {
                    setSelectedSpill(linkedSpill.id);
                    navigate(`/analyze?spillId=${linkedSpill.id}`);
                  }}
                  className="py-1.5 px-3.5 rounded-xl bg-[#06283D] hover:bg-[#087EA4] text-white font-label font-bold text-xs flex items-center gap-2 border border-[#18C7E8]/30 shadow-xs cursor-pointer transition-all"
                >
                  <span>OPEN IN ANALYSIS MAP</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#18C7E8]" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2 border-t border-[#06283D]/10 font-label">
                <div>SURFACE AREA: <span className="text-[#087EA4] font-bold">{linkedSpill.areaKm2} km²</span></div>
                <div>ESTIMATED VOLUME: <span className="text-[#087EA4] font-bold">{linkedSpill.volumeM3} m³</span></div>
                <div>CONFIDENCE: <span className="text-emerald-700 font-bold">{linkedSpill.confidenceScore}%</span></div>
                <div>CLASSIFICATION: <span className="text-[#06283D] font-medium">{linkedSpill.type}</span></div>
              </div>

              <p className="text-[#06283D]/80 font-body text-xs pt-1 leading-relaxed">
                {linkedSpill.summary}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: ATTRIBUTED VESSELS */}
        {activeTab === 'VESSELS' && (
          <div className="space-y-3.5 font-body text-xs">
            {attributions.map((candidate) => (
              <div
                key={candidate.vesselMmsi}
                className="p-5 bg-[#F5F9FC] rounded-xl border border-[#06283D]/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-headline font-bold text-[#06283D] text-base">{candidate.vesselName}</span>
                    <span className="text-[#06283D]/70 text-xs block font-label pt-0.5">
                      MMSI: <span className="font-mono text-[#06283D]">{candidate.vesselMmsi}</span> | FLAG: {candidate.flag}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-headline font-bold text-emerald-700 block">
                      {candidate.attributionScore}% CONFIDENCE
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/15 text-red-700 font-label font-bold border border-red-500/30">
                      {candidate.riskLevel} RISK
                    </span>
                  </div>
                </div>

                {candidate.aisGapDetected && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-800 font-label font-bold flex items-center gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>90-MINUTE AIS TRANSCEIVER BLACKOUT GAP CORRELATED TO RELEASE EPOCH</span>
                  </div>
                )}

                <p className="text-[#06283D]/80 font-body text-xs leading-relaxed">
                  {candidate.evidenceNotes}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedVessel(candidate.vesselMmsi);
                      navigate(`/vessels/${candidate.vesselMmsi}`);
                    }}
                    className="py-1.5 px-3.5 rounded-xl bg-[#06283D] hover:bg-[#087EA4] text-white font-label font-bold flex items-center gap-2 text-xs border border-[#18C7E8]/30 shadow-xs cursor-pointer transition-all"
                  >
                    <span>INSPECT VESSEL DOSSIER</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#18C7E8]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: INCIDENT TIMELINE */}
        {activeTab === 'TIMELINE' && (
          <div className="space-y-4 font-body text-xs">
            <div className="relative border-l-2 border-[#087EA4] ml-4 pl-6 space-y-6">
              {[
                { title: 'SAR Satellite Acquisition', time: '2026-09-23T04:12:18Z', text: 'Sentinel-1A C-SAR pass over Arabian Sea.' },
                { title: 'Automated Oil Spill Detection', time: '2026-09-23T04:15:30Z', text: 'SARspill pipeline flagged 14.85 km² slick with 94% confidence rating.' },
                { title: 'Reverse Drift Simulation', time: '2026-09-23T04:20:00Z', text: 'Origin estimated at Lat 18.892°N, Lon 72.270°E (Release window: 01:00Z - 02:30Z).' },
                { title: 'Vessel Attribution & AIS Correlator', time: '2026-09-23T04:25:12Z', text: 'Attribution engine scored MT OCEAN VOYAGER at 94% confidence.' },
                { title: 'Case Dossier Opened', time: '2026-09-23T04:30:00Z', text: 'Urgent priority case initialized by Cmdr. A. Sharma.' }
              ].map((ev, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-[#087EA4] border-2 border-white ring-2 ring-[#087EA4]/30" />
                  <div className="font-headline font-bold text-[#06283D] text-xs">{ev.title}</div>
                  <div className="text-[10px] text-[#087EA4] font-mono">{ev.time.replace('T', ' ').substring(0, 19)} UTC</div>
                  <p className="text-[#06283D]/70 font-body text-xs pt-0.5 leading-relaxed">{ev.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ANALYST NOTES & FEED */}
        {activeTab === 'NOTES' && (
          <div className="space-y-5">
            {/* Add Note Form */}
            <form onSubmit={handleAddNoteSubmit} className="space-y-3 font-body text-xs">
              <span className="text-[#06283D] text-xs uppercase font-label font-bold block">
                ADD OPERATIONAL ANALYST NOTE
              </span>
              <textarea
                rows={3}
                required
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Enter investigation update, aerial report notes, fine calculation, or Coast Guard coordination updates..."
                className="w-full bg-[#F5F9FC] border border-[#06283D]/15 rounded-xl p-3 text-[#06283D] font-body text-xs outline-none focus:border-[#087EA4] focus:ring-2 focus:ring-[#087EA4]/20 transition-all"
              />
              <button
                type="submit"
                className="py-2 px-5 rounded-xl bg-[#06283D] hover:bg-[#087EA4] text-white font-label font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-[0_0_16px_rgba(24,199,232,0.35)] border border-[#18C7E8]/40 transition-all cursor-pointer"
              >
                POST ANALYST NOTE
              </button>
            </form>

            {/* Existing Notes Feed */}
            <div className="space-y-3 pt-3 border-t border-[#06283D]/10 font-body text-xs">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 bg-[#F5F9FC] rounded-xl border border-[#06283D]/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-label">
                    <span className="font-bold text-[#06283D]">{note.author} ({note.role})</span>
                    <span className="text-[#06283D]/60 font-mono text-[10px]">
                      {note.timestamp.replace('T', ' ').substring(0, 16)} UTC
                    </span>
                  </div>
                  <p className="text-[#06283D]/80 text-xs font-body leading-relaxed pt-1">
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
