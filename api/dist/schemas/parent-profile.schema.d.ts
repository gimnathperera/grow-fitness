import { Document, Types } from 'mongoose';
export type ParentProfileDocument = ParentProfile & Document;
export declare class ParentProfile {
    userId: Types.ObjectId;
    children: Types.ObjectId[];
}
export declare const ParentProfileSchema: import("mongoose").Schema<ParentProfile, import("mongoose").Model<ParentProfile, any, any, any, Document<unknown, any, ParentProfile, any, {}> & ParentProfile & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ParentProfile, Document<unknown, {}, import("mongoose").FlatRecord<ParentProfile>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ParentProfile> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
