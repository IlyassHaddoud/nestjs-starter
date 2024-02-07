import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async SignIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && password == user.hashed_password) {
      const payload = { sub: user._id, name: user.name };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async SignUp(createUserDto: CreateUserDto) {
    const { hashed_password: password } = createUserDto;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await this.usersService.create({
      ...createUserDto,
      hashed_password: hash,
    });
    return newUser;
  }
}
