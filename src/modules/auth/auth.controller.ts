import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('login')
  signIn(@Body(ValidationPipe) signInUser: AuthLoginDto) {
    return this.authService.SignIn(signInUser);
  }

  @HttpCode(201)
  @Post('register')
  async signUp(@Body(ValidationPipe) signUpUser: CreateUserDto) {
    const { email } = signUpUser;
    const isAlreadyExist = await this.usersService.findByEmail(email);
    if (isAlreadyExist) throw new HttpException('Email Already Exist', 403);
    return this.authService.SignUp(signUpUser);
  }
}
