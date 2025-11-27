import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MilestoneRuleDocument = MilestoneRule & Document;

@Schema({ timestamps: true })
export class MilestoneRule {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Object })
  conditionJSON: any;

  @Prop({ required: true })
  rewardType: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const MilestoneRuleSchema = SchemaFactory.createForClass(MilestoneRule);

