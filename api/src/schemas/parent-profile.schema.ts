import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ParentProfileDocument = ParentProfile & Document;

@Schema({ timestamps: true })
export class ParentProfile {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Child' }], default: [] })
  children: Types.ObjectId[];
}

export const ParentProfileSchema = SchemaFactory.createForClass(ParentProfile);

