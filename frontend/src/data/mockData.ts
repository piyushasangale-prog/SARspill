import type {
  Detection,
  Vessel,
  VesselTrack,
  DriftResult,
  AttributionCandidate,
  InvestigationCase,
  CaseNote,
  TimelineEvent,
  SarScene
} from '../types';

export const MOCK_SCENES: SarScene[] = [
  {
    id: 'S1A_IW_GRDH_1SDV_20260923T041218',
    satellite: 'Sentinel-1A C-SAR',
    acquisitionTime: '2026-09-23T04:12:18Z',
    mode: 'IW (Interferometric Wide)',
    resolution: '10m x 10m',
    orbitPass: 'ASCENDING',
    boundingBox: [[18.5, 71.5], [19.8, 73.2]],
    spillCount: 3,
    status: 'PROCESSED'
  },
  {
    id: 'RS2_FINE_QUAD_20260922T164500',
    satellite: 'RADARSAT-2 C-Band',
    acquisitionTime: '2026-09-22T16:45:00Z',
    mode: 'Fine Quad-Pol',
    resolution: '8m x 8m',
    orbitPass: 'DESCENDING',
    boundingBox: [[18.2, 71.8], [19.5, 73.0]],
    spillCount: 1,
    status: 'PROCESSED'
  },
  {
    id: 'ALOS2_PALSAR2_20260921T221005',
    satellite: 'ALOS-2 PALSAR-2 L-Band',
    acquisitionTime: '2026-09-21T22:10:05Z',
    mode: 'Stripmap 3m',
    resolution: '3m x 3m',
    orbitPass: 'ASCENDING',
    boundingBox: [[18.8, 72.0], [19.6, 72.9]],
    spillCount: 0,
    status: 'PROCESSED'
  }
];

export const MOCK_DETECTIONS: Detection[] = [
  {
    id: 'DET-2026-0891',
    timestamp: '2026-09-23T04:12:18Z',
    location: { lat: 18.9450, lng: 72.3200 }, // Arabian Sea offshore Bombay High
    areaKm2: 14.85,
    volumeM3: 420.0,
    confidence: 'HIGH',
    confidenceScore: 94,
    status: 'ACTION_REQUIRED',
    type: 'CRUDE_OIL',
    sensor: 'Sentinel-1A C-SAR',
    passType: 'ASCENDING',
    incidenceAngleDeg: 34.2,
    polarization: 'VV+VH',
    slickWidthKm: 2.4,
    sceneId: 'S1A_IW_GRDH_1SDV_20260923T041218',
    regionName: 'Bombay High North Corridor (Arabian Sea)',
    summary: 'Elongated dark radar backscatter patch with sharp damping boundaries. High VV/VH cross-polarization ratio indicating mineral oil slick.',
    polygon: [
      [18.960, 72.300],
      [18.968, 72.315],
      [18.955, 72.340],
      [18.935, 72.335],
      [18.928, 72.318],
      [18.940, 72.305],
      [18.960, 72.300]
    ]
  },
  {
    id: 'DET-2026-0892',
    timestamp: '2026-09-23T04:12:18Z',
    location: { lat: 19.1200, lng: 72.4800 }, // Approach to JNPT / Mumbai Port
    areaKm2: 6.20,
    volumeM3: 110.0,
    confidence: 'HIGH',
    confidenceScore: 88,
    status: 'CONFIRMED_SPILL',
    type: 'BILGE_DISCHARGE',
    sensor: 'Sentinel-1A C-SAR',
    passType: 'ASCENDING',
    incidenceAngleDeg: 37.8,
    polarization: 'VV',
    slickWidthKm: 0.9,
    sceneId: 'S1A_IW_GRDH_1SDV_20260923T041218',
    regionName: 'Mumbai Port Navigation Approach Channel',
    summary: 'Linear discharge trace aligned with commercial shipping lane leading into JNPT port anchorage.',
    polygon: [
      [19.130, 72.470],
      [19.135, 72.485],
      [19.115, 72.495],
      [19.105, 72.480],
      [19.130, 72.470]
    ]
  },
  {
    id: 'DET-2026-0893',
    timestamp: '2026-09-23T04:12:18Z',
    location: { lat: 18.6500, lng: 72.1500 }, // South Konkan Offshore
    areaKm2: 3.40,
    volumeM3: 45.0,
    confidence: 'MEDIUM',
    confidenceScore: 68,
    status: 'UNVERIFIED',
    type: 'LOOKALIKE_WIND',
    sensor: 'Sentinel-1A C-SAR',
    passType: 'ASCENDING',
    incidenceAngleDeg: 28.5,
    polarization: 'VV',
    slickWidthKm: 1.1,
    sceneId: 'S1A_IW_GRDH_1SDV_20260923T041218',
    regionName: 'Alibag / Raigad Offshore Sector',
    summary: 'Low-wind calm sea area causing dark patch look-alike in SAR. Low contrast gradient across edges.',
    polygon: [
      [18.660, 72.140],
      [18.665, 72.160],
      [18.645, 72.165],
      [18.640, 72.145],
      [18.660, 72.140]
    ]
  },
  {
    id: 'DET-2026-0894',
    timestamp: '2026-09-22T16:45:00Z',
    location: { lat: 18.8200, lng: 72.0500 }, // Central Arabian Sea Track
    areaKm2: 21.50,
    volumeM3: 680.0,
    confidence: 'HIGH',
    confidenceScore: 96,
    status: 'CONFIRMED_SPILL',
    type: 'HEAVY_FUEL',
    sensor: 'RADARSAT-2 C-Band',
    passType: 'DESCENDING',
    incidenceAngleDeg: 41.0,
    polarization: 'VV+VH',
    slickWidthKm: 3.8,
    sceneId: 'RS2_FINE_QUAD_20260922T164500',
    regionName: 'Deep Water Arabian Sea Transit Corridor',
    summary: 'Major heavy fuel oil slick detected in high sea state. Significant damping effect across 21.5 sq km.',
    polygon: [
      [18.840, 72.020],
      [18.850, 72.060],
      [18.810, 72.080],
      [18.790, 72.040],
      [18.840, 72.020]
    ]
  }
];

