import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async SignIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    console.log(user);
    console.log(email);
    console.log(password);
    if (user && password == user.hashed_password) {
      const payload = { sub: user._id, name: user.name };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
