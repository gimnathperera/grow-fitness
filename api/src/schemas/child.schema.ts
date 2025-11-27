import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChildDocument = Child & Document;

type Gender = 'boy' | 'girl';
type TrainingPreference = 'personal' | 'group';

@Schema({ timestamps: true })
export class Child {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  parentId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, enum: ['boy', 'girl'] })
  gender: Gender;

  @Prop({ required: true })
  location: string;

  @Prop({ type: [String], required: true })
  goals: string[];

  @Prop()
  medicalCondition?: string;

  @Prop({ default: false })
  isInSports: boolean;

  @Prop({ required: true, enum: ['personal', 'group'] })
  trainingPreference: TrainingPreference;
}

export const ChildSchema = SchemaFactory.createForClass(Child);
