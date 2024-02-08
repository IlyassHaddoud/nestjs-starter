import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async SignIn(signInUser: AuthLoginDto) {
    const { email, hashed_password: password } = signInUser;
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.hashed_password);
      if (isMatch) {
        const payload = { sub: user._id, name: user.name };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      } else {
        throw new HttpException('Password incorrect', 401);
      }
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
