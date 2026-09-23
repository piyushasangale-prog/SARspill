export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type DetectionStatus = 'UNVERIFIED' | 'CONFIRMED_SPILL' | 'LOOKALIKE' | 'ACTION_REQUIRED';
export type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'ARCHIVED';
export type CasePriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type VesselType = 'OIL_TANKER' | 'CHEMICAL_TANKER' | 'CARGO' | 'CONTAINER' | 'FISHING' | 'TUG' | 'UNKNOWN';

export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface Detection {
  id: string;
  timestamp: string;
  location: LocationPoint;
  areaKm2: number;
  volumeM3: number;
  confidence: ConfidenceLevel;
  confidenceScore: number; // e.g. 94%
  status: DetectionStatus;
  type: 'CRUDE_OIL' | 'HEAVY_FUEL' | 'BILGE_DISCHARGE' | 'LOOKALIKE_ALGAE' | 'LOOKALIKE_WIND';
  sensor: string;
  passType: 'ASCENDING' | 'DESCENDING';
  incidenceAngleDeg: number;
  polarization: 'VV' | 'VH' | 'VV+VH';
  slickWidthKm: number;
  polygon: [number, number][]; // Lat, Lng coordinates for GeoJSON slick rendering
  sceneId: string;
  regionName: string;
  summary: string;
}

export interface Vessel {
  mmsi: string;
  imo: string;
  name: string;
  flag: string;
  flagCode: string;
  type: VesselType;
  callsign: string;
  speedKnots: number;
  headingDeg: number;
  lengthM: number;
  beamM: number;
  draftM: number;
  lastSeen: string;
  status: string;
  destination: string;
}

export interface TrackPoint extends LocationPoint {
  timestamp: string;
  speedKnots: number;
  headingDeg: number;
}

export interface VesselTrack {
  vesselMmsi: string;
  points: TrackPoint[];
  aisGapDetected?: boolean;
  gapStartTimestamp?: string;
  gapEndTimestamp?: string;
}

export interface DriftPoint extends LocationPoint {
  timestamp: string;
  currentSpeedKnots: number;
  currentDirectionDeg: number;
  windSpeedKnots: number;
}

export interface DriftResult {
  spillId: string;
  computedAt: string;
  driftTrajectory: DriftPoint[];
  estimatedOriginRegion: {
    center: [number, number]; // [lat, lng]
    radiusKm: number;
    polygon: [number, number][]; // Elliptical bounding polygon
    estimatedReleaseTimeStart: string;
    estimatedReleaseTimeEnd: string;
  };
  seaCurrentSpeed: number; // knots
  seaCurrentHeading: number; // degrees
  windSpeed: number; // knots
  decayPct: number;
}

export interface AttributionCandidate {
  vesselMmsi: string;
  vesselName: string;
  flag: string;
  flagCode: string;
  type: VesselType;
  attributionScore: number; // e.g. 92%
  proximityDistanceKm: number;
  courseAlignmentDeg: number;
  aisGapDetected: boolean;
  estimatedDischargeTimestamp: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  evidenceNotes: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  region: string;
  createdAt: string;
  updatedAt: string;
  assignedAnalyst: string;
  linkedSpillId: string;
  linkedVesselMmsi?: string;
  summary: string;
  notesCount: number;
  evidenceCount: number;
}

export interface CaseNote {
  id: string;
  caseId: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'SAR_ACQUISITION' | 'DETECTION' | 'REVERSE_DRIFT' | 'ATTRIBUTION' | 'CASE_CREATED' | 'NOTE_ADDED' | 'STATUS_CHANGE';
}

export interface SarScene {
  id: string;
  satellite: string;
  acquisitionTime: string;
  mode: string;
  resolution: string;
  orbitPass: 'ASCENDING' | 'DESCENDING';
  boundingBox: [[number, number], [number, number]];
  spillCount: number;
  status: 'PROCESSED' | 'ANALYZING' | 'PENDING';
}
