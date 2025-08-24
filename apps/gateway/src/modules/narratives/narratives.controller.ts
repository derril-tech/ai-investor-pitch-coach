// Created automatically by Cursor AI (2024-08-24)
import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NarrativesService } from './narratives.service';
import { GenerateNarrativeDto } from './dto/generate-narrative.dto';
import { RewriteNarrativeDto } from './dto/rewrite-narrative.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Narratives')
@Controller('narratives')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class NarrativesController {
  constructor(private readonly narrativesService: NarrativesService) {}

  @Post('startups/:startupId/generate')
  @ApiOperation({ summary: 'Generate narrative for a startup' })
  @ApiResponse({ status: 201, description: 'Narrative generated successfully' })
  async generateNarrative(
    @Param('startupId') startupId: string,
    @Body() generateNarrativeDto: GenerateNarrativeDto,
    @CurrentUser() user: any,
  ) {
    return this.narrativesService.generateNarrative(startupId, generateNarrativeDto, user.orgId);
  }

  @Get('startups/:startupId')
  @ApiOperation({ summary: 'Get narratives for a startup' })
  @ApiResponse({ status: 200, description: 'Narratives retrieved successfully' })
  async getNarratives(
    @Param('startupId') startupId: string,
    @CurrentUser() user: any,
  ) {
    return this.narrativesService.getNarratives(startupId, user.orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific narrative by ID' })
  @ApiResponse({ status: 200, description: 'Narrative retrieved successfully' })
  async getNarrative(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.narrativesService.getNarrative(id, user.orgId);
  }

  @Put(':id/rewrite')
  @ApiOperation({ summary: 'Rewrite a section of the narrative' })
  @ApiResponse({ status: 200, description: 'Narrative section rewritten successfully' })
  async rewriteNarrative(
    @Param('id') id: string,
    @Body() rewriteNarrativeDto: RewriteNarrativeDto,
    @CurrentUser() user: any,
  ) {
    return this.narrativesService.rewriteNarrative(id, rewriteNarrativeDto, user.orgId);
  }

  @Post(':id/slides/build')
  @ApiOperation({ summary: 'Build slides from narrative' })
  @ApiResponse({ status: 201, description: 'Slides built successfully' })
  async buildSlides(
    @Param('id') id: string,
    @Body() buildSlidesDto: any,
    @CurrentUser() user: any,
  ) {
    return this.narrativesService.buildSlides(id, buildSlidesDto, user.orgId);
  }
}
