import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type UserDocument = User & Document;

const current = new Date();
const timeStamp = new Date(
  Date.UTC(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    current.getHours(),
    current.getMinutes(),
    current.getSeconds(),
    current.getMilliseconds(),
  ),
);

@Schema({
  versionKey: false,
  timestamps: {
    currentTime: () => {
      return timeStamp;
    },
  },
})
export class User extends mongoose.Document {
  @Prop({ unique: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
