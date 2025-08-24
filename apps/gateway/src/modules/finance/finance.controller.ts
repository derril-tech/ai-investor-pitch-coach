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
import { FinanceService } from './finance.service';
import { ParseFinanceDto } from './dto/parse-finance.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Finance')
@Controller('finance')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('parse')
  @ApiOperation({ summary: 'Parse financial spreadsheet' })
  @ApiResponse({ status: 201, description: 'Financial data parsed successfully' })
  async parseFinance(@Body() parseFinanceDto: ParseFinanceDto, @CurrentUser() user: any) {
    return this.financeService.parseFinance(parseFinanceDto, user.orgId);
  }

  @Get('startups/:startupId/diagnostics')
  @ApiOperation({ summary: 'Get financial diagnostics for a startup' })
  @ApiResponse({ status: 200, description: 'Financial diagnostics retrieved successfully' })
  async getDiagnostics(@Param('startupId') startupId: string, @CurrentUser() user: any) {
    return this.financeService.getDiagnostics(startupId, user.orgId);
  }
}
