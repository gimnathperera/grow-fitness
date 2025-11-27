import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProgressLogDocument = ProgressLog & Document;

@Schema({ timestamps: true })
export class ProgressLog {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Session' })
  sessionId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Child' })
  childId: Types.ObjectId;

  @Prop()
  notes?: string;

  @Prop({ type: [String], default: [] })
  milestones: string[];
}

export const ProgressLogSchema = SchemaFactory.createForClass(ProgressLog);

