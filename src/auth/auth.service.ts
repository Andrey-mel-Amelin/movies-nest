import {
  ConflictException,
  Injectable,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { SignInUserDto, SignUpUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async createUser(
    createUserDto: SignUpUserDto,
  ): Promise<{ message: string; user: User }> {
    const { email, name, password, passwordConfirm } = createUserDto;

    const emailIsBusy = await this.userModel.findOne({
      email: email,
    });

    if (emailIsBusy) {
      throw new ConflictException('Этот емейл уже занят.');
    }

    const passwordConfirmed = password === passwordConfirm ? password : '';

    if (!password) throw new Error('Пароли не совпадают.');

    const hashedPassword = await bcrypt.hash(passwordConfirmed, 10);

    const userInfo = await this.userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    return {
      message: 'Пользователь успешно зарегистрирован.',
      user: userInfo,
    };
  }

  async loginUser(
    loginUserDto: SignInUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string; user: User }> {
    const { email, password } = loginUserDto;

    const userWithPassword = await this.userModel
      .findOne({ email })
      .select('+password');

    if (!userWithPassword) {
      throw new UnauthorizedException('Направильный емейл или пароль.');
    }

    const passwordMatched = await bcrypt.compare(
      password,
      userWithPassword.password,
    );

    if (!passwordMatched) {
      throw new UnauthorizedException('Направильный емейл или пароль.');
    }

    const token = await this.jwtService.signAsync(
      { id: userWithPassword._id },
      { secret: this.config.get<string>('JWT_SECRET') },
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 3600000 * 24 * 10,
      sameSite: 'none',
      secure: true,
    });

    const userWithoutPassword = await this.userModel.findOne({ email });

    return {
      message: 'Пользователь успешно авторизован.',
      user: userWithoutPassword,
    };
  }

  async logoutUser(@Res() res: Response): Promise<{ message: string }> {
    res.clearCookie('jwt', { httpOnly: true, sameSite: true, secure: true });
    return { message: 'Пользователь успешно вышел.' };
  }
}
