import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ versionKey: false })
export class Movie extends mongoose.Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number[] | null;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
