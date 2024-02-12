import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpException,
  NotFoundException,
  HttpStatus,
  UseGuards,
  Req,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(201)
  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const ExistingUser = await this.usersService.findByEmail(email);
    if (ExistingUser) throw new HttpException('Email Already Exist', 403);
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  @HttpCode(200)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @HttpCode(200)
  @Get()
  test() {
    return 'Working...';
  }

  @HttpCode(200)
  @Get('check')
  check(@Req() req: Request) {
    const { name } = req.body.user;
    return { message: 'Welcome ' + name, status: 200 };
  }

  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const IsValidId = mongoose.Types.ObjectId.isValid(id);
    if (!IsValidId) throw new HttpException('Invalid User Id', 401);
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  @HttpCode(200)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const IsValidId = mongoose.Types.ObjectId.isValid(id);
    if (!IsValidId) throw new HttpException('Invalid User Id', 401);
    const newUser = await this.usersService.update(id, updateUserDto);
    return newUser;
  }

  @HttpCode(200)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
