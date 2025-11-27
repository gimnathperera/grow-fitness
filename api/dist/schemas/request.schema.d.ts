import { Document, Types } from 'mongoose';
export type RequestDocument = Request & Document;
export declare enum RequestType {
    RESCHEDULE = "reschedule",
    CANCEL = "cancel"
}
export declare enum RequestStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class Request {
    type: RequestType;
    sessionId: Types.ObjectId;
    requesterId: Types.ObjectId;
    reason: string;
    isLate: boolean;
    status: RequestStatus;
    adminNote?: string;
    decidedAt?: Date;
}
export declare const RequestSchema: import("mongoose").Schema<Request, import("mongoose").Model<Request, any, any, any, Document<unknown, any, Request, any, {}> & Request & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Request, Document<unknown, {}, import("mongoose").FlatRecord<Request>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Request> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