export const MOCK_VESSELS: Vessel[] = [
  {
    mmsi: '419001284',
    imo: 'IMO9438201',
    name: 'MT OCEAN VOYAGER',
    flag: 'India',
    flagCode: 'IN',
    type: 'OIL_TANKER',
    callsign: 'VTFX',
    speedKnots: 13.4,
    headingDeg: 325,
    lengthM: 245,
    beamM: 42,
    draftM: 14.8,
    lastSeen: '2026-09-23T04:10:00Z',
    status: 'UNDERWAY_USING_ENGINE',
    destination: 'MUMBAI OFFSHORE / JNPT'
  },
  {
    mmsi: '352984000',
    imo: 'IMO9120488',
    name: 'SS KONKAN TRADER',
    flag: 'Panama',
    flagCode: 'PA',
    type: 'CHEMICAL_TANKER',
    callsign: '3FEP9',
    speedKnots: 11.2,
    headingDeg: 190,
    lengthM: 182,
    beamM: 28,
    draftM: 10.2,
    lastSeen: '2026-09-23T04:05:00Z',
    status: 'UNDERWAY_USING_ENGINE',
    destination: 'FUJAIRAH UAE'
  },
  {
    mmsi: '636018332',
    imo: 'IMO9604123',
    name: 'MV AL-MANSOOR',
    flag: 'Liberia',
    flagCode: 'LR',
    type: 'CONTAINER',
    callsign: 'A8LK4',
    speedKnots: 18.5,
    headingDeg: 340,
    lengthM: 300,
    beamM: 48,
    draftM: 13.5,
    lastSeen: '2026-09-23T03:55:00Z',
    status: 'UNDERWAY_USING_ENGINE',
    destination: 'SALALAH OMAN'
  },
  {
    mmsi: '419002999',
    imo: 'IMO9501192',
    name: 'COAST SENTINEL II',
    flag: 'India',
    flagCode: 'IN',
    type: 'TUG',
    callsign: 'VWTG',
    speedKnots: 8.1,
    headingDeg: 95,
    lengthM: 65,
    beamM: 16,
    draftM: 5.5,
    lastSeen: '2026-09-23T04:12:00Z',
    status: 'ENGAGED_IN_TOWING',
    destination: 'BOMBAY HIGH SOUTH'
  }
];

