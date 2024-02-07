import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  signIn(@Body(ValidationPipe) signInUser: AuthLoginDto) {
    return this.authService.SignIn(signInUser);
  }

  @Post('register')
  async signUp(@Body(ValidationPipe) signUpUser: CreateUserDto) {
    const { email } = signUpUser;
    const isAlreadyExist = await this.usersService.findByEmail(email);
    if (isAlreadyExist) throw new HttpException('Email Already Exist', 403);
    return this.authService.SignUp(signUpUser);
  }
}
