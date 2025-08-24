// Created automatically by Cursor AI (2024-08-24)
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { StartupsModule } from './modules/startups/startups.module';
import { NarrativesModule } from './modules/narratives/narratives.module';
import { FinanceModule } from './modules/finance/finance.module';
import { MarketModule } from './modules/market/market.module';
import { QaModule } from './modules/qa/qa.module';
import { RehearsalsModule } from './modules/rehearsals/rehearsals.module';
import { ExportsModule } from './modules/exports/exports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HealthModule,
    AuthModule,
    StartupsModule,
    NarrativesModule,
    FinanceModule,
    MarketModule,
    QaModule,
    RehearsalsModule,
    ExportsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