export const MOCK_VESSEL_TRACKS: Record<string, VesselTrack> = {
  '419001284': {
    vesselMmsi: '419001284',
    aisGapDetected: true,
    gapStartTimestamp: '2026-09-23T01:15:00Z',
    gapEndTimestamp: '2026-09-23T02:45:00Z',
    points: [
      { lat: 18.7200, lng: 72.1000, timestamp: '2026-09-22T23:00:00Z', speedKnots: 13.8, headingDeg: 325 },
      { lat: 18.8000, lng: 72.1700, timestamp: '2026-09-23T00:15:00Z', speedKnots: 13.6, headingDeg: 325 },
      { lat: 18.8800, lng: 72.2400, timestamp: '2026-09-23T01:15:00Z', speedKnots: 13.5, headingDeg: 325 }, // AIS Turn OFF
      // Gap simulated between 01:15 and 02:45 (Discharge window)
      { lat: 18.9700, lng: 72.3300, timestamp: '2026-09-23T02:45:00Z', speedKnots: 12.1, headingDeg: 325 }, // AIS Turn ON
      { lat: 19.0500, lng: 72.4000, timestamp: '2026-09-23T04:10:00Z', speedKnots: 13.4, headingDeg: 325 }
    ]
  },
  '352984000': {
    vesselMmsi: '352984000',
    aisGapDetected: false,
    points: [
      { lat: 19.1800, lng: 72.4200, timestamp: '2026-09-22T23:30:00Z', speedKnots: 11.5, headingDeg: 190 },
      { lat: 19.0500, lng: 72.3900, timestamp: '2026-09-23T01:00:00Z', speedKnots: 11.4, headingDeg: 190 },
      { lat: 18.9200, lng: 72.3500, timestamp: '2026-09-23T02:30:00Z', speedKnots: 11.2, headingDeg: 190 },
      { lat: 18.7800, lng: 72.3100, timestamp: '2026-09-23T04:05:00Z', speedKnots: 11.2, headingDeg: 190 }
    ]
  },
  '636018332': {
    vesselMmsi: '636018332',
    aisGapDetected: false,
    points: [
      { lat: 18.6000, lng: 72.0000, timestamp: '2026-09-23T00:00:00Z', speedKnots: 18.8, headingDeg: 340 },
      { lat: 18.8500, lng: 72.1000, timestamp: '2026-09-23T02:00:00Z', speedKnots: 18.6, headingDeg: 340 },
      { lat: 19.1000, lng: 72.2000, timestamp: '2026-09-23T03:55:00Z', speedKnots: 18.5, headingDeg: 340 }
    ]
  }
};

export const MOCK_DRIFT_RESULTS: Record<string, DriftResult> = {
  'DET-2026-0891': {
    spillId: 'DET-2026-0891',
    computedAt: '2026-09-23T04:20:00Z',
    seaCurrentSpeed: 1.4, // knots
    seaCurrentHeading: 65, // NNE drift
    windSpeed: 12.5, // knots from SW
    decayPct: 18.4,
    driftTrajectory: [
      { lat: 18.9450, lng: 72.3200, timestamp: '2026-09-23T04:12:00Z', currentSpeedKnots: 1.4, currentDirectionDeg: 65, windSpeedKnots: 12.5 },
      { lat: 18.9280, lng: 72.3050, timestamp: '2026-09-23T03:12:00Z', currentSpeedKnots: 1.3, currentDirectionDeg: 68, windSpeedKnots: 13.0 },
      { lat: 18.9100, lng: 72.2880, timestamp: '2026-09-23T02:12:00Z', currentSpeedKnots: 1.5, currentDirectionDeg: 62, windSpeedKnots: 12.0 },
      { lat: 18.8920, lng: 72.2700, timestamp: '2026-09-23T01:12:00Z', currentSpeedKnots: 1.4, currentDirectionDeg: 65, windSpeedKnots: 12.5 }
    ],
    estimatedOriginRegion: {
      center: [18.8920, 72.2700],
      radiusKm: 3.8,
      estimatedReleaseTimeStart: '2026-09-23T01:00:00Z',
      estimatedReleaseTimeEnd: '2026-09-23T02:30:00Z',
      polygon: [
        [18.915, 72.250],
        [18.925, 72.280],
        [18.880, 72.300],
        [18.865, 72.260],
        [18.915, 72.250]
      ]
    }
  },
  'DET-2026-0892': {
    spillId: 'DET-2026-0892',
    computedAt: '2026-09-23T04:22:00Z',
    seaCurrentSpeed: 0.9,
    seaCurrentHeading: 45,
    windSpeed: 9.0,
    decayPct: 32.0,
    driftTrajectory: [
      { lat: 19.1200, lng: 72.4800, timestamp: '2026-09-23T04:12:00Z', currentSpeedKnots: 0.9, currentDirectionDeg: 45, windSpeedKnots: 9.0 },
      { lat: 19.1050, lng: 72.4650, timestamp: '2026-09-23T02:42:00Z', currentSpeedKnots: 1.0, currentDirectionDeg: 42, windSpeedKnots: 8.5 },
      { lat: 19.0900, lng: 72.4500, timestamp: '2026-09-23T01:12:00Z', currentSpeedKnots: 0.8, currentDirectionDeg: 48, windSpeedKnots: 9.2 }
    ],
    estimatedOriginRegion: {
      center: [19.0900, 72.4500],
      radiusKm: 2.1,
      estimatedReleaseTimeStart: '2026-09-23T01:00:00Z',
      estimatedReleaseTimeEnd: '2026-09-23T02:30:00Z',
      polygon: [
        [19.102, 72.440],
        [19.108, 72.462],
        [19.078, 72.460],
        [19.075, 72.438],
        [19.102, 72.440]
      ]
    }
  }
};

