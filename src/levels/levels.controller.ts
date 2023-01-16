import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLevelDto } from './dtos/create.dto';
import { UpdateLevelDto } from './dtos/update.dto';
import { Level } from './entities/level.entity';
import { LevelsService } from './levels.service';

@ApiTags('Levels')
@Controller('levels')
export class LevelsController {
  constructor(private levelsService: LevelsService) {}

  @ApiOperation({ summary: 'Find Levels' })
  @ApiQuery({
    name: 'sort',
    type: 'string',
    required: false,
    description: 'Examples: "id desc", "name asc", "name asc, id asc"',
  })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  @ApiQuery({ name: 'skip', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'Ok' })
  @HttpCode(200)
  @Get()
  async findAll(@Req() req) {
    return await this.levelsService.findAll(req.query);
  }

  @ApiOperation({ summary: 'List Levels for select' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @HttpCode(200)
  @Get('for-select')
  async findAllForSelect() {
    return await this.levelsService.findAllForSelect();
  }

  @ApiOperation({ summary: 'Find Level' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @HttpCode(200)
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.levelsService.findOne({ where: { id } });
  }

  @ApiOperation({ summary: 'Create Level' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(201)
  @Post()
  async create(@Body() body: CreateLevelDto) {
    return await this.levelsService.create(body as Level);
  }

  @ApiOperation({ summary: 'Update Level' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(200)
  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateLevelDto) {
    return await this.levelsService.update(id, body as Level);
  }

  @ApiOperation({ summary: 'Delete Level' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(204)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.levelsService.delete(id);
  }
}
