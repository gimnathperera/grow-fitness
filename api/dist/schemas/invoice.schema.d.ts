import { Document, Types } from 'mongoose';
export type InvoiceDocument = Invoice & Document;
export declare enum InvoiceStatus {
    PAID = "paid",
    UNPAID = "unpaid"
}
export declare enum PaymentMethod {
    CASH = "cash",
    BANK = "bank",
    OTHER = "other"
}
export declare class Invoice {
    parentId: Types.ObjectId;
    amountLKR: number;
    status: InvoiceStatus;
    paidDate?: Date;
    paidMethod?: PaymentMethod;
}
export declare const InvoiceSchema: import("mongoose").Schema<Invoice, import("mongoose").Model<Invoice, any, any, any, Document<unknown, any, Invoice, any, {}> & Invoice & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Invoice, Document<unknown, {}, import("mongoose").FlatRecord<Invoice>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Invoice> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
