import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Find Users' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get()
  async find() {
    return await this.usersService.find({});
  }

  @ApiOperation({ summary: 'Find User' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne({ where: { id } });
  }

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  async create(@Body() body: CreateDto) {
    try {
      return await this.usersService.create(body as User);
    } catch (error) {
      throw new BadRequestException('Não foi possível criar o usuário!');
    }
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateDto) {
    try {
      return await this.usersService.update(id, body as User);
    } catch (error) {
      throw new BadRequestException('Não foi possível atualizar o usuário!');
    }
  }

  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
