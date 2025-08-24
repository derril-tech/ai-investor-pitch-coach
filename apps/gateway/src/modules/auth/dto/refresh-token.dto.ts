// Created automatically by Cursor AI (2024-08-24)
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
