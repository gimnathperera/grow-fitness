import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MilestoneAwardDocument = MilestoneAward & Document;

@Schema({ timestamps: true })
export class MilestoneAward {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Child' })
  childId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'MilestoneRule' })
  ruleId: Types.ObjectId;

  @Prop({ required: true })
  awardedAt: Date;

  @Prop()
  artifactUrl?: string;
}

export const MilestoneAwardSchema =
  SchemaFactory.createForClass(MilestoneAward);

