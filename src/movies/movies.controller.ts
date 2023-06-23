import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Movie } from 'src/schemas/movie.schema';
import { MoviesService } from './movies.service';
import { GradeMovieDto, MovieDto, ParamsWithId } from './dto/movie.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly MoviesService: MoviesService) {}

  @ApiOperation({
    summary: 'Получить список всех фильмов.',
  })
  @UseGuards(AuthGuard)
  @Get()
  getMovies(): Promise<Movie[]> {
    return this.MoviesService.getMovies();
  }

  @ApiOperation({
    summary: 'Получить определенный фильм.',
  })
  @ApiParam({
    name: 'id',
    description: 'Этот ID из базы Mongo',
    example: '648f32341da7560bd0b9115f',
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  getMovie(@Param() { id }: ParamsWithId): Promise<Movie[]> {
    return this.MoviesService.getMovie(id);
  }

  @ApiOperation({
    summary: 'Добавить новый фильм.',
  })
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createMovie(@Body() movieDto: MovieDto): Promise<Movie> {
    return this.MoviesService.createMovie(movieDto);
  }

  @ApiOperation({
    summary: 'Обновить информацию о фильме заголовок/описание.',
  })
  @ApiParam({
    name: 'id',
    description: 'Этот ID из базы Mongo',
    example: '648f32341da7560bd0b9115f',
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  updateMovie(
    @Param() { id }: ParamsWithId,
    @Body() movieDto: MovieDto,
  ): Promise<Movie> {
    return this.MoviesService.updateMovie(id, movieDto);
  }

  @ApiOperation({
    summary: 'Добавить оценку фильму.',
  })
  @ApiParam({
    name: 'id',
    description: 'Этот ID из базы Mongo',
    example: '648f32341da7560bd0b9115f',
  })
  @UseGuards(AuthGuard)
  @Post(':id')
  rateMovie(
    @Param() { id }: ParamsWithId,
    @Body() grade: GradeMovieDto,
  ): Promise<Movie> {
    return this.MoviesService.rateMovie(id, grade.grade);
  }

  @ApiOperation({
    summary: 'Удалить фильм.',
  })
  @ApiParam({
    name: 'id',
    description: 'Этот ID из базы Mongo',
    example: '648f32341da7560bd0b9115f',
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteMovie(@Param() { id }: ParamsWithId): Promise<Movie[]> {
    return this.MoviesService.deleteMovie(id);
  }
}
