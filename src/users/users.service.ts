import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/signup.dto';
import { LoginUserDto } from './dto/login.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDato: CreateUserDto): Promise<{ token: string }> {
    try {
      const { name, email, password } = signUpDato;
      const hashedPassword = await bcrypt.hash(password, 12);

      const exist_user = await this.userModel.findOne({
        email: email,
      });
      if (exist_user) {
        throw new BadRequestException('User already registered');
      }

      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({ id: user._id });

      return { token };
    } catch (error) {
      console.log('error in signup', error);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userModel.findOne({
        email: email,
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.jwtService.sign({ id: user._id });

      return {
        token,
      };
    } catch (error) {
      console.log('error in login', error);
      throw error;
    }
  }
}
