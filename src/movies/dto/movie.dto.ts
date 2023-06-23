import { ApiProperty } from '@nestjs/swagger';
import * as classValidator from 'class-validator';

export class MovieDto {
  @ApiProperty({ required: true })
  @classValidator.IsString()
  @classValidator.MinLength(2, {
    message: 'Заголовок не может быть короче двух символов.',
  })
  title: string;

  @ApiProperty({ required: true })
  @classValidator.IsString()
  @classValidator.MinLength(2, {
    message: 'Описание не может быть короче двух символов.',
  })
  description: string;
}

export class GradeMovieDto {
  @ApiProperty({ required: true })
  @classValidator.IsNotEmpty()
  @classValidator.IsNumber()
  @classValidator.Min(1, { message: 'Оценка не должна быть ниже 1.' })
  @classValidator.Max(10, { message: 'Оценка не должна быть выше 10.' })
  grade: number;
}

export class ParamsWithId {
  @ApiProperty({ required: true })
  @classValidator.IsMongoId({
    message: 'Параметры запроса должен содержать MongoID.',
  })
  id: string;
}
