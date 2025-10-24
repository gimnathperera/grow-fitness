import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizResultDocument = QuizResult & Document;

export enum OwnerType {
  PARENT = 'parent',
  COACH = 'coach',
}

@Schema({ timestamps: true })
export class QuizResult {
  @Prop({ required: true, enum: OwnerType })
  ownerType: OwnerType;

  @Prop({ required: true, type: Types.ObjectId })
  ownerId: Types.ObjectId;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  score: number;
}

export const QuizResultSchema = SchemaFactory.createForClass(QuizResult);

