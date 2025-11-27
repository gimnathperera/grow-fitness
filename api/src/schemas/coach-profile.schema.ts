import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CoachProfileDocument = CoachProfile & Document;

@Schema({ timestamps: true })
export class CoachProfile {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [Object], default: [] })
  availability: any[];

  @Prop({ default: 0 })
  earningsDerived?: number;
}

export const CoachProfileSchema = SchemaFactory.createForClass(CoachProfile);

