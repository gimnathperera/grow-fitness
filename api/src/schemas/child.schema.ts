import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChildDocument = Child & Document;

@Schema({ timestamps: true })
export class Child {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  parentId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: false })
  medicalCondition?: string;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop({ type: [String], default: [] })
  goals: string[];
}

export const ChildSchema = SchemaFactory.createForClass(Child);
