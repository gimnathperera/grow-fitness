import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach',
  PARENT = 'parent',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

