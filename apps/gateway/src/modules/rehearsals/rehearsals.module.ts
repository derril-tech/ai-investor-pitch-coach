// Created automatically by Cursor AI (2024-08-24)
import { Module } from '@nestjs/common';
import { RehearsalsController } from './rehearsals.controller';
import { RehearsalsService } from './rehearsals.service';

@Module({
  controllers: [RehearsalsController],
  providers: [RehearsalsService],
  exports: [RehearsalsService],
})
export class RehearsalsModule {}
