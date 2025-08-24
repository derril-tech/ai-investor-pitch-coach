// Created automatically by Cursor AI (2024-08-24)
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExportDto {
  @ApiProperty({ description: 'Startup ID' })
  @IsString()
  @IsNotEmpty()
  startupId: string;

  @ApiProperty({ example: 'deck', description: 'Type of export' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'pptx', description: 'Export format' })
  @IsString()
  @IsNotEmpty()
  format: string;

  @ApiPropertyOptional({ example: 's3://bucket/path', description: 'Export destination' })
  @IsOptional()
  @IsString()
  destination?: string;
}
