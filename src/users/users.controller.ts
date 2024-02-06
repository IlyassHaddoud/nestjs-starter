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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';
import { AuthGuard } from 'src/auth/guards/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const ExistingUser = await this.usersService.findByEmail(email);
    console.log(ExistingUser);
    if (ExistingUser) throw new HttpException('Email Already Exist', 403);
    const newUser = await this.usersService.create(createUserDto);
    return newUser;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const IsValidId = mongoose.Types.ObjectId.isValid(id);
    if (!IsValidId) throw new HttpException('Invalid User Id', 401);
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
