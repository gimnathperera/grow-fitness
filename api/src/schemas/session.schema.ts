import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

export enum SessionType {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export enum SessionStatus {
  BOOKED = 'booked',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true, enum: SessionType })
  type: SessionType;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  coachId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Child' }], required: true })
  childIds: Types.ObjectId[];

  @Prop({ required: true, type: Types.ObjectId, ref: 'Location' })
  locationId: Types.ObjectId;

  @Prop({ required: true })
  startAt: Date;

  @Prop({ required: true })
  endAt: Date;

  @Prop({ required: true, enum: SessionStatus, default: SessionStatus.BOOKED })
  status: SessionStatus;

  @Prop({ type: [String], default: [] })
  remindersSent: string[];
}

export const SessionSchema = SchemaFactory.createForClass(Session);

// Add indexes
SessionSchema.index({ coachId: 1, startAt: 1 });
SessionSchema.index({ childIds: 1, startAt: 1 });

