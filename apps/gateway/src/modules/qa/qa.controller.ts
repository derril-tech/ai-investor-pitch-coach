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
import { QaService } from './qa.service';
import { GenerateQuestionsDto } from './dto/generate-questions.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Q&A')
@Controller('qa')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate Q&A questions for a startup' })
  @ApiResponse({ status: 201, description: 'Questions generated successfully' })
  async generateQuestions(@Body() generateQuestionsDto: GenerateQuestionsDto, @CurrentUser() user: any) {
    return this.qaService.generateQuestions(generateQuestionsDto, user.orgId);
  }

  @Get('startups/:startupId/questions')
  @ApiOperation({ summary: 'Get Q&A questions for a startup' })
  @ApiResponse({ status: 200, description: 'Questions retrieved successfully' })
  async getQuestions(@Param('startupId') startupId: string, @CurrentUser() user: any) {
    return this.qaService.getQuestions(startupId, user.orgId);
  }
}
