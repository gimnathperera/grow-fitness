import { Document, Types } from 'mongoose';
export type SessionDocument = Session & Document;
export declare enum SessionType {
    INDIVIDUAL = "individual",
    GROUP = "group",
    TRAINING = "TRAINING"
}
export declare enum SessionStatus {
    BOOKED = "booked",
    CANCELED = "canceled",
    COMPLETED = "completed",
    CONFIRMED = "CONFIRMED"
}
export declare class Session {
    type: SessionType;
    coachId: Types.ObjectId;
    childIds: Types.ObjectId[];
    locationId: Types.ObjectId;
    startAt: Date;
    endAt: Date;
    status: SessionStatus;
    remindersSent: string[];
}
export declare const SessionSchema: import("mongoose").Schema<Session, import("mongoose").Model<Session, any, any, any, Document<unknown, any, Session, any, {}> & Session & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Session, Document<unknown, {}, import("mongoose").FlatRecord<Session>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Session> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
