// Created automatically by Cursor AI (2024-08-24)
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'pitch-coach-gateway',
      version: '0.1.0',
    };
  }
}
