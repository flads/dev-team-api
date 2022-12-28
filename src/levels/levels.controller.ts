import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { Level } from './entities/level.entity';
import { LevelsService } from './levels.service';

@ApiTags('Levels')
@Controller('levels')
export class LevelsController {
  constructor(private levelsService: LevelsService) {}

  @ApiOperation({ summary: 'Find Levels' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get()
  async findAll() {
    return await this.levelsService.findAll({});
  }

  @ApiOperation({ summary: 'Find Level' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.levelsService.findOne({ where: { id } });
  }

  @ApiOperation({ summary: 'Create Level' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  async create(@Body() body: CreateDto) {
    return await this.levelsService.create(body as Level);
  }

  @ApiOperation({ summary: 'Update Level' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateDto) {
    return await this.levelsService.update(id, body as Level);
  }

  @ApiOperation({ summary: 'Delete Level' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.levelsService.delete(id);
  }
}
