import { Document, Types } from 'mongoose';
export type CoachProfileDocument = CoachProfile & Document;
export declare class CoachProfile {
    userId: Types.ObjectId;
    skills: string[];
    availability: any[];
    earningsDerived?: number;
}
export declare const CoachProfileSchema: import("mongoose").Schema<CoachProfile, import("mongoose").Model<CoachProfile, any, any, any, Document<unknown, any, CoachProfile, any, {}> & CoachProfile & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CoachProfile, Document<unknown, {}, import("mongoose").FlatRecord<CoachProfile>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<CoachProfile> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
