// Created automatically by Cursor AI (2024-08-24)
import { Module } from '@nestjs/common';
import { QaController } from './qa.controller';
import { QaService } from './qa.service';

@Module({
  controllers: [QaController],
  providers: [QaService],
  exports: [QaService],
})
export class QaModule {}
