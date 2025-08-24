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
import { ExportsService } from './exports.service';
import { CreateExportDto } from './dto/create-export.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Exports')
@Controller('exports')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new export' })
  @ApiResponse({ status: 201, description: 'Export created successfully' })
  async createExport(@Body() createExportDto: CreateExportDto, @CurrentUser() user: any) {
    return this.exportsService.createExport(createExportDto, user.orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get export status and download URL' })
  @ApiResponse({ status: 200, description: 'Export details retrieved successfully' })
  async getExport(@Param('id') id: string, @CurrentUser() user: any) {
    return this.exportsService.getExport(id, user.orgId);
  }

  @Get('startups/:startupId')
  @ApiOperation({ summary: 'Get all exports for a startup' })
  @ApiResponse({ status: 200, description: 'Exports retrieved successfully' })
  async getExports(@Param('startupId') startupId: string, @CurrentUser() user: any) {
    return this.exportsService.getExports(startupId, user.orgId);
  }
}
