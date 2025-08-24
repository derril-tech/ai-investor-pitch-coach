// Created automatically by Cursor AI (2024-08-24)
import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SizeMarketDto {
  @ApiProperty({ description: 'Startup ID' })
  @IsString()
  @IsNotEmpty()
  startupId: string;

  @ApiProperty({ example: 'top_down', description: 'Market sizing method' })
  @IsString()
  @IsNotEmpty()
  method: string;

  @ApiProperty({ description: 'Input parameters for market sizing' })
  @IsObject()
  inputs: any;
}
