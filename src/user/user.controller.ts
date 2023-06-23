import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UserService } from './user.service';
import { ParamsWithId, UpdateUserDto } from './dto/user.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @ApiOperation({
    summary: 'Получить список всех пользователей.',
  })
  @UseGuards(AuthGuard)
  @Get()
  getUsers(): Promise<User[]> {
    return this.UserService.getUsers();
  }

  @ApiOperation({
    summary:
      'Получить информацию о пользователе / аутентификация на основе кук.',
  })
  @UseGuards(AuthGuard)
  @Get('/me')
  getUser(@Req() req: Request): Promise<User> {
    return this.UserService.getUser(req);
  }

  @ApiOperation({
    summary: 'Обновить информацию о пользователе емайл/ник/пароль.',
    description:
      'Можно передать, одно поле необходимое для изменения(если это пароль то необходимо поле confirmPassword).',
  })
  @ApiParam({
    name: 'id',
    description: 'Этот ID из базы Mongo',
    example: '648f32341da7560bd0b9115f',
  })
  @UseGuards(AuthGuard)
  @Patch('/me/:id')
  updateUser(
    @Param() { id }: ParamsWithId,
    @Body() userInfo: UpdateUserDto,
  ): Promise<User> {
    return this.UserService.updateUser(id, userInfo);
  }

  @ApiOperation({
    summary: 'Удалить пользователя.',
  })
  @ApiParam({
    name: 'id',
    description: 'Этот ID из базы Mongo',
    example: '648f32341da7560bd0b9115f',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteUser(
    @Req() req: Request,
    @Param() { id }: ParamsWithId,
  ): Promise<{ message: string; additions: string }> {
    return this.UserService.deleteUser(req, id);
  }
}
