// Created automatically by Cursor AI (2024-08-24)
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StartupsService } from './startups.service';
import { CreateStartupDto } from './dto/create-startup.dto';
import { UpdateStartupDto } from './dto/update-startup.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Startups')
@Controller('startups')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new startup' })
  @ApiResponse({ status: 201, description: 'Startup created successfully' })
  async create(@Body() createStartupDto: CreateStartupDto, @CurrentUser() user: any) {
    return this.startupsService.create(createStartupDto, user.orgId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all startups for the organization' })
  @ApiResponse({ status: 200, description: 'Startups retrieved successfully' })
  async findAll(@CurrentUser() user: any, @Query('cursor') cursor?: string) {
    return this.startupsService.findAll(user.orgId, cursor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific startup by ID' })
  @ApiResponse({ status: 200, description: 'Startup retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Startup not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.startupsService.findOne(id, user.orgId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a startup' })
  @ApiResponse({ status: 200, description: 'Startup updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateStartupDto: UpdateStartupDto,
    @CurrentUser() user: any,
  ) {
    return this.startupsService.update(id, updateStartupDto, user.orgId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a startup' })
  @ApiResponse({ status: 200, description: 'Startup deleted successfully' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.startupsService.remove(id, user.orgId);
  }

  @Post(':id/materials')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload material for a startup' })
  @ApiResponse({ status: 201, description: 'Material uploaded successfully' })
  async uploadMaterial(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('kind') kind: string,
    @CurrentUser() user: any,
  ) {
    return this.startupsService.uploadMaterial(id, file, kind, user.orgId);
  }

  @Get(':id/materials')
  @ApiOperation({ summary: 'Get all materials for a startup' })
  @ApiResponse({ status: 200, description: 'Materials retrieved successfully' })
  async getMaterials(@Param('id') id: string, @CurrentUser() user: any) {
    return this.startupsService.getMaterials(id, user.orgId);
  }
}
