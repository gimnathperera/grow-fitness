import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RequestDocument = Request & Document;

export enum RequestType {
  RESCHEDULE = 'reschedule',
  CANCEL = 'cancel',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Request {
  @Prop({ required: true, enum: RequestType })
  type: RequestType;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Session' })
  sessionId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  requesterId: Types.ObjectId;

  @Prop({ required: true })
  reason: string;

  @Prop({ default: false })
  isLate: boolean;

  @Prop({ required: true, enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Prop()
  adminNote?: string;

  @Prop()
  decidedAt?: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

// Add indexes
RequestSchema.index({ status: 1 });
RequestSchema.index({ requesterId: 1 });

