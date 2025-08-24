// Created automatically by Cursor AI (2024-08-24)
import { IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateNarrativeDto {
  @ApiPropertyOptional({ description: 'Additional constraints for narrative generation' })
  @IsOptional()
  @IsObject()
  constraints?: any;
}
