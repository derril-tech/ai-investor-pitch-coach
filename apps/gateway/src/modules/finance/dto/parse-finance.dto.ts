// Created automatically by Cursor AI (2024-08-24)
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParseFinanceDto {
  @ApiProperty({ description: 'Startup ID' })
  @IsString()
  @IsNotEmpty()
  startupId: string;

  @ApiProperty({ description: 'Material ID containing the financial spreadsheet' })
  @IsString()
  @IsNotEmpty()
  materialId: string;
}
