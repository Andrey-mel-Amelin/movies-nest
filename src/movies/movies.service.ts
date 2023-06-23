import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from 'src/schemas/movie.schema';
import mongoose, { Model } from 'mongoose';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  async getMovies() {
    const movieList = this.movieModel.aggregate([
      {
        $unwind: {
          path: '$_id',
        },
      },
      {
        $addFields: {
          rating: { $avg: '$rating' },
        },
      },
    ]);
    return movieList;
  }

  async getMovie(id: string): Promise<Movie[]> {
    const movie = this.movieModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $addFields: {
          rating: { $avg: '$rating' },
        },
      },
    ]);
    if (!(await movie).length) {
      throw new NotFoundException('Такого фильма нет в базе.');
    }
    return movie;
  }

  async createMovie(createMovieDto: MovieDto): Promise<Movie> {
    return this.movieModel.create(createMovieDto);
  }

  async updateMovie(id: string, movieDto: MovieDto): Promise<Movie> {
    const movie = await this.movieModel.findByIdAndUpdate(id, movieDto);
    if (!movie) {
      throw new NotFoundException('Такого фильма нет в базе.');
    }
    return movie;
  }

  async rateMovie(id: string, grade: number): Promise<Movie> {
    const movie = await this.movieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Такого фильма нет в базе.');
    }
    movie.rating.push(grade);
    await movie.save();
    return movie;
  }

  async deleteMovie(id: string) {
    const movie = this.movieModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
    ]);
    if (!movie) {
      throw new NotFoundException('Такого фильма нет в базе.');
    }
    return movie;
  }
}
