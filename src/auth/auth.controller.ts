import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInUser: { email: string; hashed_password: string }) {
    return this.authService.SignIn(
      signInUser.email,
      signInUser.hashed_password,
    );
  }
}
