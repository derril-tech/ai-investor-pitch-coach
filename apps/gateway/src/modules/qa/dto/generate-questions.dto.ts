// Created automatically by Cursor AI (2024-08-24)
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateQuestionsDto {
  @ApiProperty({ description: 'Startup ID' })
  @IsString()
  @IsNotEmpty()
  startupId: string;

  @ApiPropertyOptional({ example: 10, description: 'Number of questions to generate' })
  @IsOptional()
  @IsNumber()
  count?: number;

  @ApiPropertyOptional({ example: 'medium', description: 'Difficulty level' })
  @IsOptional()
  @IsString()
  difficulty?: string;
}
