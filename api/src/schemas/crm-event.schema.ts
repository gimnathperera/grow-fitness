import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CRMEventDocument = CRMEvent & Document;

@Schema({ timestamps: true })
export class CRMEvent {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  actorId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  subjectId: Types.ObjectId;

  @Prop({ required: true })
  kind: string;

  @Prop({ required: true, type: Object })
  payload: any;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CRMEventSchema = SchemaFactory.createForClass(CRMEvent);

