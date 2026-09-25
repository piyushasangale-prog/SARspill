import { create } from 'zustand';
import type {
  Detection,
  Vessel,
  DriftResult,
  AttributionCandidate,
  InvestigationCase,
  CaseNote,
  SarScene
} from '../types';
import {
  MOCK_DETECTIONS,
  MOCK_VESSELS,
  MOCK_SCENES,
  MOCK_DRIFT_RESULTS,
  MOCK_ATTRIBUTIONS,
  MOCK_CASES,
  MOCK_CASE_NOTES
} from '../data/mockData';

export interface MapLayers {
  sarImagery: boolean;
  spillPolygons: boolean;
  vesselTracks: boolean;
  driftTrajectory: boolean;
  originRegion: boolean;
  vesselMarkers: boolean;
}

interface WorkspaceState {
  // Selected Entities
  selectedSpillId: string | null;
  selectedVesselMmsi: string | null;
  activeSceneId: string;
  
  // Layer Toggles
  layers: MapLayers;
  
  // Data Collections
  detections: Detection[];
  vessels: Vessel[];
  scenes: SarScene[];
  cases: InvestigationCase[];
  caseNotes: Record<string, CaseNote[]>;
  driftResults: Record<string, DriftResult>;
  attributionResults: Record<string, AttributionCandidate[]>;
  
  // Async Loading States
  isRunningDetection: boolean;
  isAnalyzingDrift: boolean;
  isComputingAttribution: boolean;
  
  // Filter States
  timeRange: { start: string; end: string };
  regionBbox: [number, number, number, number] | null;

  // Sidebar / Dashboard Navigation State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Actions
  setSelectedSpill: (spillId: string | null) => void;
  setSelectedVessel: (mmsi: string | null) => void;
  setActiveScene: (sceneId: string) => void;
  toggleLayer: (layerKey: keyof MapLayers) => void;
  setAllLayers: (enabled: boolean) => void;
  
  runDetectionSimulation: () => Promise<void>;
  runReverseDrift: (spillId: string) => Promise<void>;
  computeAttribution: (spillId: string) => Promise<void>;
  
  createCase: (caseData: {
    title: string;
    priority: InvestigationCase['priority'];
    region: string;
    assignedAnalyst: string;
    linkedSpillId: string;
    linkedVesselMmsi?: string;
    summary: string;
  }) => string;
  
  addCaseNote: (caseId: string, author: string, role: string, content: string) => void;
  updateCaseStatus: (caseId: string, status: InvestigationCase['status']) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  selectedSpillId: 'DET-2026-0891',
  selectedVesselMmsi: '419001284',
  activeSceneId: 'S1A_IW_GRDH_1SDV_20260923T041218',
  
  layers: {
    sarImagery: true,
    spillPolygons: true,
    vesselTracks: true,
    driftTrajectory: true,
    originRegion: true,
    vesselMarkers: true
  },
  
  detections: MOCK_DETECTIONS,
  vessels: MOCK_VESSELS,
  scenes: MOCK_SCENES,
  cases: MOCK_CASES,
  caseNotes: MOCK_CASE_NOTES,
  driftResults: MOCK_DRIFT_RESULTS,
  attributionResults: MOCK_ATTRIBUTIONS,
  
  isRunningDetection: false,
  isAnalyzingDrift: false,
  isComputingAttribution: false,
  
  timeRange: {
    start: '2026-09-22T00:00:00Z',
    end: '2026-09-23T23:59:59Z'
  },
  regionBbox: [18.5, 71.5, 19.8, 73.2],

  setSelectedSpill: (spillId) => {
    set({ selectedSpillId: spillId });
    if (spillId && MOCK_ATTRIBUTIONS[spillId] && MOCK_ATTRIBUTIONS[spillId].length > 0) {
      set({ selectedVesselMmsi: MOCK_ATTRIBUTIONS[spillId][0].vesselMmsi });
    }
  },

  setSelectedVessel: (mmsi) => set({ selectedVesselMmsi: mmsi }),
  
  setActiveScene: (sceneId) => set({ activeSceneId: sceneId }),
  
  toggleLayer: (layerKey) => set((state) => ({
    layers: { ...state.layers, [layerKey]: !state.layers[layerKey] }
  })),

  setAllLayers: (enabled) => set({
    layers: {
      sarImagery: enabled,
      spillPolygons: enabled,
      vesselTracks: enabled,
      driftTrajectory: enabled,
      originRegion: enabled,
      vesselMarkers: enabled
    }
  }),

  runDetectionSimulation: async () => {
    set({ isRunningDetection: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    set({ isRunningDetection: false });
  },

  runReverseDrift: async (_spillId) => {
    set({ isAnalyzingDrift: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set((state) => ({
      isAnalyzingDrift: false,
      layers: { ...state.layers, driftTrajectory: true, originRegion: true }
    }));
  },

  computeAttribution: async (_spillId) => {
    set({ isComputingAttribution: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set((state) => ({
      isComputingAttribution: false,
      layers: { ...state.layers, vesselTracks: true, vesselMarkers: true }
    }));
  },

  createCase: (caseData) => {
    const newId = `CASE-IND-2026-0${get().cases.length + 43}`;
    const now = new Date().toISOString();
    const newCase: InvestigationCase = {
      id: newId,
      title: caseData.title,
      status: 'INVESTIGATING',
      priority: caseData.priority,
      region: caseData.region,
      createdAt: now,
      updatedAt: now,
      assignedAnalyst: caseData.assignedAnalyst || 'Commander A. Sharma',
      linkedSpillId: caseData.linkedSpillId,
      linkedVesselMmsi: caseData.linkedVesselMmsi,
      summary: caseData.summary,
      notesCount: 1,
      evidenceCount: 3
    };

    const initialNote: CaseNote = {
      id: `NOTE-${Date.now()}`,
      caseId: newId,
      author: caseData.assignedAnalyst || 'Commander A. Sharma',
      role: 'Lead Maritime Analyst',
      timestamp: now,
      content: `Case initialized from SAR Detection ${caseData.linkedSpillId}. Initial findings attached with high spatial attribution score.`
    };

    set((state) => ({
      cases: [newCase, ...state.cases],
      caseNotes: {
        ...state.caseNotes,
        [newId]: [initialNote]
      },
      selectedCaseId: newId
    }));

    return newId;
  },

  addCaseNote: (caseId, author, role, content) => {
    const newNote: CaseNote = {
      id: `NOTE-${Date.now()}`,
      caseId,
      author,
      role,
      timestamp: new Date().toISOString(),
      content
    };

    set((state) => {
      const existingNotes = state.caseNotes[caseId] || [];
      const updatedCases = state.cases.map((c) =>
        c.id === caseId ? { ...c, notesCount: c.notesCount + 1, updatedAt: new Date().toISOString() } : c
      );
      return {
        cases: updatedCases,
        caseNotes: {
          ...state.caseNotes,
          [caseId]: [newNote, ...existingNotes]
        }
      };
    });
  },

  updateCaseStatus: (caseId, status) => {
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === caseId ? { ...c, status, updatedAt: new Date().toISOString() } : c
      )
    }));
  }
}));
