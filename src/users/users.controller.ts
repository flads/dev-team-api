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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDto } from './dtos/create.dto';
import { Request } from 'express';
import { UpdateDto } from './dtos/update.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Find Users' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @HttpCode(200)
  @Get()
  async findAll(@Req() req: Request) {
    return await this.usersService.findAll(req.query);
  }

  @ApiOperation({ summary: 'Find User' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @HttpCode(200)
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne({ where: { id } });
  }

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(201)
  @Post()
  async create(@Body() body: CreateDto) {
    return await this.usersService.create(body as User);
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(200)
  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateDto) {
    return await this.usersService.update(id, body as User);
  }

  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(204)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
