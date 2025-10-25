import { Document, Types } from 'mongoose';
export type ProgressLogDocument = ProgressLog & Document;
export declare class ProgressLog {
    sessionId: Types.ObjectId;
    childId: Types.ObjectId;
    notes?: string;
    milestones: string[];
}
export declare const ProgressLogSchema: import("mongoose").Schema<ProgressLog, import("mongoose").Model<ProgressLog, any, any, any, Document<unknown, any, ProgressLog, any, {}> & ProgressLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProgressLog, Document<unknown, {}, import("mongoose").FlatRecord<ProgressLog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ProgressLog> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
