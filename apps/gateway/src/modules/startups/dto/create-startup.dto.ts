// Created automatically by Cursor AI (2024-08-24)
import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStartupDto {
  @ApiProperty({ example: 'My Awesome Startup' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'SaaS' })
  @IsString()
  sector: string;

  @ApiProperty({ example: 'seed' })
  @IsString()
  stage: string;

  @ApiPropertyOptional({ example: { colors: ['#000000', '#ffffff'] } })
  @IsOptional()
  @IsObject()
  brand?: any;
}
