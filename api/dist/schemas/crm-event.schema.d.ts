import { Document, Types } from 'mongoose';
export type CRMEventDocument = CRMEvent & Document;
export declare class CRMEvent {
    actorId: Types.ObjectId;
    subjectId: Types.ObjectId;
    kind: string;
    payload: any;
    createdAt: Date;
}
export declare const CRMEventSchema: import("mongoose").Schema<CRMEvent, import("mongoose").Model<CRMEvent, any, any, any, Document<unknown, any, CRMEvent, any, {}> & CRMEvent & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CRMEvent, Document<unknown, {}, import("mongoose").FlatRecord<CRMEvent>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CRMEvent> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
