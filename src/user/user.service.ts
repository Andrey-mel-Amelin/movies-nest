import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUser(@Req() req: Request): Promise<User> {
    const userId = req.user;

    const user = this.userModel.findOne({
      _id: userId,
    });

    return user;
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
    if (userDto.password && userDto.password !== userDto.passwordConfirm) {
      throw new ForbiddenException('Пароли не совпадают.');
    }

    const user = await this.userModel.findByIdAndUpdate(id, userDto);

    if (!user) {
      throw new NotFoundException('Такого пользователя нет в базе.');
    }

    const updateUser = await this.userModel.findById(id);

    return updateUser;
  }

  async deleteUser(
    @Req() req: Request,
    id: string,
  ): Promise<{ message: string; additions: string }> {
    if (id !== req.user) {
      throw new ForbiddenException('Нет прав для удаления этого профиля.');
    }

    await this.userModel.findByIdAndDelete(id);

    return {
      message: 'Пользователь успешно удален.',
      additions: 'Выполните выход, для очистки куков.',
    };
  }
}
