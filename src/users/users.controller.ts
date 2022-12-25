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
import { CreateDto } from './dtos/create.dto';
import { UpdateDto } from './dtos/update.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll({});
  }

  @Get('/:id')
  async find(@Param('id') id: number) {
    return await this.usersService.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() body: CreateDto) {
    try {
      return await this.usersService.create(body as User);
    } catch (error) {
      throw new BadRequestException('Não foi possível criar o usuário!');
    }
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() body: UpdateDto) {
    try {
      return await this.usersService.update(id, body as User);
    } catch (error) {
      throw new BadRequestException('Não foi possível atualizar o usuário!');
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.usersService.delete(id);
  }
}
