import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'string@string.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(2, {
    message: 'Ник не может быть короче двух символов.',
  })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(2, {
    message: 'Пароль не может быть короче двух символов.',
  })
  @IsOptional()
  password: string;

  @ApiProperty({ required: false, example: 'somepassword' })
  @IsString()
  @IsOptional()
  passwordConfirm: string;
}

export class ParamsWithId {
  @ApiProperty({ required: true })
  @IsMongoId({
    message: 'Параметры запроса должен содержать MongoID.',
  })
  id: string;
}
