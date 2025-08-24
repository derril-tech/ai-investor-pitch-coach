// Created automatically by Cursor AI (2024-08-24)
import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';

@Module({
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService],
})
export class MarketModule {}
