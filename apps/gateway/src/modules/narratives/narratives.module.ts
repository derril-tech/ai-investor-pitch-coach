// Created automatically by Cursor AI (2024-08-24)
import { Module } from '@nestjs/common';
import { NarrativesController } from './narratives.controller';
import { NarrativesService } from './narratives.service';

@Module({
  controllers: [NarrativesController],
  providers: [NarrativesService],
  exports: [NarrativesService],
})
export class NarrativesModule {}
