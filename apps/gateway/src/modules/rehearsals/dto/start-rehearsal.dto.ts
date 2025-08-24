// Created automatically by Cursor AI (2024-08-24)
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartRehearsalDto {
  @ApiProperty({ description: 'Startup ID' })
  @IsString()
  @IsNotEmpty()
  startupId: string;

  @ApiProperty({ description: 'Narrative ID to rehearse' })
  @IsString()
  @IsNotEmpty()
  narrativeId: string;
}
