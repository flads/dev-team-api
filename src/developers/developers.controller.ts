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
import { CreateDeveloperDto } from './dtos/create.dto';
import { Request } from 'express';
import { UpdateDeveloperDto } from './dtos/update.dto';
import { Developer } from './entities/developer.entity';
import { DevelopersService } from './developers.service';

@ApiTags('Developers')
@Controller('developers')
export class DevelopersController {
  constructor(private developersService: DevelopersService) {}

  @ApiOperation({ summary: 'Find Developers' })
  @ApiQuery({
    name: 'sort',
    type: 'string',
    required: false,
    description:
      'Examples: "developers.id desc", "developers.name asc, developers.id asc"',
  })
  @ApiQuery({ name: 'search', type: 'string', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  @ApiQuery({ name: 'skip', type: 'number', required: false })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(200)
  @Get()
  async findAll(@Req() req: Request) {
    return await this.developersService.findAll(req.query);
  }

  @ApiOperation({ summary: 'Find Developer' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @HttpCode(200)
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.developersService.findOne({ where: { id } });
  }

  @ApiOperation({ summary: 'Create Developer' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(201)
  @Post()
  async create(@Body() body: CreateDeveloperDto) {
    return await this.developersService.create(body as Developer);
  }

  @ApiOperation({ summary: 'Update Developer' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(200)
  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateDeveloperDto) {
    return await this.developersService.update(id, body as Developer);
  }

  @ApiOperation({ summary: 'Delete Developer' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(204)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.developersService.delete(id);
  }
}
