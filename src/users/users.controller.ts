import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/signup.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: CreateUserDto): Promise<{ token: string }> {
    return this.userService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    return this.userService.login(loginUserDto);
  }
}
