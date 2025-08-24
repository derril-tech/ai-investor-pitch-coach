// Created automatically by Cursor AI (2024-08-24)
import { Injectable } from '@nestjs/common';
import { ParseFinanceDto } from './dto/parse-finance.dto';

@Injectable()
export class FinanceService {
  async parseFinance(parseFinanceDto: ParseFinanceDto, orgId: string) {
    // TODO: Call finance-linter worker to parse spreadsheet
    const diagnostics = {
      id: '1',
      startupId: parseFinanceDto.startupId,
      materialId: parseFinanceDto.materialId,
      metrics: {
        cac: 150,
        ltv: 1200,
        ltvCacRatio: 8.0,
        churnRate: 0.05,
        grossMargin: 0.75,
        runway: 18,
      },
      anomalies: [
        {
          type: 'high_cac',
          severity: 'warning',
          message: 'Customer acquisition cost is above industry average',
          metric: 'cac',
          value: 150,
          threshold: 100,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return diagnostics;
  }

  async getDiagnostics(startupId: string, orgId: string) {
    // TODO: Implement actual database query
    const diagnostics = {
      id: '1',
      startupId,
      materialId: '1',
      metrics: {
        cac: 150,
        ltv: 1200,
        ltvCacRatio: 8.0,
        churnRate: 0.05,
        grossMargin: 0.75,
        runway: 18,
      },
      anomalies: [
        {
          type: 'high_cac',
          severity: 'warning',
          message: 'Customer acquisition cost is above industry average',
          metric: 'cac',
          value: 150,
          threshold: 100,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    return diagnostics;
  }
}
