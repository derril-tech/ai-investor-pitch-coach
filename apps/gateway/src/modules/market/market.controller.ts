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
import { MarketService } from './market.service';
import { SizeMarketDto } from './dto/size-market.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Market')
@Controller('market')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Post('size')
  @ApiOperation({ summary: 'Calculate market size (TAM/SAM/SOM)' })
  @ApiResponse({ status: 201, description: 'Market size calculated successfully' })
  async sizeMarket(@Body() sizeMarketDto: SizeMarketDto, @CurrentUser() user: any) {
    return this.marketService.sizeMarket(sizeMarketDto, user.orgId);
  }

  @Get('startups/:startupId/results')
  @ApiOperation({ summary: 'Get market sizing results for a startup' })
  @ApiResponse({ status: 200, description: 'Market sizing results retrieved successfully' })
  async getResults(@Param('startupId') startupId: string, @CurrentUser() user: any) {
    return this.marketService.getResults(startupId, user.orgId);
  }
}
