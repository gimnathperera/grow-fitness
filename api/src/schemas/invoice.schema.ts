import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

export enum InvoiceStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK = 'bank',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  parentId: Types.ObjectId;

  @Prop({ required: true })
  amountLKR: number;

  @Prop({ required: true, enum: InvoiceStatus, default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @Prop()
  paidDate?: Date;

  @Prop({ enum: PaymentMethod })
  paidMethod?: PaymentMethod;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Add indexes
InvoiceSchema.index({ status: 1, paidDate: 1 });