export const MOCK_ATTRIBUTIONS: Record<string, AttributionCandidate[]> = {
  'DET-2026-0891': [
    {
      vesselMmsi: '419001284',
      vesselName: 'MT OCEAN VOYAGER',
      flag: 'India',
      flagCode: 'IN',
      type: 'OIL_TANKER',
      attributionScore: 94,
      proximityDistanceKm: 0.45,
      courseAlignmentDeg: 12,
      aisGapDetected: true,
      estimatedDischargeTimestamp: '2026-09-23T01:45:00Z',
      riskLevel: 'CRITICAL',
      evidenceNotes: 'Vessel track intersects reverse-drift origin ellipse with 94% spatial confidence. AIS transceiver disabled for 90 minutes directly inside the discharge window.'
    },
    {
      vesselMmsi: '352984000',
      vesselName: 'SS KONKAN TRADER',
      flag: 'Panama',
      flagCode: 'PA',
      type: 'CHEMICAL_TANKER',
      attributionScore: 42,
      proximityDistanceKm: 4.8,
      courseAlignmentDeg: 78,
      aisGapDetected: false,
      estimatedDischargeTimestamp: '2026-09-23T02:15:00Z',
      riskLevel: 'MODERATE',
      evidenceNotes: 'Passed 4.8 km southeast of origin zone. Active continuous AIS broadcasting with stable 11.4 knot speed profile.'
    },
    {
      vesselMmsi: '636018332',
      vesselName: 'MV AL-MANSOOR',
      flag: 'Liberia',
      flagCode: 'LR',
      type: 'CONTAINER',
      attributionScore: 18,
      proximityDistanceKm: 12.3,
      courseAlignmentDeg: 145,
      aisGapDetected: false,
      estimatedDischargeTimestamp: '2026-09-23T01:00:00Z',
      riskLevel: 'LOW',
      evidenceNotes: 'Container vessel transiting deep water corridor. High speed (18.5 kn) and distant offset.'
    }
  ],
  'DET-2026-0892': [
    {
      vesselMmsi: '352984000',
      vesselName: 'SS KONKAN TRADER',
      flag: 'Panama',
      flagCode: 'PA',
      type: 'CHEMICAL_TANKER',
      attributionScore: 82,
      proximityDistanceKm: 0.8,
      courseAlignmentDeg: 8,
      aisGapDetected: false,
      estimatedDischargeTimestamp: '2026-09-23T02:10:00Z',
      riskLevel: 'HIGH',
      evidenceNotes: 'Direct track overlap along Mumbai port approach channel during tank washing window.'
    }
  ]
};

export const MOCK_CASES: InvestigationCase[] = [
  {
    id: 'CASE-IND-2026-042',
    title: 'Bombay High North Heavy Crude Discharge Incident',
    status: 'INVESTIGATING',
    priority: 'URGENT',
    region: 'Arabian Sea / Bombay High North',
    createdAt: '2026-09-23T04:30:00Z',
    updatedAt: '2026-09-23T05:15:00Z',
    assignedAnalyst: 'Commander A. Sharma (Indian Coast Guard / Maritime Intelligence)',
    linkedSpillId: 'DET-2026-0891',
    linkedVesselMmsi: '419001284',
    summary: 'High-confidence 14.85 sq km oil slick detected by Sentinel-1A SAR. Reverse hydro-drift models trace release to 01:45Z epoch, matching AIS gap of crude tanker MT OCEAN VOYAGER.',
    notesCount: 4,
    evidenceCount: 6
  },
  {
    id: 'CASE-IND-2026-041',
    title: 'JNPT Approach Channel Bilge Spill',
    status: 'OPEN',
    priority: 'HIGH',
    region: 'Mumbai Port Channel (JNPT)',
    createdAt: '2026-09-22T18:00:00Z',
    updatedAt: '2026-09-23T02:00:00Z',
    assignedAnalyst: 'Analyst R. Varma (DG Shipping Surveillance)',
    linkedSpillId: 'DET-2026-0892',
    linkedVesselMmsi: '352984000',
    summary: '6.2 sq km illegal bilge water discharge detected along approach buoy line. Chemical tanker SS Konkan Trader identified as top candidate.',
    notesCount: 2,
    evidenceCount: 3
  },
  {
    id: 'CASE-IND-2026-039',
    title: 'Deep Water Arabian Sea Transit Slick',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    region: 'Arabian Sea EEZ Boundary',
    createdAt: '2026-09-20T11:20:00Z',
    updatedAt: '2026-09-22T14:00:00Z',
    assignedAnalyst: 'Capt. S. Nair (IN Maritime Operations Center)',
    linkedSpillId: 'DET-2026-0894',
    linkedVesselMmsi: '636018332',
    summary: '21.5 sq km heavy fuel slick. Fine imposed by port state control upon vessel arrival at Salalah.',
    notesCount: 5,
    evidenceCount: 8
  }
];

