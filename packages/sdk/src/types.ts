// Created automatically by Cursor AI (2024-08-24)

export interface Startup {
  id: string;
  name: string;
  sector: string;
  stage: string;
  brand?: any;
  createdAt: string;
}

export interface Narrative {
  id: string;
  startupId: string;
  version: number;
  status: string;
  outline: any;
  createdAt: string;
}

export interface Slide {
  id: string;
  startupId: string;
  narrativeId: string;
  section: string;
  orderIdx: number;
  title: string;
  bullets: any[];
  speakerNotes: string;
  evidence: any[];
  createdAt: string;
}

export interface Rehearsal {
  id: string;
  startupId: string;
  narrativeId: string;
  durationSec: number;
  startedAt: string;
  endedAt?: string;
  transcript?: any;
  speechMetrics?: any;
}
