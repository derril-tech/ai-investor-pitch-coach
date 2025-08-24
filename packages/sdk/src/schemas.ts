// Created automatically by Cursor AI (2024-08-24)
import { z } from 'zod';

export const StartupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  sector: z.string(),
  stage: z.string(),
  brand: z.any().optional(),
  createdAt: z.string().datetime(),
});

export const NarrativeSchema = z.object({
  id: z.string().uuid(),
  startupId: z.string().uuid(),
  version: z.number(),
  status: z.string(),
  outline: z.any(),
  createdAt: z.string().datetime(),
});

export const SlideSchema = z.object({
  id: z.string().uuid(),
  startupId: z.string().uuid(),
  narrativeId: z.string().uuid(),
  section: z.string(),
  orderIdx: z.number(),
  title: z.string(),
  bullets: z.array(z.any()),
  speakerNotes: z.string(),
  evidence: z.array(z.any()),
  createdAt: z.string().datetime(),
});

export const RehearsalSchema = z.object({
  id: z.string().uuid(),
  startupId: z.string().uuid(),
  narrativeId: z.string().uuid(),
  durationSec: z.number(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime().optional(),
  transcript: z.any().optional(),
  speechMetrics: z.any().optional(),
});
