import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  signIn(@Body() signInUser: { email: string; hashed_password: string }) {
    return this.authService.SignIn(
      signInUser.email,
      signInUser.hashed_password,
    );
  }

  @Post('register')
  async signUp(@Body() signUpUser: CreateUserDto) {
    const { email } = signUpUser;
    const isAlreadyExist = await this.usersService.findByEmail(email);
    if (isAlreadyExist) throw new HttpException('Email Already Exist', 403);
    return this.authService.SignUp(signUpUser);
  }
}
