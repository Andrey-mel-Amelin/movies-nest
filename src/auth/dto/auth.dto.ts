import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({ required: true, example: 'string@string.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Введите корректный емейл.' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(2, {
    message: 'Ник не может быть короче двух символов.',
  })
  name: string;

  @ApiProperty({ required: true, example: 'somepassword' })
  @IsString()
  @MinLength(6, {
    message: 'Пароль не может быть короче шести символов.',
  })
  password: string;

  @ApiProperty({ required: true, example: 'somepassword' })
  @IsString()
  passwordConfirm: string;
}

export class SignInUserDto {
  @ApiProperty({ required: true, example: 'string@string.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, example: 'somepassword' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