export const MOCK_TIMELINE_EVENTS: Record<string, TimelineEvent[]> = {
  'CASE-IND-2026-042': [
    {
      id: 'EV-001',
      caseId: 'CASE-IND-2026-042',
      timestamp: '2026-09-23T04:12:18Z',
      title: 'SAR Satellite Acquisition',
      description: 'Sentinel-1A C-SAR pass completed over Arabian Sea Sector 4. IW mode VV+VH polarizations.',
      category: 'SAR_ACQUISITION'
    },
    {
      id: 'EV-002',
      caseId: 'CASE-IND-2026-042',
      timestamp: '2026-09-23T04:15:30Z',
      title: 'Automated Oil Spill Detection',
      description: 'SARspill ML pipeline flagged 14.85 km² dark slick with 94% confidence rating.',
      category: 'DETECTION'
    },
    {
      id: 'EV-003',
      caseId: 'CASE-IND-2026-042',
      timestamp: '2026-09-23T04:20:00Z',
      title: 'Reverse Drift Hydrodynamic Simulation',
      description: 'Backward surface current & wind vector model estimated spill origin zone at Lat 18.892°N, Lon 72.270°E (Release window: 01:00Z - 02:30Z).',
      category: 'REVERSE_DRIFT'
    },
    {
      id: 'EV-004',
      caseId: 'CASE-IND-2026-042',
      timestamp: '2026-09-23T04:25:12Z',
      title: 'Vessel Attribution & AIS Correlator',
      description: 'Attribution engine scored MT OCEAN VOYAGER (MMSI 419001284) at 94% confidence. 90-minute AIS gap detected during release epoch.',
      category: 'ATTRIBUTION'
    },
    {
      id: 'EV-005',
      caseId: 'CASE-IND-2026-042',
      timestamp: '2026-09-23T04:30:00Z',
      title: 'Investigation Case Dossier Opened',
      description: 'Urgent priority case dossier created by Cmdr. A. Sharma. Coast Guard Patrol Aircraft CG-814 dispatched for aerial sampling.',
      category: 'CASE_CREATED'
    }
  ]
};

export const MOCK_CASE_NOTES: Record<string, CaseNote[]> = {
  'CASE-IND-2026-042': [
    {
      id: 'NOTE-101',
      caseId: 'CASE-IND-2026-042',
      author: 'Cmdr. A. Sharma',
      role: 'Lead Maritime Analyst',
      timestamp: '2026-09-23T04:35:00Z',
      content: 'Initial SAR anomaly verified against atmospheric wind speed data (12.5 knots). Slick geometry shows clear un-weathered crude oil characteristics with metallic rainbow sheen confirmed on optical overlay.'
    },
    {
      id: 'NOTE-102',
      caseId: 'CASE-IND-2026-042',
      author: 'Lt. Cmdr. K. Mehta',
      role: 'AIS Operations Officer',
      timestamp: '2026-09-23T04:50:00Z',
      content: 'Corroborating coastal radar station logs from Murud Janjira tower. Target 419001284 was tracked visually on x-band radar during the AIS blackout window at speed 13.2 knots.'
    },
    {
      id: 'NOTE-103',
      caseId: 'CASE-IND-2026-042',
      author: 'Dr. V. Rao',
      role: 'Geospatial Hydro-Modeler',
      timestamp: '2026-09-23T05:15:00Z',
      content: 'Reverse drift simulation re-run with updated HYCOM 1/12° ocean surface velocity fields. Origin ellipse tightened to 3.8 km radius centered on Lat 18.892°N, Lon 72.270°E.'
    }
  ]
};
