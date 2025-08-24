// Created automatically by Cursor AI (2024-08-24)
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RehearsalsService } from './rehearsals.service';
import { StartRehearsalDto } from './dto/start-rehearsal.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Rehearsals')
@Controller('rehearsals')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RehearsalsController {
  constructor(private readonly rehearsalsService: RehearsalsService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new rehearsal session' })
  @ApiResponse({ status: 201, description: 'Rehearsal started successfully' })
  async startRehearsal(@Body() startRehearsalDto: StartRehearsalDto, @CurrentUser() user: any) {
    return this.rehearsalsService.startRehearsal(startRehearsalDto, user.orgId);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: 'Stop a rehearsal session' })
  @ApiResponse({ status: 200, description: 'Rehearsal stopped successfully' })
  async stopRehearsal(@Param('id') id: string, @CurrentUser() user: any) {
    return this.rehearsalsService.stopRehearsal(id, user.orgId);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Analyze rehearsal audio' })
  @ApiResponse({ status: 200, description: 'Rehearsal analyzed successfully' })
  async analyzeRehearsal(@Param('id') id: string, @CurrentUser() user: any) {
    return this.rehearsalsService.analyzeRehearsal(id, user.orgId);
  }

  @Get('startups/:startupId')
  @ApiOperation({ summary: 'Get rehearsals for a startup' })
  @ApiResponse({ status: 200, description: 'Rehearsals retrieved successfully' })
  async getRehearsals(@Param('startupId') startupId: string, @CurrentUser() user: any) {
    return this.rehearsalsService.getRehearsals(startupId, user.orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific rehearsal by ID' })
  @ApiResponse({ status: 200, description: 'Rehearsal retrieved successfully' })
  async getRehearsal(@Param('id') id: string, @CurrentUser() user: any) {
    return this.rehearsalsService.getRehearsal(id, user.orgId);
  }
}
