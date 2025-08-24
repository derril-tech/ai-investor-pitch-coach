// Created automatically by Cursor AI (2024-08-24)
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RewriteNarrativeDto {
  @ApiProperty({ example: 'problem', description: 'Section to rewrite' })
  @IsString()
  @IsNotEmpty()
  section: string;

  @ApiProperty({ example: 'Updated problem statement', description: 'New content for the section' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
