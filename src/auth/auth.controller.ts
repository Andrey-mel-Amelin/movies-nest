import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto/auth.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly UserService: AuthService) {}

  @ApiOperation({
    summary: 'Добавить нового пользователя.',
  })
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  createUser(
    @Body() userInfo: SignUpUserDto,
  ): Promise<{ message: string; user: User }> {
    return this.UserService.createUser(userInfo);
  }

  @ApiOperation({
    summary: 'Аутентификация(логин) пользователя.',
  })
  @Post('/signin')
  loginUser(
    @Body() userInfo: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; user: User }> {
    return this.UserService.loginUser(userInfo, res);
  }

  @ApiOperation({
    summary: 'Выйти.',
  })
  @Delete('/signout')
  logotUser(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    return this.UserService.logoutUser(res);
  }
}
